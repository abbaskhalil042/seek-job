import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/shared/container";

export function CtaSection() {
  return (
    <section className="pb-24 pt-4">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center text-white shadow-elevated sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />
          <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Get started free
            </span>
            <h2 className="mt-5 text-3xl font-bold font-heading tracking-tight sm:text-4xl">
              Ready to make every application more informed?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85 sm:text-lg">
              Create a profile, browse ranked opportunities, or start reviewing
              candidates with match scores already attached.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/register"
                variant="secondary"
                className="h-11 gap-2 px-6 text-base"
              >
                Create your account
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/jobs"
                variant="outline"
                className="h-11 border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10"
              >
                Explore jobs
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
