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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "AI resume parsing",
    description:
      "Upload a PDF or DOCX and we instantly extract skills, experience, and education into a structured profile.",
  },
  {
    icon: Target,
    title: "Smart match scoring",
    description:
      "Every application gets a 0–100 match score so candidates and employers see fit at a glance.",
  },
  {
    icon: Gauge,
    title: "Real-time analytics",
    description:
      "Dashboards track applications, pipeline stages, and performance — for both seekers and employers.",
  },
  {
    icon: Users,
    title: "Applicant pipeline",
    description:
      "Move candidates through reviewing, shortlist, interview, and offer with a clean status pipeline.",
  },
  {
    icon: Sparkles,
    title: "Powered by free LLMs",
    description:
      "Provider-agnostic AI (Gemini, Groq, OpenRouter) with a built-in fallback that always works.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "JWT auth with refresh rotation, role-based access, and validated inputs across the stack.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Everything you need"
          title="A platform built for modern hiring"
          description="From resume parsing to ranked shortlists, every screen is built to help job seekers and teams make faster decisions."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="transition-colors hover:border-brand/30"
            >
              <CardHeader>
                <div className="mb-2 grid size-10 place-items-center rounded-md bg-muted text-brand">
                  <f.icon className="size-5" />
                </div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
