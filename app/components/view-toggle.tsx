"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "../lib/cn";

export type ViewMode = "grid" | "list";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex h-7 items-center overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] text-[12px]">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 transition-colors",
          value === "grid"
            ? "bg-[var(--color-surface-300)] text-[var(--color-fg)]"
            : "text-[var(--color-fg-light)] hover:text-[var(--color-fg)]"
        )}
      >
        <LayoutGrid size={12} />
        Grid
      </button>
      <span className="h-full w-px bg-[var(--color-border)]" />
      <button
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 transition-colors",
          value === "list"
            ? "bg-[var(--color-surface-300)] text-[var(--color-fg)]"
            : "text-[var(--color-fg-light)] hover:text-[var(--color-fg)]"
        )}
      >
        <List size={12} />
        List
      </button>
    </div>
  );
}
