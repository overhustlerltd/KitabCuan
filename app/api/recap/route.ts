import { NextResponse } from "next/server";
import { listOrders } from "@/lib/durianpay";
import { sendDiscordRecap } from "@/lib/discord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIB = 7 * 60 * 60 * 1000; // offset UTC+7

function formatRp(n: number): string {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export async function GET(request: Request) {
  // Auth: dari Vercel Cron (Authorization: Bearer CRON_SECRET) atau manual ?key=ACCESS_TOKEN_SECRET.
  const url = new URL(request.url);
  const auth = request.headers.get("authorization");
  const okCron = Boolean(process.env.CRON_SECRET) && auth === `Bearer ${process.env.CRON_SECRET}`;
  const okKey =
    Boolean(process.env.ACCESS_TOKEN_SECRET) &&
    url.searchParams.get("key") === process.env.ACCESS_TOKEN_SECRET;
  if (!okCron && !okKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Recap dijalankan SETELAH tengah malam & melaporkan HARI YANG BARU SELESAI (kemarin WIB).
  // Anti-telat: walau cron molor sampai lewat tengah malam, hari yang dilaporkan tetap benar.
  // ?day=today memaksa laporan hari berjalan (untuk tes manual).
  const oneDay = 24 * 60 * 60 * 1000;
  const wibNow = new Date(Date.now() + WIB);
  const startTodayWibMs = Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - WIB;
  const reportToday = url.searchParams.get("day") === "today";
  const startMs = reportToday ? startTodayWibMs : startTodayWibMs - oneDay;
  const endMs = reportToday ? Number.POSITIVE_INFINITY : startTodayWibMs;
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(reportToday ? Date.now() : startTodayWibMs - 1000));

  let orders;
  try {
    orders = await listOrders(100);
  } catch (err) {
    console.error("[recap] gagal ambil order:", err);
    return NextResponse.json({ ok: false, error: "list_failed" }, { status: 502 });
  }

  // Penjualan dalam rentang hari target, berdasarkan waktu BAYAR (paidAt), bukan created_at.
  const today = orders.filter((o) => {
    if (!o.isPaid) return false;
    const ts = o.paidAt || o.createdAt;
    if (!ts) return false;
    const t = new Date(ts).getTime();
    return t >= startMs && t < endMs;
  });
  const count = today.length;
  const total = today.reduce((s, o) => s + o.amount, 0);
  const lines = today.map((o) => `• ${o.name || "Buyer"} — ${formatRp(o.amount)}`);

  const disc = await sendDiscordRecap({ dateLabel, count, total: formatRp(total), lines });

  return NextResponse.json({
    ok: true,
    date: dateLabel,
    count,
    total,
    discordSent: disc.ok,
    discordReason: disc.reason,
  });
}
