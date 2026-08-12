"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Tag, Timer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FINAL_CTA_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-background via-amber-50/60 to-primary-50/40 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-black text-white shadow-sm">
              <Timer className="h-4 w-4" />
              {FINAL_CTA_CONTENT.eyebrow}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            {FINAL_CTA_CONTENT.headline}
          </motion.h2>

          <motion.p variants={fadeInUp} className="max-w-xl text-lg text-neutral-700 sm:text-xl font-medium">
            {FINAL_CTA_CONTENT.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-2 flex flex-col items-center gap-2 rounded-3xl border-2 border-accent-400/50 bg-card px-8 py-6 shadow-md"
          >
            <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{FINAL_CTA_CONTENT.priceRecapLabel}</span>
            <div className="flex items-center gap-3">
              <span className="text-xl text-neutral-400 line-through font-bold sm:text-2xl">
                {FINAL_CTA_CONTENT.originalPrice}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-1 text-sm font-black text-amber-800 border border-amber-400/40">
                <Tag className="h-4 w-4" />
                {FINAL_CTA_CONTENT.savingsBadge}
              </span>
            </div>
            <span className="font-heading text-6xl font-black text-accent-700 sm:text-7xl">
              {FINAL_CTA_CONTENT.promoPrice}
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full max-w-md">
            <Link
              href={FINAL_CTA_CONTENT.ctaHref}
              className={buttonVariants({ variant: "accent", size: "lg", className: "mt-3 w-full py-4 text-lg font-black tracking-wide shadow-glow-accent sm:text-xl" })}
            >
              {FINAL_CTA_CONTENT.ctaLabel}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
