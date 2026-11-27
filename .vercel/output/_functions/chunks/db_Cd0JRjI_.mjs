import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
// src/lib/db.ts
function getDatabaseUrl() {
	let url = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_t6HVcE0hjPke@ep-fragrant-dew-bil0das0-pooler.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
	try {
		const match = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf-8").match(/^DATABASE_URL\s*=\s*(.+)$/m);
		if (match) url = match[1];
	} catch {}
	return url.trim().replace(/^psql\s+/, "").replace(/^['"]|['"]$/g, "");
}
var dbUrl = getDatabaseUrl();
if (!dbUrl) throw new Error("DATABASE_URL belum diisi di file .env");
var sql = neon(dbUrl);
export { sql as t };
