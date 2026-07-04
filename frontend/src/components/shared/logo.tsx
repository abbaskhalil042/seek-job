import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({
  className,
  href = "/",
  showWordmark = true,
  asLink = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  /** When false, renders a plain <span> instead of a <Link> — use inside another link. */
  asLink?: boolean;
}) {
  const content = (
    <>
      <span className="relative grid size-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path
            d="M11 4a7 7 0 1 0 4.2 12.6l3.6 3.6a1 1 0 0 0 1.4-1.4l-3.6-3.6A7 7 0 0 0 11 4Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-lg font-heading font-bold tracking-tight">
          {siteConfig.name}
        </span>
      )}
    </>
  );

  const classes = cn("flex items-center gap-2.5 group", className);

  if (!asLink) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
