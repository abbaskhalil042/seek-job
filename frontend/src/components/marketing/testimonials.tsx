import { Star } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/format";

const testimonials = [
  {
    quote:
      "I uploaded my resume and within minutes I was matched to roles that actually fit. Landed three interviews the same week.",
    name: "Ava Thompson",
    role: "Frontend Engineer",
  },
  {
    quote:
      "The match scores changed how we screen. We spend our time on the strongest candidates instead of digging through PDFs.",
    name: "Marcus Lee",
    role: "Head of Talent, Northstar",
  },
  {
    quote:
      "Posting a role and watching ranked applicants roll in — with matched and missing skills — is a genuine time-saver.",
    name: "Priya Nair",
    role: "Founder, BrightLayer",
  },
];

export function Testimonials() {
  return (
    <section className="border-y bg-muted/30 py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Loved by both sides"
          title="Trusted by seekers and hiring teams"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-card"
            >
              <div className="flex gap-0.5 text-highlight">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-6 text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-brand/10 text-xs font-semibold text-brand">
                    {initials(t.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
