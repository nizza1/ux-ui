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

function highlightCode(code: string): string {
  // Escape HTML entities
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // HTML comments
  html = html.replace(
    /(&lt;!--[\s\S]*?--&gt;)/g,
    '<span class="le-hl-comment">$1</span>'
  );

  // HTML tags: opening and closing
  html = html.replace(
    /(&lt;\/?)([\w-]+)/g,
    '$1<span class="le-hl-tag">$2</span>'
  );

  // Attributes (word before =)
  html = html.replace(
    /\s([\w-]+)(=)/g,
    ' <span class="le-hl-attr">$1</span>$2'
  );

  // Quoted strings
  html = html.replace(
    /(&quot;|")(.*?)(\1)/g,
    '<span class="le-hl-string">$1$2$3</span>'
  );

  // CSS property names (indented word before colon, inside style blocks)
  html = html.replace(
    /^(\s+)([\w-]+)(\s*:)/gm,
    '$1<span class="le-hl-prop">$2</span>$3'
  );

  // Numbers with units
  html = html.replace(
    /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|ms|s|deg)\b/g,
    '<span class="le-hl-num">$1$2</span>'
  );

  // Hex colors
  html = html.replace(
    /(#[0-9a-fA-F]{3,8})\b/g,
    '<span class="le-hl-color">$1</span>'
  );

  return html;
}
