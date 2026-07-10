import { type LucideIcon, TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "success" | "warning" | "muted";
}) {
  const accentClass = {
    primary: "text-primary bg-accent",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    muted: "text-muted-foreground bg-muted",
  }[accent];

  return (
    <div className="neu-card p-5 md:p-6 flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-full grid place-items-center ${accentClass} shadow-neu-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-3xl font-bold tracking-tight truncate">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
