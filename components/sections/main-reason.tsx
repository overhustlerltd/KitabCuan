"use client";

import { motion, type Variants } from "framer-motion";
import { MAIN_REASON_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function MainReason() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mx-auto max-w-3xl text-center font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          {MAIN_REASON_CONTENT.headline}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {MAIN_REASON_CONTENT.reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={fadeInUp}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-elevate"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {reason.emoji}
              </span>
              <h3 className="font-heading text-lg font-bold text-card-foreground sm:text-xl">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
