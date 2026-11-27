import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { isAdminAuthorized } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized — Silakan login ulang.' }), {
      status: 401,
    });
  }

  try {
    const data = await request.json();
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
    } = data;

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Judul dan Slug wajib diisi.' }), {
        status: 400,
      });
    }

    const categoriesJson = JSON.stringify(Array.isArray(categories) ? categories : []);
    const executionJson = JSON.stringify(Array.isArray(execution) ? execution : []);
    const resultsJson = JSON.stringify(Array.isArray(results) ? results : []);
    const photosJson = JSON.stringify(Array.isArray(photos) ? photos : []);
    const careerIdVal = career_id ? Number(career_id) : null;

    if (id) {
      await sql`
        UPDATE case_studies
        SET
          career_id = ${careerIdVal},
          title = ${title},
          slug = ${slug},
          categories = ${categoriesJson}::jsonb,
          live_url = ${live_url || null},
          subtitle = ${subtitle || null},
          challenge = ${challenge || null},
          execution = ${executionJson}::jsonb,
          results = ${resultsJson}::jsonb,
          photos = ${photosJson}::jsonb
        WHERE id = ${Number(id)}
      `;
    } else {
      await sql`
        INSERT INTO case_studies (
          career_id, title, slug, categories, live_url, subtitle, challenge, execution, results, photos
        )
        VALUES (
          ${careerIdVal},
          ${title},
          ${slug},
          ${categoriesJson}::jsonb,
          ${live_url || null},
          ${subtitle || null},
          ${challenge || null},
          ${executionJson}::jsonb,
          ${resultsJson}::jsonb,
          ${photosJson}::jsonb
        )
      `;
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal menyimpan studi kasus.' }), {
      status: 500,
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized — Silakan login ulang.' }), {
      status: 401,
    });
  }

  try {
    const { id } = await request.json();
    await sql`DELETE FROM case_studies WHERE id = ${Number(id)}`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal menghapus studi kasus.' }), {
      status: 500,
    });
  }
};