import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { createSessionToken, getAdminCredentials } from './auth';

export const prerender = false;

function isAuthorized(request: Request, cookies: any): boolean {
  const { validUser, validPass } = getAdminCredentials();
  if (!validPass) return false;

  const expectedToken = createSessionToken(validUser, validPass);
  const sessionCookie = cookies.get('admin_session')?.value;
  if (sessionCookie && sessionCookie === expectedToken) return true;

  const headerPwd = request.headers.get('x-admin-password') || '';
  return headerPwd === validPass;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const blobToken = (
    process.env.BLOB_READ_WRITE_TOKEN ||
    import.meta.env.BLOB_READ_WRITE_TOKEN ||
    ''
  )
    .replace(/^["']|["']$/g, '')
    .trim();

  if (!blobToken) {
    return new Response(
      JSON.stringify({
        error: 'BLOB_READ_WRITE_TOKEN belum terpasang di Environment Variables Vercel.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'File gambar tidak ditemukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const blob = await put(`portfolio/${safeName}`, file, {
      access: 'public',
      token: blobToken,
    });

    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[API Upload] Error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Gagal mengunggah gambar ke Vercel Blob' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};