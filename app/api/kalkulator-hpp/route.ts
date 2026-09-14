import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/anthropic";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_MINUTE = 5;

const bahanSchema = z.object({
  nama: z.string().trim().min(1),
  harga: z.number().min(0),
  satuan: z.string().trim().min(1),
});

const requestSchema = z.object({
  namaProduk: z.string().trim().min(2).max(120),
  bahan: z.array(bahanSchema).min(1).max(20),
  biayaGas: z.number().min(0).default(0),
  biayaKemasan: z.number().min(0).default(0),
  biayaLainnya: z.number().min(0).default(0),
  jumlahPorsi: z.number().min(1),
  marginKeuntungan: z.number().min(1).max(500),
});

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

  // Hitung HPP secara matematis
  const totalBiayaBahan = parsedInput.bahan.reduce((sum, b) => sum + b.harga, 0);
  const totalBiayaOperasional =
    parsedInput.biayaGas + parsedInput.biayaKemasan + parsedInput.biayaLainnya;
  const totalHpp = totalBiayaBahan + totalBiayaOperasional;
  const hppPerPorsi = Math.ceil(totalHpp / parsedInput.jumlahPorsi);
  const hargaJualRekomendasi = Math.ceil(hppPerPorsi * (1 + parsedInput.marginKeuntungan / 100));
  const keuntunganPerPorsi = hargaJualRekomendasi - hppPerPorsi;

  // Break-even point: asumsi biaya tetap harian = biaya operasional, cari jumlah porsi agar balik modal
  const breakEvenPorsi =
    totalBiayaOperasional > 0
      ? Math.ceil(totalBiayaOperasional / keuntunganPerPorsi)
      : 0;

  // Minta AI untuk analisis/rekomendasi singkat
  const SYSTEM_PROMPT = `Kamu adalah konsultan bisnis kuliner rumahan dari KitabCuan — santai dan lugas.
Berikan analisis singkat (2-3 kalimat, Bahasa Indonesia santai) berdasarkan data HPP yang diberikan.
Sampaikan apakah harga jual sudah kompetitif, saran rounding harga agar lebih menarik (misal Rp15.000 lebih bagus dari Rp14.200), dan satu tips praktis untuk meningkatkan keuntungan.
Balas HANYA dengan JSON: { "analisis": "teks analisis di sini" }. Tanpa teks lain, tanpa markdown code fence.`;

  const userPrompt = `Produk: ${parsedInput.namaProduk}
HPP per porsi: Rp${hppPerPorsi}
Harga jual rekomendasi (margin ${parsedInput.marginKeuntungan}%): Rp${hargaJualRekomendasi}
Keuntungan per porsi: Rp${keuntunganPerPorsi}
Jumlah porsi per batch: ${parsedInput.jumlahPorsi}`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const analisisJson =
      textBlock && textBlock.type === "text"
        ? extractJson<{ analisis: string }>(textBlock.text)
        : { analisis: "Harga jual sudah terhitung, pastikan tambahkan sedikit batas atas agar ada ruang negosiasi." };

    return NextResponse.json({
      data: {
        totalBiayaBahan,
        totalBiayaOperasional,
        totalHpp,
        hppPerPorsi,
        hargaJualRekomendasi,
        keuntunganPerPorsi,
        breakEvenPorsi,
        analisis: analisisJson.analisis,
      },
    });
  } catch (error) {
    console.error("[kalkulator-hpp] failed:", error);
    // Fallback: kembalikan hasil tanpa analisis AI
    return NextResponse.json({
      data: {
        totalBiayaBahan,
        totalBiayaOperasional,
        totalHpp,
        hppPerPorsi,
        hargaJualRekomendasi,
        keuntunganPerPorsi,
        breakEvenPorsi,
        analisis: "Perhitungan berhasil. Coba bulatkan harga jual ke angka yang lebih mudah diingat pembeli.",
      },
    });
  }
}
