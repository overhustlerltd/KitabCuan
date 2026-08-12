"use client";

import { motion, type Variants } from "framer-motion";
import { PRODUCT_CONTENTS_CONTENT } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ProductContents() {
  return (
    <section id="isi-kitab" className="bg-background py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto flex max-w-2xl flex-col gap-3 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {PRODUCT_CONTENTS_CONTENT.headline}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-neutral-600 sm:text-xl">
            {PRODUCT_CONTENTS_CONTENT.subheadline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PRODUCT_CONTENTS_CONTENT.items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                className="group flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-gradient-gold font-heading text-5xl font-black">{item.value}</p>
                <p className="text-base font-semibold text-neutral-700 sm:text-lg">{item.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
