import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { isAdminAuthorized } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const careers = await sql`SELECT * FROM careers ORDER BY sort_order ASC`;
    return new Response(JSON.stringify(careers), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal memuat data karier.' }), {
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
    const { id, company, role, period, sort_order, summary, milestones } = body;

    if (!company || !role || !period) {
      return new Response(
        JSON.stringify({ error: 'Perusahaan, Jabatan, dan Periode wajib diisi.' }),
        { status: 400 }
      );
    }

    const cleanMilestones = Array.isArray(milestones) ? milestones : [];
    const orderNum = Number(sort_order || 1);

    if (id) {
      await sql`
        UPDATE careers
        SET
          company = ${company},
          role = ${role},
          period = ${period},
          sort_order = ${orderNum},
          summary = ${summary || ''},
          milestones = ${cleanMilestones},
          en_data = NULL
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO careers (company, role, period, sort_order, summary, milestones)
        VALUES (${company}, ${role}, ${period}, ${orderNum}, ${summary || ''}, ${cleanMilestones})
      `;
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menyimpan karier.' }), {
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
      return new Response(JSON.stringify({ error: 'ID karier tidak ditemukan.' }), { status: 400 });
    }

    await sql`UPDATE case_studies SET career_id = NULL WHERE career_id = ${id}`;
    await sql`DELETE FROM careers WHERE id = ${id}`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menghapus karier.' }), {
      status: 500,
    });
  }
};