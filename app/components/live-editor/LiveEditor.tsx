import { useState, useCallback, useRef } from "react";
import "./live-editor.css";
import type { LiveEditorProps, SelectedElementInfo, PreviewPaneHandle, StyleChangesMap } from "./types";
import { PreviewPane } from "./PreviewPane";
import { CodeEditor } from "./CodeEditor";
import { InspectorPanel } from "./InspectorPanel";

export function LiveEditor({
  html,
  controls: _controls,
  defaultMode = "code",
  previewHeight = 500,
  title,
}: LiveEditorProps) {
  const [mode, setMode] = useState<"code" | "controller">(defaultMode);
  const [currentHtml, setCurrentHtml] = useState(html);

  /* ── Inspector state ────────────────────────── */
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);
  const [styleChanges, setStyleChanges] = useState<StyleChangesMap>({});
  const previewRef = useRef<PreviewPaneHandle>(null);

  /** Map from unique selector to display selector (for CSS output) */
  const selectorDisplayMap = useRef(new Map<string, string>());

  /** Overrides for the currently selected element */
  const currentOverrides = selectedElement
    ? styleChanges[selectedElement.selector] ?? {}
    : {};

  /** CSS-output-friendly changes: displaySelector → { prop: val } */
  const cssOutputChanges: StyleChangesMap = {};
  for (const [selector, overrides] of Object.entries(styleChanges)) {
    const displayKey = selectorDisplayMap.current.get(selector) ?? selector;
    cssOutputChanges[displayKey] = overrides;
  }

  const handleElementSelect = useCallback((info: SelectedElementInfo) => {
    setSelectedElement(info);
    selectorDisplayMap.current.set(info.selector, info.displaySelector);
  }, []);

  const handleStyleChange = useCallback(
    (property: string, value: string) => {
      if (!selectedElement) return;
      const sel = selectedElement.selector;

      setStyleChanges((prev) => ({
        ...prev,
        [sel]: { ...(prev[sel] ?? {}), [property]: value },
      }));

      // Apply to the DOM element immediately
      previewRef.current?.applyStyle(property, value);
    },
    [selectedElement]
  );

  const handleDeselect = useCallback(() => {
    previewRef.current?.clearSelection();
    setSelectedElement(null);
  }, []);

  // Called when the iframe reloads (e.g. after a code edit is applied)
  const handlePreviewReload = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCurrentHtml(value);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentHtml(html);
    setStyleChanges({});
    setSelectedElement(null);
    previewRef.current?.clearSelection();
  }, [html]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentHtml);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = currentHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }, [currentHtml]);

  const handleOpenInTab = useCallback(() => {
    const blob = new Blob([currentHtml], { type: "text/html" });
    window.open(URL.createObjectURL(blob));
  }, [currentHtml]);

  return (
    <div className="live-editor">
      {/* Header */}
      <div className="le-header">
        <div className="le-tabs">
          <button
            type="button"
            className={`le-tab ${mode === "code" ? "le-tab--active" : ""}`}
            onClick={() => setMode("code")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>
          <button
            type="button"
            className={`le-tab ${mode === "controller" ? "le-tab--active" : ""}`}
            onClick={() => setMode("controller")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6M8 11h6" />
            </svg>
            Inspector
          </button>
        </div>

        {title && <span className="le-title">{title}</span>}

        <div className="le-toolbar">
          <button type="button" className="le-toolbar-btn" onClick={handleCopyCode} title="Copy HTML">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button type="button" className="le-toolbar-btn" onClick={handleOpenInTab} title="Open in new tab">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open
          </button>
          <button type="button" className="le-toolbar-btn le-toolbar-btn--reset" onClick={handleReset} title="Reset to defaults">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Main body: editor + preview */}
      <div className="le-body" style={{ height: previewHeight }}>
        {/* Left: editor panel */}
        <div className="le-editor-panel">
          {mode === "code" ? (
            <CodeEditor value={currentHtml} onChange={handleCodeChange} />
          ) : (
            <InspectorPanel
              selectedElement={selectedElement}
              overrides={currentOverrides}
              allChanges={cssOutputChanges}
              onStyleChange={handleStyleChange}
              onDeselect={handleDeselect}
            />
          )}
        </div>

        {/* Divider */}
        <div className="le-divider" />

        {/* Right: preview — always shows currentHtml so code edits persist */}
        <PreviewPane
          ref={previewRef}
          html={currentHtml}
          height={previewHeight}
          inspectorActive={mode === "controller"}
          onElementSelect={handleElementSelect}
          onReload={handlePreviewReload}
          styleChanges={styleChanges}
        />
      </div>
    </div>
  );
}
