import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Testimonials } from "@/components/sections/testimonials";
import { PainPoints } from "@/components/sections/pain-points";
import { Solution } from "@/components/sections/solution";
import { Audience } from "@/components/sections/audience";
import { Bridge } from "@/components/sections/bridge";
import { ProductReveal } from "@/components/sections/product-reveal";
import { Imagine } from "@/components/sections/imagine";
import { MainReason } from "@/components/sections/main-reason";
import { Bonus } from "@/components/sections/bonus";
import { FinalOffer } from "@/components/sections/final-offer";
import { Faq } from "@/components/sections/faq";
import { OrderForm } from "@/components/sections/order-form";
import { PurchaseNotification } from "@/components/tools/purchase-notification";
import { PixelEvent } from "@/components/analytics/meta-pixel";
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
      <PixelEvent event="ViewContent" params={{ content_name: "KitabCuan", content_category: "ebook" }} />
      <Hero />
      <Testimonials />
      <PainPoints />
      <Solution />
      <Audience />
      <Bridge />
      <ProductReveal />
      <Imagine />
      <MainReason />
      <Faq />
      <Bonus />
      <FinalOffer />
      <OrderForm />
      <PurchaseNotification />
    </main>
  );
}
