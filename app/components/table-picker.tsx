"use client";

import { Table2 } from "lucide-react";
import type { TableName } from "../lib/supabase";

export function TablePicker({
  value,
  onChange,
}: {
  value: TableName;
  onChange: (t: TableName) => void;
}) {
  return (
    <div className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] pl-2 pr-1 text-[12px]">
      <Table2 size={12} className="text-[var(--color-fg-lighter)]" />
      <span className="text-[var(--color-fg-light)]">Table</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TableName)}
        className="appearance-none border-0 bg-transparent pl-1 pr-1 text-[12px] font-medium text-[var(--color-fg)] focus:outline-none"
      >
        <option value="orders">orders</option>
        <option value="events">events</option>
      </select>
    </div>
  );
}
