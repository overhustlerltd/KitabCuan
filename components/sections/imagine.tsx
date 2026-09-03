"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { IMAGINE_CONTENT as C } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function Imagine() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-primary-50/50 to-background">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="text-center font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          💭 {C.headline}
        </motion.h2>

        {/* Timeline */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mx-auto mt-12 max-w-2xl"
        >
          {/* vertical connector line */}
          <div className="pointer-events-none absolute bottom-8 left-[27px] top-4 w-0.5 bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" />

          {C.steps.map((step, i) => (
            <motion.li key={i} variants={fadeInUp} className="relative flex items-start gap-5 pb-6 last:pb-0">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary-200 bg-card text-2xl shadow-sm">
                {step.emoji}
              </span>
              <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
                {"time" in step && step.time && (
                  <span className="mb-1.5 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
                    {step.time}
                  </span>
                )}
                <p className="text-base leading-relaxed text-foreground/80">
                  {step.seg.map((s, j) =>
                    "b" in s && s.b ? (
                      <strong key={j} className="font-bold text-foreground">
                        {s.t}
                      </strong>
                    ) : (
                      <span key={j}>{s.t}</span>
                    ),
                  )}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Reassurance */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mx-auto mt-10 max-w-2xl text-center text-lg font-semibold text-foreground"
        >
          {C.reassure}
        </motion.p>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-6 flex max-w-xl flex-col gap-3"
        >
          {C.withouts.map((w) => (
            <motion.li
              key={w}
              variants={fadeInUp}
              className="flex items-center gap-3 rounded-xl border border-primary-200/60 bg-primary-50/60 px-4 py-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className="text-base font-semibold text-foreground">{w}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Closing / transformation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="mx-auto mt-14 max-w-2xl rounded-3xl border border-primary-200 bg-card p-7 text-center shadow-elevate sm:p-9"
        >
          <h3 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            {C.closingTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-base leading-relaxed text-foreground/75">
            {C.closingBody}
          </p>

          {/* FOMO income banner */}
          <div className="mx-auto mt-7 max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 shadow-glow-accent">
            <p className="text-sm leading-relaxed text-primary-100">{C.fomoLead}</p>
            <p className="text-gradient-gold-on-dark mt-1 font-heading text-3xl font-black tracking-tight sm:text-4xl">
              {C.fomoHighlight}
            </p>
          </div>

          <p className="mt-6 text-base font-semibold uppercase tracking-wide text-foreground/60">
            {C.transition}
          </p>
          <p className="mx-auto mt-2 max-w-lg font-heading text-xl font-extrabold text-foreground sm:text-2xl">
            {C.finalLine}
          </p>

          <a
            href={C.ctaHref}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 px-8 py-4 font-heading text-base font-black uppercase tracking-wide text-white shadow-2xl ring-1 ring-white/20 transition hover:scale-[1.03] sm:text-lg"
          >
            {C.ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
