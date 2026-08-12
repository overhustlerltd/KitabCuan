"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";

// Tree-shake friendly imports for payment logos
import BcaSvg from "idn-finlogos/icons/bca";
import BriSvg from "idn-finlogos/icons/bri";
import MandiriSvg from "idn-finlogos/icons/mandiri";
import BniSvg from "idn-finlogos/icons/bni";
import GopaySvg from "idn-finlogos/icons/gopay";
import DanaSvg from "idn-finlogos/icons/dana";
import ShopeepayOld from "idn-finlogos/icons/shopeepay";
import QrisSvg from "idn-finlogos/icons/qris";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ORDER_FORM_CONTENT } from "@/lib/constants";

const phoneRegex = /^8[0-9]{8,11}$/;

const orderFormSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(phoneRegex, "Nomor tidak valid, contoh: 81234567890"),
  email: z.string().trim().email("Format email tidak valid"),
  paymentMethod: z.string().min(1, "Pilih salah satu metode pembayaran"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type LogoMap = { svg: string; title: string };

const SINGLE_PAYMENT_LOGOS: Record<string, LogoMap> = {
  bca: { svg: BcaSvg, title: "Bank Central Asia" },
  qris: { svg: QrisSvg, title: "QRIS" },
  bri: { svg: BriSvg, title: "BRI Virtual Account" },
  mandiri: { svg: MandiriSvg, title: "Bank Mandiri Virtual Account" },
  bni: { svg: BniSvg, title: "BNI Virtual Account" },
  dana: { svg: DanaSvg, title: "Dana" },
  shopeepay: { svg: ShopeepayOld, title: "ShopeePay" },
  gopay: { svg: GopaySvg, title: "GoPay" },
};

/** Inline SVG badge */
function SvgLogo({ svg, title, size = 36 }: { svg: string; title: string; size?: number }) {
  const styled = svg.replace(
    /<svg/,
    `<svg style="width:${size}px;height:auto;display:block;"`,
  );
  return (
    <span
      role="img"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: styled }}
      className="contents"
    />
  );
}

function PaymentMethodRow({
  method,
  isActive,
  onClick,
}: {
  method: (typeof ORDER_FORM_CONTENT.paymentMethods)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const logo = SINGLE_PAYMENT_LOGOS[method.value];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-150 sm:px-5 sm:py-4",
        isActive
          ? "border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-400/40"
          : "border-amber-200/80 bg-neutral-50/50 hover:border-amber-400 hover:bg-neutral-50",
      )}
    >
      {/* Radio Circle Indicator */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isActive ? "border-amber-600 bg-white" : "border-neutral-400 bg-white",
        )}
      >
        {isActive && <div className="h-2.5 w-2.5 rounded-full bg-amber-600" />}
      </div>

      {/* Logo */}
      {logo && (
        <div className="flex h-7 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-0.5 shadow-2xs">
          <SvgLogo svg={logo.svg} title={logo.title} size={method.value === "qris" ? 48 : 36} />
        </div>
      )}

      {/* Label */}
      <span
        className={cn(
          "text-base font-bold sm:text-lg",
          isActive ? "text-amber-950" : "text-neutral-800",
        )}
      >
        {method.label}
      </span>
    </button>
  );
}

export function OrderForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { name: "", phone: "", email: "", paymentMethod: "bca" },
  });

  const onSubmit = async (data: OrderFormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitted(true);
    reset();
  };

  return (
    <section id="order" className="bg-neutral-100/60 py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {ORDER_FORM_CONTENT.headline}
          </h2>
          <p className="text-base text-neutral-600 sm:text-lg">{ORDER_FORM_CONTENT.description}</p>
        </div>

        <div className="mt-8 rounded-3xl border-2 border-border bg-card p-6 shadow-md sm:p-8">
          {isSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="font-heading text-xl font-bold text-foreground">Pendaftaran Berhasil!</p>
              <p className="max-w-sm text-base text-neutral-600">
                {ORDER_FORM_CONTENT.successMessage}
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-3 text-base font-bold text-primary hover:underline"
              >
                Isi form lagi
              </button>
            </div>
          ) : (
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
                {errors.email && <p className="text-sm font-semibold text-red-600">{errors.email.message}</p>}
              </div>

              {/* Metode Pembayaran List (Persis Gambar 1) */}
              <div className="flex flex-col gap-3">
                <span className="font-heading text-lg font-bold text-foreground">
                  Metode Pembayaran:
                </span>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3">
                      {ORDER_FORM_CONTENT.paymentMethods.map((method) => (
                        <PaymentMethodRow
                          key={method.value}
                          method={method}
                          isActive={field.value === method.value}
                          onClick={() => field.onChange(method.value)}
                        />
                      ))}
                    </div>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-sm font-semibold text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>

              <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="mt-3 py-4 text-lg font-black tracking-wide shadow-glow-accent">
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {ORDER_FORM_CONTENT.submitLabel}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
