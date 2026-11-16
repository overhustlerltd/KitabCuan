// Pemenuhan pesanan KitabCuan — SATU jalur untuk semua pemicu.
//
// Dipakai oleh:
//   - app/api/durianpay/webhook/route.ts  (kalau webhook DurianPay memang sampai)
//   - app/api/order/status/route.ts       (poller halaman bayar — jalur utama saat
//                                          slot primary webhook dipegang produk lain)
//   - app/api/fulfill/route.ts            (pemicu manual admin / kirim ulang, dan
//                                          sweep terjadwal yang menambal order lunas
//                                          yang luput dari webhook maupun poller)
//
// Langkahnya: Meta CAPI → notif Discord pembelian → email akses ke pembeli
// (Brevo) → notif Discord terkirim → email notifikasi admin.
//
// IDEMPOTENSI (tanpa database):
//   1. Set in-memory per instance — menahan polling beruntun di instance yang sama.
//   2. Riwayat Brevo — kalau alamat pembeli SUDAH pernah dikirimi email transaksional,
//      pesanan dianggap sudah dipenuhi. Ini penyimpan status yang otoritatif dan
//      lintas-instance. Bisa dilewati dengan `force` untuk kirim ulang manual.

import { type OrderStatus } from "@/lib/durianpay";
import { signAccess } from "@/lib/access-token";
import { sendMetaCapiPurchase } from "@/lib/meta-capi";
import { sendDiscordDelivered } from "@/lib/discord";
import { isKitabCuanRef, notifyPurchase, productPriceNum, rp } from "@/lib/purchase-notif";
import {
  sendBrevoEmail,
  deliveryEmailHtml,
  adminNotifyHtml,
  isBrevoConfigured,
} from "@/lib/email";

export type FulfillTrigger = "webhook" | "poll" | "manual" | "sweep";

export type FulfillResult = {
  ok: boolean;
  delivered: boolean;
  skipped?: string;
  steps?: {
    capi: boolean;
    discordPurchase: boolean;
    email: boolean;
    discordDelivered: boolean;
    adminEmail: boolean;
  };
  reason?: string;
};

// Guard in-memory (hidup selama instance lambda hidup).
const handled = new Set<string>();
const inFlight = new Set<string>();

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://kitabcuan.org").replace(/\/$/, "");
}

/**
 * Sudah pernah ada email transaksional ke alamat ini? Dipakai sebagai penanda
 * "pesanan sudah dipenuhi" yang bertahan lintas instance dan lintas deploy.
 */
async function alreadyEmailed(email: string): Promise<boolean | null> {
  const key = process.env.BREVO_API_KEY;
  if (!key || !email) return null;
  try {
    const res = await fetch(
      `https://api.brevo.com/v3/smtp/emails?email=${encodeURIComponent(email)}&limit=10`,
      { headers: { "api-key": key, accept: "application/json" }, cache: "no-store" },
    );
    if (!res.ok) return null; // tidak tahu → jangan blokir pengiriman
    const j = (await res.json()) as { transactionalEmails?: unknown[]; count?: number };
    const rows = j.transactionalEmails;
    if (Array.isArray(rows)) return rows.length > 0;
    if (typeof j.count === "number") return j.count > 0;
    return false;
  } catch {
    return null;
  }
}

/**
 * Jalankan pemenuhan penuh untuk satu order yang SUDAH lunas.
 * Aman dipanggil berkali-kali: pemanggilan kedua akan di-skip.
 */
export async function fulfillOrder(opts: {
  order: OrderStatus;
  trigger: FulfillTrigger;
  /** Lewati pengecekan idempotensi (kirim ulang manual). */
  force?: boolean;
}): Promise<FulfillResult> {
  const { order, trigger, force = false } = opts;
  const ref = order.orderRefId || order.id;

  if (!order.isPaid) return { ok: true, delivered: false, skipped: "belum_lunas" };
  if (!isKitabCuanRef(order.orderRefId)) {
    return { ok: true, delivered: false, skipped: "bukan_order_kitabcuan" };
  }

  if (!force) {
    if (handled.has(ref)) return { ok: true, delivered: false, skipped: "sudah_diproses_instance" };
    if (inFlight.has(ref)) return { ok: true, delivered: false, skipped: "sedang_diproses" };
  }

  inFlight.add(ref);
  try {
    const email = order.customerEmail;

    if (!force && email) {
      const sent = await alreadyEmailed(email);
      if (sent === true) {
        handled.add(ref);
        return { ok: true, delivered: false, skipped: "sudah_pernah_dikirim" };
      }
    }

    const priceNum = productPriceNum();
    const priceLabel = rp(priceNum);
    const name = order.customerName || "Sahabat Cuan";
    const mobile = order.customerMobile || "-";
    const driveUrl = process.env.PRODUCT_DRIVE_URL;

    const steps = {
      capi: false,
      discordPurchase: false,
      email: false,
      discordDelivered: false,
      adminEmail: false,
    };

    // 1) Meta CAPI Purchase. Non-fatal. eventId = order ref, jadi Meta men-dedup
    //    seandainya pixel browser juga mengirim event yang sama.
    try {
      const capi = await sendMetaCapiPurchase({
        email: order.customerEmail,
        phone: order.customerMobile,
        name: order.customerName,
        value: priceNum,
        currency: "IDR",
        eventId: ref,
        fbp: order.fbp,
        fbc: order.fbc,
        clientIp: order.clientIp,
        userAgent: order.userAgent,
        eventSourceUrl: `${siteUrl()}/terima-kasih`,
      });
      steps.capi = capi.ok;
      if (!capi.ok && capi.reason !== "capi_not_configured") {
        console.error("[fulfill] CAPI gagal:", capi.reason);
      }
    } catch (err) {
      console.error("[fulfill] CAPI error:", err);
    }

    // 2) Notif Discord pembelian. Non-fatal.
    try {
      const disc = await notifyPurchase({ order, capiFired: steps.capi });
      steps.discordPurchase = disc.ok;
      if (!disc.ok && disc.reason !== "discord_not_configured") {
        console.error("[fulfill] Discord notif gagal:", disc.reason);
      }
    } catch (err) {
      console.error("[fulfill] Discord error:", err);
    }

    // 3) Email akses ke pembeli — INI yang menentukan "delivered".
    if (!email || !driveUrl || !isBrevoConfigured()) {
      console.error("[fulfill] lunas tapi konfigurasi delivery kurang", {
        hasEmail: Boolean(email),
        hasDrive: Boolean(driveUrl),
        brevo: isBrevoConfigured(),
      });
      handled.add(ref);
      return { ok: false, delivered: false, reason: "delivery_not_configured", steps };
    }

    try {
      const token = signAccess({ ref, email });
      const toolsUrl = `${siteUrl()}/api/tools-access?akses=${encodeURIComponent(token)}`;
      await sendBrevoEmail({
        to: [{ email, name }],
        subject: "Akses KitabCuan kamu sudah aktif ✅",
        htmlContent: deliveryEmailHtml({ name, driveUrl, toolsUrl, price: priceLabel }),
        tags: [ref, `kc-trigger-${trigger}`],
      });
      steps.email = true;
    } catch (err) {
      console.error("[fulfill] email akses GAGAL:", err);
      // Jangan tandai handled: biar percobaan berikutnya masih bisa mengirim.
      inFlight.delete(ref);
      return {
        ok: false,
        delivered: false,
        reason: err instanceof Error ? err.message : "email_failed",
        steps,
      };
    }

    handled.add(ref);

    // 4) Notif Discord "produk terkirim". Non-fatal.
    try {
      const d = await sendDiscordDelivered({ name, email, orderRef: ref });
      steps.discordDelivered = d.ok;
    } catch (err) {
      console.error("[fulfill] Discord delivered error:", err);
    }

    // 5) Email notifikasi admin. Non-fatal.
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      try {
        await sendBrevoEmail({
          to: [{ email: adminEmail }],
          subject: `Pembayaran lunas: ${name} (${priceLabel})`,
          htmlContent: adminNotifyHtml({ name, email, mobile, price: priceLabel, orderRef: ref }),
          tags: [`admin-${ref}`],
        });
        steps.adminEmail = true;
      } catch (err) {
        console.error("[fulfill] email admin gagal:", err);
      }
    }

    console.log("[fulfill] selesai ref=%s trigger=%s steps=%s", ref, trigger, JSON.stringify(steps));
    return { ok: true, delivered: true, steps };
  } finally {
    inFlight.delete(ref);
  }
}
