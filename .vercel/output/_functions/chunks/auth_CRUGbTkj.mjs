import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
// src/pages/api/auth.ts
var auth_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST,
	createSessionToken: () => createSessionToken,
	getAdminCredentials: () => getAdminCredentials,
	prerender: () => false
});
function readLocalEnvFile() {
	const result = {};
	for (const filename of [".env.local", ".env"]) {
		const filePath = path.resolve(process.cwd(), filename);
		if (!fs.existsSync(filePath)) continue;
		const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eqIdx = trimmed.indexOf("=");
			if (eqIdx === -1) continue;
			const key = trimmed.slice(0, eqIdx).trim();
			const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
			if (!(key in result)) result[key] = val;
		}
	}
	return result;
}
function getAdminCredentials() {
	readLocalEnvFile();
	const rawUser = process.env.ADMIN_USERNAME || "mahardhika";
	const rawPass = process.env.ADMIN_PASSWORD || "atreya!2";
	return {
		validUser: String(rawUser).replace(/^["']|["']$/g, "").trim(),
		validPass: String(rawPass).replace(/^["']|["']$/g, "").trim()
	};
}
function createSessionToken(username, password) {
	return crypto.createHmac("sha256", password).update(`portfolio-admin:${username}`).digest("hex");
}
var POST = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const inputUser = String(body.username || "").trim();
		const inputPass = String(body.password || "").trim();
		const { validUser, validPass } = getAdminCredentials();
		if (!validPass) return new Response(JSON.stringify({ error: "ADMIN_PASSWORD kosong atau tidak ditemukan di .env." }), { status: 500 });
		if (inputUser !== validUser || inputPass !== validPass) return new Response(JSON.stringify({ error: "Username atau password salah." }), { status: 401 });
		const token = createSessionToken(validUser, validPass);
		cookies.set("admin_session", token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			maxAge: 86400
		});
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch {
		return new Response(JSON.stringify({ error: "Permintaan tidak valid." }), { status: 400 });
	}
};
var DELETE = async ({ cookies }) => {
	cookies.delete("admin_session", { path: "/" });
	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
export { createSessionToken as n, getAdminCredentials as r, auth_exports as t };
