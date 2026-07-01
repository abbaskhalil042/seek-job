"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { useUploadResume } from "@/lib/hooks/use-resumes";
import { normalizeError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.doc,.docx,.txt";
const MAX_MB = 5;

export function ResumeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const upload = useUploadResume();

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File is too large (max ${MAX_MB}MB).`);
      return;
    }
    try {
      await upload.mutateAsync({ file, makePrimary: true });
      toast.success("Resume uploaded & parsed!");
    } catch (err) {
      toast.error(normalizeError(err).message || "Upload failed");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        dragging
          ? "border-brand bg-brand/5"
          : "border-border hover:border-brand/50 hover:bg-muted/30",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
        {upload.isPending ? (
          <Loader2 className="size-7 animate-spin" />
        ) : (
          <UploadCloud className="size-7" />
        )}
      </div>
      <p className="font-semibold">
        {upload.isPending ? "Parsing your resume…" : "Upload your resume"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag & drop or click to browse · PDF, DOCX, TXT · max {MAX_MB}MB
      </p>
    </div>
  );
}
