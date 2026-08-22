import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    const dbUrl = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;
    if (!dbUrl) {
      throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
    }
    const sql = neon(dbUrl);
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({}, {
  get(target, prop) {
    return Reflect.get(getDb(), prop);
  }
});
