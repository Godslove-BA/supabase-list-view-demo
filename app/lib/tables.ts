import { formatMoney } from "./format";
import type { TableName } from "./supabase";

export type Row = Record<string, unknown> & { id: number };

export type SecondaryField = {
  key: string;
  /** Optional renderer — overrides raw value */
  render?: (row: Row) => string;
};

export type StatusMap = Record<
  string,
  "paid" | "pending" | "failed" | "neutral" | "info"
>;

export type TableConfig = {
  name: TableName;
  label: string;
  /** Primary-key style identifier shown left of the row (e.g. `#001234`). */
  pkField: keyof Row;
  /** Bold/leading title field (e.g. customer_name, event_type). */
  titleField: keyof Row;
  /** Optional renderer for the title (e.g. to truncate a long session id). */
  titleRender?: (row: Row) => string;
  /** 1-3 dim secondary fields shown after the title, dot-separated. */
  secondaryFields: SecondaryField[];
  /** Status field — drives the badge color. Optional. */
  statusField?: keyof Row;
  statusMap?: StatusMap;
  /** Timestamp field — drives the relative-time on the right. */
  timestampField: keyof Row;
  /** Column list for the grid view + cmd+k picker. */
  columns: string[];
  /** Page-size for the initial fetch. */
  fetchLimit: number;
  /** Used by the filter input + Cmd+K column picker. */
  defaultVisibleColumns: string[];
};

export const TABLES: Record<TableName, TableConfig> = {
  orders: {
    name: "orders",
    label: "orders",
    pkField: "order_number",
    titleField: "customer_name",
    secondaryFields: [
      { key: "total_cents", render: (r) => formatMoney(r.total_cents as number, (r.currency as string) ?? "USD") },
      { key: "shipping_city" },
      { key: "shipping_country" },
    ],
    statusField: "status",
    statusMap: {
      paid: "paid",
      pending: "pending",
      failed: "failed",
      refunded: "neutral",
    },
    timestampField: "created_at",
    columns: [
      "id",
      "order_number",
      "customer_name",
      "customer_email",
      "total_cents",
      "currency",
      "status",
      "payment_method",
      "shipping_city",
      "shipping_country",
      "items_count",
      "notes",
      "created_at",
    ],
    defaultVisibleColumns: [
      "order_number",
      "customer_name",
      "total_cents",
      "status",
      "shipping_city",
      "created_at",
    ],
    fetchLimit: 5000,
  },
  events: {
    name: "events",
    label: "events",
    pkField: "id",
    titleField: "session_id",
    titleRender: (r) => {
      const s = String(r.session_id ?? "");
      // Show a recognisable prefix + suffix for the 32-char md5-based ids
      return s.length > 18 ? `${s.slice(0, 10)}…${s.slice(-4)}` : s;
    },
    secondaryFields: [
      {
        key: "metadata",
        render: (r) => {
          const m = r.metadata as { path?: string; duration_ms?: number } | null;
          if (!m) return "";
          return [m.path, m.duration_ms ? `${m.duration_ms}ms` : null]
            .filter(Boolean)
            .join(" · ");
        },
      },
    ],
    statusField: "event_type",
    statusMap: {
      purchase: "paid",
      signup: "info",
      logout: "neutral",
      form_submit: "info",
      page_view: "neutral",
      button_click: "neutral",
      search: "neutral",
      video_play: "info",
      scroll_50: "neutral",
      scroll_100: "neutral",
    },
    timestampField: "occurred_at",
    columns: ["id", "event_type", "session_id", "metadata", "occurred_at"],
    defaultVisibleColumns: ["id", "event_type", "session_id", "occurred_at"],
    fetchLimit: 5000,
  },
};
