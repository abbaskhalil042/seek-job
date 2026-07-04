"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  Eye,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { JobStatusBadge } from "@/components/shared/job-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyJobs, useUpdateJobStatus, useDeleteJob } from "@/lib/hooks/use-jobs";
import { normalizeError } from "@/lib/api/client";
import {
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  JOB_STATUS_LABELS,
} from "@/config/constants";
import { formatSalary, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Job, JobStatus } from "@/types";

const FILTERS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

const STATUS_CHOICES: JobStatus[] = ["open", "draft", "closed", "archived"];

export default function MyJobsPage() {
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const { data, isLoading } = useMyJobs(filter === "all" ? undefined : filter);
  const jobs = data?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="My Jobs"
        description="Manage your listings, track applicants, and update status."
        action={
          <ButtonLink href="/employer/jobs/new" className="shadow-glow">
            <PlusCircle className="size-4" />
            Post a job
          </ButtonLink>
        }
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
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
          description={
            filter === "all"
              ? "Post your first role to start receiving applications."
              : "Try a different filter or post a new job."
          }
          action={<ButtonLink href="/employer/jobs/new">Post a job</ButtonLink>}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <EmployerJobRow key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmployerJobRow({ job }: { job: Job }) {
  const updateStatus = useUpdateJobStatus();
  const remove = useDeleteJob();
  const salary = formatSalary(job.salary);

  async function changeStatus(status: JobStatus) {
    if (status === job.status) return;
    try {
      await updateStatus.mutateAsync({ id: job.id, status });
      toast.success(`Marked as ${JOB_STATUS_LABELS[status].toLowerCase()}`);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    try {
      await remove.mutateAsync(job.id);
      toast.success("Job deleted");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <Card className="p-5 shadow-card transition-colors hover:border-brand/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/jobs/${job.slug}`}
                className="truncate font-semibold hover:text-brand"
              >
                {job.title}
              </Link>
              <JobStatusBadge status={job.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{WORK_MODE_LABELS[job.workMode]}</span>
              <span>{JOB_TYPE_LABELS[job.jobType]}</span>
              {salary && <span className="text-success">{salary}</span>}
              <span>Posted {timeAgo(job.createdAt)}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 font-medium" title="Applicants">
              <Users className="size-4 text-muted-foreground" />
              {job.applicationCount}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground" title="Views">
              <Eye className="size-4" />
              {job.viewCount}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <ButtonLink
            href={`/employer/jobs/${job.id}/applications`}
            variant="outline"
            size="sm"
          >
            <Users className="size-4" />
            View applicants ({job.applicationCount})
          </ButtonLink>
          <ButtonLink href={`/employer/jobs/${job.id}/edit`} variant="ghost" size="sm">
            <Pencil className="size-4" />
            Edit
          </ButtonLink>
          <ButtonLink href={`/jobs/${job.slug}`} variant="ghost" size="sm">
            <ExternalLink className="size-4" />
            Preview
          </ButtonLink>

          <div className="ml-auto flex items-center gap-2">
            <Select
              value={job.status}
              onValueChange={(v) => changeStatus(String(v) as JobStatus)}
            >
              <SelectTrigger className="h-9 w-36" disabled={updateStatus.isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_CHOICES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {JOB_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              disabled={remove.isPending}
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              {remove.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
