import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PoliciesSurface } from "./components/policies-surface";
import { RealtimeSurface } from "./components/realtime-surface";
import { StorageSurface } from "./components/storage-surface";

export const metadata: Metadata = {
  title: "Teach-first empty states · Supabase Studio · PR #46664",
  description:
    "A clickable Before / After prototype for the three teach-first Studio empty states proposed in supabase/supabase PR #46664.",
};

const PR_URL = "https://github.com/supabase/supabase/pull/46664";
const SOURCE_BRANCH_URL =
  "https://github.com/Godslove-BA/supabase/tree/feat/studio-empty-states-teach-first";

export default function EmptyStatesPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Top bar — matches the list-view demo's chrome */}
      <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-sidebar)] px-4 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="block h-4 w-4 rounded-sm shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand) 0%, hsl(153.1 60.2% 30%) 100%)",
            }}
            aria-hidden
          />
          <span className="text-[13px] font-medium tracking-tight">
            Studio empty-states proposal
          </span>
          <span className="hidden truncate text-[11px] text-[var(--color-fg-lighter)] sm:inline">
            A clickable Before / After prototype for supabase/supabase PR #46664
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] px-2.5 text-[12px] text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-200)] transition-colors"
        >
          <ArrowLeft size={12} />
          List-view demo
        </Link>
      </header>

      {/* Page intro */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-fg-lighter)] mb-3">
            Design proposal ·{" "}
            <a
              href={PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand)] hover:underline normal-case"
            >
              supabase/supabase PR #46664
            </a>
          </p>
          <h1 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-[var(--color-fg)] mb-2">
            Teach-first empty states for Studio
          </h1>
          <p className="text-[14px] text-[var(--color-fg-light)] max-w-2xl leading-relaxed">
            Three empty-state surfaces — Storage, Auth Policies, and Realtime —
            get a tiny paste-ready code snippet beneath their existing copy and
            CTA. The empty state stops being a dead-end and becomes the first
            paragraph of the docs. Toggle{" "}
            <span className="text-[var(--color-fg)]">Before ↔ After</span> per
            surface to see what changes.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px]">
            <a
              href={PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-200)] px-2.5 text-[var(--color-fg)] hover:bg-[var(--color-surface-300)] transition-colors"
            >
              View the PR ↗
            </a>
            <a
              href={SOURCE_BRANCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] px-2.5 text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-200)] transition-colors"
            >
              Source branch ↗
            </a>
            <Link
              href="/"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] px-2.5 text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-200)] transition-colors"
            >
              ← Back to list-view demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stack of surfaces */}
      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl flex flex-col gap-8 sm:gap-12">
          <StorageSurface />
          <PoliciesSurface />
          <RealtimeSurface />
        </div>
      </section>

      {/* Why-it-matters note + footer */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-100)] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[15px] font-medium text-[var(--color-fg)] mb-3">
            Why this matters
          </h2>
          <div className="text-[13px] text-[var(--color-fg-light)] leading-relaxed flex flex-col gap-3">
            <p>
              Today, every Studio empty state ends with a button. The user has
              to either click into a flow that creates the resource inside
              Studio, or context-switch out to the docs to learn how to call it
              from their app. Both are valid, but the path that most users
              eventually take — &ldquo;wire this into my code&rdquo; — has no
              affordance in the empty state itself.
            </p>
            <p>
              A 10-line paste-ready snippet, beneath the existing CTA, costs
              nothing if you ignore it and turns the empty state into the first
              paragraph of the docs if you don&rsquo;t. A first-time visitor
              can copy it, swap one identifier, and watch a file land in their
              bucket / a policy show up on their table / a realtime message
              stream in — the moment the feature actually clicks rather than
              just being described.
            </p>
            <p>
              The PR adds a single new primitive (
              <code className="font-mono text-[12px] bg-[var(--color-surface-200)] px-1.5 py-0.5 rounded">
                QuickStartSnippet
              </code>
              , 43 lines, wraps the existing{" "}
              <code className="font-mono text-[12px] bg-[var(--color-surface-200)] px-1.5 py-0.5 rounded">
                CodeBlock
              </code>{" "}
              from <code className="font-mono text-[12px]">ui-patterns</code>)
              and uses it in three places. Net diff is small; the UX shift is
              meaningful.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-sidebar)] px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--color-fg-lighter)]">
          <span>
            Not affiliated with Supabase · a clickable Before/After prototype
            of{" "}
            <a
              href={PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:underline"
            >
              PR #46664
            </a>
          </span>
          <a
            href="https://github.com/Godslove-BA/supabase-list-view-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:underline"
          >
            github ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
