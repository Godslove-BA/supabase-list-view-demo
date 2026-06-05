"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface SurfaceProps {
  /** e.g. "Storage · Empty bucket (Files)" */
  title: string;
  /** Where in Studio this surface lives, e.g. "Storage → New bucket" */
  location?: string;
  /** Path the file lives at inside the supabase/supabase fork, for the link */
  sourcePath?: string;
  /** Sub-toggle row above the Before/After toggle (e.g. bucket type) */
  variantToggle?: ReactNode;
  /** What Studio currently looks like (no snippet). */
  before: ReactNode;
  /** What the PR proposes (same surface + QuickStartSnippet). */
  after: ReactNode;
}

const SOURCE_REPO =
  "https://github.com/Godslove-BA/supabase/tree/feat/studio-empty-states-teach-first";

export function Surface({
  title,
  location,
  sourcePath,
  variantToggle,
  before,
  after,
}: SurfaceProps) {
  const [mode, setMode] = useState<"before" | "after">("after");

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-100)] overflow-hidden">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-200)] px-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <h2 className="truncate text-[13px] font-medium text-[var(--color-fg)]">
            {title}
          </h2>
          {location ? (
            <span className="hidden text-[11px] text-[var(--color-fg-lighter)] sm:inline">
              {location}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {sourcePath ? (
            <a
              href={`${SOURCE_REPO}/${sourcePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[11px] text-[var(--color-fg-lighter)] hover:text-[var(--color-fg)] hover:underline md:inline"
            >
              source ↗
            </a>
          ) : null}
          <ToggleControl mode={mode} onChange={setMode} />
        </div>
      </header>

      {/* Variant toggle row (optional, e.g. bucket type sub-toggle) */}
      {variantToggle ? (
        <div className="flex h-9 items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4">
          {variantToggle}
        </div>
      ) : null}

      {/* Stage — Studio-like surface that the empty state would actually
          render into. Subtle inner border so the empty state's own
          dashed/card container has something to sit against. */}
      <div className="bg-[var(--color-bg)] p-6 sm:p-10 min-h-[420px] flex items-center justify-center">
        {mode === "before" ? before : after}
      </div>

      {/* Footer caption */}
      <footer className="flex h-7 items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-100)] px-4 text-[10px] uppercase tracking-wide text-[var(--color-fg-lighter)]">
        <span>
          showing:{" "}
          <span className="text-[var(--color-fg-light)]">
            {mode === "before" ? "current Studio" : "PR #46664"}
          </span>
        </span>
        <span className="hidden sm:inline">
          {mode === "before"
            ? "the empty state with no quick-start snippet"
            : "+ QuickStartSnippet beneath the primary CTA"}
        </span>
      </footer>
    </section>
  );
}

function ToggleControl({
  mode,
  onChange,
}: {
  mode: "before" | "after";
  onChange: (m: "before" | "after") => void;
}) {
  return (
    <div className="inline-flex h-7 items-center overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] text-[12px]">
      <button
        onClick={() => onChange("before")}
        aria-pressed={mode === "before"}
        className={cn(
          "px-3 transition-colors",
          mode === "before"
            ? "bg-[var(--color-surface-300)] text-[var(--color-fg)]"
            : "text-[var(--color-fg-light)] hover:text-[var(--color-fg)]"
        )}
      >
        Before
      </button>
      <span className="h-full w-px bg-[var(--color-border)]" />
      <button
        onClick={() => onChange("after")}
        aria-pressed={mode === "after"}
        className={cn(
          "flex items-center gap-1.5 px-3 transition-colors",
          mode === "after"
            ? "bg-[var(--color-brand-bg)] text-[var(--color-brand)]"
            : "text-[var(--color-fg-light)] hover:text-[var(--color-fg)]"
        )}
      >
        After
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            mode === "after"
              ? "bg-[var(--color-brand)]"
              : "bg-[var(--color-fg-muted)]"
          )}
          aria-hidden
        />
      </button>
    </div>
  );
}
