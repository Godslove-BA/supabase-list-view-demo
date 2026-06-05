import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase-list-view-demo] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env."
  );
}

export const supabase = createClient(url ?? "", key ?? "", {
  auth: { persistSession: false },
});

export type TableName = "orders" | "events";
