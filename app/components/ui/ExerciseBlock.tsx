import type { ReactNode } from "react";

interface ExerciseBlockProps {
  title: string;
  children: ReactNode;
  tasks: string[];
  className?: string;
}

export function ExerciseBlock({ title, children, tasks, className = "" }: ExerciseBlockProps) {
  return (
    <div className={`bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl p-6 mb-6 ${className}`}>
      <h3 className="text-[15px] font-bold text-(--text-primary) mt-0 mb-2">{title}</h3>
      <p className="text-[13px] leading-[1.6] text-(--text-secondary) mt-0 mb-0">{children}</p>
      <ul className="list-none p-0 mt-4 flex flex-col gap-1.5">
        {tasks.map((task, i) => (
          <li key={i} className="text-[13px] leading-[1.5] text-(--text-secondary) pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-(--accent) before:font-semibold">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
