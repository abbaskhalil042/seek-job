import type { Metadata } from "next";
import { BrainCircuit, Scale, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "About" };

const principles = [
  {
    icon: BrainCircuit,
    title: "Understand the work",
    description:
      "SeekJob compares role requirements with structured resume data, not only isolated keywords.",
  },
  {
    icon: Scale,
    title: "Make fit visible",
    description:
      "Scores, skills, and status cues are designed to make tradeoffs easier to scan.",
  },
  {
    icon: ShieldCheck,
    title: "Keep control clear",
    description:
      "Applicants choose what to upload and teams keep hiring decisions inside their workflow.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <SectionHeading
          align="center"
          eyebrow="Our mission"
          title="Hiring, reimagined with AI"
          description="SeekJob connects job seekers and employers through intelligent resume parsing and match scoring — making the hiring loop faster and fairer for everyone."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-6 text-muted-foreground">
            We believe the right opportunity shouldn&apos;t be buried under
            keyword filters. By understanding the substance of a resume and a
            role, SeekJob surfaces genuine fit — not just matching strings.
          </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-6 text-muted-foreground">
            The platform is built on a modern, secure stack and is powered by
            free, provider-agnostic LLMs with a deterministic fallback, so it
            always works.
          </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title}>
              <CardHeader>
                <div className="mb-2 grid size-10 place-items-center rounded-md bg-muted text-brand">
                  <principle.icon className="size-5" />
                </div>
                <CardTitle>{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
      <CtaSection />
    </>
  );
}
