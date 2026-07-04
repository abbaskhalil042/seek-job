"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["employer", "admin"]}>
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
}
