import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const url = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(url);

if (!url) {
  console.warn('DATABASE_URL is not set — database calls will fail until configured.');
}

const sqlClient = url ? neon(url) : null;

export const db = sqlClient ? drizzle(sqlClient, { schema }) : (null as never);

export { schema };
