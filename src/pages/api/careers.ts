import type { APIRoute } from 'astro';
import { sql } from '../../lib/db';
import { createSessionToken, getAdminCredentials } from './auth';

export const prerender = false;

function isAuthorized(request: Request, cookies: any): boolean {
  const { validUser, validPass } = getAdminCredentials();
  if (!validPass) return false;

  const expectedToken = createSessionToken(validUser, validPass);
  const sessionCookie = cookies.get('admin_session')?.value;
  if (sessionCookie && sessionCookie === expectedToken) {
    return true;
  }

  const headerPwd = request.headers.get('x-admin-password') || '';
  return headerPwd === validPass;
}

function normalizeMilestones(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // Lanjut pecah per baris jika gagal parse JSON
      }
    }
    return trimmed
      .split(/\r?\n+/)
      .map((line) => line.replace(/^[\s•\-\*\u2022\d\.]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

export const GET: APIRoute = async () => {
  try {
    const rows = await sql`SELECT * FROM careers ORDER BY sort_order ASC`;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Gagal memuat data karier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const {
      id,
      company = '',
      role = '',
      period = '',
      summary = '',
      sort_order = 1,
    } = body;

    const cleanMilestones = normalizeMilestones(body.milestones);
    const milestonesJson = JSON.stringify(cleanMilestones);
    const sortOrderNum = Number(sort_order) || 1;

    if (id) {
      const updated = await sql`
        UPDATE careers
        SET
          company = ${String(company).trim()},
          role = ${String(role).trim()},
          period = ${String(period).trim()},
          summary = ${String(summary).trim()},
          milestones = ${milestonesJson}::jsonb,
          sort_order = ${sortOrderNum},
          en_data = NULL
        WHERE id = ${id}
        RETURNING *
      `;
      return new Response(JSON.stringify(updated[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const created = await sql`
        INSERT INTO careers (company, role, period, summary, milestones, sort_order)
        VALUES (
          ${String(company).trim()},
          ${String(role).trim()},
          ${String(period).trim()},
          ${String(summary).trim()},
          ${milestonesJson}::jsonb,
          ${sortOrderNum}
        )
        RETURNING *
      `;
      return new Response(JSON.stringify(created[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    console.error('[API Careers] Error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menyimpan karier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let targetId = url.searchParams.get('id');
    if (!targetId) {
      const body = await request.json().catch(() => ({}));
      targetId = body?.id;
    }

    if (!targetId) {
      return new Response(JSON.stringify({ error: 'ID karier tidak ditemukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await sql`DELETE FROM careers WHERE id = ${targetId}`;
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[API Careers] Delete Error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Gagal menghapus karier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};