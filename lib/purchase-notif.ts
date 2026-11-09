// Notifikasi Discord "💰 Pembelian Baru" — SATU sumber kebenaran.
//
// Dipakai oleh:
//   - app/api/durianpay/webhook/route.ts  (real-time, dipicu DurianPay payment.completed)
//   - app/api/notif-test/route.ts         (uji manual / kirim ulang notif yang terlewat)
//
// Semua pembentukan field (metode bayar, biaya, kota, sumber traffic, recap
// harian) ada di sini supaya notif dari jalur mana pun bentuknya identik.

import { getOrderPayment, listOrders, type OrderStatus, type PaymentInfo } from "@/lib/durianpay";
import { lookupLocation } from "@/lib/geo";
import { sendDiscordPurchase } from "@/lib/discord";

const WIB_MS = 7 * 60 * 60 * 1000;

export function productPriceNum(): number {
  return Number(process.env.PRODUCT_PRICE || "197000");
}

export function rp(n: number): string {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

// Hanya order KitabCuan. Key DurianPay bisa ber-scope lebih luas (mis. ikut
// mengembalikan order FateFace), jadi selalu saring lewat prefix order_ref_id.
export function isKitabCuanRef(ref?: string | null): boolean {
  return Boolean(ref && ref.startsWith("kc-"));
}

// Label metode pembayaran dari data DurianPay.
export function methodLabel(p: PaymentInfo | null): string {
  if (!p) return "-";
  const t = (p.detailsType || "").toLowerCase();
  const id = p.methodId || "";
  if (t.includes("qris")) return `QRIS${p.issuer ? ` (${p.issuer})` : ""}`;
  if (t.includes("va")) return `${id} Virtual Account`;
  if (t.includes("ewallet")) return id || "E-Wallet";
  return id || "-";
}

// Biaya DurianPay: pakai total_fee kalau ada, kalau belum -> estimasi per metode.
export function feeInfo(p: PaymentInfo | null, amount: number): { label: string; net: string } {
  if (p && p.totalFee > 0) {
    return { label: rp(p.totalFee), net: rp(amount - p.totalFee) };
  }
  const t = (p?.detailsType || "").toLowerCase();
  let est = amount * 0.007; // default QRIS ~0.7%
  if (t.includes("va")) est = 4440; // VA flat
  else if (t.includes("ewallet")) est = amount * 0.015; // e-wallet ~1.5%
  return { label: `${rp(est)} (estimasi)`, net: rp(amount - est) };
}

// Jumlah + omzet penjualan lunas HARI INI (WIB), untuk recap di tiap notif.
export async function todayRecap(): Promise<{ count: number; total: number }> {
  try {
    const wibNow = new Date(Date.now() + WIB_MS);
    const startMs =
      Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - WIB_MS;
    const orders = await listOrders(100);
    const today = orders.filter((o) => {
      if (!o.isPaid) return false;
      if (!isKitabCuanRef(o.orderRefId)) return false;
      const ts = o.paidAt || o.createdAt;
      return ts ? new Date(ts).getTime() >= startMs : false;
    });
    return { count: today.length, total: today.reduce((s, o) => s + o.amount, 0) };
  } catch {
    return { count: 0, total: 0 };
  }
}

export function trafficSource(order: Pick<OrderStatus, "fbc" | "fbp">): string {
  return order.fbc ? "🟢 Iklan (ad-click)" : order.fbp ? "🔵 Organik / traffic" : "🔵 Langsung";
}

/**
 * Kirim notif "💰 Pembelian Baru" untuk satu order lunas.
 * Non-fatal: selalu mengembalikan hasil, tidak pernah melempar.
 */
export async function notifyPurchase(opts: {
  order: OrderStatus;
  capiFired: boolean;
  /** Tandai di footer bahwa ini kiriman uji, bukan penjualan baru. */
  testLabel?: string;
  /** Mode uji: pakai data ini alih-alih memanggil DurianPay/geo. */
  paymentOverride?: PaymentInfo | null;
  cityOverride?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const { order, capiFired, testLabel } = opts;
  try {
    const priceNum = productPriceNum();
    const [payment, city, recap] = await Promise.all([
      opts.paymentOverride !== undefined
        ? Promise.resolve(opts.paymentOverride)
        : getOrderPayment(order.id),
      opts.cityOverride !== undefined
        ? Promise.resolve(opts.cityOverride)
        : lookupLocation(order.clientIp),
      todayRecap(),
    ]);
    const fee = feeInfo(payment, priceNum);
    const orderRef = order.orderRefId || order.id;

    return await sendDiscordPurchase({
      name: order.customerName || "-",
      email: order.customerEmail || "-",
      mobile: order.customerMobile || "-",
      amount: rp(priceNum),
      city,
      method: methodLabel(payment),
      feeLabel: fee.label,
      netLabel: fee.net,
      source: trafficSource(order),
      capiFired,
      orderRef: testLabel ? `${orderRef} · ${testLabel}` : orderRef,
      todayCount: recap.count,
      todayTotal: rp(recap.total),
    });
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "notify_error" };
  }
}

/**
 * Notif darurat: webhook lunas masuk tapi order TIDAK bisa diverifikasi lewat
 * DURIANPAY_SECRET_KEY yang aktif (mis. order dibuat dengan key lain saat
 * pergantian key). Tanpa ini kejadiannya hilang tanpa jejak di Discord.
 */
export async function notifyUnverifiedPaid(opts: {
  orderId: string;
  orderRef?: string;
  reason: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const recap = await todayRecap();
  return sendDiscordPurchase({
    name: "⚠️ TIDAK TERVERIFIKASI",
    email: "-",
    mobile: "-",
    amount: rp(productPriceNum()),
    city: undefined,
    method: "-",
    feeLabel: undefined,
    netLabel: undefined,
    source: `⚠️ Webhook lunas masuk tapi order gagal dicek (${opts.reason.slice(0, 120)})`,
    capiFired: false,
    orderRef: opts.orderRef || opts.orderId,
    todayCount: recap.count,
    todayTotal: rp(recap.total),
  });
}
