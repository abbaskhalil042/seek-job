import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Search,
  User,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const seekerNav: NavItem[] = [
  { title: "Overview", href: "/seeker", icon: LayoutDashboard },
  { title: "Browse Jobs", href: "/jobs", icon: Search },
  { title: "My Applications", href: "/seeker/applications", icon: Briefcase },
  { title: "My Resumes", href: "/seeker/resumes", icon: FileText },
  { title: "Profile", href: "/seeker/profile", icon: User },
];

export const employerNav: NavItem[] = [
  { title: "Overview", href: "/employer", icon: LayoutDashboard },
  { title: "My Jobs", href: "/employer/jobs", icon: Briefcase },
  { title: "Post a Job", href: "/employer/jobs/new", icon: PlusCircle },
  { title: "Profile", href: "/employer/profile", icon: User },
];

export function navForRole(role: UserRole): NavItem[] {
  return role === "employer" || role === "admin" ? employerNav : seekerNav;
}
