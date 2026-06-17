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
      <FAQSection />
      <About />
      <Social />
    </SiteLayout>
  );
}
