import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 5;

const requestSchema = z.object({
  jenisMenuUtama: z.string().trim().min(2).max(120),
  segmentPasar: z.enum(["keluarga-rumahan", "anak-muda", "kantoran", "semua"]),
  modalHarian: z.enum(["di-bawah-100rb", "100-300rb", "300-500rb", "500rb-plus"]),
  canalJualan: z.enum(["wa-ig", "pesan-antar", "titip-warung", "semua"]),
});

const SEGMENT_LABEL: Record<string, string> = {
  "keluarga-rumahan": "keluarga dan ibu rumah tangga",
  "anak-muda": "anak muda dan remaja",
  kantoran: "pekerja kantoran",
  semua: "semua kalangan",
};

const MODAL_LABEL: Record<string, string> = {
  "di-bawah-100rb": "di bawah Rp100.000 per hari",
  "100-300rb": "Rp100.000 - Rp300.000 per hari",
  "300-500rb": "Rp300.000 - Rp500.000 per hari",
  "500rb-plus": "di atas Rp500.000 per hari",
};

const CANAL_LABEL: Record<string, string> = {
  "wa-ig": "WhatsApp & Instagram",
  "pesan-antar": "pesan antar / GoFood / ShopeeFood",
  "titip-warung": "titip di warung / kantin sekitar",
  semua: "semua cara sekaligus",
};

const SYSTEM_PROMPT = `Kamu adalah mentor bisnis kuliner rumahan dari KitabCuan — santai, hangat, dan selalu kasih saran yang praktis.
Tugasmu: menyusun rencana menu jualan 7 hari untuk penjual makanan rumahan berdasarkan input pengguna.

ATURAN OUTPUT:
- Balas HANYA dengan JSON valid, tanpa teks pembuka, tanpa penjelasan, tanpa markdown code fence.
- Ikuti schema persis seperti ini:
{
  "days": [
    { "day": 1, "title": "tema/fokus hari itu", "menu": ["nama menu 1", "nama menu 2", "nama menu 3"], "tips": "tips spesifik untuk hari itu (promosi, packaging, dll)" }
  ]
}
- Harus ada tepat 7 entri di "days", day 1 sampai 7.
- Setiap hari punya 2-3 menu yang realistis dibuat dengan modal yang tersedia.
- Tips harus actionable dan spesifik (bukan saran umum seperti "promosikan produkmu").
- Pertimbangkan variasi menu supaya tidak bosan tapi tetap efisien dari sisi bahan.
- Gunakan Bahasa Indonesia santai sehari-hari, bukan bahasa formal.`;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, MAX_REQUESTS_PER_MINUTE)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Tunggu sebentar sebelum coba lagi ya." },
      { status: 429 },
    );
  }

  let parsedInput;
  try {
    const body = await request.json();
    parsedInput = requestSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Data yang dikirim tidak valid. Coba isi ulang form-nya." },
      { status: 400 },
    );
  }

  const userPrompt = `Buatkan rencana menu jualan 7 hari untuk usaha makanan rumahan berikut:
- Jenis masakan yang dijual: ${parsedInput.jenisMenuUtama}
- Target pembeli: ${SEGMENT_LABEL[parsedInput.segmentPasar]}
- Modal belanja harian: ${MODAL_LABEL[parsedInput.modalHarian]}
- Cara jualan: ${CANAL_LABEL[parsedInput.canalJualan]}`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Tidak ada teks di respons AI.");
    }

    const plan = extractJson<{ days: { day: number; title: string; menu: string[]; tips: string }[] }>(
      textBlock.text,
    );

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("[rencana-menu] failed:", error);
    return NextResponse.json(
      { error: "Gagal menyusun rencana menu. Coba lagi sebentar ya." },
      { status: 502 },
    );
  }
}
