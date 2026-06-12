import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Grandma's Herbals" },
      { name: "description", content: "Terms of service and purchasing guidelines for our botanical shop." },
    ],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16 sm:py-24">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-white border border-stone-200/80 shadow-[0_20px_70px_rgba(73,88,52,0.06)] rounded-[2rem] p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Compliance</p>
                <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-olive-900 mt-1">Terms of Service</h1>
              </div>
            </div>
            
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <p className="text-xs text-stone-400 italic">Last Updated: June 12, 2026</p>
              
              <p>
                Welcome to Grandma&apos;s Herbals. These Terms of Service governs your use of our storefront, membership plans, consultations, and natural products. By accessing our site or purchasing our products, you agree to be bound by these terms.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">1. Eligibility & Accounts</h2>
              <p>
                To register for a wellness membership or book a consultation, you must create a secure account. You are responsible for maintaining the confidentiality of your account credentials and represent that you are at least 18 years of age.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">2. Product Purchases & Membership Tiers</h2>
              <p>
                We offer botanical products and concierge wellness membership packages (Tiers I, II, and III).
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Membership fees are billed on a recurring monthly basis. You may cancel your subscription at any time via your account settings.</li>
                <li>Customized formulations are prepared based on the intake questionnaire. All compounds are prepared for educational and wellness-supportive purposes.</li>
                <li>Product listings, availability, and pricing are subject to change. We reserve the right to refuse orders at our discretion.</li>
              </ul>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">3. Sourcing & Intellectual Property</h2>
              <p>
                All brand systems, formulas, content, and website software are the property of Grandma&apos;s Herbals. By using this service, you agree not to commercially replicate our customized wellness formulations, reverse engineer product structures, or bypass supplier and consulting relationships introduced through the Company.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">4. Disclaimer & Liability Waiver</h2>
              <p>
                Your purchases are subject to our disclaimers. Our natural formulations are not FDA approved and do not constitute medical treatments. You agree that using our services is entirely at your own risk and subject to the Liability Waiver.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">5. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to its conflict-of-law provisions. Any disputes shall be resolved through binding arbitration in Georgia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
