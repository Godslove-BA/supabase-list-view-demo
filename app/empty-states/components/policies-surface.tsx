"use client";

import { Plus, Shield } from "lucide-react";
import { QuickStartSnippet } from "./quick-start-snippet";
import { Surface } from "./surface";

const SCHEMA = "public";
const TABLE = "orders";

const POLICY_SNIPPET = `create policy "Users can read their own rows"
on ${SCHEMA}.${TABLE}
for select
to authenticated
using ((select auth.uid()) = user_id);`;

export function PoliciesSurface() {
  const before = (
    <PolicyCard>
      {/* Verbatim from supabase/supabase
          apps/studio/components/interfaces/Auth/Policies/PolicyTableRow/index.tsx
          — the entire empty-state branch is just this one muted line. */}
      <p className="text-[var(--color-fg-lighter)] text-[13px] p-4">
        No policies created yet
      </p>
    </PolicyCard>
  );

  const after = (
    <PolicyCard>
      <div className="p-4 flex flex-col items-start gap-3">
        <p className="text-[var(--color-fg-lighter)] text-[13px]">
          No policies created yet. Most tables need at least one policy per role
          + command pair. As a starting point:
        </p>
        <QuickStartSnippet
          caption="Allow signed-in users to read their own rows:"
          snippet={POLICY_SNIPPET}
          language="sql"
          className="max-w-full mt-0"
        />
      </div>
    </PolicyCard>
  );

  return (
    <Surface
      title="Auth · Policies"
      location={`Authentication → Policies → ${SCHEMA}.${TABLE}`}
      sourcePath="apps/studio/components/interfaces/Auth/Policies/PolicyTableRow/index.tsx"
      before={before}
      after={after}
    />
  );
}

function PolicyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[720px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-100)] overflow-hidden">
      {/* Card header — mirrors Studio's PolicyTableRowHeader */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <Shield size={14} className="text-[var(--color-fg-light)] shrink-0" />
          <span className="font-mono text-[13px] text-[var(--color-fg)]">
            {SCHEMA}.{TABLE}
          </span>
          <span className="hidden text-[11px] text-[var(--color-fg-lighter)] sm:inline">
            · RLS enabled
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-6 items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-surface-200)] px-2 text-[11px] text-[var(--color-fg)] hover:bg-[var(--color-surface-300)] transition-colors"
        >
          <Plus size={11} />
          Create policy
        </button>
      </div>
      {children}
    </div>
  );
}
