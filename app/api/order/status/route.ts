import { NextResponse } from "next/server";
import { getOrder, isDurianpayConfigured } from "@/lib/durianpay";
import { isKitabCuanRef } from "@/lib/purchase-notif";
import { fulfillOrder } from "@/lib/fulfill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dipanggil berkala oleh halaman bayar untuk cek apakah QRIS sudah lunas.
//
// Sekaligus JALUR PEMENUHAN UTAMA: begitu order terlihat lunas, pemenuhan
// (CAPI + notif Discord + email akses + notif admin) dijalankan dari sini.
// Alasannya, DurianPay cuma mengirim webhook ke satu endpoint "primary" per
// event per merchant, dan slot itu dipegang produk lain — jadi webhook
// KitabCuan tidak bisa diandalkan. fulfillOrder() idempoten, jadi kalaupun
// webhook suatu saat ikut sampai, pembeli tidak akan dikirimi dua kali.
export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("order");
  if (!orderId) {
    return NextResponse.json({ ok: false, paid: false, reason: "no_order" }, { status: 400 });
  }
  if (!isDurianpayConfigured()) {
    return NextResponse.json({ ok: false, paid: false, reason: "not_configured" }, { status: 503 });
  }
  try {
    const order = await getOrder(orderId);

    if (order.isPaid && isKitabCuanRef(order.orderRefId)) {
      console.log("[order/status] order lunas -> memicu pemenuhan ref=%s", order.orderRefId);
      try {
        const f = await fulfillOrder({ order, trigger: "poll" });
        console.log("[order/status] hasil pemenuhan ref=%s %s", order.orderRefId, JSON.stringify(f));
        if (!f.ok) console.error("[order/status] pemenuhan gagal:", f.reason);
      } catch (err) {
        // Jangan sampai halaman bayar ikut error kalau pemenuhan bermasalah.
        console.error("[order/status] pemenuhan error:", err);
      }
    }

    return NextResponse.json({ ok: true, paid: order.isPaid, status: order.status });
  } catch (err) {
    console.error("[order/status] gagal cek status:", err);
    // Jangan bikin halaman error; biar polling lanjut.
    return NextResponse.json({ ok: false, paid: false, reason: "check_failed" });
  }
}
