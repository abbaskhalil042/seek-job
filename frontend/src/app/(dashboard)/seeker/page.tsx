"use client";

import { Briefcase, Target, FileText, Search, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBreakdown } from "@/components/dashboard/status-breakdown";
import { ApplicationRow } from "@/components/dashboard/application-row";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeekerDashboard } from "@/lib/hooks/use-analytics";
import { useAuth } from "@/providers/auth-provider";

export default function SeekerOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading } = useSeekerDashboard();
  const dashboard = data?.data;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "there"} 👋`}
        description="Here's how your job search is going."
        action={
          <ButtonLink href="/jobs" className="shadow-glow">
            <Search className="size-4" />
            Browse jobs
          </ButtonLink>
        }
      />

      {isLoading ? (
        <StatSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Applications"
            value={dashboard?.totals.totalApplications ?? 0}
            icon={Briefcase}
            accent="brand"
          />
          <StatCard
            label="Avg. match score"
            value={`${dashboard?.totals.avgMatchScore ?? 0}%`}
            icon={Target}
            accent="success"
          />
          <StatCard
            label="Resumes"
            value={dashboard?.totals.resumes ?? 0}
            icon={FileText}
            accent="info"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent applications</h3>
            <ButtonLink href="/seeker/applications" variant="ghost" size="sm">
              View all
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : !dashboard?.recentApplications.length ? (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Find a role that fits and apply in one click."
              action={
                <ButtonLink href="/jobs">
                  Browse jobs
                </ButtonLink>
              }
            />
          ) : (
            <div className="space-y-3">
              {dashboard.recentApplications.map((app) => (
                <ApplicationRow key={app.id} application={app} />
              ))}
            </div>
          )}
        </Card>

        {dashboard && <StatusBreakdown counts={dashboard.applicationsByStatus} />}
      </div>

      <Card className="flex flex-col items-start gap-4 bg-brand/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Boost your match scores</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your resume up to date — we re-parse skills automatically.
          </p>
        </div>
        <ButtonLink href="/seeker/resumes" variant="outline" className="shrink-0">
          Manage resumes
        </ButtonLink>
      </Card>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}
