"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Wallet,
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Container } from "@/components/shared/container";
import { ApplyDialog } from "./apply-dialog";
import { useJobBySlug } from "@/lib/hooks/use-jobs";
import { useAuth } from "@/providers/auth-provider";
import {
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from "@/config/constants";
import { formatSalary, timeAgo, initials, pluralize } from "@/lib/format";

export function JobDetail({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useJobBySlug(slug);
  const { user, status } = useAuth();
  const [applyOpen, setApplyOpen] = useState(false);

  if (isLoading) return <JobDetailSkeleton />;
  if (isError || !data?.data) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={Briefcase}
          title="Job not found"
          description="This role may have been closed or removed."
          action={<ButtonLink href="/jobs">Back to jobs</ButtonLink>}
        />
      </Container>
    );
  }

  const job = data.data;
  const salary = formatSalary(job.salary);
  const isSeeker = user?.role === "job_seeker";

  const metaItems = [
    { icon: Briefcase, label: JOB_TYPE_LABELS[job.jobType] },
    { icon: MapPin, label: job.location || WORK_MODE_LABELS[job.workMode] },
    { icon: Users, label: EXPERIENCE_LEVEL_LABELS[job.experienceLevel] },
    ...(salary ? [{ icon: Wallet, label: salary }] : []),
  ];

  const applyAction =
    status !== "authenticated" ? (
      <ButtonLink
        href={`/login?redirect=/jobs/${job.slug}`}
        className="h-11 w-full text-base shadow-glow"
      >
        Log in to apply
      </ButtonLink>
    ) : !isSeeker ? (
      <Button disabled className="h-11 w-full text-base">
        Employers can&apos;t apply
      </Button>
    ) : (
      <Button
        onClick={() => setApplyOpen(true)}
        className="h-11 w-full text-base shadow-glow"
      >
        <CheckCircle2 className="size-4" />
        Apply now
      </Button>
    );

  return (
    <Container className="py-8">
      <ButtonLink href="/jobs" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="size-4" />
        All jobs
      </ButtonLink>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 rounded-2xl border">
                <AvatarFallback className="rounded-2xl bg-brand/10 text-xl font-bold text-brand">
                  {initials(job.companyName ?? "Co")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold font-heading tracking-tight sm:text-3xl">
                  {job.title}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {job.companyName && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="size-4" />
                      {job.companyName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {timeAgo(job.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" />
                    {pluralize(job.applicationCount, "applicant")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {metaItems.map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium"
                >
                  <m.icon className="size-4 text-brand" />
                  {m.label}
                </span>
              ))}
            </div>
          </Card>

          <Section title="About the role">
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </Section>

          {job.responsibilities.length > 0 && (
            <Section title="Responsibilities">
              <BulletList items={job.responsibilities} />
            </Section>
          )}

          {job.requirements.length > 0 && (
            <Section title="Requirements">
              <BulletList items={job.requirements} />
            </Section>
          )}

          {job.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand/5 px-3 py-1 text-sm font-medium text-brand"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="space-y-5 p-6">
            {salary && (
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="text-xl font-bold">{salary}</p>
              </div>
            )}
            {applyAction}
            <div className="space-y-3 border-t pt-4 text-sm">
              <Row label="Job type" value={JOB_TYPE_LABELS[job.jobType]} />
              <Row label="Work mode" value={WORK_MODE_LABELS[job.workMode]} />
              <Row label="Experience" value={EXPERIENCE_LEVEL_LABELS[job.experienceLevel]} />
              {job.location && <Row label="Location" value={job.location} />}
              <Row label="Openings" value={String(job.openings)} />
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-brand/5 p-3 text-xs text-muted-foreground">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
              Apply to get an instant AI match score for this role.
            </div>
          </Card>
        </div>
      </div>

      {isSeeker && <ApplyDialog job={job} open={applyOpen} onOpenChange={setApplyOpen} />}
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6 sm:p-8">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-6 h-8 w-24" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex gap-4">
              <Skeleton className="size-16 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
          <Card className="space-y-3 p-8">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
        </div>
        <Card className="h-64 p-6">
          <Skeleton className="h-11 w-full" />
        </Card>
      </div>
    </Container>
  );
}
