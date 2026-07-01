"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, FileText, Search, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/shared/container";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

const stats = [
  { value: "12k+", label: "Open roles" },
  { value: "4k+", label: "Companies" },
  { value: "98%", label: "Match accuracy" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-aurora blur-3xl" />
      </div>

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="max-w-3xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
              className="mb-5"
          >
              <Badge variant="outline" className="h-7 gap-1.5 rounded-md px-3 text-brand">
                <Sparkles className="size-3.5" />
                AI-powered job matching
              </Badge>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
              className="text-balance text-4xl font-semibold font-heading leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
              Find roles that actually match your resume.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
              className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
          >
              Upload a resume, browse clean job cards, and apply with a clear
              match score before your application enters the pipeline.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink
              href="/register"
                className="h-11 gap-2 px-5 shadow-glow"
            >
                Get started
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/jobs"
              variant="outline"
                className="h-11 gap-2 px-5"
            >
              <Search className="size-4" />
              Browse jobs
            </ButtonLink>
          </motion.div>

          <motion.dl
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
              className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                  className="rounded-lg border bg-card p-4 shadow-card"
              >
                  <dt className="text-2xl font-semibold font-heading">
                  {s.value}
                </dt>
                  <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
          </div>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:justify-self-end"
          >
            <Card className="w-full max-w-[440px] shadow-elevated">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recommended roles</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on your resume profile
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-md">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {[
                  ["Product Designer", "Northstar Labs", "94%"],
                  ["UX Researcher", "BrightLayer", "88%"],
                  ["Frontend Engineer", "SignalWorks", "82%"],
                ].map(([role, company, score]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-lg border bg-background p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                        <Building2 className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{role}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {company}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-md text-brand">
                      {score}
                    </Badge>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <FileText className="mb-2 size-4 text-brand" />
                    <p className="text-sm font-medium">Resume parsed</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Skills and experience extracted
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <CheckCircle2 className="mb-2 size-4 text-brand" />
                    <p className="text-sm font-medium">Ready to apply</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      One click with saved profile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
