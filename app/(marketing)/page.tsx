import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { PainPoints } from "@/components/sections/pain-points";
import { WhyNow } from "@/components/sections/why-now";
import { ProductContents } from "@/components/sections/product-contents";
import { Bonus } from "@/components/sections/bonus";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { OrderForm } from "@/components/sections/order-form";
import { PurchaseNotification } from "@/components/tools/purchase-notification";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  description: SITE_CONFIG.description,
  openGraph: {
    description: SITE_CONFIG.description,
  },
};

export default function MarketingHomePage() {
  return (
    <main>
      <Hero />
      <PainPoints />
      <WhyNow />
      <ProductContents />
      <Bonus />
      <Pricing />
      <Faq />
      <FinalCta />
      <OrderForm />
      <PurchaseNotification />
    </main>
  );
}
