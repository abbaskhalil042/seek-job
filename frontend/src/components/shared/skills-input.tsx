"use client";

import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A lightweight tag input for skills / keywords. Add with Enter or comma,
 * remove with Backspace on an empty field or the × button. Fully controlled.
 */
export function SkillsInput({
  value,
  onChange,
  placeholder = "Type a skill and press Enter",
  className,
  max = 30,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const skill = raw.trim().replace(/,$/, "").trim();
    if (!skill) return;
    const exists = value.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (exists || value.length >= max) {
      setDraft("");
      return;
    }
    onChange([...value, skill]);
    setDraft("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value.length - 1);
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent p-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        className,
      )}
    >
      {value.map((skill, i) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 rounded-md bg-brand/10 py-0.5 pl-2.5 pr-1 text-sm font-medium text-brand"
        >
          {skill}
          <button
            type="button"
            onClick={() => remove(i)}
            className="grid size-4 place-items-center rounded-sm text-brand/70 transition-colors hover:bg-brand/20 hover:text-brand"
            aria-label={`Remove ${skill}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <div className="flex min-w-[8rem] flex-1 items-center gap-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={value.length ? "" : placeholder}
          className="h-8 flex-1 border-0 bg-transparent px-1.5 shadow-none focus-visible:ring-0"
        />
        {draft.trim() && (
          <button
            type="button"
            onClick={() => add(draft)}
            className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Add skill"
          >
            <Plus className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
