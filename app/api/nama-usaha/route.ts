import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 5;

const requestSchema = z.object({
  jenisJualan: z.string().trim().min(2).max(120),
  kesanNama: z.enum(["kekinian-gaul", "hangat-rumahan", "mewah-berkelas", "lucu-unik"]),
  kataYangDiinginkan: z.string().trim().max(60).optional(),
});

const KESAN_LABEL: Record<string, string> = {
  "kekinian-gaul": "kekinian & gaul",
  "hangat-rumahan": "hangat & rumahan",
  "mewah-berkelas": "mewah & berkelas",
  "lucu-unik": "lucu & unik",
};

const SYSTEM_PROMPT = `Kamu adalah asisten branding KitabCuan untuk penjual makanan rumahan Indonesia — kreatif dan paham selera pasar kuliner lokal.
Tugasmu: mengusulkan nama brand kuliner/makanan berdasarkan input pengguna.

ATURAN OUTPUT:
- Balas HANYA dengan JSON valid, tanpa teks pembuka, tanpa markdown code fence.
- Ikuti schema persis:
{
  "names": [
    { "name": "nama usaha kuliner", "tagline": "tagline singkat 3-6 kata", "reason": "alasan singkat 1 kalimat kenapa nama ini cocok untuk usaha makanan ini" }
  ]
}
- Tepat 5 pilihan nama, semuanya berbeda gaya satu sama lain (jangan variasi kecil dari nama yang sama).
- Nama harus mudah diingat, enak diucapkan, dan cocok dipakai di Instagram, WhatsApp, GoFood, dan marketplace.
- Pertimbangkan nama yang berkesan lezat, hangat, atau bikin penasaran sesuai dengan jenis makanannya.
- Bahasa Indonesia santai sehari-hari, boleh mix dengan kata Inggris atau Jawa jika terasa natural.`;

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

  const userPrompt = `Buatkan 5 pilihan nama brand untuk:
- Jenis usaha/produk: ${parsedInput.jenisJualan}
- Kesan nama yang diinginkan: ${KESAN_LABEL[parsedInput.kesanNama]}
${parsedInput.kataYangDiinginkan ? `- Kata yang ingin dipakai: ${parsedInput.kataYangDiinginkan}` : ""}`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Tidak ada teks di respons AI.");
    }

    const names = extractJson<{ names: { name: string; tagline: string; reason: string }[] }>(
      textBlock.text,
    );

    return NextResponse.json({ data: names });
  } catch (error) {
    console.error("[nama-usaha] failed:", error);
    return NextResponse.json(
      { error: "Gagal mencari ide nama usaha. Coba lagi sebentar ya." },
      { status: 502 },
    );
  }
}
