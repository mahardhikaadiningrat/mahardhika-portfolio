import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { isAdminAuthorized } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const studies = await sql`SELECT * FROM case_studies ORDER BY created_at DESC`;
    return new Response(JSON.stringify(studies), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal memuat studi kasus.' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthorized(request, cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized (Sesi login habis, silakan logout lalu login ulang).' }),
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      id,
      career_id,
      title,
      slug,
      categories,
      live_url,
      subtitle,
      challenge,
      execution,
      results,
      photos,
    } = body;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Judul dan Slug wajib diisi.' }), { status: 400 });
    }

    const cleanCategories = Array.isArray(categories) ? categories : [];
    const cleanExecution = Array.isArray(execution) ? execution : [];
    const cleanResults = Array.isArray(results) ? results : [];
    const cleanPhotos = Array.isArray(photos) ? photos : [];
    const cleanCareerId = career_id || null;

    if (id) {
      await sql`
        UPDATE case_studies
        SET
          career_id = ${cleanCareerId},
          title = ${title},
          slug = ${slug},
          categories = ${cleanCategories},
          live_url = ${live_url || null},
          subtitle = ${subtitle || ''},
          challenge = ${challenge || ''},
          execution = ${cleanExecution},
          results = ${cleanResults},
          photos = ${JSON.stringify(cleanPhotos)}::jsonb,
          en_data = NULL
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO case_studies (
          career_id,
          title,
          slug,
          categories,
          live_url,
          subtitle,
          challenge,
          execution,
          results,
          photos
        )
        VALUES (
          ${cleanCareerId},
          ${title},
          ${slug},
          ${cleanCategories},
          ${live_url || null},
          ${subtitle || ''},
          ${challenge || ''},
          ${cleanExecution},
          ${cleanResults},
          ${JSON.stringify(cleanPhotos)}::jsonb
        )
      `;
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menyimpan studi kasus.' }), {
      status: 500,
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAdminAuthorized(request, cookies)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized (Sesi login habis, silakan logout lalu login ulang).' }),
      { status: 401 }
    );
  }

  try {
    let id = url.searchParams.get('id');
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID studi kasus tidak ditemukan.' }), { status: 400 });
    }

    await sql`DELETE FROM case_studies WHERE id = ${id}`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menghapus studi kasus.' }), {
      status: 500,
    });
  }
};