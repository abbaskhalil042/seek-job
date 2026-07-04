import type {
  ApplicationStatus,
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkMode,
} from "@/types";

/** Human-readable labels + presentation metadata for domain enums. */

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  entry: "Entry level",
  junior: "Junior",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead / Principal",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  hired: "Hired",
};

/**
 * Tailwind classes per application status — uses the design-system tokens so
 * statuses re-theme automatically. (token-driven, not hard-coded hex.)
 */
export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: "bg-muted text-muted-foreground",
  reviewing: "bg-info/10 text-info border-info/20",
  shortlisted: "bg-brand/10 text-brand border-brand/20",
  interview: "bg-highlight/15 text-highlight-foreground border-highlight/30",
  offered: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  withdrawn: "bg-muted text-muted-foreground line-through",
  hired: "bg-success text-success-foreground",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  archived: "Archived",
};

/** Token-driven badge styles per job status. */
export const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  open: "bg-success/10 text-success border-success/20",
  closed: "bg-destructive/10 text-destructive border-destructive/20",
  archived: "bg-muted text-muted-foreground border-border line-through",
};

/** Statuses an employer can move an application to (pipeline). */
export const EMPLOYER_PIPELINE: ApplicationStatus[] = [
  "reviewing",
  "shortlisted",
  "interview",
  "offered",
  "hired",
  "rejected",
];

export const JOB_TYPE_OPTIONS = Object.entries(JOB_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as JobType, label }),
);
export const WORK_MODE_OPTIONS = Object.entries(WORK_MODE_LABELS).map(
  ([value, label]) => ({ value: value as WorkMode, label }),
);
export const EXPERIENCE_LEVEL_OPTIONS = Object.entries(
  EXPERIENCE_LEVEL_LABELS,
).map(([value, label]) => ({ value: value as ExperienceLevel, label }));
