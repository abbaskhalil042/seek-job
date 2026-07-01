"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, homeForRole } from "@/providers/auth-provider";
import { PageLoader } from "@/components/shared/spinner";
import type { UserRole } from "@/types";

/**
 * Client-side guard for authenticated routes. Redirects unauthenticated users
 * to /login (preserving the intended destination) and users with the wrong
 * role to their own dashboard home.
 */
export function RouteGuard({
  roles,
  children,
}: {
  roles?: UserRole[];
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    } else if (status === "authenticated" && user && roles && !roles.includes(user.role)) {
      router.replace(homeForRole(user.role));
    }
  }, [status, user, roles, router, pathname]);

  if (status === "loading") return <PageLoader label="Authenticating…" />;
  if (status === "unauthenticated") return <PageLoader label="Redirecting…" />;
  if (user && roles && !roles.includes(user.role)) {
    return <PageLoader label="Redirecting…" />;
  }

  return <>{children}</>;
}
