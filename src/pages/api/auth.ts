import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

function readLocalEnvFile(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in result)) result[key] = val;
    }
  }
  return result;
}

export function getAdminCredentials() {
  const localEnv = readLocalEnvFile();

  const rawUser =
    process.env.ADMIN_USERNAME ||
    import.meta.env.ADMIN_USERNAME ||
    localEnv.ADMIN_USERNAME ||
    'admin';

  const rawPass =
    process.env.ADMIN_PASSWORD ||
    import.meta.env.ADMIN_PASSWORD ||
    localEnv.ADMIN_PASSWORD ||
    '';

  return {
    validUser: String(rawUser).replace(/^["']|["']$/g, '').trim(),
    validPass: String(rawPass).replace(/^["']|["']$/g, '').trim(),
  };
}

export function createSessionToken(username: string, password: string): string {
  return crypto
    .createHmac('sha256', password)
    .update(`portfolio-admin:${username}`)
    .digest('hex');
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const inputUser = String(body.username || '').trim();
    const inputPass = String(body.password || '').trim();

    const { validUser, validPass } = getAdminCredentials();

    if (!validPass) {
      return new Response(
        JSON.stringify({ error: 'ADMIN_PASSWORD kosong atau tidak ditemukan di .env.' }),
        { status: 500 }
      );
    }

    if (inputUser !== validUser || inputPass !== validPass) {
      return new Response(
        JSON.stringify({ error: 'Username atau password salah.' }),
        { status: 401 }
      );
    }

    const token = createSessionToken(validUser, validPass);

    cookies.set('admin_session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Permintaan tidak valid.' }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('admin_session', { path: '/' });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};