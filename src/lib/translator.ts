import { sql } from './db';

function getApiKey(): string {
  return (import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
}

function extractJson(raw: string): any {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Respons AI bukan JSON valid');
  return JSON.parse(raw.slice(start, end + 1));
}

async function generateTranslation(prompt: string, timeoutMs = 20000) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY tidak ditemukan di file .env');

  const models = ['gemini-3.8-flash', 'gemini-3-flash-preview', 'gemini-flash-latest'];
  let lastError = '';

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return extractJson(text);
      }

      lastError = data?.error?.message || `HTTP ${res.status}`;
      if (res.status !== 404) throw new Error(lastError);
    } catch (err: any) {
      lastError = err?.message || String(err);
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        throw new Error(`Koneksi ke Gemini timeout (>${timeoutMs / 1000} detik)`);
      }
    }
  }

  throw new Error(lastError || 'Gagal memanggil Gemini API');
}

export function getActiveLang(url: URL, cookies: any): 'id' | 'en' {
  const queryLang = url.searchParams.get('lang');
  if (queryLang === 'en' || queryLang === 'id') {
    cookies.set('site_lang', queryLang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return queryLang;
  }
  const cookieLang = cookies.get('site_lang')?.value;
  return cookieLang === 'en' ? 'en' : 'id';
}

export async function getTranslatedCareersBatch(careers: any[]) {
  const uncached = careers.filter((c) => !c.en_data || !c.en_data.summary);

  if (uncached.length > 0) {
    try {
      const batchInput: Record<string, any> = {};
      for (const c of uncached) {
        batchInput[String(c.id)] = {
          role: c.role || '',
          period: c.period || '',
          summary: c.summary || '',
          milestones: Array.isArray(c.milestones) ? c.milestones : [],
        };
      }

      const translatedMap = await generateTranslation(
        `Translate each career entry in this JSON object from Indonesian to natural, executive-grade English. Keep the exact same top-level ID keys and inner keys (role, period, summary, milestones). Preserve company names and metrics. Return ONLY valid JSON:\n${JSON.stringify(batchInput)}`,
        20000
      );

      for (const c of uncached) {
        const item = translatedMap?.[String(c.id)];
        if (item && (item.summary || item.role)) {
          c.en_data = item;
          await sql`UPDATE careers SET en_data = ${JSON.stringify(item)}::jsonb WHERE id = ${c.id}`;
        }
      }
    } catch (err: any) {
      console.error('[Translator] Batch careers gagal:', err?.message || err);
    }
  }

  return careers.map((c) => (c.en_data && c.en_data.summary ? { ...c, ...c.en_data } : c));
}

// Proses maksimal 3 studi kasus per batch agar respons cepat & tidak timeout
export async function getTranslatedStudiesBatch(studies: any[]) {
  const uncached = studies.filter((s) => !s.en_data || !s.en_data.title);
  const chunkSize = 3;

  for (let i = 0; i < uncached.length; i += chunkSize) {
    const chunk = uncached.slice(i, i + chunkSize);
    try {
      const batchInput: Record<string, any> = {};
      for (const s of chunk) {
        const photos = Array.isArray(s.photos) ? s.photos : [];
        batchInput[String(s.id)] = {
          title: s.title || '',
          subtitle: s.subtitle || '',
          challenge: s.challenge || '',
          execution: Array.isArray(s.execution) ? s.execution : [],
          results: Array.isArray(s.results) ? s.results : [],
          captions: photos.map((p: any) => p.caption || ''),
        };
      }

      const translatedMap = await generateTranslation(
        `Translate each case study in this JSON object from Indonesian to natural, executive-grade English. Keep the exact same top-level ID keys and inner keys (title, subtitle, challenge, execution, results, captions). Preserve brand names and metrics. Return ONLY valid JSON:\n${JSON.stringify(batchInput)}`,
        25000
      );

      for (const s of chunk) {
        const item = translatedMap?.[String(s.id)];
        if (item && item.title) {
          const originalPhotos = Array.isArray(s.photos) ? s.photos : [];
          const mergedPhotos = originalPhotos.map((p: any, idx: number) => ({
            url: p.url,
            caption: Array.isArray(item.captions) && item.captions[idx] ? item.captions[idx] : p.caption || '',
          }));
          const finalEnData = {
            title: item.title,
            subtitle: item.subtitle || s.subtitle,
            challenge: item.challenge || s.challenge,
            execution: Array.isArray(item.execution) ? item.execution : s.execution,
            results: Array.isArray(item.results) ? item.results : s.results,
            photos: mergedPhotos,
          };
          s.en_data = finalEnData;
          await sql`UPDATE case_studies SET en_data = ${JSON.stringify(finalEnData)}::jsonb WHERE id = ${s.id}`;
        }
      }
    } catch (err: any) {
      console.error(`[Translator] Chunk studies (${i}..${i + chunk.length}) gagal:`, err?.message || err);
    }
  }

  return studies.map((s) => (s.en_data && s.en_data.title ? { ...s, ...s.en_data } : s));
}

export async function getTranslatedCareer(career: any) {
  const [res] = await getTranslatedCareersBatch([career]);
  return res;
}

export async function getTranslatedStudy(study: any) {
  const [res] = await getTranslatedStudiesBatch([study]);
  return res;
}