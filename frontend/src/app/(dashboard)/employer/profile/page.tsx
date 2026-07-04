"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/spinner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUpdateProfile } from "@/lib/hooks/use-analytics";
import { useAuth } from "@/providers/auth-provider";
import { normalizeError } from "@/lib/api/client";
import { initials } from "@/lib/format";
import type { User } from "@/types";

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];

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

export default function EmployerProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Company Profile"
        description="This information appears on your job listings and to candidates."
      />
      {!user ? <PageLoader label="Loading profile…" /> : <CompanyForm user={user} />}
    </div>
  );
}

function CompanyForm({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const update = useUpdateProfile();
  const p = user.employerProfile;

  const [name, setName] = useState(user.name ?? "");
  const [companyName, setCompanyName] = useState(p?.companyName ?? "");
  const [companyWebsite, setCompanyWebsite] = useState(p?.companyWebsite ?? "");
  const [industry, setIndustry] = useState(p?.industry ?? "");
  const [companySize, setCompanySize] = useState(p?.companySize ?? "");
  const [location, setLocation] = useState(p?.location ?? "");
  const [about, setAbout] = useState(p?.about ?? "");

  async function handleSave() {
    try {
      await update.mutateAsync({
        name: name.trim() || undefined,
        employerProfile: {
          companyName: companyName.trim(),
          companyWebsite: companyWebsite.trim(),
          industry: industry.trim(),
          companySize: companySize.trim(),
          location: location.trim(),
          about: about.trim(),
        },
      });
      await refreshUser();
      toast.success("Company profile updated");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 rounded-xl">
            <AvatarFallback className="rounded-xl bg-brand/10 text-lg font-semibold text-brand">
              {initials(companyName || user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{companyName || user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </Card>

      <Card className="mt-8 space-y-5 p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <Building2 className="size-4 text-brand" />
          Company details
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </Field>
          <Field label="Company name">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              className="h-11"
            />
          </Field>
          <Field label="Website">
            <Input
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://acme.com"
              className="h-11"
            />
          </Field>
          <Field label="Industry">
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Software, Fintech"
              className="h-11"
            />
          </Field>
          <Field label="Company size">
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Select size</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="h-11"
            />
          </Field>
        </div>

        <Field label="About the company">
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            placeholder="Tell candidates about your mission, culture, and what makes you a great place to work…"
          />
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
