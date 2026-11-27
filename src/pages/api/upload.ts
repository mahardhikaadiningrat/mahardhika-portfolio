import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { isAdminAuthorized } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized — Silakan login ulang.' }), {
      status: 401,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'File gambar tidak ditemukan.' }), {
        status: 400,
      });
    }

    const token = import.meta.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN belum diatur di server.' }),
        { status: 500 }
      );
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const blob = await put(`portfolio/${Date.now()}-${cleanName}`, file, {
      access: 'public',
      token,
    });

    return new Response(JSON.stringify({ url: blob.url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal mengunggah ke Vercel Blob.' }), {
      status: 500,
    });
  }
};