import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "Code" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Code blocks intentionally use a fixed dark "terminal" surface in BOTH themes.
  // This is a deliberate, self-consistent surface (not theme-bound), so the
  // header/body colors below are scoped to that dark surface on purpose.
  return (
    <div className="relative rounded-xl overflow-hidden border border-(--bg-elevated) shadow-(--shadow-sm) mb-6">
      <div className="flex items-center justify-between bg-[#12121e] p-2 px-4 border-b border-white/8">
        <span className="font-mono text-[10px] font-semibold text-white/45 tracking-[1.5px] uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-md border tracking-[1px] uppercase transition-colors duration-150 cursor-pointer ${
            copied
              ? "text-(--accent) border-(--accent-border) bg-(--accent-dim)"
              : "text-white/60 border-white/15 bg-white/8 hover:bg-white/16 hover:text-white/90"
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Kopiert!" : "Code kopieren"}
        </button>
      </div>
      <pre className="bg-[#1a1a2e] p-4 overflow-x-auto m-0">
        <code className="font-mono text-[13px] leading-[1.7] text-[#c8d3f5] whitespace-pre block">{code}</code>
      </pre>
    </div>
  );
}
