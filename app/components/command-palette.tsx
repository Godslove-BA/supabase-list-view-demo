"use client";

import { Check, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

export function CommandPalette({
  open,
  onClose,
  columns,
  visible,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  columns: string[];
  visible: Set<string>;
  onToggle: (col: string) => void;
}) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const filtered = columns.filter((c) =>
    c.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="w-[480px] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
          <Search size={14} className="text-[var(--color-fg-lighter)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
              } else if (e.key === "Enter" && filtered[cursor]) {
                e.preventDefault();
                onToggle(filtered[cursor]);
              }
            }}
            placeholder="Toggle column…"
            className="flex-1 bg-transparent text-[13px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-lighter)] focus:outline-none"
          />
          <span className="text-[10px] uppercase tracking-wide text-[var(--color-fg-lighter)]">
            Esc
          </span>
        </div>
        <ul className="max-h-[320px] overflow-auto py-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-[12px] text-[var(--color-fg-lighter)]">
              No columns match
            </li>
          ) : (
            filtered.map((col, i) => {
              const on = visible.has(col);
              return (
                <li
                  key={col}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[13px]",
                    i === cursor
                      ? "bg-[var(--color-selection)] text-[var(--color-fg)]"
                      : "text-[var(--color-fg-light)] hover:bg-[var(--color-surface-200)]"
                  )}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => onToggle(col)}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border",
                      on
                        ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-black"
                        : "border-[var(--color-border-strong)]"
                    )}
                  >
                    {on && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span className="font-mono">{col}</span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
