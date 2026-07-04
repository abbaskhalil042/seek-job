import {
  FileSearch,
  Gauge,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const features = [
  {
    icon: FileSearch,
    title: "AI resume parsing",
    description:
      "Upload a PDF, DOCX, or TXT and we instantly extract skills, experience, and education into a structured, searchable profile.",
  },
  {
    icon: Target,
    title: "Smart match scoring",
    description:
      "Every application gets a 0–100 match score with matched and missing skills, so fit is obvious at a glance.",
  },
  {
    icon: Gauge,
    title: "Real-time analytics",
    description:
      "Dashboards track applications, pipeline stages, views, and average match — for both seekers and employers.",
  },
  {
    icon: Users,
    title: "Applicant pipeline",
    description:
      "Move candidates through reviewing, shortlist, interview, offer, and hired with a clean, one-click status pipeline.",
  },
  {
    icon: Sparkles,
    title: "Powered by free LLMs",
    description:
      "Provider-agnostic AI (Gemini, Groq, OpenRouter) with a deterministic fallback parser that always works — no key required.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "JWT auth with refresh-token rotation, role-based access control, and validated inputs across the entire stack.",
  },
];

export function FeatureGrid() {
  return (
    <section className="relative bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Everything you need"
          title="A platform built for modern hiring"
          description="From resume parsing to ranked shortlists, every screen is designed to help job seekers and teams make faster, better decisions."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-elevated"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-brand/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <f.icon className="size-6" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
