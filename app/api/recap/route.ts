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

  // Awal hari ini menurut WIB, dinyatakan dalam ms UTC.
  const wibNow = new Date(Date.now() + WIB);
  const startWibMs = Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - WIB;
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  let orders;
  try {
    orders = await listOrders(100);
  } catch (err) {
    console.error("[recap] gagal ambil order:", err);
    return NextResponse.json({ ok: false, error: "list_failed" }, { status: 502 });
  }

  const today = orders.filter(
    (o) => o.isPaid && o.createdAt && new Date(o.createdAt).getTime() >= startWibMs,
  );
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
