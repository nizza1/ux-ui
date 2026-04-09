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

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-[#12121e] p-2 px-4 rounded-t-xl">
        <span className="font-mono text-[10px] font-semibold text-white/40 tracking-[1.5px] uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-md border tracking-[1px] uppercase transition-colors duration-150 cursor-pointer ${
            copied
              ? "text-(--accent) border-(--accent-border) bg-(--accent-dim)"
              : "text-white/50 border-white/12 bg-white/7 hover:bg-white/14 hover:text-white/85"
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Kopiert!" : "Code kopieren"}
        </button>
      </div>
      <pre className="bg-[#1a1a2e] rounded-b-xl p-4 overflow-x-auto m-0">
        <code className="font-mono text-[13px] leading-[1.7] text-[#c8d3f5] whitespace-pre block">{code}</code>
      </pre>
    </div>
  );
}
