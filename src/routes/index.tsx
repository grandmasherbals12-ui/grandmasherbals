import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { Social } from "@/components/site/Social";
import { FAQSection } from "@/components/site/FAQSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <FeaturedProducts />
      <Testimonials />
      <About />
      <FAQSection />
      <div className="w-full p-0 m-0 overflow-hidden">
        <img
          src="/yogaplant.jpeg"
          alt="Grandma's Herbals Botanical Scene"
          className="w-full h-auto block"
        />
      </div>
      <Social />
    </SiteLayout>
  );
}
