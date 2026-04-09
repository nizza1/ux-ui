import { useRef, useEffect, useCallback } from "react";
import type { PropertyControl } from "./types";

interface PreviewPaneProps {
  html: string;
  mode: "code" | "controller";
  controlValues: Record<string, string | number>;
  controls: PropertyControl[];
  height: number;
}

export function PreviewPane({
  html,
  mode,
  controlValues,
  controls,
  height,
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const applyControlStyles = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || mode !== "controller") return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    for (const control of controls) {
      const value = controlValues[control.id];
      if (value === undefined) continue;

      const formattedValue =
        typeof value === "number" && control.unit
          ? `${value}${control.unit}`
          : String(value);

      const els = doc.querySelectorAll<HTMLElement>(control.target);
      for (const el of els) {
        el.style.setProperty(
          camelToKebab(control.property),
          formattedValue,
          "important"
        );
      }
    }
  }, [controls, controlValues, mode]);

  useEffect(() => {
    if (mode !== "controller") return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => applyControlStyles();
    iframe.addEventListener("load", handleLoad);

    // Also apply immediately if doc is already loaded
    if (iframe.contentDocument?.readyState === "complete") {
      applyControlStyles();
    }

    return () => iframe.removeEventListener("load", handleLoad);
  }, [mode, applyControlStyles]);

  // Re-apply styles whenever controlValues change in controller mode
  useEffect(() => {
    if (mode === "controller") {
      applyControlStyles();
    }
  }, [controlValues, mode, applyControlStyles]);

  const srcDoc = mode === "code" ? html : undefined;

  return (
    <div className="le-preview-pane" style={{ height }}>
      {mode === "controller" ? (
        <iframe
          key="controller"
          ref={iframeRef}
          className="le-preview-iframe"
          srcDoc={html}
          sandbox="allow-same-origin allow-scripts"
          title="Preview"
        />
      ) : (
        <iframe
          key="code"
          className="le-preview-iframe"
          srcDoc={srcDoc}
          sandbox="allow-same-origin allow-scripts"
          title="Preview"
        />
      )}
    </div>
  );
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
