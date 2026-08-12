"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { ChefHat } from "lucide-react";

type BuyerNotification = {
  id: number;
  name: string;
  location: string;
  product: string;
  price: string;
  timeAgo: string;
};

const SAMPLE_BUYERS: BuyerNotification[] = [
  { id: 1, name: "Mustika", location: "Surabaya", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "12 menit yang lalu" },
  { id: 2, name: "Ibu Rahmawati", location: "Bandung", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "18 menit yang lalu" },
  { id: 3, name: "Siti Nurjanah", location: "Semarang", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "25 menit yang lalu" },
  { id: 4, name: "Dewi Handayani", location: "Jakarta", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "34 menit yang lalu" },
  { id: 5, name: "Ratna Sari", location: "Yogyakarta", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "42 menit yang lalu" },
  { id: 6, name: "Tri Wahyuni", location: "Malang", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "47 menit yang lalu" },
  { id: 7, name: "Maya Kartika", location: "Medan", product: "KitabCuan Resep Dapur", price: "Rp197.000", timeAgo: "53 menit yang lalu" },
];

export function PurchaseNotification() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Rotate notification every 8 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % SAMPLE_BUYERS.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = SAMPLE_BUYERS[index];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-[18rem] sm:max-w-xs">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5"
          >
            {/* Main content padding */}
            <div className="p-3.5 sm:p-4">
              {/* Header Badge & Close Button */}
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-amber-600">
                  🔔 PEMBELIAN TERVERIFIKASI
                </span>
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  aria-label="Tutup notifikasi"
                  className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Body: Thumbnail + Info */}
              <div className="flex items-center gap-3">
                {/* Book Thumbnail Icon with Verified Checkmark */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-kitab text-white shadow-sm ring-1 ring-primary/20">
                  <ChefHat className="h-6 w-6 text-amber-200" />
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                    <CheckCircle2 className="h-3 w-3 fill-emerald-500 text-white" />
                  </div>
                </div>

                {/* Buyer & Purchase Text */}
                <div className="flex flex-col text-left">
                  <p className="text-xs leading-tight text-neutral-800 sm:text-sm">
                    <strong className="font-extrabold text-foreground">{current.name}</strong>{" "}
                    <span className="text-neutral-600">baru saja membeli</span>
                  </p>
                  <p className="text-[0.75rem] font-semibold text-neutral-500">
                    {current.product}
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="font-heading text-sm font-extrabold text-emerald-600">
                      {current.price}
                    </span>
                    <span className="text-[0.68rem] text-neutral-400">
                      {current.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Orange Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
