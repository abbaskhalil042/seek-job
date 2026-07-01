import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-muted-foreground", className)} />;
}

/** Full-area centered loader for page/section suspense states. */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3">
      <Spinner className="size-7 text-brand" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
