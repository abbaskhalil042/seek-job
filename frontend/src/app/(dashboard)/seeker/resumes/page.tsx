"use client";

import { FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeUploader } from "@/components/resumes/resume-uploader";
import { ResumeCard } from "@/components/resumes/resume-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes } from "@/lib/hooks/use-resumes";

export default function SeekerResumesPage() {
  const { data, isLoading } = useResumes();
  const resumes = data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="My Resumes"
        description="Upload a resume and we'll extract your skills and experience to power job matching."
      />

      <ResumeUploader />

      <div className="flex items-start gap-2 rounded-xl border bg-brand/5 p-4 text-sm text-muted-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
        <p>
          Your <span className="font-medium text-foreground">primary resume</span> is
          used by default when you apply. We compare its skills against each role to
          compute your match score — no AI key required.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Upload your first resume above to get started with smart job matching."
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
          </p>
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
