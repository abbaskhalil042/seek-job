/** Global, static site configuration — names, nav, metadata. */

export const siteConfig = {
  name: "SeekJob",
  tagline: "Where talent meets opportunity",
  description:
    "A modern job platform with AI-powered resume parsing and analytics. Find your next role or your next hire — faster.",
  url: "http://localhost:3000",
} as const;

/** Public top-nav links. */
export const mainNav = [
  { title: "Find Jobs", href: "/jobs" },
  { title: "For Employers", href: "/employers" },
  { title: "About", href: "/about" },
] as const;

/** Where each role lands after authentication. */
export const roleHome: Record<string, string> = {
  job_seeker: "/seeker",
  employer: "/employer",
  admin: "/employer",
};
