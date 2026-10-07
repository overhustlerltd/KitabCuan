import { NextResponse } from "next/server";
import { getOrder, isDurianpayConfigured } from "@/lib/durianpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Dipanggil berkala oleh halaman bayar untuk cek apakah QRIS sudah lunas.
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
    return NextResponse.json({ ok: true, paid: order.isPaid, status: order.status });
  } catch (err) {
    console.error("[order/status] gagal cek status:", err);
    // Jangan bikin halaman error; biar polling lanjut.
    return NextResponse.json({ ok: false, paid: false, reason: "check_failed" });
  }
}
