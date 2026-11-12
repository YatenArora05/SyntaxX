import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  // prepare:false keeps this compatible with Supabase / Neon connection poolers
  return (globalForDb.pg ??= postgres(url, { prepare: false, max: 5 }));
}

export const db = () => drizzle(client(), { schema });
