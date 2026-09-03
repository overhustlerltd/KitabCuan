"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SOLUTION_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Solution() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-primary-50/50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(60%_50%_at_50%_35%,black,transparent)]" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8 md:py-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          {SOLUTION_CONTENT.headline}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-foreground"
        >
          {SOLUTION_CONTENT.intro}
        </motion.p>

        <motion.ul variants={fadeInUp} className="mx-auto mt-6 flex max-w-md flex-col gap-2">
          {SOLUTION_CONTENT.struggles.map((s) => (
            <li key={s} className="text-base italic text-foreground/70">
              {s}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={fadeInUp} className="mt-10">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 font-heading text-lg font-bold text-primary">
            {SOLUTION_CONTENT.pivotLabel}
          </span>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-bold text-foreground sm:text-2xl">
            {SOLUTION_CONTENT.pivot}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-foreground">
            {SOLUTION_CONTENT.body}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {SOLUTION_CONTENT.transforms.map((t) => (
            <div
              key={t.from}
              className="flex items-center gap-2 rounded-full border border-primary-200 bg-card px-4 py-2 shadow-sm dark:border-primary-900"
            >
              <span className="text-sm font-medium text-neutral-500 line-through dark:text-neutral-500">
                {t.from}
              </span>
              <MoveRight className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{t.to}</span>
            </div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-8 max-w-2xl text-lg font-medium text-foreground"
        >
          {SOLUTION_CONTENT.closing}
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-10">
          <Link
            href={SOLUTION_CONTENT.ctaHref}
            className={buttonVariants({
              variant: "accent",
              size: "lg",
              className: "shadow-glow-accent px-8 py-4 text-lg font-black tracking-wide",
            })}
          >
            {SOLUTION_CONTENT.ctaLabel}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
