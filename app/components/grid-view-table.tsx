"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";
import { cn } from "../lib/cn";
import { formatMoney } from "../lib/format";
import type { Row, TableConfig } from "../lib/tables";

const HEADER_HEIGHT = 32;
const CELL_HEIGHT = 30;

type GridViewProps = {
  rows: Row[];
  config: TableConfig;
  loading: boolean;
};

const columnHelper = createColumnHelper<Row>();

export function GridViewTable({ rows, config, loading }: GridViewProps) {
  const columns = useMemo(
    () =>
      config.columns.map((col) =>
        columnHelper.accessor((r) => r[col], {
          id: col,
          header: col,
          cell: ({ getValue }) => {
            const v = getValue();
            if (v == null) return <span className="text-[var(--color-fg-muted)]">NULL</span>;
            if (col === "total_cents") return formatMoney(v as number);
            if (col === "metadata" || typeof v === "object") {
              return (
                <span className="font-mono text-[12px]">
                  {JSON.stringify(v)}
                </span>
              );
            }
            if (col === "id" || col === "items_count") {
              return <span className="font-mono">{String(v)}</span>;
            }
            return String(v);
          },
          size: estimateWidth(col),
        })
      ),
    [config.columns]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CELL_HEIGHT,
    overscan: 12,
  });

  if (loading) {
    return (
      <div className="flex-1 space-y-px overflow-hidden bg-[var(--color-bg)] p-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="h-[24px] animate-pulse bg-[var(--color-surface-200)]"
            style={{ opacity: 1 - i * 0.04 }}
          />
        ))}
      </div>
    );
  }

  const total = columns.reduce((s, c) => s + (c.size ?? 120), 0);

  return (
    <div
      ref={parentRef}
      className="relative flex-1 overflow-auto bg-[var(--color-bg)]"
    >
      <table
        className="w-full border-separate border-spacing-0 text-[13px]"
        style={{ minWidth: total }}
      >
        <thead className="sticky top-0 z-10 bg-[var(--color-surface-100)]">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} style={{ height: HEADER_HEIGHT }}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{ width: h.column.getSize() }}
                  className={cn(
                    "border-b border-r border-[var(--color-border)] px-2 text-left font-mono text-[11px] font-normal uppercase tracking-wide text-[var(--color-fg-lighter)]",
                  )}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr style={{ height: virtualizer.getTotalSize() }}>
            <td colSpan={columns.length} style={{ padding: 0, border: 0 }}>
              <div style={{ position: "relative", height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((vrow) => {
                  const row = table.getRowModel().rows[vrow.index];
                  return (
                    <div
                      key={row.id}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${vrow.start}px)`,
                        height: vrow.size,
                        display: "flex",
                      }}
                      className="border-b border-[var(--color-border-muted)] hover:bg-white/[0.025]"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="flex items-center overflow-hidden border-r border-[var(--color-border-muted)] px-2 text-[13px] text-[var(--color-fg)] whitespace-nowrap"
                        >
                          <span className="truncate">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function estimateWidth(col: string): number {
  const widths: Record<string, number> = {
    id: 80,
    order_number: 110,
    customer_name: 140,
    customer_email: 220,
    total_cents: 100,
    currency: 80,
    status: 100,
    payment_method: 120,
    shipping_city: 120,
    shipping_country: 110,
    items_count: 90,
    notes: 200,
    created_at: 220,
    event_type: 130,
    session_id: 280,
    metadata: 320,
    occurred_at: 220,
  };
  return widths[col] ?? 140;
}
