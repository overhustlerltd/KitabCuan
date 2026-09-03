"use client";

import { motion, type Variants } from "framer-motion";
import { AUDIENCE_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Audience() {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl">
            {AUDIENCE_CONTENT.headline}
          </h2>
          <p className="mt-3 text-lg text-foreground/70">{AUDIENCE_CONTENT.subheadline}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {AUDIENCE_CONTENT.items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-elevate"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl">
                {item.emoji}
              </span>
              <h3 className="font-heading text-base font-bold text-card-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
