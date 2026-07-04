import { UserPlus, FileUp, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Sign up as a job seeker or employer in seconds. Pick your role and you're straight in — no credit card, no setup wizard.",
  },
  {
    step: "02",
    icon: FileUp,
    title: "Upload or post",
    description:
      "Seekers upload a resume and AI parses it automatically. Employers post roles with rich detail and required skills.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Get matched",
    description:
      "Apply with one click and see your match score, or review ranked applicants on your dashboard in real time.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/30 py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Three steps to your next move"
          description="Build a profile, let the platform read the fit, and act on the roles or candidates worth your time."
        />
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s) => (
            <div key={s.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 grid size-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                <s.icon className="size-6" />
                <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border-2 border-background bg-card text-[11px] font-bold text-brand">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
