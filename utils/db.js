import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy initialization to avoid module-level evaluation issues
let _db = null;

function getDatabase() {
  if (_db) return _db;

  const databaseUrl = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

  if (!databaseUrl) {
    console.error("❌ Database URL is missing!");
    console.error("Current env vars:", {
      hasUrl: !!process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
      nodeEnv: process.env.NODE_ENV,
    });
    throw new Error(
      "NEXT_PUBLIC_DRIZZLE_DB_URL is not set. Please check your .env.local file."
    );
  }

  const sql = neon(databaseUrl);
  _db = drizzle(sql, { schema });
  return _db;
}

// Export a proxy that initializes the database on first access
export const db = new Proxy({}, {
  get(target, prop) {
    const database = getDatabase();
    return database[prop];
  }
});