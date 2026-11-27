import type { AstroCookies } from 'astro';
import { createSessionToken, getAdminCredentials } from '../pages/api/auth';

export function isAdminAuthorized(request: Request, cookies: AstroCookies): boolean {
  const { validUser, validPass } = getAdminCredentials();
  if (!validPass) return false;

  const sessionCookie = cookies.get('admin_session')?.value;
  if (sessionCookie && sessionCookie === createSessionToken(validUser, validPass)) {
    return true;
  }

  const headerPass = request.headers.get('x-admin-password');
  return headerPass === validPass;
}