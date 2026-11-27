import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as isAdminAuthorized } from "./auth_BvBch6iK.mjs";
import { put } from "@vercel/blob";
// src/pages/api/upload.ts
var upload_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	if (!isAdminAuthorized(request, cookies)) return new Response(JSON.stringify({ error: "Unauthorized — Silakan login ulang." }), { status: 401 });
	try {
		const file = (await request.formData()).get("file");
		if (!file) return new Response(JSON.stringify({ error: "File gambar tidak ditemukan." }), { status: 400 });
		const token = "vercel_blob_rw_xyMEPWd8V2AlqCST_h8RhnAoqWn6GPehNzZbAAcxz8YOqzb";
		const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
		const blob = await put(`portfolio/${Date.now()}-${cleanName}`, file, {
			access: "public",
			token
		});
		return new Response(JSON.stringify({ url: blob.url }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message || "Gagal mengunggah ke Vercel Blob." }), { status: 500 });
	}
};
// \0virtual:astro:page:src/pages/api/upload@_@ts
var page = () => upload_exports;
export { page };
