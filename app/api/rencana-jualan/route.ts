import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 5;

const requestSchema = z.object({
  jualanApa: z.string().trim().min(2).max(120),
  caraJualan: z.enum(["wa-ig", "sekitar-rumah", "marketplace", "semua"]),
  statusJualan: z.enum(["belum-ada", "sudah-ada"]),
  budgetPromosi: z.enum(["belum-ada", "50-100rb", "100-300rb", "300rb-plus"]),
});

const CARA_JUALAN_LABEL: Record<string, string> = {
  "wa-ig": "WhatsApp & Instagram",
  "sekitar-rumah": "Dari mulut ke mulut di sekitar rumah",
  marketplace: "Marketplace (Shopee/Tokopedia)",
  semua: "Semua cara sekaligus",
};

const STATUS_LABEL: Record<string, string> = {
  "belum-ada": "belum pernah jualan sama sekali",
  "sudah-ada": "sudah pernah jualan ke beberapa orang",
};

const BUDGET_LABEL: Record<string, string> = {
  "belum-ada": "belum ada budget promosi sama sekali",
  "50-100rb": "Rp50.000 - Rp100.000",
  "100-300rb": "Rp100.000 - Rp300.000",
  "300rb-plus": "lebih dari Rp300.000",
};

const SYSTEM_PROMPT = `Kamu adalah mentor bisnis kuliner rumahan dari KitabCuan — santai, hangat, dan selalu kasih langkah konkret.
Tugasmu: menyusun rencana 7 hari untuk mulai dapat cuan pertama dari jualan makanan berdasarkan input pengguna, yang bisa langsung dikerjakan tanpa mikir ulang.

ATURAN OUTPUT:
- Balas HANYA dengan JSON valid, tanpa teks pembuka, tanpa penjelasan, tanpa markdown code fence.
- Ikuti schema persis seperti ini:
{
  "days": [
    { "day": 1, "title": "judul singkat fokus hari itu", "actions": ["aksi konkret 1", "aksi konkret 2", "aksi konkret 3"] }
  ]
}
- Harus ada tepat 7 entri di "days", day 1 sampai 7.
- Setiap hari punya 3-4 aksi konkret, actionable, dan spesifik untuk bisnis kuliner (bukan saran umum seperti "promosikan produkmu").
- Aksi harus relevan dengan jualan makanan: misalnya bikin stok, foto produk, kirim sample, posting di WA/IG, dll.
- Gunakan Bahasa Indonesia santai sehari-hari, bukan bahasa formal/korporat.`;

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

  const userPrompt = `Buatkan rencana 7 hari untuk mulai dapat cuan dari usaha berikut:
- Mau cuan dari: ${parsedInput.jualanApa}
- Cara jualan: ${CARA_JUALAN_LABEL[parsedInput.caraJualan]}
- Status saat ini: ${STATUS_LABEL[parsedInput.statusJualan]}
- Budget promosi: ${BUDGET_LABEL[parsedInput.budgetPromosi]}`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Tidak ada teks di respons AI.");
    }

    const plan = extractJson<{ days: { day: number; title: string; actions: string[] }[] }>(
      textBlock.text,
    );

    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error("[rencana-jualan] failed:", error);
    return NextResponse.json(
      { error: "Gagal menyusun rencana jualan. Coba lagi sebentar ya." },
      { status: 502 },
    );
  }
}
