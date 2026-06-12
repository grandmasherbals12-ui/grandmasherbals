import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Grandma's Herbals" },
      { name: "description", content: "Learn how we protect and manage your personal wellness data." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16 sm:py-24">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-white border border-stone-200/80 shadow-[0_20px_70px_rgba(73,88,52,0.06)] rounded-[2rem] p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Compliance</p>
                <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-olive-900 mt-1">Privacy Policy</h1>
              </div>
            </div>
            
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <p className="text-xs text-stone-400 italic">Last Updated: June 12, 2026</p>
              
              <p>
                At Grandma&apos;s Herbals, we are committed to protecting the privacy, confidentiality, and security of your personal and wellness data. This Privacy Policy explains how we collect, use, store, and share your personal information through our website and concierge wellness services.
              </p>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when registering for a membership, purchasing products, submitting intake forms, or completing daily progress reports. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Identity Data:</strong> Full name, age, title, and biological details.</li>
                <li><strong>Contact Data:</strong> Email address, phone number, and shipping/billing addresses.</li>
                <li><strong>Wellness & Assessment Data:</strong> Primary wellness objectives, health notes, medications list, blood pressure, blood sugar readings, and daily tracking metrics (mood, energy, walking comfort, joint stiffness).</li>
              </ul>
              
              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">2. How We Use Your Information</h2>
              <p>
                We use the collected data methodically to optimize your wellness experience:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To formulate, prepare, and customize your personalized botanical blends.</li>
                <li>To generate and deliver your 3-Day or 10-Day progress reports via email and text message.</li>
                <li>To coordinate upcoming consultations and respond to service requests.</li>
                <li>To secure your account and manage orders.</li>
              </ul>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">3. Data Security & Storage</h2>
              <p>
                Your data is stored securely using advanced Row-Level Security (RLS) database protocols. RLS ensures that your wellness progress logs, forms, and profiles are only accessible to you and authorized practitioners supporting your concierge wellness program.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">4. Third-Party Services</h2>
              <p>
                We work with select third-party providers to deliver emails (e.g. Resend) and SMS notifications (e.g. Twilio). These processors handle your contact details solely to deliver automated reports and welcome packages. We never sell, rent, or trade your wellness records to external marketing firms.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">5. Your Rights</h2>
              <p>
                You can review, edit, or update your personal information directly through your Wellness Journal account dashboard. For questions regarding data erasure or data access requests, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
