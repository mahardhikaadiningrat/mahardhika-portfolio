import { n as createSessionToken, r as getAdminCredentials } from "./auth_CRUGbTkj.mjs";
// src/lib/auth.ts
function isAdminAuthorized(request, cookies) {
	const { validUser, validPass } = getAdminCredentials();
	if (!validPass) return false;
	const sessionCookie = cookies.get("admin_session")?.value;
	if (sessionCookie && sessionCookie === createSessionToken(validUser, validPass)) return true;
	return request.headers.get("x-admin-password") === validPass;
}
export { isAdminAuthorized as t };
