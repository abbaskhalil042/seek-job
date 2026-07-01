"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Briefcase,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, homeForRole } from "@/providers/auth-provider";
import { initials } from "@/lib/format";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const isSeeker = user.role === "job_seeker";
  const home = homeForRole(user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-9 border border-border ring-2 ring-transparent transition hover:ring-brand/30">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-brand/10 text-brand font-semibold">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(home)}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>
        {isSeeker ? (
          <>
            <DropdownMenuItem onClick={() => router.push("/seeker/applications")}>
              <Briefcase className="size-4" />
              My Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/seeker/resumes")}>
              <FileText className="size-4" />
              My Resumes
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/employer/jobs")}>
            <Briefcase className="size-4" />
            My Jobs
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push(`${home}/profile`)}>
          <UserIcon className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void logout()}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
