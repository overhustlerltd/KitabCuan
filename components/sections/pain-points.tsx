"use client";

import { motion, type Variants } from "framer-motion";
import { Users } from "lucide-react";
import { PAIN_POINTS_CONTENT } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function PainPoints() {
  return (
    <section className="bg-muted/40">
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
            {PAIN_POINTS_CONTENT.headline}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-neutral-600 dark:text-neutral-400">
            {PAIN_POINTS_CONTENT.subheadline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PAIN_POINTS_CONTENT.points.map((point) => {
            const Icon = ICON_MAP[point.icon];
            return (
              <motion.div
                key={point.title}
                variants={fadeInUp}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{point.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{point.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="mx-auto mt-8 flex max-w-xl items-center gap-4 rounded-2xl border border-primary-200 bg-primary/5 p-5 dark:border-primary-900"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{PAIN_POINTS_CONTENT.reassurance.title}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {PAIN_POINTS_CONTENT.reassurance.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
