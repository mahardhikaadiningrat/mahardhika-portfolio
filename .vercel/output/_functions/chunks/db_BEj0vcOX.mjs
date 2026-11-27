import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { neon } from "@neondatabase/serverless";
// src/pages/src/lib/db.ts
var db_exports = /* @__PURE__ */ __exportAll({ sql: () => sql });
var sql = neon("postgresql://neondb_owner:npg_t6HVcE0hjPke@ep-fragrant-dew-bil0das0-pooler.c-5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
// \0virtual:astro:page:src/pages/src/lib/db@_@ts
var page = () => db_exports;
export { page };
