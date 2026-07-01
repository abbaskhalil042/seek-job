"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/config/constants";
import type { JobSearchParams } from "@/lib/api/jobs.api";

export interface JobFilterState {
  q: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  location: string;
}

export const emptyFilters: JobFilterState = {
  q: "",
  jobType: "all",
  workMode: "all",
  experienceLevel: "all",
  location: "",
};

/** Convert UI filter state to API query params (dropping "all"/empty). */
export function toQueryParams(f: JobFilterState): JobSearchParams {
  return {
    q: f.q.trim() || undefined,
    jobType: f.jobType !== "all" ? (f.jobType as JobSearchParams["jobType"]) : undefined,
    workMode: f.workMode !== "all" ? (f.workMode as JobSearchParams["workMode"]) : undefined,
    experienceLevel:
      f.experienceLevel !== "all"
        ? (f.experienceLevel as JobSearchParams["experienceLevel"])
        : undefined,
    location: f.location.trim() || undefined,
  };
}

export function JobFilters({
  value,
  onChange,
  onReset,
}: {
  value: JobFilterState;
  onChange: (next: JobFilterState) => void;
  onReset: () => void;
}) {
  const set = <K extends keyof JobFilterState>(key: K, v: JobFilterState[K]) =>
    onChange({ ...value, [key]: v });

  const hasActive =
    value.jobType !== "all" ||
    value.workMode !== "all" ||
    value.experienceLevel !== "all" ||
    value.location !== "";

  return (
    <Card className="space-y-5 p-5 shadow-card">
      <div className="border-b border-border/60 pb-4">
        <h2 className="text-base font-semibold">Refine results</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Narrow the list to roles that fit how you want to work.
        </p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Title, skill, company…"
            className="h-10 pl-9"
          />
        </div>
      </div>

      <FilterSelect
        label="Job type"
        value={value.jobType}
        onValueChange={(v) => set("jobType", v)}
        options={JOB_TYPE_OPTIONS}
        allLabel="Any type"
      />
      <FilterSelect
        label="Work mode"
        value={value.workMode}
        onValueChange={(v) => set("workMode", v)}
        options={WORK_MODE_OPTIONS}
        allLabel="Any mode"
      />
      <FilterSelect
        label="Experience"
        value={value.experienceLevel}
        onValueChange={(v) => set("experienceLevel", v)}
        options={EXPERIENCE_LEVEL_OPTIONS}
        allLabel="Any level"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium">Location</label>
        <Input
          value={value.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="e.g. Remote, Berlin"
          className="h-10"
        />
      </div>

      {(hasActive || value.q) && (
        <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
          <X className="size-4" />
          Clear filters
        </Button>
      )}
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={(v) => onValueChange(String(v))}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
