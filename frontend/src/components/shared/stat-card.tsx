import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "brand",
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  hint?: string;
  accent?: "brand" | "success" | "info" | "highlight";
  className?: string;
}) {
  const accentMap = {
    brand: "bg-brand/10 text-brand",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    highlight: "bg-highlight/15 text-highlight-foreground",
  } as const;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 shadow-card transition-all hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold font-heading tracking-tight tabular-nums">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110",
            accentMap[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
