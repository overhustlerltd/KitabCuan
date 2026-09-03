"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT_REVEAL_CONTENT as C } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function ProductReveal() {
  return (
    <section id="produk" className="border-b border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-accent-400/40 bg-accent-50 px-4 py-1.5 font-heading text-sm font-bold uppercase tracking-wide text-accent-700">
            {C.eyebrow}
          </span>
        </motion.div>

        {/* Product mockup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mt-8 flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kitabcuan-cover.png"
            alt="KitabCuan — Paket Usaha Sumber Cuan"
            width={860}
            height={1040}
            className="h-auto w-full max-w-md select-none"
            draggable={false}
          />
        </motion.div>

        {/* Heading below the book */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="mx-auto mt-12 max-w-2xl text-center font-heading text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
        >
          {C.headline}
        </motion.h2>

        {/* Core deliverables */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {C.core.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-elevate"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {item.emoji}
              </span>
              <h3 className="font-heading text-lg font-bold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bonus header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
            🎁 {C.bonusTitle}
          </h3>
          <p className="mt-3 inline-block rounded-full bg-accent-500/12 px-4 py-1 text-sm font-bold text-accent-700">
            {C.bonusValueNote}
          </p>
        </motion.div>

        {/* Bonus grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {C.bonuses.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeInUp}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                <Lock className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <h4 className="font-heading text-base font-bold text-card-foreground">{b.title}</h4>
                  <span className="shrink-0 rounded-full bg-accent-500/12 px-2.5 py-0.5 text-xs font-bold text-accent-700">
                    Senilai {b.value}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{b.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Total value + pricing */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeInUp}
          className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-3xl border border-primary-200 shadow-elevate"
        >
          {/* total value */}
          <div className="bg-primary/5 px-6 py-8 text-center">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-foreground/70">
              💎 {C.totalLabel}
            </p>
            <p className="mt-2 font-heading text-4xl font-extrabold text-foreground line-through decoration-red-500/70 decoration-[3px] sm:text-5xl">
              {C.totalValue}
            </p>
          </div>

          {/* today price */}
          <div className="bg-gradient-to-b from-primary-500 to-primary-700 px-6 py-8 text-center">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
              🔥 {C.todayLabel}
            </span>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-100">{C.priceLead}</p>
            <p className="mt-2 font-heading text-5xl font-extrabold text-white sm:text-6xl">{C.promoPrice}</p>
            <p className="mt-1 text-sm font-semibold text-primary-100">(Akses seumur hidup)</p>
            <a
              href={C.ctaHref}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "mt-6 w-full px-6 py-4 text-base font-black tracking-wide shadow-glow-accent sm:text-lg",
              })}
            >
              {C.ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
