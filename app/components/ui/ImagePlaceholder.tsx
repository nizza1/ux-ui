import type { ReactNode } from "react";
import { Image } from "lucide-react";

interface ImagePlaceholderProps {
  /** Aspect ratio as a CSS string, e.g. "16/9", "4/3", "1/1" */
  aspectRatio?: string;
  /** Caption shown below the placeholder */
  caption?: string;
  /** Short label shown inside the placeholder box */
  label?: string;
  /** Additional Tailwind classes on the outer wrapper */
  className?: string;
  /** Optional children to render inside (e.g. a real <img> later) */
  children?: ReactNode;
}

/**
 * Reusable image placeholder.
 * Drop a real <img> (or any content) as children to replace the placeholder.
 * Without children it renders a grey box with an icon and optional label.
 */
export function ImagePlaceholder({
  aspectRatio = "16/9",
  caption,
  label,
  className = "",
  children,
}: ImagePlaceholderProps) {
  return (
    <figure className={`my-6 ${className}`}>
      <div
        className="w-full rounded-xl overflow-hidden border border-(--bg-elevated) bg-(--bg-surface)"
        style={{ aspectRatio }}
      >
        {children ?? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-(--text-ghost) select-none">
            <Image className="w-8 h-8 opacity-40" strokeWidth={1.5} />
            {label && (
              <span className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase opacity-60">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-[11px] text-(--text-ghost) tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
