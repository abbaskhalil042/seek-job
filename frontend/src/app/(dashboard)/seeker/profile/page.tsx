"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/spinner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkillsInput } from "@/components/shared/skills-input";
import { useUpdateProfile } from "@/lib/hooks/use-analytics";
import { useAuth } from "@/providers/auth-provider";
import { normalizeError } from "@/lib/api/client";
import { initials } from "@/lib/format";
import type { User } from "@/types";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function SeekerProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Profile"
        description="Keep your details current — employers see this alongside your applications."
      />
      {!user ? <PageLoader label="Loading profile…" /> : <ProfileForm user={user} />}
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const update = useUpdateProfile();
  const p = user.seekerProfile;

  const [name, setName] = useState(user.name ?? "");
  const [headline, setHeadline] = useState(p?.headline ?? "");
  const [bio, setBio] = useState(p?.bio ?? "");
  const [location, setLocation] = useState(p?.location ?? "");
  const [phone, setPhone] = useState(p?.phone ?? "");
  const [experienceYears, setExperienceYears] = useState(
    p?.experienceYears != null ? String(p.experienceYears) : "",
  );
  const [skills, setSkills] = useState<string[]>(p?.skills ?? []);
  const [links, setLinks] = useState<string[]>(p?.links ?? []);

  async function handleSave() {
    try {
      await update.mutateAsync({
        name: name.trim() || undefined,
        seekerProfile: {
          headline: headline.trim(),
          bio: bio.trim(),
          location: location.trim(),
          phone: phone.trim(),
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          skills,
          links,
        },
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-brand/10 text-lg font-semibold text-brand">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </Card>

      <Card className="mt-8 space-y-5 p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <UserIcon className="size-4 text-brand" />
          Personal details
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </Field>
          <Field label="Headline" hint="e.g. Senior Frontend Engineer">
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="What you do in one line"
              className="h-11"
            />
          </Field>
          <Field label="Location">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Berlin, Remote"
              className="h-11"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="h-11"
            />
          </Field>
          <Field label="Years of experience">
            <Input
              type="number"
              min={0}
              max={60}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="e.g. 5"
              className="h-11"
            />
          </Field>
        </div>

        <Field label="Bio">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short summary of your background and what you're looking for…"
            rows={4}
          />
        </Field>

        <Field label="Skills" hint="Press Enter or comma to add. These boost your match scores.">
          <SkillsInput value={skills} onChange={setSkills} placeholder="e.g. React, TypeScript, Node.js" />
        </Field>

        <Field label="Links" hint="Portfolio, GitHub, LinkedIn — add each and press Enter.">
          <SkillsInput value={links} onChange={setLinks} placeholder="https://…" max={8} />
        </Field>

        <div className="flex justify-end border-t pt-5">
          <Button onClick={handleSave} disabled={update.isPending} className="shadow-glow">
            {update.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
          </Button>
        </div>
      </Card>
    </>
  );
}
