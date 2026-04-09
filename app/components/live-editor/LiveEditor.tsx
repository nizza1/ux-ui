import { useState, useCallback } from "react";
import "./live-editor.css";
import type { LiveEditorProps } from "./types";
import { PreviewPane } from "./PreviewPane";
import { CodeEditor } from "./CodeEditor";
import { ControllerPanel } from "./ControllerPanel";

export function LiveEditor({
  html,
  controls,
  defaultMode = "controller",
  previewHeight = 500,
  title,
}: LiveEditorProps) {
  const [mode, setMode] = useState<"code" | "controller">(defaultMode);
  const [currentHtml, setCurrentHtml] = useState(html);
  const [controlValues, setControlValues] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    for (const c of controls) init[c.id] = c.defaultValue;
    return init;
  });

  const handleControlChange = useCallback((id: string, value: string | number) => {
    setControlValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCurrentHtml(value);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentHtml(html);
    const init: Record<string, string | number> = {};
    for (const c of controls) init[c.id] = c.defaultValue;
    setControlValues(init);
  }, [html, controls]);

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
            className={`le-tab ${mode === "controller" ? "le-tab--active" : ""}`}
            onClick={() => setMode("controller")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="8" cy="12" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="16" cy="18" r="2"/>
              <path d="M10 12h8M18 6H8M18 18H8"/>
            </svg>
            Controls
          </button>
          <button
            type="button"
            className={`le-tab ${mode === "code" ? "le-tab--active" : ""}`}
            onClick={() => setMode("code")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            Code
          </button>
        </div>

        {title && <span className="le-title">{title}</span>}

        <div className="le-toolbar">
          <button type="button" className="le-toolbar-btn" onClick={handleCopyCode} title="Copy HTML">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
          <button type="button" className="le-toolbar-btn" onClick={handleOpenInTab} title="Open in new tab">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open
          </button>
          <button type="button" className="le-toolbar-btn le-toolbar-btn--reset" onClick={handleReset} title="Reset to defaults">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Main body: editor + preview */}
      <div className="le-body">
        {/* Left: editor panel */}
        <div className="le-editor-panel">
          {mode === "code" ? (
            <CodeEditor value={currentHtml} onChange={handleCodeChange} />
          ) : (
            <ControllerPanel
              controls={controls}
              controlValues={controlValues}
              onChange={handleControlChange}
            />
          )}
        </div>

        {/* Divider */}
        <div className="le-divider" />

        {/* Right: preview */}
        <PreviewPane
          html={mode === "code" ? currentHtml : html}
          mode={mode}
          controlValues={controlValues}
          controls={controls}
          height={previewHeight}
        />
      </div>
    </div>
  );
}
