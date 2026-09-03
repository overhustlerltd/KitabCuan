"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { FINAL_OFFER_CONTENT as C } from "@/lib/constants";

function CountdownTimer({ hours }: { hours: number }) {
  const [remaining, setRemaining] = useState(hours * 3600);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { v: Math.floor(remaining / 86400), label: "HARI" },
    { v: Math.floor((remaining % 86400) / 3600), label: "JAM" },
    { v: Math.floor((remaining % 3600) / 60), label: "MENIT" },
    { v: remaining % 60, label: "DETIK" },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex min-w-[56px] flex-col items-center rounded-xl bg-primary-950/80 px-2 py-2 ring-1 ring-accent-300/30 sm:min-w-[72px]">
            <span className="font-heading text-2xl font-black tabular-nums text-white sm:text-4xl">
              {String(u.v).padStart(2, "0")}
            </span>
            <span className="text-[0.55rem] font-bold uppercase tracking-widest text-accent-300 sm:text-[0.6rem]">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-heading text-xl font-black text-accent-400 sm:text-2xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function FinalOffer() {
  return (
    <section className="relative overflow-hidden border-b border-primary-900 bg-primary-950 text-primary-50">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 -z-0 h-80 w-80 rounded-full bg-primary-500/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-0 bg-grid opacity-[0.07] [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-10 pt-16 text-center md:px-8 md:pb-12 md:pt-24">
        {/* Urgency badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
          className="inline-flex items-center rounded-full bg-red-600 px-5 py-2 font-heading text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_-4px_rgba(220,38,38,0.8)]"
        >
          {C.badge}
        </motion.span>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="mt-6 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {C.headline}
        </motion.h2>

        {/* Pain list */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeInUp}
          className="mt-8 text-lg text-primary-100"
        >
          {C.painIntro}
        </motion.p>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-5 flex w-full max-w-xl flex-col gap-3"
        >
          {C.pains.map((pain) => (
            <motion.li
              key={pain}
              variants={fadeInUp}
              className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                <X className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-base font-medium text-primary-50">{pain}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeInUp}
          className="mt-6 max-w-xl text-base italic text-primary-100/90"
        >
          {C.painClosing}
        </motion.p>

        {/* Pivot */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeInUp}
          className="text-gradient-gold-on-dark mt-14 font-heading text-2xl font-extrabold uppercase tracking-wide sm:text-3xl"
        >
          {C.pivot}
        </motion.p>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeInUp}
          className="mt-4 max-w-xl text-lg text-primary-100"
        >
          {C.pivotBody}
        </motion.p>

        {/* ===== PRICE CARD (the star) ===== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeInUp}
          className="relative mt-10 w-full max-w-lg"
        >
          {/* pulsing glow behind card */}
          <motion.div
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-accent-500/40 blur-2xl"
          />

          <div className="overflow-hidden rounded-3xl border border-accent-300/40 bg-gradient-to-b from-accent-400 to-accent-600 shadow-2xl">
            <div className="px-6 py-7 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
                {C.valueLabel}
              </p>
              <p className="mt-1 font-heading text-3xl font-black tracking-tight text-white sm:text-4xl">
                {C.valueAmount}{" "}
                <span className="align-middle text-lg font-extrabold text-white/80">{C.valueTag}</span>
              </p>
              <p className="mt-1 text-sm text-white/85">{C.valueNote}</p>
            </div>

            <div className="bg-primary-950/85 px-6 py-8 text-center">
              <p className="font-heading text-sm font-bold uppercase tracking-widest text-accent-300">
                {C.todayLabel}
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-xl font-semibold text-primary-200 line-through">
                  {C.todayOriginal}
                </span>
                <motion.span
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-sm font-black uppercase text-white shadow-[0_0_20px_-2px_rgba(220,38,38,0.9)]"
                >
                  🔥 {C.todayDiscount}
                </motion.span>
              </div>

              <p className="text-gradient-gold-on-dark mt-2 px-2 font-heading text-5xl font-black tracking-tight sm:text-6xl">
                {C.todayPrice}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Imagine */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mt-10 max-w-xl text-lg leading-relaxed text-primary-100"
        >
          {C.imagine}
        </motion.p>

        {/* ===== Early bird (50 buyers) ===== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mt-12 w-full max-w-2xl rounded-3xl border-2 border-dashed border-accent-300/60 bg-primary-900/60 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8"
        >
          <span className="inline-block rounded-full bg-accent-500 px-4 py-1.5 font-heading text-sm font-black uppercase tracking-wide text-white shadow-glow-accent">
            {C.earlyBadge}
          </span>
          <p className="mt-4 text-base text-primary-100">{C.earlyLabel}</p>

          <div className="mt-5 grid gap-4 text-left md:grid-cols-2 md:items-stretch">
            {/* Kolom harga — highlight sendiri */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 px-5 py-8 text-center shadow-lg ring-2 ring-accent-300/50">
              <motion.span
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -inset-6 -z-0 rounded-full bg-white/20 blur-2xl"
              />
              <p className="relative z-10 text-[0.7rem] font-black uppercase tracking-widest text-white/90">
                Harga Spesial
              </p>
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 mt-1 font-heading text-4xl font-black leading-none tracking-tight text-white sm:text-5xl"
              >
                {C.earlyPrice}
              </motion.p>
              <p className="relative z-10 mt-2 text-[0.7rem] font-semibold uppercase tracking-wide text-white/85">
                50 Pembeli Pertama
              </p>
            </div>

            {/* Kolom bonus */}
            <div className="rounded-2xl bg-primary-950/50 px-5 py-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-200">
                {C.earlyBonusLabel}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {C.earlyBonuses.map((b) => (
                  <li
                    key={b.text}
                    className="flex items-center gap-3 rounded-xl bg-primary-950/60 px-3 py-2"
                  >
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-sm font-medium text-primary-50">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="mt-10 w-full max-w-xl rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-5"
        >
          <p className="font-heading text-base font-black uppercase tracking-wide text-amber-300">
            {C.warningLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-primary-100">{C.warning}</p>
        </motion.div>

        {/* Urgency close */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mt-10 max-w-xl text-lg font-semibold leading-relaxed text-white"
        >
          <span className="mr-1">💡</span>
          {C.urgency}
        </motion.p>

        {/* Promo + Countdown + CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="mt-12 w-full max-w-xl rounded-3xl border border-accent-300/40 bg-primary-900/60 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-8"
        >
          <p className="font-heading text-lg font-black uppercase leading-snug tracking-wide text-white sm:text-2xl">
            ⏳ {C.promoCtaLabel}
          </p>

          <div className="mt-6">
            <CountdownTimer hours={C.countdownHours} />
          </div>

          <div className="relative mt-7 inline-block">
            <motion.span
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.96, 1.05, 0.96] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-accent-500/60 blur-xl"
            />
            <a
              href={C.ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 px-8 py-4 font-heading text-base font-black uppercase tracking-wide text-white shadow-2xl ring-1 ring-white/20 transition hover:scale-[1.03] sm:px-10 sm:py-5 sm:text-xl"
            >
              {C.ctaLabel}
            </a>
          </div>

          {/* Panah animasi mengarah ke form data pembelian */}
          <div className="mt-6 flex flex-col items-center" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="-mt-2.5 first:mt-0"
                animate={{ opacity: [0.15, 1, 0.15], y: [-2, 4, -2] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
              >
                <ChevronDown className="h-7 w-7 text-accent-300" strokeWidth={2.75} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
