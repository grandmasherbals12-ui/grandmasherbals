import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DailyProgressForm } from "@/components/site/DailyProgressForm";
import { Leaf, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/progress-report")({
  head: () => ({
    meta: [
      { title: "Daily Progress Report — Grandma's Herbals" },
      { name: "description", content: "Submit your 3-day wellness progress. Your personalized report will be emailed and texted to you." },
    ],
  }),
  component: ProgressReportPage,
});

function ProgressReportPage() {
  const { isAuthenticated } = useAuth();
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-olive-50 via-white to-stone-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-olive-800 to-olive-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="h-6 w-6 text-olive-300" />
              <span className="text-olive-300 text-sm font-semibold uppercase tracking-widest">Member Portal</span>
              <Leaf className="h-6 w-6 text-olive-300" />
            </div>
            <h1 className="text-5xl font-cormorant font-bold mb-4">
              Your 3-Day Progress Report
            </h1>
            <p className="text-olive-200 max-w-2xl mx-auto text-lg leading-relaxed">
              Fill in your daily wellness data each evening. At{" "}
              <strong className="text-white">8:00 AM</strong> you'll receive a personalized encouragement
              message, and at <strong className="text-white">9:00 AM</strong> your full branded progress
              report will be delivered via email and text.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-12">
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-olive-600" />
                  </div>
                  <h2 className="text-2xl font-cormorant font-bold text-olive-800 mb-4">
                    Member Login Required
                  </h2>
                  <p className="text-stone-600 mb-8 max-w-md mx-auto">
                    Please log in or create an account to submit your daily wellness progress and receive personalized reports.
                  </p>
                  <Link
                    to="/account"
                    className="inline-flex items-center justify-center bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8 py-4 font-semibold transition"
                  >
                    Log In / Register
                  </Link>
                </div>
              ) : (
                <DailyProgressForm />
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
