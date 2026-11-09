import { NextResponse } from "next/server";
import { getOrderPayment, listOrders, type PaymentInfo } from "@/lib/durianpay";
import { sendDiscordRecap } from "@/lib/discord";
import { isKitabCuanRef, methodLabel } from "@/lib/purchase-notif";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIB = 7 * 60 * 60 * 1000; // offset UTC+7

// Kurs untuk padanan dolar di ringkasan. Hanya untuk gambaran kasar; bisa
// ditimpa lewat env kalau kursnya bergeser jauh.
const IDR_PER_USD = Number(process.env.IDR_PER_USD || "18370");

// Nama ringkas ala rincian produk Fate Face (tanpa prefix merek, biar tidak wrap).
const PRODUCT_NAME = "Paket Usaha Sumber Cuan";

// Format ala ringkasan Fate Face: "Rp 197.000" (pakai spasi sesudah Rp).
function rpSpaced(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

// Biaya DurianPay per order: pakai total_fee asli kalau sudah tersedia,
// kalau belum pakai estimasi sesuai metode (sama dengan notif pembelian).
function feeFor(p: PaymentInfo | null, amount: number): number {
  if (p && p.totalFee > 0) return p.totalFee;
  const t = (p?.detailsType || "").toLowerCase();
  if (t.includes("va")) return 4440; // VA flat
  if (t.includes("ewallet")) return amount * 0.015; // e-wallet ~1.5%
  return amount * 0.007; // QRIS ~0.7%
}

export async function GET(request: Request) {
  // Auth: dari Vercel Cron (Authorization: Bearer CRON_SECRET) atau manual ?key=ACCESS_TOKEN_SECRET.
  const url = new URL(request.url);
  const auth = request.headers.get("authorization");
  const okCron = Boolean(process.env.CRON_SECRET) && auth === `Bearer ${process.env.CRON_SECRET}`;
  const given = url.searchParams.get("key");
  const okKey =
    Boolean(given) &&
    [process.env.NOTIF_TEST_SECRET, process.env.ACCESS_TOKEN_SECRET]
      .filter(Boolean)
      .includes(given as string);
  if (!okCron && !okKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Recap dijalankan SETELAH tengah malam & melaporkan HARI YANG BARU SELESAI (kemarin WIB).
  // Anti-telat: walau cron molor sampai lewat tengah malam, hari yang dilaporkan tetap benar.
  // ?day=today memaksa laporan hari berjalan (untuk tes manual).
  const oneDay = 24 * 60 * 60 * 1000;
  const wibNow = new Date(Date.now() + WIB);
  const startTodayWibMs = Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - WIB;
  // ?date=YYYY-MM-DD melaporkan satu hari WIB tertentu (kirim ulang recap lama / uji).
  const dateParam = url.searchParams.get("date");
  const reportToday = url.searchParams.get("day") === "today";

  let startMs: number;
  let endMs: number;
  let labelMs: number;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const [y, m, d] = dateParam.split("-").map(Number);
    startMs = Date.UTC(y, m - 1, d) - WIB;
    endMs = startMs + oneDay;
    labelMs = startMs + 1000;
  } else if (reportToday) {
    startMs = startTodayWibMs;
    endMs = Number.POSITIVE_INFINITY;
    labelMs = Date.now();
  } else {
    startMs = startTodayWibMs - oneDay;
    endMs = startTodayWibMs;
    labelMs = startTodayWibMs - 1000;
  }

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(labelMs));

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
    // Hanya hitung order KitabCuan (order_ref_id "kc-"). DurianPay /orders di scope key ini
    // bisa ikut mengembalikan order produk lain (mis. FateFace); jangan sampai masuk recap KitabCuan.
    if (!isKitabCuanRef(o.orderRefId)) return false;
    const ts = o.paidAt || o.createdAt;
    if (!ts) return false;
    const t = new Date(ts).getTime();
    return t >= startMs && t < endMs;
  });

  const orderCount = today.length;
  const totalIdr = today.reduce((s, o) => s + o.amount, 0);
  const customerCount = new Set(
    today.map((o) => (o.email || o.name || o.id).toLowerCase()),
  ).size;


  // Ambil detail pembayaran tiap order (metode + biaya asli). Dibatasi supaya
  // recap tidak kena timeout kalau suatu hari ordernya banyak.
  const detailed = today.slice(0, 40);
  const payments = await Promise.all(
    detailed.map(async (o) => {
      try {
        return { order: o, payment: await getOrderPayment(o.id) };
      } catch {
        return { order: o, payment: null as PaymentInfo | null };
      }
    }),
  );

  // Rincian produk: dikelompokkan per harga (KitabCuan satu produk, tapi
  // harga promo bisa berbeda antar periode).
  const byPrice = new Map<number, number>();
  for (const o of today) byPrice.set(o.amount, (byPrice.get(o.amount) || 0) + 1);
  const productLines = Array.from(byPrice.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([price, qty]) => {
      const k = Math.round(price / 1000);
      return `• ${PRODUCT_NAME} (${k}k) — ${qty} × ${rpSpaced(price * qty)}`;
    });

  // Channel bayar: jumlah transaksi + nilainya per metode.
  const byChannel = new Map<string, { n: number; sum: number }>();
  for (const { order, payment } of payments) {
    const label = methodLabel(payment);
    const cur = byChannel.get(label) || { n: 0, sum: 0 };
    cur.n += 1;
    cur.sum += order.amount;
    byChannel.set(label, cur);
  }
  const channelLines = Array.from(byChannel.entries())
    .sort((a, b) => b[1].sum - a[1].sum)
    .map(([label, v]) => `• ${label} — ${v.n} (${rpSpaced(v.sum)})`);

  const feeIdr = payments.reduce((s, { order, payment }) => s + feeFor(payment, order.amount), 0);
  const feePct = totalIdr > 0 ? (feeIdr / totalIdr) * 100 : 0;
  const profitIdr = totalIdr - feeIdr;

  const usd = IDR_PER_USD > 0 ? Math.round(totalIdr / IDR_PER_USD) : null;

  const disc = await sendDiscordRecap({
    dateLabel,
    totalIdr: rpSpaced(totalIdr),
    usdLabel: usd === null ? undefined : `(~$${usd})`,
    orderCount,
    customerCount,
    productLines,
    channelLines,
    feeLabel: `~${rpSpaced(feeIdr)} (${feePct.toFixed(2)}%)`,
    profitLabel: `~${rpSpaced(profitIdr)}`,
  });

  return NextResponse.json({
    ok: true,
    date: dateLabel,
    orderCount,
    customerCount,
    totalIdr,
    feeIdr: Math.round(feeIdr),
    profitIdr: Math.round(profitIdr),
    channels: channelLines,
    discordSent: disc.ok,
    discordReason: disc.reason,
  });
}
