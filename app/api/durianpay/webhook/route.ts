import { NextResponse } from "next/server";
import { getOrder } from "@/lib/durianpay";
import { notifyUnverifiedPaid } from "@/lib/purchase-notif";
import { fulfillOrder } from "@/lib/fulfill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

// order_ref_id dari payload (dipakai saat order tidak bisa diverifikasi).
function extractOrderRef(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const p = payload as Record<string, any>;
  return p.order_ref_id || p.data?.order_ref_id || p.data?.order?.order_ref_id || undefined;
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

  // Catat SETIAP webhook yang masuk, apa pun hasilnya. Tanpa ini, request yang
  // tidak memicu error sama sekali tidak terlihat di log Vercel — bikin mustahil
  // membuktikan DurianPay benar-benar mengirim event ke sini.
  console.log(
    "[webhook] masuk ev=%s order=%s ref=%s",
    (payload as Record<string, unknown>)?.event ?? "(tanpa event)",
    orderId ?? "-",
    extractOrderRef(payload) ?? "-",
  );

  if (!orderId) {
    return NextResponse.json({ ok: true, ignored: "no_order_id" });
  }

  // Otoritatif: cek status langsung ke DurianPay pakai secret key kita.
  // Kalau GAGAL (mis. order dibuat dengan key lain), jangan diam-diam hilang:
  // kirim alert ke Discord supaya penjualan tidak terlewat tanpa jejak.
  let order;
  try {
    order = await getOrder(orderId);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "get_order_failed";
    console.error("[webhook] gagal verifikasi order", orderId, reason);
    let alerted = false;
    try {
      const a = await notifyUnverifiedPaid({ orderId, orderRef: extractOrderRef(payload), reason });
      alerted = a.ok;
      if (!a.ok) console.error("[webhook] alert unverified gagal:", a.reason);
    } catch (e) {
      console.error("[webhook] alert unverified error:", e);
    }
    return NextResponse.json({ ok: true, delivered: false, error: "verify_failed", alerted });
  }

  try {
    const res = await fulfillOrder({ order, trigger: "webhook" });
    return NextResponse.json(res);
  } catch (err) {
    console.error("[webhook] error:", err);
    // 200 supaya DurianPay tidak spam retry; error tercatat di log server.
    return NextResponse.json({ ok: true, delivered: false, error: "internal" });
  }
}
