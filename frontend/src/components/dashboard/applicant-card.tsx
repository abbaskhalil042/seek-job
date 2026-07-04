"use client";

import Link from "next/link";
import { Mail, Clock, Briefcase, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { MatchScoreRing } from "@/components/shared/match-score";
import { initials, timeAgo } from "@/lib/format";
import type { Application } from "@/types";

/** Employer-facing summary of a single applicant + optional actions slot. */
export function ApplicantCard({
  application,
  showJob = true,
  actions,
}: {
  application: Application;
  showJob?: boolean;
  actions?: React.ReactNode;
}) {
  const applicant = typeof application.applicant === "string" ? null : application.applicant;
  const job = typeof application.job === "string" ? null : application.job;
  const resume = typeof application.resume === "string" ? null : application.resume;
  const insights = application.matchInsights;

  return (
    <Card className="p-5 shadow-card transition-colors hover:border-brand/30">
      <div className="flex items-start gap-4">
        <MatchScoreRing score={application.matchScore} size={54} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-brand/10 text-xs font-semibold text-brand">
                  {initials(applicant?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{applicant?.name ?? "Applicant"}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {applicant?.email && (
                    <a
                      href={`mailto:${applicant.email}`}
                      className="inline-flex items-center gap-1 hover:text-brand"
                    >
                      <Mail className="size-3" />
                      {applicant.email}
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {timeAgo(application.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {showJob && job && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Briefcase className="size-3.5" />
              Applied for{" "}
              <Link href={`/jobs/${job.slug}`} className="font-medium text-foreground hover:text-brand">
                {job.title}
              </Link>
            </p>
          )}

          {applicant?.seekerProfile?.headline && (
            <p className="mt-1 text-sm text-muted-foreground">
              {applicant.seekerProfile.headline}
            </p>
          )}

          {insights && insights.matchedSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insights.matchedSkills.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success"
                >
                  {s}
                </span>
              ))}
              {insights.missingSkills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground line-through"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {resume && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {resume.originalName}
              {resume.parsedBy ? ` · ${resume.parsedBy === "llm" ? "AI parsed" : "heuristic"}` : ""}
            </p>
          )}

          {application.coverLetter && (
            <p className="mt-3 line-clamp-3 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              {application.coverLetter}
            </p>
          )}

          {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </Card>
  );
}
