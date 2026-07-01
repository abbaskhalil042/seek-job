import Link from "next/link";
import { Building2, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { MatchScoreRing } from "@/components/shared/match-score";
import { timeAgo } from "@/lib/format";
import type { Application } from "@/types";

/** A seeker-facing row summarizing one of their applications. */
export function ApplicationRow({
  application,
  actions,
}: {
  application: Application;
  actions?: React.ReactNode;
}) {
  const job = application.job;
  const jobObj = typeof job === "string" ? null : job;
  const slug = jobObj?.slug;

  const title = jobObj?.title ?? "Job";

  return (
    <Card className="flex items-center gap-4 p-4 transition-colors hover:border-brand/30">
      <MatchScoreRing score={application.matchScore} size={52} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {slug ? (
            <Link
              href={`/jobs/${slug}`}
              className="truncate font-semibold hover:text-brand"
            >
              {title}
            </Link>
          ) : (
            <span className="truncate font-semibold">{title}</span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          {jobObj?.companyName && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3.5" />
              {jobObj.companyName}
            </span>
          )}
          {jobObj?.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {jobObj.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {timeAgo(application.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <StatusBadge status={application.status} />
        {actions}
      </div>
    </Card>
  );
}
