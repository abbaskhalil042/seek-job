import { Card } from "@/components/ui/card";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
} from "@/config/constants";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, StatusCounts } from "@/types";

/** Compact bar visualization of application counts by status. */
export function StatusBreakdown({
  counts,
  title = "Applications by status",
}: {
  counts: StatusCounts;
  title?: string;
}) {
  const entries = (Object.entries(counts) as [ApplicationStatus, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  const total = entries.reduce((sum, [, n]) => sum + n, 0);

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map(([status, count]) => (
            <div key={status}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">
                  {APPLICATION_STATUS_LABELS[status]}
                </span>
                <span className="tabular-nums text-muted-foreground">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    // reuse status style background by stripping text classes
                    APPLICATION_STATUS_STYLES[status].split(" ")[0],
                  )}
                  style={{ width: `${Math.max(6, (count / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
