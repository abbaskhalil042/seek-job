"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Star,
  RefreshCw,
  Trash2,
  Loader2,
  ChevronDown,
  Sparkles,
  CircleCheck,
  CircleAlert,
  Clock,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useReparseResume,
  useSetPrimaryResume,
  useDeleteResume,
} from "@/lib/hooks/use-resumes";
import { normalizeError } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Resume, ResumeParseStatus } from "@/types";

const PARSE_META: Record<
  ResumeParseStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: { label: "Queued", className: "text-muted-foreground", icon: Clock },
  processing: { label: "Parsing…", className: "text-info", icon: Loader2 },
  completed: { label: "Parsed", className: "text-success", icon: CircleCheck },
  failed: { label: "Failed", className: "text-destructive", icon: CircleAlert },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ResumeCard({ resume }: { resume: Resume }) {
  const [open, setOpen] = useState(false);
  const setPrimary = useSetPrimaryResume();
  const reparse = useReparseResume();
  const remove = useDeleteResume();

  const meta = PARSE_META[resume.parseStatus];
  const StatusIcon = meta.icon;
  const parsed = resume.parsed;

  async function run(
    fn: () => Promise<unknown>,
    success: string,
  ) {
    try {
      await fn();
      toast.success(success);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden p-0 shadow-card transition-colors",
        resume.isPrimary && "ring-1 ring-brand/30",
      )}
    >
      <div className="flex items-start gap-4 p-5">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
          <FileText className="size-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold">{resume.originalName}</p>
            {resume.isPrimary && (
              <Badge className="gap-1 bg-brand text-brand-foreground">
                <Star className="size-3 fill-current" />
                Primary
              </Badge>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className={cn("inline-flex items-center gap-1 font-medium", meta.className)}>
              <StatusIcon
                className={cn("size-3.5", resume.parseStatus === "processing" && "animate-spin")}
              />
              {meta.label}
            </span>
            {resume.parsedBy && (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="size-3.5" />
                {resume.parsedBy === "llm" ? "AI parsed" : "Heuristic"}
              </span>
            )}
            <span>{formatBytes(resume.sizeBytes)}</span>
            <span>Uploaded {formatDate(resume.createdAt)}</span>
          </div>
          {resume.parseStatus === "failed" && resume.parseError && (
            <p className="mt-2 text-sm text-destructive">{resume.parseError}</p>
          )}
        </div>
      </div>

      {parsed && (parsed.skills.length > 0 || parsed.summary) && (
        <div className="border-t px-5 py-4">
          {parsed.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {parsed.summary}
            </p>
          )}
          {parsed.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {parsed.skills.slice(0, open ? undefined : 8).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                  {s}
                </span>
              ))}
              {!open && parsed.skills.length > 8 && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  +{parsed.skills.length - 8}
                </span>
              )}
            </div>
          )}

          {open && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {parsed.experience.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                    <Briefcase className="size-4 text-brand" />
                    Experience
                  </h4>
                  <ul className="space-y-2">
                    {parsed.experience.slice(0, 4).map((e, i) => (
                      <li key={i} className="text-sm">
                        <p className="font-medium">{e.title ?? "Role"}</p>
                        <p className="text-muted-foreground">
                          {[e.company, [e.startDate, e.endDate].filter(Boolean).join(" – ")]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed.education.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                    <GraduationCap className="size-4 text-brand" />
                    Education
                  </h4>
                  <ul className="space-y-2">
                    {parsed.education.slice(0, 4).map((e, i) => (
                      <li key={i} className="text-sm">
                        <p className="font-medium">
                          {[e.degree, e.field].filter(Boolean).join(", ") || "Study"}
                        </p>
                        <p className="text-muted-foreground">{e.institution}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(parsed.experience.length > 0 ||
            parsed.education.length > 0 ||
            parsed.skills.length > 8) && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              {open ? "Show less" : "Show parsed details"}
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t bg-muted/20 px-5 py-3">
        {!resume.isPrimary && (
          <Button
            variant="ghost"
            size="sm"
            disabled={setPrimary.isPending}
            onClick={() => run(() => setPrimary.mutateAsync(resume.id), "Set as primary resume")}
          >
            {setPrimary.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Star className="size-4" />
            )}
            Set primary
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={reparse.isPending}
          onClick={() => run(() => reparse.mutateAsync(resume.id), "Re-parsing resume…")}
        >
          {reparse.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Re-parse
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={remove.isPending}
          onClick={() => {
            if (confirm(`Delete "${resume.originalName}"? This can't be undone.`)) {
              run(() => remove.mutateAsync(resume.id), "Resume deleted");
            }
          }}
          className="ml-auto text-muted-foreground hover:text-destructive"
        >
          {remove.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Delete
        </Button>
      </div>
    </Card>
  );
}
