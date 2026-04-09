import { useMemo, useState } from "react";
import type { PropertyControl } from "./types";

interface CssOutputPanelProps {
  controls: PropertyControl[];
  controlValues: Record<string, string | number>;
}

export function CssOutputPanel({ controls, controlValues }: CssOutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const cssOutput = useMemo(() => {
    const byTarget = new Map<string, string[]>();

    for (const control of controls) {
      const current = controlValues[control.id];
      if (current === undefined || current === control.defaultValue) continue;

      const formattedValue =
        typeof current === "number" && control.unit
          ? `${current}${control.unit}`
          : String(current);

      const kebabProp = camelToKebab(control.property);
      const line = `  ${kebabProp}: ${formattedValue};`;

      const list = byTarget.get(control.target) ?? [];
      list.push(line);
      byTarget.set(control.target, list);
    }

    if (byTarget.size === 0) return "";

    const blocks: string[] = [];
    for (const [selector, lines] of byTarget) {
      blocks.push(`${selector} {\n${lines.join("\n")}\n}`);
    }
    return blocks.join("\n\n");
  }, [controls, controlValues]);

  const handleCopy = async () => {
    if (!cssOutput) return;
    try {
      await navigator.clipboard.writeText(cssOutput);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cssOutput;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!cssOutput) {
    return (
      <div className="le-css-output">
        <div className="le-css-output-header">
          <span>CSS Output</span>
        </div>
        <div className="le-css-output-empty">
          Adjust controls to generate CSS
        </div>
      </div>
    );
  }

  return (
    <div className="le-css-output">
      <div className="le-css-output-header">
        <span>CSS Output</span>
        <button
          type="button"
          className={`le-css-copy-btn ${copied ? "le-css-copy-btn--copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="le-css-output-code">
        <code>{cssOutput}</code>
      </pre>
    </div>
  );
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
