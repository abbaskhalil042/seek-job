"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { JobForm } from "@/components/jobs/job-form";
import { useCreateJob } from "@/lib/hooks/use-jobs";
import { normalizeError } from "@/lib/api/client";
import type { JobInput } from "@/lib/api/jobs.api";

export default function NewJobPage() {
  const router = useRouter();
  const create = useCreateJob();

  async function handleSubmit(input: JobInput) {
    try {
      await create.mutateAsync(input);
      toast.success("Job posted!");
      router.push("/employer/jobs");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
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
      <PageHeader
        title="Post a new job"
        description="Fill in the details below. Candidates are matched to your listed skills automatically."
      />
      <JobForm submitLabel="Publish job" pending={create.isPending} onSubmit={handleSubmit} />
    </div>
  );
}
