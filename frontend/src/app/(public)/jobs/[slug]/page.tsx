"use client";

import { use } from "react";
import { JobDetail } from "@/components/jobs/job-detail";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <JobDetail slug={slug} />;
}
