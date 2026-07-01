import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Sign up as a job seeker or employer in seconds. Pick your role and you're in.",
  },
  {
    step: "02",
    title: "Upload or post",
    description:
      "Seekers upload a resume — AI parses it automatically. Employers post roles with rich detail.",
  },
  {
    step: "03",
    title: "Get matched",
    description:
      "Apply with one click and see your match score, or review ranked applicants on your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/30 py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Three steps to your next move"
          description="Keep the workflow simple: build a profile, let the platform read the fit, and act on the roles or candidates worth your time."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.step}>
              <CardHeader>
                <span className="mb-2 grid size-9 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                  {s.step}
                </span>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
