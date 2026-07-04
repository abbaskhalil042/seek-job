import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const faqs = [
  {
    q: "Do I need an AI API key to use resume parsing?",
    a: "No. SeekJob ships with a deterministic fallback parser that works out of the box. Add a free LLM key (Gemini, Groq, or OpenRouter) any time for richer, more accurate parsing — no code changes required.",
  },
  {
    q: "How is the match score calculated?",
    a: "We compare the skills and experience extracted from your resume against a job's required skills, producing a 0–100 score plus the specific matched and missing skills so you know exactly where you stand.",
  },
  {
    q: "What file types can I upload?",
    a: "PDF, DOCX, and plain-text resumes up to 5 MB. You can store multiple resumes and choose which one is your primary for one-click applications.",
  },
  {
    q: "Is it free to get started?",
    a: "Yes. Create a seeker or employer account in seconds — no credit card required. Seekers can browse and apply, and employers can post roles and review applicants right away.",
  },
  {
    q: "Can employers manage a hiring pipeline?",
    a: "Absolutely. Move candidates through reviewing, shortlisted, interview, offered, hired, or rejected, and track views, applications, and average match per role from your dashboard.",
  },
];

export function Faq() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="Questions"
          title="Frequently asked questions"
        />
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border bg-card px-5 py-4 shadow-card transition-colors open:border-brand/30 [&_summary]:list-none"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="grid size-6 shrink-0 place-items-center rounded-full border text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
