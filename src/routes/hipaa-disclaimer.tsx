import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/hipaa-disclaimer")({
  head: () => ({
    meta: [
      { title: "HIPAA Disclaimer — Grandma's Herbals" },
      { name: "description", content: "Details on how health data is stored and protected outside HIPAA-covered regulations." },
    ],
  }),
  component: HipaadisclaimerPage,
});

function HipaadisclaimerPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16 sm:py-24">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-white border border-stone-200/80 shadow-[0_20px_70px_rgba(73,88,52,0.06)] rounded-[2rem] p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Compliance</p>
                <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-olive-900 mt-1">HIPAA Disclaimer</h1>
              </div>
            </div>
            
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <p className="text-xs text-stone-400 italic">Last Updated: June 12, 2026</p>
              
              <p>
                This HIPAA Disclaimer explains how we treat personal wellness disclosures, intake notes, and biological surveys submitted to Grandma&apos;s Herbals.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">1. Grandma&apos;s Herbals is NOT a HIPAA-Covered Entity</h2>
              <p>
                Please note that Grandma&apos;s Herbals is a Georgian botanical wellness company providing natural blends, educational guides, lifestyle recommendations, and general wellness tracking tools. The Company is <strong>not</strong> a health clinic, hospital, licensed medical practice, or insurance carrier. Consequently, Grandma&apos;s Herbals is not classified as a &quot;covered entity&quot; or &quot;business associate&quot; under the Health Insurance Portability and Accountability Act (HIPAA).
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">2. How We Protect Your Health Disclosures</h2>
              <p>
                Even though we are not bound by federal HIPAA rules, we strongly believe that your personal health objectives, intake files, and daily symptom reports deserve the highest standards of data security. To safeguard this data, we implement robust safety measures:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Encryption:</strong> All intake forms and progress logs are encrypted in transit and at rest.</li>
                <li><strong>Row-Level Security (RLS):</strong> Our database utilizes strict row-level security protocols. This means your private files can only be accessed by you and the specific concierge staff assigned to prepare your formulas.</li>
                <li><strong>Access Control:</strong> No third-party advertisers or marketing partners can view, access, or acquire your wellness assessments.</li>
              </ul>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">3. Communications</h2>
              <p>
                When you sign up for our services, you consent to receive progress reports, encouragement tips, and order alerts via email (via Resend) or text message (via Twilio). While these pathways are secure, standard emails and SMS transmissions are not fully encrypted channels. You acknowledge this risk by opting to receive these automated progress logs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
