"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillsInput } from "@/components/shared/skills-input";
import {
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from "@/config/constants";
import type { JobInput } from "@/lib/api/jobs.api";
import type { Job, JobStatus } from "@/types";

const PERIOD_OPTIONS = [
  { value: "year", label: "per year" },
  { value: "month", label: "per month" },
  { value: "hour", label: "per hour" },
];

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "open", label: "Open — visible & accepting applications" },
  { value: "draft", label: "Draft — hidden, save for later" },
  { value: "closed", label: "Closed — no longer accepting" },
];

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function JobForm({
  initial,
  submitLabel = "Publish job",
  pending,
  onSubmit,
}: {
  initial?: Job;
  submitLabel?: string;
  pending?: boolean;
  onSubmit: (input: JobInput) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [responsibilities, setResponsibilities] = useState(
    (initial?.responsibilities ?? []).join("\n"),
  );
  const [requirements, setRequirements] = useState(
    (initial?.requirements ?? []).join("\n"),
  );
  const [jobType, setJobType] = useState<string>(initial?.jobType ?? "full_time");
  const [workMode, setWorkMode] = useState<string>(initial?.workMode ?? "onsite");
  const [experienceLevel, setExperienceLevel] = useState<string>(
    initial?.experienceLevel ?? "mid",
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [salaryMin, setSalaryMin] = useState(
    initial?.salary?.min != null ? String(initial.salary.min) : "",
  );
  const [salaryMax, setSalaryMax] = useState(
    initial?.salary?.max != null ? String(initial.salary.max) : "",
  );
  const [currency, setCurrency] = useState(initial?.salary?.currency ?? "USD");
  const [period, setPeriod] = useState<string>(initial?.salary?.period ?? "year");
  const [openings, setOpenings] = useState(String(initial?.openings ?? 1));
  const [deadline, setDeadline] = useState(
    initial?.deadline ? initial.deadline.slice(0, 10) : "",
  );
  const [status, setStatus] = useState<string>(initial?.status ?? "open");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (title.trim().length < 3) next.title = "Title must be at least 3 characters.";
    if (title.trim().length > 160) next.title = "Title is too long (max 160).";
    if (description.trim().length < 20)
      next.description = "Description must be at least 20 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const hasSalary = salaryMin !== "" || salaryMax !== "";
    const input: JobInput = {
      title: title.trim(),
      description: description.trim(),
      responsibilities: linesToArray(responsibilities),
      requirements: linesToArray(requirements),
      skills,
      jobType: jobType as JobInput["jobType"],
      workMode: workMode as JobInput["workMode"],
      experienceLevel: experienceLevel as JobInput["experienceLevel"],
      location: location.trim() || undefined,
      salary: hasSalary
        ? {
            min: salaryMin ? Number(salaryMin) : undefined,
            max: salaryMax ? Number(salaryMax) : undefined,
            currency: currency.trim() || "USD",
            period: period as "hour" | "month" | "year",
          }
        : undefined,
      openings: openings ? Math.max(1, Number(openings)) : 1,
      deadline: deadline || undefined,
      status: status as JobStatus,
    };
    onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-5 p-6">
        <h3 className="font-semibold">Role details</h3>
        <Field label="Job title" error={errors.title} hint="e.g. Senior Frontend Engineer">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
        </Field>
        <Field
          label="Description"
          error={errors.description}
          hint="Describe the role, team, and mission. Minimum 20 characters."
        >
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="What will this person work on? What does success look like?"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Responsibilities" hint="One per line.">
            <Textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              rows={5}
              placeholder={"Own the frontend architecture\nMentor junior engineers"}
            />
          </Field>
          <Field label="Requirements" hint="One per line.">
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={5}
              placeholder={"5+ years with React\nStrong TypeScript skills"}
            />
          </Field>
        </div>
        <Field label="Skills" hint="Press Enter or comma to add. Used for candidate matching.">
          <SkillsInput value={skills} onChange={setSkills} placeholder="e.g. React, TypeScript" />
        </Field>
      </Card>

      <Card className="space-y-5 p-6">
        <h3 className="font-semibold">Classification</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Job type">
            <Select value={jobType} onValueChange={(v) => setJobType(String(v))}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Work mode">
            <Select value={workMode} onValueChange={(v) => setWorkMode(String(v))}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORK_MODE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Experience level">
            <Select value={experienceLevel} onValueChange={(v) => setExperienceLevel(String(v))}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVEL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location" hint="Leave blank if fully remote.">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Berlin, Germany"
              className="h-11"
            />
          </Field>
          <Field label="Openings">
            <Input
              type="number"
              min={1}
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="h-11"
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <h3 className="font-semibold">Compensation & timeline</h3>
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Min salary">
            <Input
              type="number"
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="80000"
              className="h-11"
            />
          </Field>
          <Field label="Max salary">
            <Input
              type="number"
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="120000"
              className="h-11"
            />
          </Field>
          <Field label="Currency">
            <Input
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              maxLength={3}
              className="h-11"
            />
          </Field>
          <Field label="Period">
            <Select value={period} onValueChange={(v) => setPeriod(String(v))}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Application deadline" hint="Optional.">
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="h-11 w-full sm:w-56"
          />
        </Field>
      </Card>

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
        <Field label="Visibility">
          <Select value={status} onValueChange={(v) => setStatus(String(v))}>
            <SelectTrigger className="h-11 w-full sm:w-96">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button type="submit" disabled={pending} className="h-11 shrink-0 shadow-glow">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {submitLabel}
        </Button>
      </Card>
    </form>
  );
}
