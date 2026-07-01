"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Loader2, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ApplicationRow } from "@/components/dashboard/application-row";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyApplications,
  useWithdrawApplication,
} from "@/lib/hooks/use-applications";
import { normalizeError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";

const FILTERS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const WITHDRAWABLE: ApplicationStatus[] = [
  "applied",
  "reviewing",
  "shortlisted",
  "interview",
];

export default function SeekerApplicationsPage() {
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const { data, isLoading } = useMyApplications(
    filter === "all" ? undefined : filter,
  );
  const withdraw = useWithdrawApplication();
  const applications = data?.data ?? [];

  async function handleWithdraw(id: string) {
    try {
      await withdraw.mutateAsync(id);
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="My Applications"
        description="Track every role you've applied to and where it stands."
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-brand text-brand-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications here"
          description={
            filter === "all"
              ? "You haven't applied to any jobs yet."
              : `No applications with status "${filter}".`
          }
          action={<ButtonLink href="/jobs">Browse jobs</ButtonLink>}
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app: Application) => (
            <ApplicationRow
              key={app.id}
              application={app}
              actions={
                WITHDRAWABLE.includes(app.status) ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={withdraw.isPending}
                    onClick={() => handleWithdraw(app.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {withdraw.isPending && withdraw.variables === app.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <X className="size-4" />
                    )}
                    Withdraw
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
