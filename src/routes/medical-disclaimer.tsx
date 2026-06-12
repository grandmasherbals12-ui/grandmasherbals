import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/medical-disclaimer")({
  head: () => ({
    meta: [
      { title: "Medical Disclaimer — Grandma's Herbals" },
      { name: "description", content: "Important notice regarding our natural formulations and wellness guidance." },
    ],
  }),
  component: MedicalDisclaimerPage,
});

function MedicalDisclaimerPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16 sm:py-24">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-white border border-stone-200/80 shadow-[0_20px_70px_rgba(73,88,52,0.06)] rounded-[2rem] p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Compliance</p>
                <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-olive-900 mt-1">Medical Disclaimer</h1>
              </div>
            </div>
            
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <p className="text-xs text-stone-400 italic">Last Updated: June 12, 2026</p>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-xl text-amber-900 font-semibold mb-6">
                GRANDMA&apos;S HERBALS PRODUCTS, SERVICES, DISCUSSIONS, AND AUTO-GENERATED PROGRESS REPORTS ARE EDUCATIONAL AND GENERAL WELLNESS-SUPPORTIVE IN NATURE. THEY ARE NOT MEDICAL TREATMENTS AND DO NOT REPLACE INDIVIDUALIZED MEDICAL PRACTICE.
              </div>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">1. Educational & General Wellness Purpose</h2>
              <p>
                All materials, information, products, and services found on this website—including online assessments, ingredient reviews, consultations, chatbot advice, and daily progress logs—are presented solely for traditional botanical education and general wellness support. They are intended to assist you in building healthy lifestyle habits and are not designed to serve as diagnostic tools or medical interventions.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">2. No FDA Evaluation</h2>
              <p>
                The botanical ingredients, extracts, capsules, and formulas recommended or sold by Grandma&apos;s Herbals have not been evaluated by the United States Food and Drug Administration (FDA). Our natural products and formulations are not approved to diagnose, treat, cure, mitigate, or prevent any illness, disease, disorder, or physical/mental condition.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">3. Not a Substitute for Medical Advice</h2>
              <p>
                Our services and communications do not establish a physician-patient, therapist-patient, or pharmacist-patient relationship. You should never treat website information or wellness formulas as a substitute for professional medical counsel. Always seek the advice of your doctor, pharmacist, or qualified healthcare provider regarding:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Any existing or suspected medical condition.</li>
                <li>Before starting a new botanical program, supplement routine, or lifestyle regimen.</li>
                <li>Potential interactions between herbs and your current prescription medications.</li>
                <li>Adjusting any current pharmaceutical prescriptions.</li>
              </ul>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">4. Discontinue Use in Case of Adverse Reactions</h2>
              <p>
                Herbs and botanical ingredients can affect different bodies in different ways. If you experience any allergic response, sensitivity, discomfort, or unexpected physical symptoms while using our products, you should discontinue use immediately and seek professional medical attention.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
