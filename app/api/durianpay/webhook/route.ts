import { NextResponse } from "next/server";
import { getOrder } from "@/lib/durianpay";
import { signAccess } from "@/lib/access-token";
import { sendMetaCapiPurchase } from "@/lib/meta-capi";
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

    // Kirim Purchase ke Meta Conversions API (server-side, terverifikasi). Non-fatal.
    try {
      const priceNum = Number(process.env.PRODUCT_PRICE || "197000");
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
      if (!capi.ok && capi.reason !== "capi_not_configured") {
        console.error("[webhook] CAPI Purchase gagal:", capi.reason);
      }
    } catch (err) {
      console.error("[webhook] CAPI error:", err);
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
