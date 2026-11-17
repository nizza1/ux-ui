import { useRef, useCallback, useState, useEffect, useMemo } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync from parent (e.g. on reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    },
    [onChange]
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const highlighted = useMemo(() => highlightCode(localValue), [localValue]);

  return (
    <div className="le-code-editor">
      <pre
        ref={highlightRef}
        className="le-code-highlight"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
      />
      <textarea
        ref={textareaRef}
        className="le-code-textarea"
        value={localValue}
        onChange={handleChange}
        onScroll={handleScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}

/* ── Syntax highlighting ─────────────────────── */

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const span = (cls: string, text: string) => `<span class="le-hl-${cls}">${escapeHtml(text)}</span>`;

/**
 * Ein Durchlauf über den Rohtext. Wichtig: Jede Stelle wird genau einmal
 * eingefärbt — spätere Regeln dürfen nie auf bereits eingefügtes
 * <span class="…">-Markup treffen (das hat früher jedes Tag zerlegt).
 *
 * Gruppen: 1 Kommentar · 2+3 Tag · 4 String · 5+6 Attribut · 7+8 CSS-Property
 *          · 9 Zahl mit Einheit · 10 Hex-Farbe
 */
const TOKEN =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/)|(<\/?)([\w-]+)|("[^"\n]*"|'[^'\n]*')|(\s)([\w-]+)(?==)|(^[ \t]+)([\w-]+)(?=\s*:)|\b(\d+\.?\d*(?:px|em|rem|%|vh|vw|ms|s|deg))(?![\w-])|(#[0-9a-fA-F]{3,8})\b/gm;

function highlightCode(code: string): string {
  let out = "";
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    out += escapeHtml(code.slice(last, index));
    if (match[1] !== undefined) out += span("comment", match[1]);
    else if (match[3] !== undefined) out += escapeHtml(match[2]) + span("tag", match[3]);
    else if (match[4] !== undefined) out += span("string", match[4]);
    else if (match[6] !== undefined) out += match[5] + span("attr", match[6]);
    else if (match[8] !== undefined) out += match[7] + span("prop", match[8]);
    else if (match[9] !== undefined) out += span("num", match[9]);
    else if (match[10] !== undefined) out += span("color", match[10]);
    last = index + match[0].length;
  }
  return out + escapeHtml(code.slice(last));
}
