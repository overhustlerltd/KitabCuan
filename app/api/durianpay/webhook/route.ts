import { NextResponse } from "next/server";
import { getOrder, getOrderPayment, listOrders, type PaymentInfo } from "@/lib/durianpay";
import { lookupLocation } from "@/lib/geo";
import { signAccess } from "@/lib/access-token";
import { sendMetaCapiPurchase } from "@/lib/meta-capi";
import { sendDiscordPurchase } from "@/lib/discord";
import {
  sendBrevoEmail,
  deliveryEmailHtml,
  adminNotifyHtml,
  isBrevoConfigured,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_PRICE_LABEL = `Rp${Number(process.env.PRODUCT_PRICE || "197000").toLocaleString("id-ID")}`;

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://kitabcuan.org").replace(/\/$/, "");
}

const WIB_MS = 7 * 60 * 60 * 1000;
function rp(n: number): string {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

// Label metode pembayaran dari data DurianPay.
function methodLabel(p: PaymentInfo | null): string {
  if (!p) return "-";
  const t = (p.detailsType || "").toLowerCase();
  const id = p.methodId || "";
  if (t.includes("qris")) return `QRIS${p.issuer ? ` (${p.issuer})` : ""}`;
  if (t.includes("va")) return `${id} Virtual Account`;
  if (t.includes("ewallet")) return id || "E-Wallet";
  return id || "-";
}

// Biaya DurianPay: pakai total_fee kalau ada, kalau belum -> estimasi per metode.
function feeInfo(p: PaymentInfo | null, amount: number): { label: string; net: string } {
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
async function todayRecap(): Promise<{ count: number; total: number }> {
  try {
    const wibNow = new Date(Date.now() + WIB_MS);
    const startMs =
      Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - WIB_MS;
    const orders = await listOrders(100);
    const today = orders.filter(
      (o) => o.isPaid && o.createdAt && new Date(o.createdAt).getTime() >= startMs,
    );
    return { count: today.length, total: today.reduce((s, o) => s + o.amount, 0) };
  } catch {
    return { count: 0, total: 0 };
  }
}

// Cari string apa pun yang berbentuk order id DurianPay ("ord_...") di seluruh payload.
function deepFindOrderId(node: unknown, depth = 0): string | null {
  if (depth > 6 || node == null) return null;
  if (typeof node === "string") return node.startsWith("ord_") ? node : null;
  if (Array.isArray(node)) {
    for (const v of node) {
      const found = deepFindOrderId(v, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>)) {
      const found = deepFindOrderId(v, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

// Ekstrak order id dari berbagai bentuk payload webhook DurianPay.
function extractOrderId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, any>;
  return (
    p.order_id ||
    p.data?.order_id ||
    p.data?.id ||
    p.data?.order?.id ||
    p.id ||
    deepFindOrderId(payload) ||
    null
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    // Selalu balas 200 supaya DurianPay tidak retry payload rusak.
    return NextResponse.json({ ok: true, ignored: "invalid_json" });
  }

  const orderId = extractOrderId(payload);
  if (!orderId) {
    return NextResponse.json({ ok: true, ignored: "no_order_id" });
  }

  try {
    // Otoritatif: cek status langsung ke DurianPay pakai secret key kita.
    const order = await getOrder(orderId);
    if (!order.isPaid) {
      return NextResponse.json({ ok: true, delivered: false, status: order.status });
    }

    const priceNum = Number(process.env.PRODUCT_PRICE || "197000");

    // Kirim Purchase ke Meta Conversions API (server-side, terverifikasi). Non-fatal.
    let capiFired = false;
    try {
      const capi = await sendMetaCapiPurchase({
        email: order.customerEmail,
        phone: order.customerMobile,
        name: order.customerName,
        value: priceNum,
        currency: "IDR",
        eventId: order.orderRefId || order.id,
        fbp: order.fbp,
        fbc: order.fbc,
        clientIp: order.clientIp,
        userAgent: order.userAgent,
        eventSourceUrl: `${siteUrl()}/terima-kasih`,
      });
      capiFired = capi.ok;
      if (!capi.ok && capi.reason !== "capi_not_configured") {
        console.error("[webhook] CAPI Purchase gagal:", capi.reason);
      }
    } catch (err) {
      console.error("[webhook] CAPI error:", err);
    }

    // Notifikasi Discord detail (server Kitab Cuan). Non-fatal.
    try {
      const [payment, city, recap] = await Promise.all([
        getOrderPayment(order.id),
        lookupLocation(order.clientIp),
        todayRecap(),
      ]);
      const fee = feeInfo(payment, priceNum);
      const source = order.fbc
        ? "🟢 Iklan (ad-click)"
        : order.fbp
          ? "🔵 Organik / traffic"
          : "🔵 Langsung";
      const disc = await sendDiscordPurchase({
        name: order.customerName || "-",
        email: order.customerEmail || "-",
        mobile: order.customerMobile || "-",
        amount: PRODUCT_PRICE_LABEL,
        city,
        method: methodLabel(payment),
        feeLabel: fee.label,
        netLabel: fee.net,
        source,
        capiFired,
        orderRef: order.orderRefId || order.id,
        todayCount: recap.count,
        todayTotal: rp(recap.total),
      });
      if (!disc.ok && disc.reason !== "discord_not_configured") {
        console.error("[webhook] Discord notif gagal:", disc.reason);
      }
    } catch (err) {
      console.error("[webhook] Discord error:", err);
    }

    const email = order.customerEmail;
    const name = order.customerName || "Sahabat Cuan";
    const mobile = order.customerMobile || "-";
    const driveUrl = process.env.PRODUCT_DRIVE_URL;

    if (!email || !driveUrl || !isBrevoConfigured()) {
      console.error("[webhook] lunas tapi konfigurasi delivery kurang", {
        hasEmail: Boolean(email),
        hasDrive: Boolean(driveUrl),
        brevo: isBrevoConfigured(),
      });
      // Tetap 200 agar tidak retry; admin bisa kirim manual.
      return NextResponse.json({ ok: true, delivered: false, reason: "delivery_not_configured" });
    }

    const token = signAccess({ ref: order.orderRefId || order.id, email });
    const toolsUrl = `${siteUrl()}/api/tools-access?akses=${encodeURIComponent(token)}`;

    await sendBrevoEmail({
      to: [{ email, name }],
      subject: "Akses KitabCuan kamu sudah aktif ✅",
      htmlContent: deliveryEmailHtml({ name, driveUrl, toolsUrl, price: PRODUCT_PRICE_LABEL }),
    });

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      await sendBrevoEmail({
        to: [{ email: adminEmail }],
        subject: `Pembayaran lunas: ${name} (${PRODUCT_PRICE_LABEL})`,
        htmlContent: adminNotifyHtml({
          name,
          email,
          mobile,
          price: PRODUCT_PRICE_LABEL,
          orderRef: order.orderRefId || order.id,
        }),
      });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[webhook] error:", err);
    // 200 supaya DurianPay tidak spam retry; error tercatat di log server.
    return NextResponse.json({ ok: true, delivered: false, error: "internal" });
  }
}
