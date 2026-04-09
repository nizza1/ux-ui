import { Target } from "lucide-react";

interface LearningGoalsProps {
  goals: string[];
  className?: string;
}

export function LearningGoals({ goals, className = "" }: LearningGoalsProps) {
  return (
    <div className={`bg-(--bg-surface) border border-(--bg-elevated) rounded-2xl p-6 mb-8 ${className}`}>
      <div className="font-mono text-[10px] font-semibold tracking-[2px] uppercase text-(--accent) mb-4 flex items-center gap-2">
        <Target size={14} />
        Lernziele
      </div>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {goals.map((goal, i) => (
          <li key={i} className="text-[13px] leading-normal text-(--text-secondary) pl-6 relative">
            <span className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-lg bg-(--accent-dim) border-[1.5px] border-(--accent-border) inline-block" />
            <span className="absolute left-1 top-1.75 w-1.5 h-1.25 border-l-[1.5px] border-b-[1.5px] border-(--accent) inline-block -rotate-45" />
            {goal}
          </li>
        ))}
      </ul>
    </div>
  );
}
