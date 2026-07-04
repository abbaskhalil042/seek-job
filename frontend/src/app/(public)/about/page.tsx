import type { Metadata } from "next";
import { BrainCircuit, Scale, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = { title: "About" };

const principles = [
  {
    icon: BrainCircuit,
    title: "Understand the work",
    description:
      "SeekJob compares role requirements with structured resume data — the substance of skills and experience, not just isolated keywords.",
  },
  {
    icon: Scale,
    title: "Make fit visible",
    description:
      "Match scores, matched and missing skills, and clear status cues are designed to make trade-offs easy to scan at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Keep control clear",
    description:
      "Applicants choose what to upload and teams keep hiring decisions inside their own workflow, backed by secure, validated APIs.",
  },
];

const stats = [
  { value: "0–100", label: "Match score on every application" },
  { value: "3", label: "Free LLM providers supported" },
  { value: "100%", label: "Works with no API key" },
  { value: "<1s", label: "Structured profile from a resume" },
];

export default function AboutPage() {
  return (
    <>
      <Container className="py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="Our mission"
          title="Hiring, reimagined with AI"
          description="SeekJob connects job seekers and employers through intelligent resume parsing and match scoring — making the hiring loop faster and fairer for everyone."
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <p className="text-sm leading-6 text-muted-foreground">
              We believe the right opportunity shouldn&apos;t be buried under
              keyword filters. By understanding the substance of a resume and a
              role, SeekJob surfaces genuine fit — not just matching strings.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <p className="text-sm leading-6 text-muted-foreground">
              The platform is built on a modern, secure stack and is powered by
              free, provider-agnostic LLMs with a deterministic fallback, so it
              always works — with or without an API key.
            </p>
          </div>
        </div>

        {/* Stats band */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 rounded-3xl border bg-muted/30 p-6 sm:p-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold font-heading tracking-tight text-brand">
                {s.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="group rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-elevated"
            >
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <principle.icon className="size-6" />
              </div>
              <h3 className="text-base font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
      <CtaSection />
    </>
  );
}
