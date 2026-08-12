import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 5;

const requestSchema = z.object({
  namaProduk: z.string().trim().min(2).max(120),
  targetPembeli: z.enum(["ibu-ibu", "anak-muda", "siapa-saja", "kantoran"]),
  platform: z.enum(["wa-status", "ig-feed-story", "facebook", "tiktok"]),
});

const TARGET_LABEL: Record<string, string> = {
  "ibu-ibu": "ibu-ibu sekitar rumah",
  "anak-muda": "anak muda & remaja",
  "siapa-saja": "siapa saja",
  kantoran: "orang kantoran",
};

const PLATFORM_LABEL: Record<string, string> = {
  "wa-status": "status WhatsApp / chat",
  "ig-feed-story": "Instagram feed & story",
  facebook: "Facebook",
  tiktok: "TikTok",
};

const SYSTEM_PROMPT = `Kamu adalah asisten marketing KitabCuan untuk penjual makanan rumahan Indonesia — santai dan persuasif tanpa lebay.
Tugasmu: membuat materi promosi siap pakai untuk produk makanan/minuman berdasarkan input pengguna.

ATURAN OUTPUT:
- Balas HANYA dengan JSON valid, tanpa teks pembuka, tanpa markdown code fence.
- Ikuti schema persis:
{
  "caption": "satu caption makanan siap pakai, 2-4 kalimat, ada deskripsi makanan yang menggugah selera dan call to action",
  "storyIdeas": ["ide story/status makanan 1", "ide story/status makanan 2", "ide story/status makanan 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "chatTemplate": "template balasan chat untuk calon pembeli yang nanya-nanya soal makanan, ramah dan meyakinkan"
}
- Tepat 3 ide story dan 5 hashtag relevan dengan kuliner/makanan (hashtag pakai simbol #, tanpa spasi).
- Sesuaikan gaya bahasa dengan target pembeli dan platform yang dipilih.
- Caption harus menggugah selera — gunakan kata-kata yang bikin orang lapar dan penasaran.
- Bahasa Indonesia santai sehari-hari.`;

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

  const userPrompt = `Buatkan materi promosi untuk produk/jasa berikut:
- Nama produk/jasa: ${parsedInput.namaProduk}
- Target pembeli: ${TARGET_LABEL[parsedInput.targetPembeli]}
- Platform posting: ${PLATFORM_LABEL[parsedInput.platform]}`;

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

    const promo = extractJson<{
      caption: string;
      storyIdeas: string[];
      hashtags: string[];
      chatTemplate: string;
    }>(textBlock.text);

    return NextResponse.json({ data: promo });
  } catch (error) {
    console.error("[tulisan-promosi] failed:", error);
    return NextResponse.json(
      { error: "Gagal membuat tulisan promosi. Coba lagi sebentar ya." },
      { status: 502 },
    );
  }
}
