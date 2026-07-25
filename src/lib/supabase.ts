import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Expected until Milestone 1 provisions a real Supabase project (dev + prod) under Freda's account.
  console.warn(
    "Supabase env vars are not set — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Auth and data calls will fail until they are.",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
