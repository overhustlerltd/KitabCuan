# KitabCuan

Landing page + micro-SaaS addon (Tools AI) untuk **KitabCuan** — ebook panduan digital buat orang yang mau mulai cari penghasilan tambahan dari nol. Dibangun dengan Next.js 14 (App Router), TypeScript, dan Tailwind CSS.

## Struktur Proyek

- `app/(marketing)/` — landing page
- `app/tools/` — dashboard Tools AI (`/tools`)
- `app/api/` — API routes yang memanggil Anthropic API
- `components/ui/` — komponen dasar reusable (Button, Card, Input, Select, dst)
- `components/sections/` — section-section landing page
- `components/tools/` — form generator & chat assistant di halaman Tools AI
- `lib/` — utils, konstanta/copy, dan helper (Anthropic client, rate limiter)

## Instalasi

```bash
npm install
```

## Environment Variable

Salin `.env.example` ke `.env` lalu isi:

```bash
cp .env.example .env
```

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Ya | API key dari [console.anthropic.com](https://console.anthropic.com/settings/keys). Dipakai oleh `app/api/rencana-jualan`, `app/api/tulisan-promosi`, `app/api/nama-usaha`, dan `app/api/chat`. |
| `NEXT_PUBLIC_SITE_URL` | Tidak | Domain production, dipakai untuk generate `sitemap.xml`. Default ke `https://kitabcuan.com` kalau tidak diisi. |

Tanpa `ANTHROPIC_API_KEY` yang valid, keempat fitur AI di halaman `/tools` akan menampilkan pesan error yang ramah (bukan crash) — sisa aplikasi tetap jalan normal.

## Menjalankan Secara Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build Production

```bash
npm run build
npm run start
```

## Catatan Teknis

- Rate limiting pada API routes berbasis in-memory per-IP (lihat `lib/rate-limit.ts`) — cukup untuk skala kecil, reset saat server restart. Untuk trafik production yang lebih besar, ganti dengan shared store (mis. Upstash Redis) atau firewall di level platform.
- Model yang dipakai: `claude-sonnet-4-6` (lihat `lib/anthropic.ts`).
