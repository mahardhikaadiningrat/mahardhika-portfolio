import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as sql } from "./db_Cd0JRjI_.mjs";
import { t as isAdminAuthorized } from "./auth_BvBch6iK.mjs";
// src/pages/api/careers.ts
var careers_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	if (!isAdminAuthorized(request, cookies)) return new Response(JSON.stringify({ error: "Unauthorized — Silakan login ulang." }), { status: 401 });
	try {
		const { id, company, role, period, sort_order, summary, milestones } = await request.json();
		if (!company || !role || !period) return new Response(JSON.stringify({ error: "Perusahaan, Jabatan, dan Periode wajib diisi." }), { status: 400 });
		const milestonesJson = JSON.stringify(Array.isArray(milestones) ? milestones : []);
		const sortVal = Number(sort_order || 1);
		if (id) await sql`
        UPDATE careers
        SET
          company = ${company},
          role = ${role},
          period = ${period},
          sort_order = ${sortVal},
          summary = ${summary || null},
          milestones = ${milestonesJson}::jsonb
        WHERE id = ${Number(id)}
      `;
		else await sql`
        INSERT INTO careers (company, role, period, sort_order, summary, milestones)
        VALUES (${company}, ${role}, ${period}, ${sortVal}, ${summary || null}, ${milestonesJson}::jsonb)
      `;
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message || "Gagal menyimpan karier." }), { status: 500 });
	}
};
var DELETE = async ({ request, cookies }) => {
	if (!isAdminAuthorized(request, cookies)) return new Response(JSON.stringify({ error: "Unauthorized — Silakan login ulang." }), { status: 401 });
	try {
		const { id } = await request.json();
		await sql`DELETE FROM careers WHERE id = ${Number(id)}`;
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message || "Gagal menghapus karier." }), { status: 500 });
	}
};
// \0virtual:astro:page:src/pages/api/careers@_@ts
var page = () => careers_exports;
export { page };
