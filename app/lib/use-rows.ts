"use client";

import { useEffect, useRef, useState } from "react";
import { supabase, type TableName } from "./supabase";
import type { Row } from "./tables";

export type FetchState = {
  rows: Row[];
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
};

// Supabase / PostgREST enforces a per-request row ceiling (default 1,000).
// To reach the demo's full row count we page in chunks and stream rows in
// as each chunk lands — the list-view starts rendering after the first chunk,
// then grows.
const PAGE_SIZE = 1000;

export function useRows(table: TableName, limit: number) {
  const [state, setState] = useState<FetchState>({
    rows: [],
    loading: true,
    error: null,
    fetchedAt: null,
  });
  const reqId = useRef(0);

  useEffect(() => {
    const orderBy = table === "orders" ? "created_at" : "occurred_at";
    const myReq = ++reqId.current;
    setState({ rows: [], loading: true, error: null, fetchedAt: null });

    (async () => {
      const collected: Row[] = [];
      let from = 0;
      while (from < limit) {
        const to = Math.min(from + PAGE_SIZE, limit) - 1;
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order(orderBy, { ascending: false })
          .range(from, to);

        if (reqId.current !== myReq) return; // stale (table changed mid-flight)

        if (error) {
          setState((s) => ({
            ...s,
            loading: false,
            error: error.message,
            fetchedAt: Date.now(),
          }));
          return;
        }

        const batch = (data ?? []) as Row[];
        collected.push(...batch);
        setState({
          rows: collected.slice(),
          loading: batch.length === PAGE_SIZE && collected.length < limit,
          error: null,
          fetchedAt: Date.now(),
        });

        if (batch.length < PAGE_SIZE) break; // ran out of rows
        from += PAGE_SIZE;
      }

      if (reqId.current === myReq) {
        setState((s) => ({ ...s, loading: false }));
      }
    })();
  }, [table, limit]);

  return state;
}
