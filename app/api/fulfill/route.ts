import { NextResponse } from "next/server";
import { getOrder, listOrders } from "@/lib/durianpay";
import { isKitabCuanRef } from "@/lib/purchase-notif";
import { fulfillOrder } from "@/lib/fulfill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pemicu pemenuhan pesanan manual (admin).
 *
 *   GET /api/fulfill?key=...&order=ord_xxxxx     → penuhi satu order
 *   GET /api/fulfill?key=...&order=ord_x&force=1 → kirim ulang walau sudah pernah
 *   GET /api/fulfill?key=...&scan=1              → cari order lunas yang BELUM dipenuhi
 *   GET /api/fulfill?key=...&sweep=1             → penuhi SEMUA order lunas yang terlewat
 *                                                 (opsional &hours=72 &max=25)
 *
 * Gunanya: menambal penjualan yang pemenuhannya terlewat (mis. pembeli menutup
 * halaman bayar sebelum poller sempat jalan, atau webhook tidak pernah sampai).
 *
 * Mode `sweep` dijalankan terjadwal lewat Vercel Cron (lihat vercel.json). Ini
 * jaring pengaman terakhir: selama order lunas tercatat di DurianPay, pembeli
 * tetap dapat produknya walau webhook DurianPay diam sama sekali. fulfillOrder()
 * idempoten (riwayat Brevo jadi penanda lintas-instance), jadi sweep berulang
 * TIDAK mengirim email dua kali ke pembeli yang sama.
 *
 * Auth: `?key=` cocok dengan NOTIF_TEST_SECRET atau ACCESS_TOKEN_SECRET,
 * atau header `Authorization: Bearer <CRON_SECRET>`.
 */
function authorized(request: Request, url: URL): boolean {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  const given = url.searchParams.get("key");
  if (!given) return false;
  return [process.env.NOTIF_TEST_SECRET, process.env.ACCESS_TOKEN_SECRET]
    .filter(Boolean)
    .includes(given);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!authorized(request, url)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const force = url.searchParams.get("force") === "1";

  // --- Mode scan: daftar order KitabCuan yang lunas, untuk dicek manual ---
  if (url.searchParams.get("scan") === "1") {
    try {
      const orders = await listOrders(100);
      const paid = orders
        .filter((o) => o.isPaid && isKitabCuanRef(o.orderRefId))
        .map((o) => ({
          id: o.id,
          ref: o.orderRefId,
          amount: o.amount,
          paidAt: o.paidAt || o.createdAt,
        }));
      return NextResponse.json({ ok: true, mode: "scan", count: paid.length, orders: paid });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: err instanceof Error ? err.message : "list_failed" },
        { status: 502 },
      );
    }
  }

  // --- Mode sweep: penuhi semua order lunas yang pemenuhannya terlewat ---
  if (url.searchParams.get("sweep") === "1") {
    const hours = Math.min(Math.max(Number(url.searchParams.get("hours")) || 72, 1), 720);
    const max = Math.min(Math.max(Number(url.searchParams.get("max")) || 25, 1), 100);
    const cutoff = Date.now() - hours * 60 * 60 * 1000;

    let candidates;
    try {
      const orders = await listOrders(100);
      candidates = orders
        .filter((o) => o.isPaid && isKitabCuanRef(o.orderRefId))
        .filter((o) => {
          const ts = o.paidAt || o.createdAt;
          return ts ? new Date(ts).getTime() >= cutoff : false;
        })
        .slice(0, max);
    } catch (err) {
      return NextResponse.json(
        { ok: false, mode: "sweep", error: err instanceof Error ? err.message : "list_failed" },
        { status: 502 },
      );
    }

    const results: Array<Record<string, unknown>> = [];
    let delivered = 0;
    let skipped = 0;
    let failed = 0;

    for (const cand of candidates) {
      try {
        const full = await getOrder(cand.id);
        const r = await fulfillOrder({ order: full, trigger: "sweep", force });
        if (r.delivered) delivered++;
        else if (r.ok) skipped++;
        else failed++;
        results.push({ id: cand.id, ref: cand.orderRefId, ...r });
      } catch (err) {
        failed++;
        results.push({
          id: cand.id,
          ref: cand.orderRefId,
          ok: false,
          error: err instanceof Error ? err.message : "fulfill_failed",
        });
      }
    }

    if (delivered > 0) {
      console.log("[fulfill/sweep] menambal %d pesanan yang terlewat", delivered);
    }
    return NextResponse.json({
      ok: failed === 0,
      mode: "sweep",
      windowHours: hours,
      scanned: candidates.length,
      delivered,
      skipped,
      failed,
      results,
    });
  }

  const orderId = url.searchParams.get("order");
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "parameter_order_wajib" }, { status: 400 });
  }

  let order;
  try {
    order = await getOrder(orderId);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "order_tidak_ditemukan", detail: err instanceof Error ? err.message : "" },
      { status: 404 },
    );
  }

  const res = await fulfillOrder({ order, trigger: "manual", force });
  return NextResponse.json({ orderRef: order.orderRefId, status: order.status, ...res });
}
