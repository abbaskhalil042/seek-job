import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { JobsBrowser } from "@/components/jobs/jobs-browser";
import { PageLoader } from "@/components/shared/spinner";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Discover roles matched to your skills.",
};

export default function JobsPage() {
  return (
    <div className="pb-16">
      <div className="border-b bg-muted/30 py-10">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Live job search
            </span>
            <h1 className="mt-4 text-3xl font-semibold font-heading tracking-tight sm:text-4xl">
              Find your next role
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Search openings by title, skill, location, or work mode, then
              compare roles with salary, tags, and fit signals in one clean list.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="pt-8">
          <Suspense fallback={<PageLoader />}>
            <JobsBrowser />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
