"use client";

import { Kbd } from "./kbd";

const ROWS: [string, React.ReactNode][] = [
  ["Navigate", <><Kbd>↑</Kbd> / <Kbd>↓</Kbd> or <Kbd>j</Kbd> / <Kbd>k</Kbd></>],
  ["Expand row", <Kbd>Enter</Kbd>],
  ["Top / bottom", <><Kbd>gg</Kbd> / <Kbd>G</Kbd></>],
  ["Filter rows", <Kbd>/</Kbd>],
  ["Column picker", <><Kbd>⌘</Kbd>+<Kbd>K</Kbd></>],
  ["Switch view", <><Kbd>⌘</Kbd>+<Kbd>\\</Kbd></>],
  ["Clear / collapse", <Kbd>Esc</Kbd>],
  ["This help", <Kbd>?</Kbd>],
];

export function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[420px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--color-fg)]">
            Keyboard shortcuts
          </h3>
          <span className="text-[11px] uppercase tracking-wide text-[var(--color-fg-lighter)]">
            Press <Kbd>Esc</Kbd> to close
          </span>
        </div>
        <ul className="space-y-2">
          {ROWS.map(([label, keys]) => (
            <li
              key={label}
              className="flex items-center justify-between text-[13px]"
            >
              <span className="text-[var(--color-fg-light)]">{label}</span>
              <span className="flex items-center gap-1 text-[var(--color-fg)]">
                {keys}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
