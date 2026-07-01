"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["job_seeker", "admin"]}>
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
}
