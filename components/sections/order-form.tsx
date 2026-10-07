"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Lock } from "lucide-react";

import QrisSvg from "idn-finlogos/icons/qris";
import BcaSvg from "idn-finlogos/icons/bca";
import BriSvg from "idn-finlogos/icons/bri";
import MandiriSvg from "idn-finlogos/icons/mandiri";
import BniSvg from "idn-finlogos/icons/bni";
import PermataSvg from "idn-finlogos/icons/permata";
import CimbSvg from "idn-finlogos/icons/cimb-niaga";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_FORM_CONTENT } from "@/lib/constants";
import { trackFb } from "@/components/analytics/meta-pixel";

const phoneRegex = /^8[0-9]{8,11}$/;

const orderFormSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(phoneRegex, "Nomor tidak valid, contoh: 81234567890"),
  email: z.string().trim().email("Format email tidak valid"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type Payment = {
  orderId: string;
  qrString: string;
  expiresAt?: string;
  amount: number;
};

type VaState = "loading" | "error" | { accountNumber: string; expiresAt?: string };

// Metode yang aktif di DurianPay (hasil verifikasi): QRIS + 6 VA bank.
const METHODS: { id: string; label: string; svg: string; isVa: boolean }[] = [
  { id: "QRIS", label: "QRIS", svg: QrisSvg, isVa: false },
  { id: "BCA", label: "BCA", svg: BcaSvg, isVa: true },
  { id: "MANDIRI", label: "Mandiri", svg: MandiriSvg, isVa: true },
  { id: "BNI", label: "BNI", svg: BniSvg, isVa: true },
  { id: "BRI", label: "BRI", svg: BriSvg, isVa: true },
  { id: "PERMATA", label: "Permata", svg: PermataSvg, isVa: true },
  { id: "CIMB", label: "CIMB Niaga", svg: CimbSvg, isVa: true },
];

function MethodLogo({ svg, label }: { svg: string; label: string }) {
  const styled = svg.replace(/<svg/, `<svg style="width:100%;height:100%;display:block;object-fit:contain;"`);
  return (
    <span
      role="img"
      aria-label={label}
      className="flex h-6 w-12 items-center justify-center"
      dangerouslySetInnerHTML={{ __html: styled }}
    />
  );
}

function formatClock(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Badge kepercayaan: pembayaran aman + logo SSL / HIMBARA / DurianPay. */
function TrustBadge() {
  return (
    <div className="rounded-2xl border border-border bg-white/70 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
          <ShieldCheck className="h-5 w-5 text-green-600" />
        </span>
        <p className="text-sm leading-snug text-neutral-700">
          <span className="font-bold text-foreground">Pembayaran 100% aman &amp; terenkripsi</span>
          <br />
          Diproses oleh <span className="font-semibold text-foreground">DurianPay</span> · dipercaya{" "}
          <span className="font-bold text-green-600">3.200+</span> pembeli
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-dashed border-border pt-3">
        {/* SSL SECURED */}
        <span className="flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-green-700">
          <Lock className="h-3.5 w-3.5" /> SSL SECURED
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        {/* HIMBARA (logo resmi) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trust/himbara.png" alt="HIMBARA" className="h-5 w-auto object-contain" />
        <span className="hidden h-4 w-px bg-border sm:block" />
        {/* DurianPay */}
        <span className="flex items-center gap-1 text-xs font-extrabold text-[#d6336c]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="#d6336c" />
            <polygon points="12,6 16.5,8.8 16.5,15.2 12,18 7.5,15.2 7.5,8.8" fill="#fff" />
            <polygon points="12,9 14.5,10.5 14.5,13.5 12,15 9.5,13.5 9.5,10.5" fill="#d6336c" />
          </svg>
          durianpay
        </span>
      </div>
    </div>
  );
}

export function OrderForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [method, setMethod] = useState<string>("QRIS");
  const [vaCache, setVaCache] = useState<Record<string, VaState>>({});
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  const readCookie = (name: string) => {
    if (typeof document === "undefined") return undefined;
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : undefined;
  };

  const onSubmit = async (data: OrderFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fbp: readCookie("_fbp"), fbc: readCookie("_fbc") }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        orderId?: string;
        qrString?: string;
        expiresAt?: string;
        amount?: number;
      };
      if (res.ok && json.ok && json.orderId && json.qrString) {
        trackFb("Lead", { content_name: "KitabCuan", currency: "IDR", value: 197000 });
        trackFb("InitiateCheckout", { content_name: "KitabCuan", currency: "IDR", value: 197000 });
        setPayment({
          orderId: json.orderId,
          qrString: json.qrString,
          expiresAt: json.expiresAt,
          amount: json.amount ?? 197000,
        });
        setMethod("QRIS");
        return;
      }
      setSubmitError(ORDER_FORM_CONTENT.errorMessage);
    } catch {
      setSubmitError(ORDER_FORM_CONTENT.errorMessage);
    }
  };

  // Generate nomor VA on-demand saat bank dipilih (di-cache per bank).
  const fetchVa = async (bank: string, orderId: string) => {
    setVaCache((p) => ({ ...p, [bank]: "loading" }));
    try {
      const r = await fetch("/api/order/va", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderId, bank }),
      });
      const j = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        accountNumber?: string;
        expiresAt?: string;
      };
      if (r.ok && j.ok && j.accountNumber) {
        setVaCache((p) => ({ ...p, [bank]: { accountNumber: j.accountNumber!, expiresAt: j.expiresAt } }));
      } else {
        setVaCache((p) => ({ ...p, [bank]: "error" }));
      }
    } catch {
      setVaCache((p) => ({ ...p, [bank]: "error" }));
    }
  };

  const selectMethod = (id: string) => {
    setMethod(id);
    setCopied(false);
    if (!payment) return;
    const m = METHODS.find((x) => x.id === id);
    if (m?.isVa && (!vaCache[id] || vaCache[id] === "error")) {
      void fetchVa(id, payment.orderId);
    }
  };

  const copyVa = (num: string) => {
    try {
      void navigator.clipboard.writeText(num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  // Poll status pembayaran tiap 4 detik; begitu lunas → arahkan ke terima kasih.
  useEffect(() => {
    if (!payment || paid) return;
    const check = async () => {
      try {
        const r = await fetch(`/api/order/status?order=${encodeURIComponent(payment.orderId)}`, { cache: "no-store" });
        const j = (await r.json().catch(() => ({}))) as { paid?: boolean };
        if (j.paid) {
          setPaid(true);
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => {
            window.location.href = "/terima-kasih";
          }, 1800);
        }
      } catch {
        /* retry */
      }
    };
    pollRef.current = setInterval(check, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [payment, paid]);

  // Hitung mundur masa berlaku.
  useEffect(() => {
    if (!payment?.expiresAt || paid) return;
    const target = new Date(payment.expiresAt).getTime();
    const tick = () => setSecondsLeft(Math.max(0, Math.round((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [payment, paid]);

  const manualCheck = async () => {
    if (!payment) return;
    setChecking(true);
    try {
      const r = await fetch(`/api/order/status?order=${encodeURIComponent(payment.orderId)}`, { cache: "no-store" });
      const j = (await r.json().catch(() => ({}))) as { paid?: boolean };
      if (j.paid) {
        setPaid(true);
        window.location.href = "/terima-kasih";
      }
    } finally {
      setChecking(false);
    }
  };

  const resetToForm = () => {
    setPayment(null);
    setPaid(false);
    setMethod("QRIS");
    setVaCache({});
    setSecondsLeft(null);
    setSubmitError(null);
  };

  const expired = secondsLeft !== null && secondsLeft <= 0 && !paid;
  const busy = isSubmitting;
  const rp = (n: number) => "Rp" + n.toLocaleString("id-ID");
  const activeMethod = METHODS.find((m) => m.id === method);
  const vaState = payment && activeMethod?.isVa ? vaCache[method] : undefined;

  return (
    <section id="order" className="bg-neutral-100/60 pb-16 pt-10 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-base text-neutral-600 sm:text-lg">{ORDER_FORM_CONTENT.description}</p>
        </div>

        <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 shadow-md sm:p-8">
          {/* ===== SUKSES ===== */}
          {paid ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
              <h3 className="font-heading text-2xl font-extrabold text-foreground">Pembayaran Berhasil! 🎉</h3>
              <p className="max-w-md text-base text-neutral-600">
                Terima kasih! Akses KitabCuan + Tools AI sedang dikirim ke emailmu. Mengarahkan…
              </p>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : payment ? (
            /* ===== HALAMAN BAYAR MULTI-METODE (ON-PAGE) ===== */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-heading text-lg font-bold text-foreground">Pilih Metode Pembayaran</span>
                <span className="font-heading text-xl font-extrabold text-primary">{rp(payment.amount)}</span>
              </div>

              {expired ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                  <p className="font-semibold text-foreground">Pembayaran sudah kedaluwarsa.</p>
                  <Button variant="accent" size="lg" onClick={resetToForm}>
                    Mulai Ulang
                  </Button>
                </div>
              ) : (
                <>
                  {/* Selektor metode */}
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {METHODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => selectMethod(m.id)}
                        className={cn(
                          "flex h-14 flex-col items-center justify-center gap-1 rounded-xl border bg-white px-2 transition",
                          method === m.id
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <MethodLogo svg={m.svg} label={m.label} />
                        <span className="text-[10px] font-semibold text-neutral-600">{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Konten metode terpilih */}
                  <div className="rounded-2xl border border-border bg-muted/30 p-5">
                    {method === "QRIS" ? (
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="rounded-2xl border-2 border-border bg-white p-3 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={payment.qrString} alt="QRIS KitabCuan" className="h-56 w-56 object-contain sm:h-64 sm:w-64" />
                        </div>
                        <p className="max-w-sm text-sm text-neutral-600">
                          Scan pakai aplikasi apa aja: <strong>GoPay, OVO, DANA, ShopeePay</strong> atau{" "}
                          <strong>m-banking</strong> (BCA, Mandiri, BNI, BRI, dll).
                        </p>
                      </div>
                    ) : vaState === "loading" || !vaState ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center text-neutral-600">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm">Membuat nomor Virtual Account {activeMethod?.label}…</p>
                      </div>
                    ) : vaState === "error" ? (
                      <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <p className="text-sm text-neutral-600">Gagal membuat nomor VA.</p>
                        <Button variant="outline" size="sm" onClick={() => payment && fetchVa(method, payment.orderId)}>
                          Coba Lagi
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-neutral-600">
                          Virtual Account {activeMethod?.label}
                        </p>
                        <div className="flex flex-col gap-2 rounded-xl border border-border bg-white px-4 py-3">
                          <span className="break-all text-center font-mono text-xl font-extrabold tracking-wider text-foreground sm:text-2xl">
                            {vaState.accountNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyVa(vaState.accountNumber)}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2.5 text-sm font-bold text-primary hover:bg-primary/20"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Tersalin!" : "Salin Nomor VA"}
                          </button>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-3 text-xs text-neutral-600">
                          <p className="font-bold text-neutral-700">Cara bayar:</p>
                          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                            <li>Buka m-banking / ATM {activeMethod?.label}</li>
                            <li>Pilih menu Transfer → Virtual Account</li>
                            <li>Masukkan nomor VA di atas</li>
                            <li>Bayar tepat <strong>{rp(payment.amount)}</strong></li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>

                  {secondsLeft !== null && (
                    <p className="text-center text-sm text-neutral-500">
                      Berlaku <span className="font-bold text-foreground">{formatClock(secondsLeft)}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-700">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    Menunggu pembayaran… halaman otomatis lanjut begitu lunas.
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={manualCheck}
                      disabled={checking}
                      className="text-sm font-bold text-primary underline-offset-2 hover:underline disabled:opacity-60"
                    >
                      {checking ? "Mengecek…" : "Sudah bayar? Cek status sekarang"}
                    </button>
                    <button type="button" onClick={resetToForm} className="text-xs text-neutral-400 hover:text-neutral-600">
                      Ganti data / batal
                    </button>
                  </div>

                  <TrustBadge />
                </>
              )}
            </div>
          ) : (
            /* ===== FORM ORDER ===== */
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-base font-bold text-foreground">
                  Nama Lengkap
                </label>
                <Input id="name" placeholder="Contoh: Ibu Ani / Pak Budi" invalid={!!errors.name} className="h-12 text-base" {...register("name")} />
                {errors.name && <p className="text-sm font-semibold text-red-600">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-base font-bold text-foreground">
                  Nomor WhatsApp
                </label>
                <div
                  className={cn(
                    "flex h-12 items-center overflow-hidden rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary",
                    errors.phone && "border-red-500 focus-within:ring-red-500",
                  )}
                >
                  <span className="flex h-full items-center border-r border-border bg-muted px-4 text-base font-bold text-neutral-600">
                    +62
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="81234567890"
                    className="h-full flex-1 bg-transparent px-4 text-base text-foreground placeholder:text-neutral-400 focus:outline-none"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && <p className="text-sm font-semibold text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-base font-bold text-foreground">
                  Alamat Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@gmail.com"
                  invalid={!!errors.email}
                  className="h-12 text-base"
                  {...register("email")}
                />
                <p className="text-sm text-neutral-500">Akses kitab + tools AI dikirim ke email ini, pastikan benar.</p>
                {errors.email && <p className="text-sm font-semibold text-red-600">{errors.email.message}</p>}
              </div>

              {/* Rincian Pesanan + Total */}
              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <p className="font-heading text-lg font-bold text-foreground">{ORDER_FORM_CONTENT.summaryTitle}</p>
                <div className="mt-4 flex flex-col gap-3">
                  {ORDER_FORM_CONTENT.summaryItems.map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">{item.label}</p>
                        {item.note && <p className="text-sm text-neutral-500">{item.note}</p>}
                      </div>
                      <p
                        className={`whitespace-nowrap text-base font-semibold ${
                          item.isDiscount ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-heading text-lg font-bold text-foreground">{ORDER_FORM_CONTENT.totalLabel}</span>
                  <span className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                    {ORDER_FORM_CONTENT.totalValue}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-bold text-foreground">Bisa bayar pakai:</p>
                <div className="flex flex-wrap items-center gap-3">
                  {METHODS.map((m) => (
                    <MethodLogo key={m.id} svg={m.svg} label={m.label} />
                  ))}
                </div>
                <p className="flex items-start gap-2 text-xs text-neutral-500">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  QRIS &amp; Virtual Account semua bank — bayar langsung di halaman ini, aman via DurianPay.
                </p>
              </div>

              <TrustBadge />

              {submitError && (
                <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </p>
              )}

              <Button type="submit" variant="accent" size="lg" disabled={busy} className="mt-1 py-4 text-lg font-black tracking-wide shadow-glow-accent">
                {busy && <Loader2 className="h-5 w-5 animate-spin" />}
                {busy ? "Memproses…" : ORDER_FORM_CONTENT.submitLabel}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
