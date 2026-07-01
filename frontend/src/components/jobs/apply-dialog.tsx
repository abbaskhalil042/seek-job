"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileText, CheckCircle2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumes } from "@/lib/hooks/use-resumes";
import { useApply } from "@/lib/hooks/use-applications";
import { normalizeError } from "@/lib/api/client";
import type { Job } from "@/types";

export function ApplyDialog({
  job,
  open,
  onOpenChange,
}: {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: resumesRes, isLoading } = useResumes();
  const apply = useApply();
  const [resumeId, setResumeId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");

  const resumes = resumesRes?.data ?? [];
  const primary = resumes.find((r) => r.isPrimary) ?? resumes[0];
  const selectedId = resumeId || primary?.id || "";

  async function handleApply() {
    try {
      await apply.mutateAsync({
        jobId: job.id,
        resumeId: selectedId || undefined,
        coverLetter: coverLetter.trim() || undefined,
      });
      toast.success("Application submitted! 🎉");
      onOpenChange(false);
      setCoverLetter("");
    } catch (err) {
      toast.error(normalizeError(err).message || "Could not submit application");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply to {job.title}</DialogTitle>
          <DialogDescription>
            {job.companyName ? `at ${job.companyName}` : "Submit your application"} —
            we&apos;ll compute your match score automatically.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
            <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">No resume yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a resume so employers can see your profile and match score.
            </p>
            <ButtonLink href="/seeker/resumes" className="mt-4">
              Upload a resume
            </ButtonLink>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Resume</label>
              <Select
                value={selectedId}
                onValueChange={(v) => setResumeId(String(v))}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.originalName}
                      {r.isPrimary ? " (primary)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Cover letter <span className="text-muted-foreground">(optional)</span>
              </label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit…"
                rows={5}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-brand/5 p-3 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
              Your resume skills will be compared against this role to generate a
              match score.
            </div>
          </div>
        )}

        {resumes.length > 0 && (
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={apply.isPending || !selectedId}>
              {apply.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Submit application
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
