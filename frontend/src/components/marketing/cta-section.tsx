import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Card className="shadow-card">
          <CardContent className="px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold font-heading tracking-tight sm:text-3xl">
              Ready to make every application more informed?
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Create a profile, browse ranked opportunities, or start reviewing
              candidates with match scores already attached.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/register"
                className="h-11 gap-2 px-5"
              >
                Get started free
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/jobs"
                variant="outline"
                className="h-11 px-5"
              >
                Explore jobs
              </ButtonLink>
            </div>
          </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
