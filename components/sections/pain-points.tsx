"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { PAIN_POINTS_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function PainPoints() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="text-center font-heading text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
        >
          {PAIN_POINTS_CONTENT.headline}
        </motion.h2>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3"
        >
          {PAIN_POINTS_CONTENT.points.map((point) => (
            <motion.li
              key={point}
              variants={fadeInUp}
              className="flex items-center gap-4 rounded-2xl border border-red-200/70 bg-card p-4 shadow-sm dark:border-red-900/40 sm:p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm ring-2 ring-red-500/20">
                <X className="h-5 w-5" strokeWidth={3} />
              </span>
              <p className="text-base font-semibold italic text-foreground sm:text-lg">
                &ldquo;{point}&rdquo;
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeInUp}
          className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 text-center shadow-glow-accent"
        >
          <Sparkles className="h-6 w-6 shrink-0 text-accent-200" />
          <p className="font-heading text-lg font-extrabold text-primary-50 sm:text-xl">
            {PAIN_POINTS_CONTENT.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
