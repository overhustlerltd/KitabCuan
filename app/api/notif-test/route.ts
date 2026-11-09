import { NextResponse } from "next/server";
import { getOrder } from "@/lib/durianpay";
import { isDiscordConfigured } from "@/lib/discord";
import { isKitabCuanRef, notifyPurchase, productPriceNum } from "@/lib/purchase-notif";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pemicu manual notifikasi Discord "💰 Pembelian Baru".
 *
 * Dua kegunaan:
 *  1. UJI  — `?key=<ACCESS_TOKEN_SECRET>` tanpa parameter lain: kirim satu notif
 *     contoh (data dummy) untuk membuktikan webhook Discord hidup & formatnya benar.
 *     Tidak menyentuh DurianPay, tidak kirim email, tidak fire Meta CAPI.
 *  2. KIRIM ULANG — `?key=...&order=ord_xxxxx`: ambil order ASLI dari DurianPay
 *     dan kirim ulang notifikasinya (untuk penjualan yang notifnya terlewat).
 *     Tetap tidak kirim email ke pembeli dan tidak fire CAPI — murni notifikasi.
 *
 * Auth: `?key=` cocok dengan NOTIF_TEST_SECRET atau ACCESS_TOKEN_SECRET,
 * atau header `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const auth = request.headers.get("authorization");
  const okCron = Boolean(process.env.CRON_SECRET) && auth === `Bearer ${process.env.CRON_SECRET}`;
  const given = url.searchParams.get("key");
  const okKey = Boolean(given) &&
    [process.env.NOTIF_TEST_SECRET, process.env.ACCESS_TOKEN_SECRET]
      .filter(Boolean)
      .includes(given as string);
  if (!okCron && !okKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isDiscordConfigured()) {
    return NextResponse.json({ ok: false, error: "DISCORD_WEBHOOK_URL belum diset" }, { status: 503 });
  }

  const orderId = url.searchParams.get("order");

  // --- Mode 2: kirim ulang notif untuk order asli ---
  if (orderId) {
    let order;
    try {
      order = await getOrder(orderId);
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "order_tidak_ditemukan", detail: err instanceof Error ? err.message : "" },
        { status: 404 },
      );
    }
    if (!isKitabCuanRef(order.orderRefId)) {
      return NextResponse.json(
        { ok: false, error: "bukan_order_kitabcuan", orderRef: order.orderRefId },
        { status: 400 },
      );
    }
    if (!order.isPaid) {
      return NextResponse.json({ ok: false, error: "order_belum_lunas", status: order.status }, { status: 400 });
    }
    const res = await notifyPurchase({ order, capiFired: false, testLabel: "KIRIM ULANG" });
    return NextResponse.json({ ok: res.ok, mode: "resend", orderRef: order.orderRefId, reason: res.reason });
  }

  // --- Mode 1: notif contoh (dummy) ---
  const res = await notifyPurchase({
    order: {
      id: "ord_CONTOHUJICOBA",
      status: "completed",
      orderRefId: `kc-${Date.now()}-uji`,
      amount: String(productPriceNum()),
      customerName: "Contoh Pembeli (UJI COBA)",
      customerEmail: "uji@kitabcuan.org",
      customerMobile: "+628123456789",
      fbc: "fb.1.0.contoh",
      isPaid: true,
    },
    capiFired: true,
    testLabel: "UJI COBA — bukan penjualan asli",
    paymentOverride: { methodId: "QRIS", detailsType: "qris_details", issuer: "Bank BCA", totalFee: 1379, amount: productPriceNum() },
    cityOverride: "Jakarta Selatan, DKI Jakarta",
  });

  return NextResponse.json({ ok: res.ok, mode: "sample", reason: res.reason });
}
