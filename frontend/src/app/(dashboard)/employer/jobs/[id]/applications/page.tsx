"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ApplicantCard } from "@/components/dashboard/applicant-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobById } from "@/lib/hooks/use-jobs";
import {
  useJobApplications,
  useUpdateApplicationStatus,
} from "@/lib/hooks/use-applications";
import { normalizeError } from "@/lib/api/client";
import { APPLICATION_STATUS_LABELS, EMPLOYER_PIPELINE } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";

const FILTERS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export default function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const { data: jobRes } = useJobById(id);
  const { data, isLoading } = useJobApplications(
    id,
    filter === "all" ? undefined : filter,
  );
  const job = jobRes?.data;
  const applications = data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to my jobs
      </Link>
      <PageHeader
        title="Applicants"
        description={job ? job.title : "Review and move candidates through your pipeline."}
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants"
          description={
            filter === "all"
              ? "No one has applied to this job yet."
              : `No applicants with status "${APPLICATION_STATUS_LABELS[filter as ApplicationStatus]}".`
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicantCard
              key={app.id}
              application={app}
              showJob={false}
              actions={<PipelineControl application={app} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineControl({ application }: { application: Application }) {
  const update = useUpdateApplicationStatus();

  async function move(status: ApplicationStatus) {
    if (status === application.status) return;
    try {
      await update.mutateAsync({ id: application.id, status });
      toast.success(`Moved to ${APPLICATION_STATUS_LABELS[status]}`);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  const terminal =
    application.status === "withdrawn" || application.status === "hired";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Move to:</span>
      <Select
        value={EMPLOYER_PIPELINE.includes(application.status) ? application.status : ""}
        onValueChange={(v) => move(String(v) as ApplicationStatus)}
      >
        <SelectTrigger className="h-9 w-40" disabled={update.isPending || terminal}>
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {EMPLOYER_PIPELINE.map((s) => (
            <SelectItem key={s} value={s}>
              {APPLICATION_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {update.isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
