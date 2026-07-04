import { cn } from "@/lib/utils";
import { JOB_STATUS_LABELS, JOB_STATUS_STYLES } from "@/config/constants";
import type { JobStatus } from "@/types";

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        JOB_STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
