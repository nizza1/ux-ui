import type { ReactNode } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const levelClasses: Record<number, string> = {
  1: "text-[32px] font-extrabold tracking-[-0.5px] leading-[1.2] text-(--text-primary)",
  2: "text-[19px] font-bold tracking-[-0.2px] leading-[1.3] text-(--text-primary)",
  3: "text-[15px] font-bold tracking-[-0.1px] leading-[1.4] text-(--text-primary)",
  4: "text-sm font-bold leading-[1.4] text-(--text-primary)",
};

export function Heading({
  level = 2,
  children,
  className,
  style,
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`m-0 p-0 ${levelClasses[level]} ${className ?? ""}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
