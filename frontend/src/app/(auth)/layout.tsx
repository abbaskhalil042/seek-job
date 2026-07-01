import Link from "next/link";
import { Quote } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <Logo className="text-white [&_span]:text-white" />
        </div>
        <div className="relative max-w-md space-y-6">
          <Quote className="size-10 text-white/40" />
          <p className="text-2xl font-medium leading-relaxed font-heading">
            “I uploaded my resume and within minutes I was matched to roles that
            actually fit. Landed interviews the same week.”
          </p>
          <div>
            <p className="font-semibold">Abbas Khalil</p>
            <p className="text-sm text-white/70">Full-Stack Engineer</p>
          </div>
        </div>
        <div className="relative flex items-center gap-6 text-sm text-white/70">
          <span>12k+ roles</span>
          <span className="size-1 rounded-full bg-white/40" />
          <span>AI matching</span>
          <span className="size-1 rounded-full bg-white/40" />
          <span>Free to start</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="lg:invisible">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
