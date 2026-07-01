"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth, homeForRole } from "@/providers/auth-provider";
import { normalizeError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const schema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    role: z.enum(["job_seeker", "employer"]),
    companyName: z.string().optional(),
  })
  .refine((d) => d.role !== "employer" || (d.companyName?.trim().length ?? 0) > 0, {
    message: "Company name is required for employers",
    path: ["companyName"],
  });

type FormValues = z.infer<typeof schema>;

const roleOptions: {
  value: Extract<UserRole, "job_seeker" | "employer">;
  title: string;
  desc: string;
  icon: typeof User;
}[] = [
  { value: "job_seeker", title: "Job Seeker", desc: "Find your next role", icon: User },
  { value: "employer", title: "Employer", desc: "Hire great talent", icon: Briefcase },
];

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "job_seeker",
      companyName: "",
    },
  });

  const role = form.watch("role");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        companyName: values.role === "employer" ? values.companyName : undefined,
      });
      toast.success("Account created — welcome aboard!");
      router.push(homeForRole(user.role));
    } catch (err) {
      const { message } = normalizeError(err);
      toast.error(message || "Registration failed");
      if (message?.toLowerCase().includes("email")) {
        form.setError("email", { message });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Start in seconds. No credit card required.
        </p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3">
        {roleOptions.map((opt) => {
          const active = role === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => form.setValue("role", opt.value)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all",
                active
                  ? "border-brand bg-brand/5 shadow-soft"
                  : "border-border hover:border-brand/40",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-lg",
                  active ? "bg-brand text-white" : "bg-muted text-muted-foreground",
                )}
              >
                <opt.icon className="size-4.5" />
              </span>
              <span className="text-sm font-semibold">{opt.title}</span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {role === "employer" && (
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full text-base shadow-glow"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
