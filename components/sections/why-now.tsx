"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { WHY_NOW_CONTENT } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";

const HighlightIcon = ICON_MAP[WHY_NOW_CONTENT.highlight.icon];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function WhyNow() {
  return (
    <section className="bg-gradient-to-b from-background via-primary-50/50 to-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto flex max-w-2xl flex-col gap-4 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {WHY_NOW_CONTENT.headline}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-neutral-600">
            {WHY_NOW_CONTENT.subheadline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid gap-5 md:grid-cols-2"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-card p-6 shadow-sm"
          >
            <h3 className="font-heading text-lg font-semibold text-neutral-500">{WHY_NOW_CONTENT.before.title}</h3>
            <ul className="flex flex-col gap-3">
              {WHY_NOW_CONTENT.before.points.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-4 rounded-2xl border border-primary-300/60 bg-primary-50/60 p-6 shadow-sm"
          >
            <h3 className="font-heading text-lg font-semibold text-primary">{WHY_NOW_CONTENT.after.title}</h3>
            <ul className="flex flex-col gap-3">
              {WHY_NOW_CONTENT.after.points.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 grid gap-5 sm:grid-cols-3"
        >
          {WHY_NOW_CONTENT.checklist.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <motion.div key={item.title} variants={fadeInUp} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-base font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="relative mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 overflow-hidden rounded-2xl border border-accent-300/40 bg-accent-50/70 px-6 py-8 text-center shadow-sm"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-400/20 text-accent-700">
            <HighlightIcon className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            {WHY_NOW_CONTENT.highlight.title}
          </h3>
          <p className="max-w-md text-sm text-neutral-600">{WHY_NOW_CONTENT.highlight.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
