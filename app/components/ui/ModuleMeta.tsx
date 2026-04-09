import { Clock, Code2 } from "lucide-react";

interface ModuleMetaProps {
  duration: string;
  practiceTime: string;
}

export function ModuleMeta({ duration, practiceTime }: ModuleMetaProps) {
  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <div className="flex items-center gap-1.5 text-[13px] text-(--text-tertiary)">
        <Clock size={13} />
        <span>{duration}</span>
      </div>
      <div className="flex items-center gap-1.5 text-[13px] text-(--text-tertiary)">
        <Code2 size={13} />
        <span>Praxisaufgabe: {practiceTime}</span>
      </div>
    </div>
  );
}
