"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "../lib/cn";
import { toSearchable } from "../lib/format";
import { relativeTime } from "../lib/relative-time";
import type { Row, TableConfig } from "../lib/tables";
import { CommandPalette } from "./command-palette";
import { HelpOverlay } from "./help-overlay";
import { StatusBadge } from "./status-badge";

/** Studio's `.rdg-cell` font is 13px; rows are ~34px tall here. */
const ROW_HEIGHT = 34;
const EXPANDED_EXTRA = 200; // additional height when a row is expanded
const FILTER_DEBOUNCE_MS = 100;

type ListViewTableProps = {
  rows: Row[];
  config: TableConfig;
  loading: boolean;
  /** Called when user wants to switch to grid view (Cmd+\) */
  onSwitchView?: () => void;
};

export function ListViewTable({
  rows,
  config,
  loading,
  onSwitchView,
}: ListViewTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const [filterRaw, setFilterRaw] = useState("");
  const [filter, setFilter] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    () => new Set(config.defaultVisibleColumns)
  );
  // Track double-tap 'g' for `gg → top`
  const lastGRef = useRef(0);

  // Reset state when table changes
  useEffect(() => {
    setFocusedIdx(0);
    setExpandedIdx(null);
    setFilterRaw("");
    setFilter("");
    setVisibleCols(new Set(config.defaultVisibleColumns));
  }, [config.name, config.defaultVisibleColumns]);

  // Debounce filter
  useEffect(() => {
    const t = setTimeout(() => setFilter(filterRaw.trim().toLowerCase()), FILTER_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filterRaw]);

  const filtered = useMemo(() => {
    if (!filter) return rows;
    const cols = [...visibleCols];
    return rows.filter((r) =>
      cols.some((c) => toSearchable(r[c]).toLowerCase().includes(filter))
    );
  }, [rows, filter, visibleCols]);

  // Clamp focused index when filtered shrinks
  useEffect(() => {
    if (focusedIdx >= filtered.length) {
      setFocusedIdx(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, focusedIdx]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (expandedIdx === i ? ROW_HEIGHT + EXPANDED_EXTRA : ROW_HEIGHT),
    overscan: 12,
  });

  // Recompute virtualizer when expansion changes
  useEffect(() => {
    virtualizer.measure();
  }, [expandedIdx, virtualizer]);

  const scrollToIndex = useCallback(
    (i: number) => virtualizer.scrollToIndex(i, { align: "auto" }),
    [virtualizer]
  );

  const move = useCallback(
    (delta: number) => {
      setFocusedIdx((i) => {
        const next = Math.max(0, Math.min(filtered.length - 1, i + delta));
        scrollToIndex(next);
        return next;
      });
      setExpandedIdx(null);
    },
    [filtered.length, scrollToIndex]
  );

  // Keyboard handler
  useEffect(() => {
    const isTypingInInput = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (helpOpen || paletteOpen) return; // those have their own handlers

      const typing = isTypingInInput(e.target);

      // / focuses filter (only outside inputs)
      if (e.key === "/" && !typing) {
        e.preventDefault();
        filterInputRef.current?.focus();
        filterInputRef.current?.select();
        return;
      }

      // ⌘+K column picker
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      // ⌘+\ switch view
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        onSwitchView?.();
        return;
      }

      // ? help
      if (e.key === "?" && !typing) {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      // Esc clears filter or collapses expansion or blurs filter
      if (e.key === "Escape") {
        if (typing) {
          (e.target as HTMLElement).blur();
          return;
        }
        if (expandedIdx !== null) {
          setExpandedIdx(null);
          return;
        }
        if (filter) {
          setFilterRaw("");
          return;
        }
        return;
      }

      // The rest only apply when not typing in an input
      if (typing) return;

      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          move(1);
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          move(-1);
          break;
        case "PageDown":
          e.preventDefault();
          move(10);
          break;
        case "PageUp":
          e.preventDefault();
          move(-10);
          break;
        case "Enter":
          e.preventDefault();
          setExpandedIdx((cur) => (cur === focusedIdx ? null : focusedIdx));
          break;
        case "g": {
          const now = Date.now();
          if (now - lastGRef.current < 400) {
            // gg → top
            setFocusedIdx(0);
            setExpandedIdx(null);
            scrollToIndex(0);
            lastGRef.current = 0;
          } else {
            lastGRef.current = now;
          }
          break;
        }
        case "G":
          e.preventDefault();
          {
            const last = Math.max(0, filtered.length - 1);
            setFocusedIdx(last);
            setExpandedIdx(null);
            scrollToIndex(last);
          }
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    move,
    filtered.length,
    focusedIdx,
    expandedIdx,
    filter,
    helpOpen,
    paletteOpen,
    onSwitchView,
    scrollToIndex,
  ]);

  const toggleCol = useCallback((col: string) => {
    setVisibleCols((s) => {
      const next = new Set(s);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  }, []);

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-100)] px-3 py-2">
        <Search size={13} className="text-[var(--color-fg-lighter)]" />
        <input
          ref={filterInputRef}
          value={filterRaw}
          onChange={(e) => setFilterRaw(e.target.value)}
          placeholder="Filter rows…  (press / to focus)"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-lighter)] focus:outline-none"
        />
        <span className="text-[11px] text-[var(--color-fg-lighter)]">
          {filter ? `${filtered.length.toLocaleString()} of ${rows.length.toLocaleString()}` : `${rows.length.toLocaleString()} rows`}
        </span>
      </div>

      {/* List body */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto bg-[var(--color-bg)]"
        tabIndex={-1}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState query={filter} />
        ) : (
          <div
            style={{ height: virtualizer.getTotalSize(), position: "relative" }}
          >
            {virtualizer.getVirtualItems().map((vrow) => {
              const row = filtered[vrow.index];
              const focused = vrow.index === focusedIdx;
              const expanded = vrow.index === expandedIdx;
              const style: CSSProperties = {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${vrow.start}px)`,
                height: vrow.size,
              };
              return (
                <ListRow
                  key={(row.id as React.Key) ?? vrow.index}
                  row={row}
                  config={config}
                  focused={focused}
                  expanded={expanded}
                  style={style}
                  visibleCols={visibleCols}
                  onClick={() => {
                    setFocusedIdx(vrow.index);
                    setExpandedIdx((cur) => (cur === vrow.index ? null : vrow.index));
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        columns={config.columns}
        visible={visibleCols}
        onToggle={toggleCol}
      />
      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </>
  );
}

/* ---------------- Row ---------------- */

function ListRow({
  row,
  config,
  focused,
  expanded,
  style,
  visibleCols,
  onClick,
}: {
  row: Row;
  config: TableConfig;
  focused: boolean;
  expanded: boolean;
  style: CSSProperties;
  visibleCols: Set<string>;
  onClick: () => void;
}) {
  const status = config.statusField ? String(row[config.statusField as string] ?? "") : "";
  const tone =
    config.statusField && config.statusMap
      ? config.statusMap[status] ?? "neutral"
      : "neutral";
  const ts = row[config.timestampField as string] as string | undefined;

  return (
    <div
      style={style}
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b border-[var(--color-border-muted)] text-[13px]",
        focused ? "row-focused" : "hover:bg-white/[0.025]"
      )}
    >
      <div className="flex h-[34px] items-center gap-3 px-3">
        {/* PK */}
        <span className="w-[88px] shrink-0 truncate font-mono text-[11px] text-[var(--color-fg-lighter)]">
          {String(row[config.pkField as string] ?? "")}
        </span>

        {/* Title */}
        <span
          className={cn(
            "min-w-[140px] shrink-0 truncate font-medium text-[var(--color-fg)]",
            config.titleRender && "font-mono text-[12px]"
          )}
        >
          {config.titleRender
            ? config.titleRender(row)
            : String(row[config.titleField as string] ?? "")}
        </span>

        {/* Secondary fields */}
        <span className="min-w-0 flex-1 truncate text-[var(--color-fg-light)]">
          {config.secondaryFields.map((f, i) => {
            const v = f.render ? f.render(row) : String(row[f.key] ?? "");
            if (!v) return null;
            return (
              <span key={f.key}>
                {i > 0 && (
                  <span className="mx-1.5 text-[var(--color-fg-muted)]">·</span>
                )}
                {v}
              </span>
            );
          })}
        </span>

        {/* Status */}
        {config.statusField && status ? (
          <StatusBadge tone={tone}>{status}</StatusBadge>
        ) : null}

        {/* Timestamp */}
        <span className="w-[100px] shrink-0 text-right text-[11px] text-[var(--color-fg-lighter)]">
          {relativeTime(ts)}
        </span>

        {/* Chevron */}
        <ChevronRight
          size={14}
          className={cn(
            "shrink-0 text-[var(--color-fg-muted)] transition-transform",
            expanded && "rotate-90 text-[var(--color-brand)]"
          )}
        />
      </div>

      {expanded && (
        <div className="border-t border-[var(--color-border-muted)] bg-[var(--color-surface-100)] px-3 py-3">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
            {config.columns.map((col) => (
              <div key={col} className="flex gap-3">
                <span
                  className={cn(
                    "w-[140px] shrink-0 font-mono text-[11px]",
                    visibleCols.has(col)
                      ? "text-[var(--color-fg-light)]"
                      : "text-[var(--color-fg-muted)]"
                  )}
                >
                  {col}
                </span>
                <span className="min-w-0 flex-1 break-words text-[var(--color-fg)]">
                  {formatCellValue(row[col])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatCellValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function LoadingSkeleton() {
  return (
    <div className="space-y-px p-3">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="h-[28px] animate-pulse rounded-sm bg-[var(--color-surface-200)]"
          style={{ opacity: 1 - i * 0.05 }}
        />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-20 text-center">
      <p className="text-[13px] text-[var(--color-fg-light)]">
        {query ? "No rows match the filter." : "No rows."}
      </p>
      {query && (
        <p className="text-[11px] text-[var(--color-fg-lighter)]">
          Press <kbd>Esc</kbd> to clear.
        </p>
      )}
    </div>
  );
}
