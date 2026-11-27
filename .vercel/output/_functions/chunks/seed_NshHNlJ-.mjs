import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as sql } from "./db_Cd0JRjI_.mjs";
// src/pages/api/seed.ts
var seed_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS careers (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        period TEXT NOT NULL,
        summary TEXT NOT NULL,
        milestones JSONB DEFAULT '[]'::jsonb,
        sort_order INT DEFAULT 1
      )
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS case_studies (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        career_id TEXT REFERENCES careers(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        subtitle TEXT,
        categories TEXT[] NOT NULL DEFAULT '{}',
        challenge TEXT,
        execution TEXT[] DEFAULT '{}',
        results TEXT[] DEFAULT '{}',
        photos JSONB DEFAULT '[]'::jsonb,
        video_url TEXT,
        live_url TEXT,
        infographics JSONB DEFAULT '[]'::jsonb,
        table_data JSONB DEFAULT '{}'::jsonb,
        chart_data JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
		await sql`
      INSERT INTO careers (id, company, role, period, summary, milestones, sort_order)
      VALUES
        ('kenak-medika', 'Kenak Medika Hospital', 'Head of Marketing', 'Oct 2025 – Present',
         'Memimpin strategi komersial, digital marketing, sinergi Back Office & Front Liner, kemitraan B2B (asuransi, TPA, BPJS, PKS rumah sakit), serta peluncuran paket layanan klinis.',
         '["+26,59% YoY Revenue Growth (106,55% Target YTD)", "6 Mitra Asuransi/Global Assistance & 5 PKS Rumah Sakit", "6 Paket Layanan Klinis Diluncurkan"]'::jsonb, 1),
        ('myth-wastra-palapa', 'CV Myth Wastra Palapa / Raditya Holding Company', 'Digital Marketing Specialist & Website Designer', 'Nov 2022 – Oct 2025',
         'Merancang antarmuka website responsif, custom theme/plugin, SEO, serta mengelola Google Ads dan Meta Ads untuk Asta Medical Center, Mysa Clinic Bali, dan Myth the Label.',
         '["3 Brand Multi-Industri (Kesehatan, Klinik Estetika & E-Commerce)", "Optimasi SEO, GTM/Pixel & Performa Iklan"]'::jsonb, 2),
        ('personal-project', 'Personal Project', 'Full-Stack Digital Marketer, Web Developer & Designer', 'Jan 2021 – Present',
         'Membangun website mandiri, sistem digital, desain grafis, otomasi AI, dan konsultasi perencanaan digital untuk berbagai proyek dan klien.',
         '["Website & Sistem Digital Mandiri", "AI Automation, SEO/GEO & Creative Design"]'::jsonb, 3)
      ON CONFLICT (id) DO NOTHING
    `;
		await sql`
      INSERT INTO case_studies (
        slug, career_id, title, subtitle, categories,
        challenge, execution, results, infographics, table_data, chart_data
      )
      VALUES (
        'kenak-medika-growth-b2b-packages',
        'kenak-medika',
        'Akselerasi Pertumbuhan Kunjungan, Kemitraan B2B & Paket Layanan',
        'Executive Case Study — Kenak Medika Hospital (NDA-Safe Metrics)',
        ARRAY['Marketing B2B', 'Data Analyst', 'Meta Ads', 'Google Ads', 'SEO', 'Event Marketing', 'Branding'],
        'Meningkatkan pertumbuhan pendapatan tahunan dan volume kunjungan pasien secara berkelanjutan serta memperluas jangkauan pasien asuransi/rujukan tanpa membuka informasi nominal finansial sensitif.',
        ARRAY[
          'Menjalin kerja sama asuransi & global assistance: Europ Assistance (Redion), Asuransi MAG, Asian Assistance, IPAC, Trippins Global, dan Medic Air.',
          'Menjalin PKS rujukan rumah sakit dengan RS BIH, RS BIMC, RS Kasih Ibu, RS Windu Usada, dan RS Payangan.',
          'Meluncurkan Paket Scalling, Bleaching, Kenak Peel Signature, Peeling 3x, Advance Laser Hemoroid, dan Paket Fisio.',
          'Menyelaraskan alur kerja tim Back Office dan Front Liner untuk mempercepat layanan dan menjaga retensi pasien.'
        ],
        ARRAY[
          '+26,59% YoY Revenue Growth & 106,55% Target Achievement YTD',
          '+17,58% Kenaikan Kunjungan Bulanan (Januari ke Oktober)',
          'Rasio belanja marketing efisien (<0,8% terhadap pendapatan)'
        ],
        '[
          {"title": "Mitra Asuransi & Global Assistance (6)", "items": ["Europ Assistance (Redion)", "Asuransi MAG", "Asian Assistance", "IPAC", "Trippins Global", "Medic Air"]},
          {"title": "PKS Rujukan Rumah Sakit (5)", "items": ["RS BIH", "RS BIMC", "RS Kasih Ibu", "RS Windu Usada", "RS Payangan"]},
          {"title": "Paket Layanan Diluncurkan (6)", "items": ["Paket Scalling", "Bleaching", "Kenak Peel Signature", "Peeling 3x", "Advance Laser Hemoroid", "Paket Fisio"]}
        ]'::jsonb,
        '{
          "headers": ["Indikator Kinerja", "Capaian", "Keterangan"],
          "rows": [
            ["Pertumbuhan Pendapatan YoY", "+26,59%", "Puncak bulanan +50,71% (Oktober)"],
            ["Pencapaian Target YTD", "106,55%", "Puncak bulanan 138,44% (Oktober)"],
            ["Kenaikan Kunjungan Bulanan", "+17,58%", "Perbandingan awal ke akhir periode"],
            ["Porsi Pasien Lama (Repeat)", "70,5%", "Didukung sinergi Back Office & Front Liner"],
            ["Rasio Budget Marketing", "<0,8%", "Efisiensi biaya akuisisi terhadap omzet"]
          ]
        }'::jsonb,
        '[
          {"label": "Jan", "value": 8.26},
          {"label": "Feb", "value": 19.02},
          {"label": "Mar", "value": 27.55},
          {"label": "Apr", "value": 22.00},
          {"label": "Mei", "value": 42.13},
          {"label": "Jun", "value": 29.25},
          {"label": "Jul", "value": 23.03},
          {"label": "Agu", "value": 21.32},
          {"label": "Sep", "value": 24.13},
          {"label": "Okt", "value": 50.71}
        ]'::jsonb
      )
      ON CONFLICT (slug) DO NOTHING
    `;
		return new Response(JSON.stringify({
			ok: true,
			message: "Data berhasil masuk ke database!"
		}), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({
			ok: false,
			error: err?.message || String(err)
		}), { status: 500 });
	}
};
// \0virtual:astro:page:src/pages/api/seed@_@ts
var page = () => seed_exports;
export { page };
