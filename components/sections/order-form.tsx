"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

// Logo metode pembayaran (display-only) — sesuai channel aktif di DurianPay.
import QrisSvg from "idn-finlogos/icons/qris";
import BcaSvg from "idn-finlogos/icons/bca";
import BriSvg from "idn-finlogos/icons/bri";
import MandiriSvg from "idn-finlogos/icons/mandiri";
import BniSvg from "idn-finlogos/icons/bni";
import PermataSvg from "idn-finlogos/icons/permata";
import CimbSvg from "idn-finlogos/icons/cimb-niaga";
import OvoSvg from "idn-finlogos/icons/ovo";
import LinkAjaSvg from "idn-finlogos/icons/link-aja";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_FORM_CONTENT } from "@/lib/constants";
import { trackFb } from "@/components/analytics/meta-pixel";

const SUPPORTED_METHODS: { svg: string; label: string }[] = [
  { svg: QrisSvg, label: "QRIS" },
  { svg: BcaSvg, label: "BCA Virtual Account" },
  { svg: BriSvg, label: "BRI Virtual Account" },
  { svg: MandiriSvg, label: "Mandiri Virtual Account" },
  { svg: BniSvg, label: "BNI Virtual Account" },
  { svg: PermataSvg, label: "Permata Virtual Account" },
  { svg: CimbSvg, label: "CIMB Niaga Virtual Account" },
  { svg: OvoSvg, label: "OVO" },
  { svg: LinkAjaSvg, label: "LinkAja" },
];

/** Badge logo inline dari string SVG idn-finlogos. */
function PaymentBadge({ svg, label }: { svg: string; label: string }) {
  const styled = svg.replace(/<svg/, `<svg style="width:100%;height:100%;display:block;object-fit:contain;"`);
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="flex h-9 w-16 items-center justify-center rounded-lg border border-border bg-white p-1.5 shadow-2xs"
      dangerouslySetInnerHTML={{ __html: styled }}
    />
  );
}

const phoneRegex = /^8[0-9]{8,11}$/;

const orderFormSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(phoneRegex, "Nomor tidak valid, contoh: 81234567890"),
  email: z.string().trim().email("Format email tidak valid"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function OrderForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
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
        paymentUrl?: string;
      };
      if (res.ok && json.ok && json.paymentUrl) {
        trackFb("Lead", { content_name: "KitabCuan", currency: "IDR", value: 197000 });
        trackFb("InitiateCheckout", { content_name: "KitabCuan", currency: "IDR", value: 197000 });
        setRedirecting(true);
        window.location.href = json.paymentUrl;
        return;
      }
      setSubmitError(ORDER_FORM_CONTENT.errorMessage);
    } catch {
      setSubmitError(ORDER_FORM_CONTENT.errorMessage);
    }
  };

  const busy = isSubmitting || redirecting;

  return (
    <section id="order" className="bg-neutral-100/60 pb-16 pt-10 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-base text-neutral-600 sm:text-lg">{ORDER_FORM_CONTENT.description}</p>
        </div>

        <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 shadow-md sm:p-8">
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
              <p className="font-heading text-lg font-bold text-foreground">
                {ORDER_FORM_CONTENT.summaryTitle}
              </p>
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
                <span className="font-heading text-lg font-bold text-foreground">
                  {ORDER_FORM_CONTENT.totalLabel}
                </span>
                <span className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                  {ORDER_FORM_CONTENT.totalValue}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-bold text-foreground">Bisa bayar pakai:</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_METHODS.map((m) => (
                  <PaymentBadge key={m.label} svg={m.svg} label={m.label} />
                ))}
              </div>
              <p className="flex items-start gap-2 text-xs text-neutral-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {ORDER_FORM_CONTENT.paymentNote}
              </p>
            </div>

            {submitError && (
              <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {submitError}
              </p>
            )}

            <Button type="submit" variant="accent" size="lg" disabled={busy} className="mt-1 py-4 text-lg font-black tracking-wide shadow-glow-accent">
              {busy && <Loader2 className="h-5 w-5 animate-spin" />}
              {redirecting ? "Mengarahkan ke pembayaran…" : ORDER_FORM_CONTENT.submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
