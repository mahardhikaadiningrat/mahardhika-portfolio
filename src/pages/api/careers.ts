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
    const { id, company, role, period, sort_order, summary, milestones } = data;

    if (!company || !role || !period) {
      return new Response(
        JSON.stringify({ error: 'Perusahaan, Jabatan, dan Periode wajib diisi.' }),
        { status: 400 }
      );
    }

    const milestonesJson = JSON.stringify(Array.isArray(milestones) ? milestones : []);
    const sortVal = Number(sort_order || 1);

    if (id) {
      await sql`
        UPDATE careers
        SET
          company = ${company},
          role = ${role},
          period = ${period},
          sort_order = ${sortVal},
          summary = ${summary || null},
          milestones = ${milestonesJson}::jsonb
        WHERE id = ${Number(id)}
      `;
    } else {
      await sql`
        INSERT INTO careers (company, role, period, sort_order, summary, milestones)
        VALUES (${company}, ${role}, ${period}, ${sortVal}, ${summary || null}, ${milestonesJson}::jsonb)
      `;
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal menyimpan karier.' }), {
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
    await sql`DELETE FROM careers WHERE id = ${Number(id)}`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal menghapus karier.' }), {
      status: 500,
    });
  }
};