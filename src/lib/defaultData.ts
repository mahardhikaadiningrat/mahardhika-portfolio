export const DEFAULT_CAREERS = [
  {
    id: 'kenak-medika',
    company: 'Kenak Medika Hospital',
    role: 'Head of Marketing',
    period: 'Oct 2025 – Present',
    summary:
      'Memimpin strategi komersial, digital marketing, sinergi Back Office & Front Liner, kemitraan B2B (asuransi, TPA, BPJS, PKS rumah sakit), serta peluncuran paket layanan klinis.',
    milestones: [
      '+26,59% YoY Revenue Growth (106,55% Target YTD)',
      '6 Mitra Asuransi/Global Assistance & 5 PKS Rumah Sakit',
      '6 Paket Layanan Klinis Diluncurkan',
    ],
    sort_order: 1,
  },
  {
    id: 'myth-wastra-palapa',
    company: 'CV Myth Wastra Palapa / Raditya Holding Company',
    role: 'Digital Marketing Specialist & Website Designer',
    period: 'Nov 2022 – Oct 2025',
    summary:
      'Merancang antarmuka website responsif, custom theme/plugin, SEO, serta mengelola Google Ads dan Meta Ads untuk Asta Medical Center, Mysa Clinic Bali, dan Myth the Label.',
    milestones: [
      '3 Brand Multi-Industri (Kesehatan, Klinik Estetika & E-Commerce)',
      'Optimasi SEO, GTM/Pixel & Performa Iklan',
    ],
    sort_order: 2,
  },
  {
    id: 'personal-project',
    company: 'Personal Project',
    role: 'Full-Stack Digital Marketer, Web Developer & Designer',
    period: 'Jan 2021 – Present',
    summary:
      'Membangun website mandiri, sistem digital, desain grafis, otomasi AI, dan konsultasi perencanaan digital untuk berbagai proyek dan klien.',
    milestones: [
      'Website & Sistem Digital Mandiri',
      'AI Automation, SEO/GEO & Creative Design',
    ],
    sort_order: 3,
  },
];

export const DEFAULT_STUDIES = [
  {
    slug: 'kenak-medika-growth-b2b-packages',
    career_id: 'kenak-medika',
    title: 'Akselerasi Pertumbuhan Kunjungan, Kemitraan B2B & Paket Layanan',
    subtitle: 'Executive Case Study — Kenak Medika Hospital (NDA-Safe Metrics)',
    categories: ['Marketing B2B', 'Data Analyst', 'Meta Ads', 'Google Ads', 'SEO', 'Event Marketing', 'Branding'],
    challenge:
      'Meningkatkan pertumbuhan pendapatan tahunan dan volume kunjungan pasien secara berkelanjutan serta memperluas jangkauan pasien asuransi/rujukan tanpa membuka informasi nominal finansial sensitif.',
    execution: [
      'Menjalin kerja sama asuransi & global assistance: Europ Assistance (Redion), Asuransi MAG, Asian Assistance, IPAC, Trippins Global, dan Medic Air.',
      'Menjalin PKS rujukan rumah sakit dengan RS BIH, RS BIMC, RS Kasih Ibu, RS Windu Usada, dan RS Payangan.',
      'Meluncurkan Paket Scalling, Bleaching, Kenak Peel Signature, Peeling 3x, Advance Laser Hemoroid, dan Paket Fisio.',
      'Menyelaraskan alur kerja tim Back Office dan Front Liner untuk mempercepat layanan dan menjaga retensi pasien.',
    ],
    results: [
      '+26,59% YoY Revenue Growth & 106,55% Target Achievement YTD',
      '+17,58% Kenaikan Kunjungan Bulanan (Januari ke Oktober)',
      'Rasio belanja marketing efisien (<0,8% terhadap pendapatan)',
    ],
    photos: [],
    video_url: '',
    live_url: '',
    infographics: [
      {
        title: 'Mitra Asuransi & Global Assistance (6)',
        items: ['Europ Assistance (Redion)', 'Asuransi MAG', 'Asian Assistance', 'IPAC', 'Trippins Global', 'Medic Air'],
      },
      {
        title: 'PKS Rujukan Rumah Sakit (5)',
        items: ['RS BIH', 'RS BIMC', 'RS Kasih Ibu', 'RS Windu Usada', 'RS Payangan'],
      },
      {
        title: 'Paket Layanan Diluncurkan (6)',
        items: ['Paket Scalling', 'Bleaching', 'Kenak Peel Signature', 'Peeling 3x', 'Advance Laser Hemoroid', 'Paket Fisio'],
      },
    ],
    table_data: {
      headers: ['Indikator Kinerja', 'Capaian', 'Keterangan'],
      rows: [
        ['Pertumbuhan Pendapatan YoY', '+26,59%', 'Puncak bulanan +50,71% (Oktober)'],
        ['Pencapaian Target YTD', '106,55%', 'Puncak bulanan 138,44% (Oktober)'],
        ['Kenaikan Kunjungan Bulanan', '+17,58%', 'Perbandingan awal ke akhir periode'],
        ['Porsi Pasien Lama (Repeat)', '70,5%', 'Didukung sinergi Back Office & Front Liner'],
        ['Rasio Budget Marketing', '<0,8%', 'Efisiensi biaya akuisisi terhadap omzet'],
      ],
    },
    chart_data: [
      { label: 'Jan', value: 8.26 },
      { label: 'Feb', value: 19.02 },
      { label: 'Mar', value: 27.55 },
      { label: 'Apr', value: 22.0 },
      { label: 'Mei', value: 42.13 },
      { label: 'Jun', value: 29.25 },
      { label: 'Jul', value: 23.03 },
      { label: 'Agu', value: 21.32 },
      { label: 'Sep', value: 24.13 },
      { label: 'Okt', value: 50.71 },
    ],
  },
  {
    slug: 'myth-wastra-palapa-digital-ecosystem',
    career_id: 'myth-wastra-palapa',
    title: 'Pengembangan Website Responsif & Kampanye Digital Multi-Brand',
    subtitle: 'Asta Medical Center • Mysa Clinic Bali • Myth the Label',
    categories: ['Website', 'SEO', 'Google Ads', 'Meta Ads', 'Copywritter', 'Branding'],
    challenge:
      'Membangun ekosistem website cepat, struktur SEO yang kuat, serta pelacakan konversi iklan yang akurat untuk tiga unit bisnis berbeda (klinik medis, klinik estetika, dan fashion e-commerce).',
    execution: [
      'Merancang antarmuka website responsif dan custom theme/plugin untuk meningkatkan pengalaman pengguna dan konversi.',
      'Mengonfigurasi Google Tag Manager, GA4, Meta Pixel, serta optimasi SEO on-page dan teknis.',
      'Mengelola dan mengoptimalkan kampanye Google Ads dan Meta Ads berbasis metrik konversi.',
    ],
    results: [
      'Peningkatan visibilitas pencarian organik dan kualitas trafik berbayar di ketiga brand.',
      'Alur tracking konversi end-to-end dari klik iklan hingga reservasi/pembelian.',
    ],
    photos: [],
    video_url: '',
    live_url: '',
    infographics: [],
    table_data: { headers: [], rows: [] },
    chart_data: [],
  },
  {
    slug: 'personal-project-web-ai-automation',
    career_id: 'personal-project',
    title: 'Arsitektur Web Modern, Otomasi AI & Konsultasi Digital',
    subtitle: 'Independent Web Development, AI Workflow & Brand Identity',
    categories: ['Website', 'AI Automation', 'SEO', 'Graphic Design', 'Branding'],
    challenge:
      'Menyediakan solusi website modern berkecepatan tinggi, sistem manajemen konten mandiri, serta otomasi produksi konten dan pemasaran digital.',
    execution: [
      'Membangun aplikasi web dengan Astro, Sanity CMS, Vercel, dan PostgreSQL serverless.',
      'Merancang alur kerja otomasi AI untuk riset konten SEO/GEO dan produksi aset visual.',
      'Menyusun strategi identitas visual dan perencanaan kampanye digital terpadu.',
    ],
    results: [
      'Performa website ringan dengan biaya operasional infrastruktur minimal.',
      'Efisiensi waktu produksi konten dan pengelolaan portofolio terpusat.',
    ],
    photos: [],
    video_url: '',
    live_url: '',
    infographics: [],
    table_data: { headers: [], rows: [] },
    chart_data: [],
  },
];
