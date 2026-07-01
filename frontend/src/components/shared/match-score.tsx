import { cn } from "@/lib/utils";
import { matchScoreMeta } from "@/lib/format";

/** Circular match-score ring (SVG). Color follows the design-system tokens. */
export function MatchScoreRing({
  score,
  size = 56,
  strokeWidth = 5,
  className,
}: {
  score?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const value = Math.max(0, Math.min(100, score ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const meta = matchScoreMeta(score);

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(meta.color, "transition-[stroke-dashoffset] duration-700")}
          stroke="currentColor"
        />
      </svg>
      <span
        className={cn(
          "absolute text-sm font-bold tabular-nums",
          meta.color,
        )}
      >
        {score == null ? "—" : value}
      </span>
    </div>
  );
}

/** Horizontal match-score bar with label. */
export function MatchScoreBar({ score }: { score?: number }) {
  const value = Math.max(0, Math.min(100, score ?? 0));
  const meta = matchScoreMeta(score);
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Match</span>
        <span className={cn("font-semibold tabular-nums", meta.color)}>
          {score == null ? "—" : `${value}%`} · {meta.label}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700", meta.track)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
