"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Check, Flame, Tag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PRICING_CONTENT } from "@/lib/constants";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Pricing() {
  return (
    <section id="harga" className="bg-neutral-50/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mx-auto max-w-2xl overflow-hidden rounded-3xl border-2 border-accent-500/50 bg-card shadow-xl"
        >
          {/* Top Banner Diskon Besar */}
          <div className="flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 px-6 py-4 text-center text-white">
            <span className="flex items-center gap-2 font-heading text-lg font-black uppercase tracking-wider text-amber-200">
              <Flame className="h-5 w-5 text-amber-200" />
              PROMO DISKON 70% KHUSUS HARI INI
            </span>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold tracking-wide text-white">
              {PRICING_CONTENT.savingsText} — CUMA DENGAN RP149.000
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {PRICING_CONTENT.title}
            </h2>
            <p className="text-base text-neutral-600 sm:text-lg">{PRICING_CONTENT.description}</p>

            {/* Display Harga Jumbo untuk Umur 35+ */}
            <div className="my-2 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-accent-300/40 bg-accent-50/60 px-8 py-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-neutral-400 line-through sm:text-2xl">
                  {PRICING_CONTENT.originalPrice}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-sm font-black text-white shadow-sm">
                  <Tag className="h-4 w-4" />
                  DISKON 70%
                </span>
              </div>

              {/* Promo Price HUGE Text */}
              <span className="font-heading text-6xl font-black tracking-tight text-accent-700 sm:text-7xl">
                {PRICING_CONTENT.promoPrice}
              </span>

              <span className="text-sm font-bold text-primary sm:text-base">
                ✅ {PRICING_CONTENT.priceNote} (Akses Seumur Hidup)
              </span>
            </div>
          </div>

          {/* Checklist Manfaat dengan Font Besar & Jelas */}
          <div className="flex flex-col gap-3.5 border-t border-border bg-neutral-50/70 px-6 py-8 sm:px-10">
            <p className="font-heading text-base font-bold text-foreground sm:text-lg">
              Yang Akan Kamu Dapatkan:
            </p>
            {PRICING_CONTENT.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 text-base text-foreground sm:text-lg">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
                <span className="font-medium text-neutral-800">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Tombol CTA Jumbo Sangat Jelas */}
          <div className="flex flex-col items-center gap-3 px-6 pb-10 pt-6 sm:px-10">
            <Link
              href={PRICING_CONTENT.ctaHref}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "w-full py-4 text-lg font-black tracking-wide shadow-glow-accent sm:text-xl",
              })}
            >
              {PRICING_CONTENT.ctaLabel}
            </Link>
            <p className="text-sm font-medium text-neutral-500">{PRICING_CONTENT.footnote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
