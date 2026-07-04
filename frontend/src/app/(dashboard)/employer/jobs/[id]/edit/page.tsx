"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { JobForm } from "@/components/jobs/job-form";
import { PageLoader } from "@/components/shared/spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { useJobById, useUpdateJob } from "@/lib/hooks/use-jobs";
import { normalizeError } from "@/lib/api/client";
import type { JobInput } from "@/lib/api/jobs.api";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useJobById(id);
  const update = useUpdateJob();
  const job = data?.data;

  async function handleSubmit(input: JobInput) {
    try {
      await update.mutateAsync({ id, input });
      toast.success("Job updated");
      router.push("/employer/jobs");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  if (isLoading) return <PageLoader label="Loading job…" />;
  if (isError || !job) {
    return (
      <div className="mx-auto max-w-4xl">
        <EmptyState
          icon={Briefcase}
          title="Job not found"
          description="This job may have been removed."
          action={<ButtonLink href="/employer/jobs">Back to my jobs</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to my jobs
      </Link>
      <PageHeader title="Edit job" description={job.title} />
      <JobForm
        initial={job}
        submitLabel="Save changes"
        pending={update.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
