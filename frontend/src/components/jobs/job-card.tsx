import Link from "next/link";
import { Building2, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from "@/config/constants";
import { formatSalary, timeAgo, initials } from "@/lib/format";
import type { Job } from "@/types";

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary);

  return (
    <Card className="group relative overflow-hidden p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-elevated">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand opacity-0 transition-opacity group-hover:opacity-100" />
      <Link
        href={`/jobs/${job.slug}`}
        className="absolute inset-0 z-10"
        aria-label={job.title}
      />
      <div className="flex items-start gap-4">
        <Avatar className="size-12 rounded-lg border bg-muted">
          <AvatarFallback className="rounded-lg bg-brand/10 font-semibold text-brand">
            {initials(job.companyName ?? "Co")}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold transition-colors group-hover:text-brand">
                {job.title}
              </h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {job.companyName && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5" />
                    {job.companyName}
                  </span>
                )}
                {job.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            {salary && (
            <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
              {salary}
            </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md">
              {WORK_MODE_LABELS[job.workMode]}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {JOB_TYPE_LABELS[job.jobType]}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {EXPERIENCE_LEVEL_LABELS[job.experienceLevel]}
            </Badge>
          </div>

          {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand ring-1 ring-brand/10"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  +{job.skills.length - 5}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Posted {timeAgo(job.createdAt)}
          </div>
        </div>
      </div>
    </Card>
  );
}
