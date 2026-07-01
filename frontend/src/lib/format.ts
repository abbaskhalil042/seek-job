import type { SalaryRange } from "@/types";

/** Format a salary range compactly, e.g. "$80k – $120k / yr". */
export function formatSalary(salary?: SalaryRange): string | null {
  if (!salary || (!salary.min && !salary.max)) return null;
  const period = { hour: "/hr", month: "/mo", year: "/yr" }[salary.period];
  const fmt = (n?: number) => {
    if (n == null) return "";
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: salary.currency || "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n);
    } catch {
      return String(n);
    }
  };
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} ${period}`;
  return `${fmt(salary.min ?? salary.max)} ${period}`;
}

/** Relative time like "3 days ago" using Intl.RelativeTimeFormat. */
export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (d.getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs || unit === "second") {
      return rtf.format(Math.round(diff / secs), unit);
    }
  }
  return "";
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Initials for avatars, e.g. "Abbas Khalil" → "AK". */
export function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Map a 0-100 match score to a semantic color token + label. */
export function matchScoreMeta(score?: number) {
  if (score == null) return { color: "text-muted-foreground", label: "—", track: "bg-muted" };
  if (score >= 80) return { color: "text-success", label: "Excellent", track: "bg-success" };
  if (score >= 60) return { color: "text-brand", label: "Strong", track: "bg-brand" };
  if (score >= 40) return { color: "text-highlight-foreground", label: "Fair", track: "bg-highlight" };
  return { color: "text-destructive", label: "Low", track: "bg-destructive" };
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
