import { Check, User, Building2, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

const seekerPoints = [
  "Upload once — AI builds a structured profile from your resume",
  "See a match score before you apply, not after",
  "Track every application through a clear status timeline",
  "Manage multiple resumes and set a primary in a click",
];

const employerPoints = [
  "Post roles with required skills used for automatic matching",
  "Review applicants ranked by match score, matched & missing skills",
  "Move candidates through a full hiring pipeline",
  "Track views, applications, and average fit per job",
];

function Panel({
  variant,
  icon: Icon,
  eyebrow,
  title,
  points,
  cta,
  href,
}: {
  variant: "seeker" | "employer";
  icon: typeof User;
  eyebrow: string;
  title: string;
  points: string[];
  cta: string;
  href: string;
}) {
  const isEmployer = variant === "employer";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-8 shadow-card sm:p-10",
        isEmployer ? "bg-card" : "bg-brand-gradient text-white",
      )}
    >
      {!isEmployer && (
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
      )}
      <div className="relative">
        <div
          className={cn(
            "mb-5 inline-flex size-12 items-center justify-center rounded-xl",
            isEmployer ? "bg-brand/10 text-brand" : "bg-white/15 text-white",
          )}
        >
          <Icon className="size-6" />
        </div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isEmployer ? "text-brand" : "text-white/70",
          )}
        >
          {eyebrow}
        </p>
        <h3 className="mt-1 text-2xl font-bold font-heading tracking-tight">
          {title}
        </h3>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm leading-6">
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                  isEmployer ? "bg-success/15 text-success" : "bg-white/20 text-white",
                )}
              >
                <Check className="size-3" />
              </span>
              <span className={isEmployer ? "text-muted-foreground" : "text-white/90"}>
                {p}
              </span>
            </li>
          ))}
        </ul>
        <ButtonLink
          href={href}
          variant={isEmployer ? "default" : "secondary"}
          className="mt-8 gap-2"
        >
          {cta}
          <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

export function AudienceSplit() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            variant="seeker"
            icon={User}
            eyebrow="For job seekers"
            title="Land roles that fit you"
            points={seekerPoints}
            cta="Find your next role"
            href="/register"
          />
          <Panel
            variant="employer"
            icon={Building2}
            eyebrow="For employers"
            title="Hire the right people, faster"
            points={employerPoints}
            cta="Start hiring"
            href="/employers"
          />
        </div>
      </Container>
    </section>
  );
}
