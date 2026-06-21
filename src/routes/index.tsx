import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { MembershipSection } from "@/components/site/MembershipSection";
import { ConsultationSection } from "@/components/site/ConsultationSection";
import { Testimonials } from "@/components/site/Testimonials";
import { StoriesSection } from "@/components/site/StoriesSection";
import { About } from "@/components/site/About";
import { Social } from "@/components/site/Social";
import { FAQSection } from "@/components/site/FAQSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grandma's Herbals — Integrative Regenerative Wellness" },
      { name: "description", content: "Experience Integrative Regenerative Wellness through personalized botanical compounds, consultations, guided meditation, and a holistic community." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* 1. Hero Slideshow Section */}
      <Hero />

      {/* 2. Shop (Featured Products) Section with clean transition */}
      <div className="bg-white border-t border-stone-200/50">
        <FeaturedProducts />
      </div>

      {/* 3. Membership Tiers & Add-ons Section */}
      <div className="bg-[#FAF8F5] border-t border-stone-200/50">
        <MembershipSection showHeader={true} />
      </div>

      {/* 4. Consultation Booking Section */}
      <div className="bg-white border-t border-stone-200/50">
        <ConsultationSection showHeader={true} />
      </div>

      {/* 5. Testimonials (Video & Text) Section */}
      <div className="bg-[#FAF8F5] border-t border-stone-200/50">
        <Testimonials />
      </div>

      {/* 6. Stories & Milestones Section */}
      <div className="bg-white border-t border-stone-200/50 pt-16">
        <StoriesSection />
      </div>

      {/* 7. About (Heritage & Generations) Section */}
      <div className="border-t border-stone-200/50">
        <About />
      </div>

      {/* 8. FAQ Section */}
      <div className="bg-[#FAF8F5] border-t border-stone-200/50">
        <FAQSection />
      </div>

      {/* 9. Social Media Section */}
      <div className="bg-white border-t border-stone-200/50">
        <Social />
      </div>
    </SiteLayout>
  );
}
