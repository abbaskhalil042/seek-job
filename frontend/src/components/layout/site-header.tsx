"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "./user-menu";
import { useAuth, homeForRole } from "@/providers/auth-provider";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { user, status } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2">
              <ButtonLink
                href={homeForRole(user.role)}
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Dashboard
              </ButtonLink>
              <UserMenu />
            </div>
          ) : status === "unauthenticated" ? (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/register" size="sm" className="h-9 px-4 shadow-glow">
                Get started
              </ButtonLink>
            </div>
          ) : (
            <div className="size-9" />
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                {status === "unauthenticated" && (
                  <div className="flex flex-col gap-2">
                    <ButtonLink href="/login" variant="outline" className="h-10">
                      Log in
                    </ButtonLink>
                    <ButtonLink href="/register" className="h-10">
                      Get started
                    </ButtonLink>
                  </div>
                )}
                {status === "authenticated" && user && (
                  <ButtonLink href={homeForRole(user.role)} className="h-10">
                    Go to dashboard
                  </ButtonLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
