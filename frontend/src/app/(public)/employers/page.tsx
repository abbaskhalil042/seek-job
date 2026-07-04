import type { Metadata } from "next";
import { ArrowRight, Gauge, Target, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = { title: "For Employers" };

const benefits = [
  {
    icon: Target,
    title: "Ranked candidates",
    description: "Applicants are auto-scored against your role so the best fits rise to the top.",
  },
  {
    icon: Gauge,
    title: "Hiring analytics",
    description: "Track applications, pipeline stages, and performance across all your jobs.",
  },
  {
    icon: Users,
    title: "Simple pipeline",
    description: "Move candidates from reviewing to offer with a clean, intuitive flow.",
  },
];

export default function EmployersPage() {
  return (
    <>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge variant="outline" className="h-7 rounded-md px-3">
                For employers
              </Badge>
              <h1 className="mt-5 max-w-3xl text-3xl font-semibold font-heading tracking-tight sm:text-4xl lg:text-5xl">
                Review qualified candidates without digging through every resume.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Post a role, receive structured applicant profiles, and use match
                scores to focus interviews on candidates with real fit.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/register"
                  className="h-11 gap-2 px-5"
                >
                  Post a job
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/jobs"
                  variant="outline"
                  className="h-11 px-5"
                >
                  View marketplace
                </ButtonLink>
              </div>
            </div>

            <Card className="shadow-elevated">
              <CardHeader className="border-b">
                <CardTitle>Applicant shortlist</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Senior Product Designer
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {["92% match", "86% match", "81% match"].map((match, index) => (
                  <div
                    key={match}
                    className="flex items-center justify-between rounded-lg border bg-background p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">Candidate profile</p>
                        <p className="text-xs text-muted-foreground">
                          Portfolio reviewed
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-md text-brand">
                      {match}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <SectionHeading
          align="center"
          eyebrow="Hiring workflow"
          title="Everything after the job post is easier to scan"
          description="Use structured profiles, pipeline status, and score context to decide what to review next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-elevated"
            >
              <div className="mb-4 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <b.icon className="size-6" />
              </div>
              <h3 className="text-base font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
      <CtaSection />
    </>
  );
}
