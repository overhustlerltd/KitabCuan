"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BRIDGE_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Bridge() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50/50 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(55%_50%_at_50%_30%,black,transparent)]" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-8 pt-16 text-center md:px-8 md:pb-10 md:pt-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          {BRIDGE_CONTENT.headline}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80"
        >
          {BRIDGE_CONTENT.body}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="text-gradient-gold mt-8 font-heading text-2xl font-extrabold uppercase tracking-tight sm:text-3xl md:text-4xl"
        >
          {BRIDGE_CONTENT.highlight}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-6 flex flex-col items-center"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="-mt-3 first:mt-0"
              animate={{ opacity: [0.15, 1, 0.15], y: [-3, 4, -3] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <ChevronDown className="h-9 w-9 text-primary sm:h-10 sm:w-10" strokeWidth={2.75} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
