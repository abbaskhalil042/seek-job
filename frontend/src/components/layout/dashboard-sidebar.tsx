"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { navForRole, type NavItem } from "@/config/dashboard-nav";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        // Exact match for index routes, prefix match for nested.
        const active =
          item.href === pathname ||
          (item.href !== "/seeker" &&
            item.href !== "/employer" &&
            pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-[1.15rem] transition-colors",
                active ? "text-brand" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  if (!user) return null;
  const items = navForRole(user.role);

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-2">
        <Logo />
      </div>
      <NavLinks items={items} onNavigate={onNavigate} />
      <div className="mt-auto rounded-2xl border bg-brand/5 p-4">
        <p className="text-sm font-semibold">Need help?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check our guide on getting matched faster.
        </p>
      </div>
    </div>
  );
}
