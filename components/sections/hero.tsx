"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, BookOpen, ChefHat, TrendingUp, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HERO_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const bookReveal: Variants = {
  hidden: { opacity: 0, y: 30, rotateY: -26 },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: -13,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

// Mini recipe card items for decorative book cover
const RECIPE_ITEMS = [
  { emoji: "🍜", name: "Mie Goreng Spesial" },
  { emoji: "🍱", name: "Nasi Box Ayam" },
  { emoji: "🧁", name: "Kue Kering Lebaran" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-8 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-300/40 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary"
          >
            <ChefHat className="h-4 w-4 text-primary" />
            {HERO_CONTENT.eyebrow}
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-heading text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-[4rem]"
          >
            {HERO_CONTENT.headlineLine1}
            <br />
            <span className="text-gradient-gold">{HERO_CONTENT.headlineLine2}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="max-w-lg text-lg leading-relaxed text-neutral-600 sm:text-xl"
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          {/* Banner Diskon Menonjol di Hero */}
          <motion.div variants={fadeInUp} className="inline-flex w-fit items-center gap-2 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 shadow-sm">
            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-black text-white uppercase">
              DISKON 60%
            </span>
            <span>HANYA Rp197.000 <span className="text-xs font-normal text-neutral-500 line-through">Rp497.000</span></span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={HERO_CONTENT.primaryCta.href}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "shadow-glow-accent py-4 px-8 text-lg font-black tracking-wide",
              })}
            >
              {HERO_CONTENT.primaryCta.label}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={HERO_CONTENT.secondaryCta.href}
              className="group inline-flex items-center justify-center gap-1.5 px-2 py-3 text-base font-bold text-foreground transition-colors hover:text-primary"
            >
              <BookOpen className="h-5 w-5" />
              {HERO_CONTENT.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "bg-primary-300",
                  "bg-primary-400",
                  "bg-primary-500",
                  "bg-accent-400",
                ].map((toneClass) => (
                  <div
                    key={toneClass}
                    className={`h-8 w-8 rounded-full border-2 border-background ${toneClass}`}
                  />
                ))}
              </div>
              <p className="text-sm">
                <span className="font-semibold text-foreground">{HERO_CONTENT.socialProofCount}</span>{" "}
                <span className="text-neutral-600">
                  {HERO_CONTENT.socialProofLabel}
                </span>
              </p>
            </div>
            <p className="text-xs text-neutral-500">{HERO_CONTENT.socialProofNote}</p>
          </motion.div>
        </motion.div>

        {/* Recipe Book Visual */}
        <motion.div
          variants={bookReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm md:mx-0 md:justify-self-end"
          style={{ perspective: 1400 }}
        >
          <div className="pointer-events-none absolute -inset-10 -z-10 animate-pulse-glow rounded-full bg-primary-400/15 blur-3xl" />

          {/* Sampul Buku Resep */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-l-md rounded-r-2xl bg-gradient-kitab shadow-elevate ring-1 ring-primary-400/30">
            {/* Book spine */}
            <div className="absolute inset-y-0 left-0 w-4 bg-primary-950/50" />
            <div className="absolute inset-y-0 left-4 w-px bg-primary-300/30" />
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-50/5 to-primary-50/10" />

            {/* Decorative dots pattern on upper right */}
            <div className="absolute right-4 top-4 grid grid-cols-4 gap-1 opacity-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-primary-100" />
              ))}
            </div>

            <div className="relative flex h-full flex-col justify-between p-6 pl-9 sm:p-7 sm:pl-11">
              {/* Edition badge */}
              <span className="w-fit rounded-full border border-primary-300/30 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-primary-200">
                {HERO_CONTENT.bookEdition}
              </span>

              {/* Book title area */}
              <div>
                {/* Mini decorative recipe list */}
                <div className="mb-4 flex flex-col gap-1.5">
                  {RECIPE_ITEMS.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 rounded-lg bg-primary-950/30 px-2.5 py-1.5 backdrop-blur-sm"
                    >
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-[0.65rem] font-medium text-primary-100/90">{item.name}</span>
                    </div>
                  ))}
                </div>

                <p className="font-heading text-4xl font-extrabold leading-none tracking-tight text-primary-50 sm:text-5xl">
                  {HERO_CONTENT.bookTitleTop}
                </p>
                <p className="text-gradient-gold-on-dark font-heading text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
                  {HERO_CONTENT.bookTitleBottom}
                </p>
                <div className="mt-4 h-px w-14 bg-accent-300/60" />
                <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-primary-100/80">
                  Dari dapur rumah sampai rekening cuan pertama.
                </p>
              </div>

              <UtensilsCrossed className="h-7 w-7 text-primary-300/60" strokeWidth={1.5} />
            </div>
          </div>

          {/* Floating stat card — bottom left */}
          <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-elevate sm:-left-6 sm:p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-400/15">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{HERO_CONTENT.statCardLabel}</p>
              <p className="text-sm font-bold text-card-foreground">{HERO_CONTENT.statCardValue}</p>
            </div>
          </div>

          {/* Floating chapter card — top right */}
          <div className="absolute -right-3 top-8 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-elevate sm:-right-5">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[0.65rem] leading-tight text-muted-foreground">
                {HERO_CONTENT.chapterCardLabel}
              </p>
              <p className="text-xs font-bold leading-tight text-card-foreground">
                {HERO_CONTENT.chapterCardValue}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
