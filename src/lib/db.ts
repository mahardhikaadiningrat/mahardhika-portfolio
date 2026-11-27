import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || import.meta.env.DATABASE_URL || '';
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
    const match = envFile.match(/^DATABASE_URL\s*=\s*(.+)$/m);
    if (match) url = match[1];
  } catch {}
  return url
    .trim()
    .replace(/^psql\s+/, '')
    .replace(/^['"]|['"]$/g, '');
}

const dbUrl = getDatabaseUrl();
if (!dbUrl) {
  throw new Error('DATABASE_URL belum diisi di file .env');
}

export const sql = neon(dbUrl);
