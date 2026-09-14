import { z } from "zod";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 15;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `Kamu adalah mentor bisnis KitabCuan — asisten yang ramah dan gampang diajak ngobrol untuk pemula yang mau mulai dan mengembangkan usaha dari nol di Indonesia.
Jawab singkat-padat (2-5 kalimat, kecuali user minta detail lebih), pakai Bahasa Indonesia santai sehari-hari — bukan bahasa formal/korporat.
Fokus bahasan: cara memilih ide bisnis, mulai usaha dengan modal kecil, hitung modal & harga jual, cara dapat pembeli pertama, strategi jualan online (WA, IG, marketplace, TikTok) maupun offline, bikin konten & promosi, dan mengembangkan bisnis.
Kalau ada yang tanya di luar topik itu, arahkan dengan sopan balik ke topik membangun dan menjalankan bisnis.
Jangan pernah janjikan keuntungan pasti atau cuan instan — kasih ekspektasi yang realistis dan jujur soal usaha yang dibutuhkan.`;

function extractTextDelta(event: unknown): string | null {
  if (
    typeof event === "object" &&
    event !== null &&
    "type" in event &&
    (event as { type: string }).type === "content_block_delta" &&
    "delta" in event
  ) {
    const delta = (event as { delta: { type: string; text?: string } }).delta;
    if (delta.type === "text_delta" && typeof delta.text === "string") {
      return delta.text;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, MAX_REQUESTS_PER_MINUTE)) {
    return new Response("Terlalu banyak permintaan. Tunggu sebentar sebelum coba lagi ya.", {
      status: 429,
    });
  }

  let parsed;
  try {
    const body = await request.json();
    parsed = requestSchema.parse(body);
  } catch {
    return new Response("Data yang dikirim tidak valid.", { status: 400 });
  }

  const claudeStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: parsed.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const iterator = claudeStream[Symbol.asyncIterator]();

  // Consume the first event outside the ReadableStream so an immediate upstream
  // failure (bad API key, network error) returns a real error response instead
  // of silently closing the connection after headers are already committed.
  let firstResult;
  try {
    firstResult = await iterator.next();
  } catch (error) {
    console.error("[chat] failed before first event:", error);
    return new Response("Asisten sedang tidak bisa menjawab. Coba lagi ya.", { status: 502 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!firstResult.done) {
          const text = extractTextDelta(firstResult.value);
          if (text) controller.enqueue(encoder.encode(text));
        }

        while (true) {
          const { done, value } = await iterator.next();
          if (done) break;
          const text = extractTextDelta(value);
          if (text) controller.enqueue(encoder.encode(text));
        }

        controller.close();
      } catch (error) {
        console.error("[chat] stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
