import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import type { PreviewPaneHandle, SelectedElementInfo, StyleChangesMap } from "./types";
import { PROPERTIES_TO_READ } from "./InspectorPanel";

interface PreviewPaneProps {
  html: string;
  height: number;
  inspectorActive: boolean;
  onElementSelect: (info: SelectedElementInfo) => void;
  onReload?: () => void;
  styleChanges: StyleChangesMap;
}

type BoundHandlers = {
  doc: Document;
  over: EventListener;
  out: EventListener;
  click: EventListener;
};

export const PreviewPane = forwardRef<PreviewPaneHandle, PreviewPaneProps>(
  function PreviewPane(
    { html, height, inspectorActive, onElementSelect, onReload, styleChanges },
    ref
  ) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const selectedElRef = useRef<HTMLElement | null>(null);
    const hoveredElRef = useRef<HTMLElement | null>(null);
    const boundRef = useRef<BoundHandlers | null>(null);

    // Live refs — always up-to-date without causing effect re-runs
    const inspectorActiveRef = useRef(inspectorActive);
    const onElementSelectRef = useRef(onElementSelect);
    const styleChangesRef = useRef(styleChanges);
    const onReloadRef = useRef(onReload);
    inspectorActiveRef.current = inspectorActive;
    onElementSelectRef.current = onElementSelect;
    styleChangesRef.current = styleChanges;
    onReloadRef.current = onReload;

    // ── Stable: detach from whatever doc is currently bound ──────────
    const detach = useCallback(() => {
      const b = boundRef.current;
      if (!b) return;
      try {
        b.doc.removeEventListener("mouseover", b.over, true);
        b.doc.removeEventListener("mouseout", b.out, true);
        b.doc.removeEventListener("click", b.click, true);
        b.doc.body.style.cursor = "";
      } catch {
        // Old doc may be inaccessible after iframe reload — ignore
      }
      boundRef.current = null;
    }, []);

    // ── Stable: attach inspector listeners to a given doc ────────────
    const attach = useCallback(
      (doc: Document) => {
        detach(); // Remove any existing binding first

        const over: EventListener = (e) => {
          const tgt = e.target as HTMLElement;
          if (!tgt || tgt === doc.body || tgt === doc.documentElement) return;
          if (hoveredElRef.current && hoveredElRef.current !== selectedElRef.current) {
            clearHighlight(hoveredElRef.current);
          }
          hoveredElRef.current = tgt;
          if (tgt !== selectedElRef.current) {
            tgt.style.setProperty("outline", "2px dashed rgba(14,165,160,0.45)", "important");
            tgt.style.setProperty("outline-offset", "-1px", "important");
          }
        };

        const out: EventListener = () => {
          if (hoveredElRef.current && hoveredElRef.current !== selectedElRef.current) {
            clearHighlight(hoveredElRef.current);
          }
        };

        const click: EventListener = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const tgt = e.target as HTMLElement;
          if (!tgt || tgt === doc.body || tgt === doc.documentElement) return;
          if (selectedElRef.current) clearHighlight(selectedElRef.current);
          selectedElRef.current = tgt;
          tgt.style.setProperty("outline", "2px solid #0ea5a0", "important");
          tgt.style.setProperty("outline-offset", "-1px", "important");

          const computed = getComputedStyle(tgt);
          const styles: Record<string, string> = {};
          for (const prop of PROPERTIES_TO_READ) {
            styles[prop] = computed.getPropertyValue(prop);
          }
          onElementSelectRef.current({
            selector: getUniqueSelector(tgt),
            displayPath: getDisplayPath(tgt),
            displaySelector: getDisplaySelector(tgt),
            tag: tgt.tagName.toLowerCase(),
            classes: [...tgt.classList],
            styles,
          });
        };

        doc.addEventListener("mouseover", over, true);
        doc.addEventListener("mouseout", out, true);
        doc.addEventListener("click", click, true);
        doc.body.style.cursor = "crosshair";
        boundRef.current = { doc, over, out, click };
      },
      [detach]
    );

    // ── Stable: runs after every iframe load ─────────────────────────
    const handleLoad = useCallback(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc?.body) return;

      // DOM is fresh — clear stale element refs
      selectedElRef.current = null;
      hoveredElRef.current = null;

      // Notify parent to clear its selectedElement state
      onReloadRef.current?.();

      // Re-apply all inspector style overrides
      for (const [sel, overrides] of Object.entries(styleChangesRef.current)) {
        const el = doc.querySelector<HTMLElement>(sel);
        if (!el) continue;
        for (const [prop, val] of Object.entries(overrides)) {
          el.style.setProperty(prop, val, "important");
        }
      }

      // Re-bind inspector if active
      if (inspectorActiveRef.current) {
        attach(doc);
      }
    }, [attach]);

    // ── On mount: register load listener ─────────────────────────────
    useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      iframe.addEventListener("load", handleLoad);
      // Handle the case where iframe is already loaded (e.g. dev HMR)
      if (iframe.contentDocument?.readyState === "complete") handleLoad();
      return () => {
        iframe.removeEventListener("load", handleLoad);
        detach();
      };
    }, [handleLoad, detach]);

    // ── When inspectorActive flips while iframe stays loaded ──────────
    useEffect(() => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc?.body) return; // Not loaded yet — handleLoad will bind when ready
      if (inspectorActive) {
        attach(doc);
      } else {
        detach();
        clearHighlight(hoveredElRef.current);
        hoveredElRef.current = null;
      }
    }, [inspectorActive, attach, detach]);

    // ── Imperative handle ─────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      applyStyle(property: string, value: string) {
        const el = selectedElRef.current;
        if (!el) return;
        el.style.setProperty(property, value, "important");
      },
      reapplyAllStyles(changes: Record<string, Record<string, string>>) {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;
        for (const [selector, overrides] of Object.entries(changes)) {
          const el = doc.querySelector<HTMLElement>(selector);
          if (!el) continue;
          for (const [prop, val] of Object.entries(overrides)) {
            el.style.setProperty(prop, val, "important");
          }
        }
      },
      clearSelection() {
        clearHighlight(selectedElRef.current);
        selectedElRef.current = null;
      },
    }));

    return (
      <div className="le-preview-pane" style={{ height }}>
        <iframe
          ref={iframeRef}
          className="le-preview-iframe"
          srcDoc={html}
          sandbox="allow-same-origin allow-scripts"
          title="Preview"
        />
      </div>
    );
  }
);

/* ── Helpers ────────────────────────────────────── */

function clearHighlight(el: HTMLElement | null) {
  if (!el) return;
  el.style.removeProperty("outline");
  el.style.removeProperty("outline-offset");
}

function getUniqueSelector(el: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current.tagName !== "BODY" && current.tagName !== "HTML") {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      parts.unshift(`#${current.id}`);
      break;
    }
    if (current.className && typeof current.className === "string") {
      const classes = current.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length) selector += "." + classes.join(".");
    }
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const sameTag = siblings.filter((s) => s.tagName === current!.tagName);
      if (sameTag.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }
    parts.unshift(selector);
    current = current.parentElement;
  }
  return parts.join(" > ");
}

function getDisplayPath(el: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current.tagName !== "HTML" && current.tagName !== "BODY") {
    let part = current.tagName.toLowerCase();
    if (current.className && typeof current.className === "string") {
      const classes = current.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length) part += "." + classes.slice(0, 2).join(".");
    }
    parts.unshift(part);
    current = current.parentElement;
  }
  if (parts.length > 3) parts.splice(0, parts.length - 3);
  return parts.join(" › ");
}

function getDisplaySelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  if (el.className && typeof el.className === "string") {
    const classes = el.className.trim().split(/\s+/).filter(Boolean);
    if (classes.length) return "." + classes.join(".");
  }
  return el.tagName.toLowerCase();
}
