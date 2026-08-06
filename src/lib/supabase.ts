import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Expected until Milestone 1 provisions a real Supabase project (dev + prod) under Freda's account.
  console.warn(
    "Supabase env vars are not set — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Auth and data calls will fail until they are.",
  );
}

// createClient throws synchronously on an empty-string key (even paired with a real URL),
// which would crash the whole app at module load — not just the Supabase call site. Fall back
// to a syntactically valid placeholder so construction always succeeds; real calls still fail
// gracefully (network error) against it until both env vars are actually set.
export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key");
