"use client";

import Link from "next/link";
import { Briefcase, DoorOpen, Users, Target, PlusCircle, ArrowRight, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBreakdown } from "@/components/dashboard/status-breakdown";
import { ApplicantCard } from "@/components/dashboard/applicant-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployerDashboard } from "@/lib/hooks/use-analytics";
import { useAuth } from "@/providers/auth-provider";
import { matchScoreMeta } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function EmployerOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading } = useEmployerDashboard();
  const dashboard = data?.data;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"} 👋`}
        description="Your hiring at a glance."
        action={
          <ButtonLink href="/employer/jobs/new" className="shadow-glow">
            <PlusCircle className="size-4" />
            Post a job
          </ButtonLink>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total jobs" value={dashboard?.totals.totalJobs ?? 0} icon={Briefcase} accent="brand" />
          <StatCard label="Open jobs" value={dashboard?.totals.openJobs ?? 0} icon={DoorOpen} accent="success" />
          <StatCard
            label="Applications"
            value={dashboard?.totals.totalApplications ?? 0}
            icon={Users}
            accent="info"
          />
          <StatCard
            label="Avg. match"
            value={`${dashboard?.totals.avgMatchScore ?? 0}%`}
            icon={Target}
            accent="highlight"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Top performing jobs</h3>
            <ButtonLink href="/employer/jobs" variant="ghost" size="sm">
              All jobs
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : !dashboard?.topJobs.length ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="Post your first role to start receiving applications."
              action={<ButtonLink href="/employer/jobs/new">Post a job</ButtonLink>}
            />
          ) : (
            <div className="space-y-2">
              {dashboard.topJobs.map((job) => {
                const meta = matchScoreMeta(job.avgScore);
                return (
                  <Link
                    key={job.jobId}
                    href={`/employer/jobs/${job.jobId}/applications`}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-brand/30"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{job.title}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3.5" />
                          {job.applications} applicants
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="size-3.5" />
                          {job.views} views
                        </span>
                      </div>
                    </div>
                    <span className={cn("shrink-0 text-sm font-semibold tabular-nums", meta.color)}>
                      {job.avgScore}% avg
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {dashboard && <StatusBreakdown counts={dashboard.applicationsByStatus} />}
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent applicants</h3>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : !dashboard?.recentApplications.length ? (
          <EmptyState
            icon={Users}
            title="No applicants yet"
            description="Once candidates apply to your jobs, they'll show up here."
          />
        ) : (
          <div className="space-y-3">
            {dashboard.recentApplications.map((app) => (
              <ApplicantCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
