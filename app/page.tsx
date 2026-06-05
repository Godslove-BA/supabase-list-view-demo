"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GridViewTable } from "./components/grid-view-table";
import { ListViewTable } from "./components/list-view-table";
import { TablePicker } from "./components/table-picker";
import { ViewToggle, type ViewMode } from "./components/view-toggle";
import type { TableName } from "./lib/supabase";
import { TABLES } from "./lib/tables";
import { useRows } from "./lib/use-rows";

const STORAGE_KEY = "slvd:view-mode";

export default function Page() {
  const [table, setTable] = useState<TableName>("orders");
  const [view, setView] = useState<ViewMode>("list");
  const [hydrated, setHydrated] = useState(false);

  // Restore preference (after mount, to avoid hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === "grid" || stored === "list") setView(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, view);
  }, [view, hydrated]);

  const config = TABLES[table];
  const { rows, loading, fetchedAt, error } = useRows(table, config.fetchLimit);

  return (
    <main className="flex h-dvh flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Companion-artifact link — surfaces the second portfolio piece */}
      <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-100)] px-4 text-[11px] text-[var(--color-fg-light)]">
        <span className="text-[var(--color-fg-lighter)]">also see</span>
        <Link
          href="/empty-states"
          className="inline-flex items-center gap-1 text-[var(--color-brand)] hover:underline"
        >
          ↗ Teach-first empty states · a design proposal for 3 Studio surfaces (PR #46664)
        </Link>
      </div>

      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-sidebar)] px-4">
        <div className="flex items-center gap-3">
          <span
            className="block h-4 w-4 rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand) 0%, hsl(153.1 60.2% 30%) 100%)",
            }}
            aria-hidden
          />
          <span className="text-[13px] font-medium tracking-tight text-[var(--color-fg)]">
            Studio list-view demo
          </span>
          <span className="hidden text-[11px] text-[var(--color-fg-lighter)] sm:inline">
            A denser, keyboard-first variant for the Supabase Studio table editor
          </span>
        </div>
        <ViewToggle value={view} onChange={setView} />
      </header>

      {/* Sub-toolbar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4">
        <div className="flex items-center gap-3">
          <TablePicker value={table} onChange={setTable} />
          <span className="text-[11px] text-[var(--color-fg-lighter)]">
            {rows.length.toLocaleString()} rows · {config.columns.length} columns
          </span>
        </div>
        <div className="hidden items-center gap-3 text-[10px] uppercase tracking-wide text-[var(--color-fg-lighter)] md:flex">
          <span><kbd>/</kbd> filter</span>
          <span><kbd>⌘</kbd>+<kbd>K</kbd> columns</span>
          <span><kbd>?</kbd> help</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {error ? (
          <div className="m-6 rounded-md border border-[var(--color-destructive)] bg-[var(--color-destructive-bg)] p-4 text-[13px] text-[var(--color-destructive)]">
            Could not load <code className="font-mono">{table}</code>: {error}
          </div>
        ) : view === "list" ? (
          <ListViewTable
            rows={rows}
            config={config}
            loading={loading}
            onSwitchView={() => setView("grid")}
          />
        ) : (
          <GridViewTable rows={rows} config={config} loading={loading} />
        )}
      </div>

      {/* Status bar */}
      <footer className="flex h-7 shrink-0 items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-100)] px-4 text-[10px] uppercase tracking-wide text-[var(--color-fg-lighter)]">
        <div className="flex items-center gap-4">
          <span>
            {loading
              ? "loading…"
              : `${rows.length.toLocaleString()} rows · ${config.columns.length} columns`}
          </span>
          {fetchedAt && (
            <span className="hidden sm:inline">
              fetched {((Date.now() - fetchedAt) / 1000).toFixed(0)}s ago
            </span>
          )}
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <span>↑↓ navigate</span>
          <span>enter expand</span>
          <span>/ filter</span>
          <span>⌘+\ switch view</span>
          <span>? help</span>
        </div>
        <a
          href="https://github.com/Godslove-BA/supabase-list-view-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:underline"
        >
          github ↗
        </a>
      </footer>
    </main>
  );
}
