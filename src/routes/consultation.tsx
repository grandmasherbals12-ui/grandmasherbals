import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import consultationImage from "@/assets/consultation.jpg";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/consultation")({
  component: Consultation,
});

function Consultation() {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please log in to book a consultation.");
      return;
    }

    if (!name.trim() || !email.trim() || !date || !message.trim()) {
      toast.error("Please complete all consultation fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("consultations").insert({
        user_id: user.id,
        consultation_type: "Wellness Consultation",
        scheduled_date: new Date(date).toISOString(),
        notes: `Client: ${name}\nEmail: ${email}\n\n${message}`,
        status: "pending",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Consultation request submitted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Unable to submit your consultation request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-stone-50 to-olive-50/40 px-4 py-16">
          <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-olive-600" />
            <h1 className="text-4xl font-cormorant font-bold text-olive-900">Consultation Requested</h1>
            <p className="mt-4 text-stone-600 leading-7">
              Your consultation request has been received. We will review your availability and follow up with next steps.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="rounded-full bg-olive-600 hover:bg-olive-700 text-white">
                <a href="https://calendly.com" target="_blank" rel="noreferrer">Book with Calendly</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-olive-200 text-olive-700">
                <a href="https://calendar.google.com" target="_blank" rel="noreferrer">Google Appointment</a>
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-olive-50/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-olive-200/30 blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-20 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-cormorant font-bold text-olive-900 sm:text-5xl lg:text-6xl"
          >
            PERSONALIZED WELLNESS CONSULTATIONS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-4xl mx-auto text-base leading-8 text-stone-700 sm:text-lg"
          >
            Every wellness journey is unique.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-6 text-left shadow-[0_20px_70px_rgba(73,88,52,0.12)] backdrop-blur sm:p-8"
          >
            <div className="space-y-4 text-stone-700">
              <p>
                Our consultation experience is designed to help you explore natural wellness
                options through an integrative approach that may include lifestyle
                recommendations, botanical guidance, nutritional support, wellness education, and
                personalized strategies tailored to your goals.
              </p>
              <p>
                Whether you are seeking greater vitality, improved balance, enhanced resilience,
                stress management support, or overall wellness guidance, our team works with you to
                identify practical next steps that fit your lifestyle.
              </p>
              <p>
                Many clients appreciate receiving actionable recommendations they can begin
                implementing immediately, often using simple resources already available within
                their daily routines.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-olive-700">
              <span>Integrative</span>
              <span>Regenerative</span>
              <span>Natural</span>
              <span>Wholistic</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-stone-200/80 bg-white p-8 shadow-[0_20px_70px_rgba(73,88,52,0.10)]"
          >
            <h2 className="text-3xl font-cormorant font-bold text-olive-900 mb-4">
              INTEGRATIVE • REGENERATIVE • NATURAL • WHOLISTIC
            </h2>
            <div className="space-y-3 text-stone-700">
              {[
                "Wellness Assessments",
                "Botanical Recommendations",
                "Lifestyle Guidance",
                "Nutrition Support",
                "Personalized Wellness Plans",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-olive-50 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-olive-600" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 w-full bg-olive-600 hover:bg-olive-700">
              <a href="#booking">BOOK A CONSULTATION</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] overflow-hidden border border-stone-200/80 bg-white shadow-[0_20px_70px_rgba(73,88,52,0.10)]"
          >
            <img
              src={consultationImage}
              alt="Herbal consultation setup"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        <div id="booking" className="mt-12 grid gap-12 md:grid-cols-2 md:items-start">
          <div className="rounded-[2rem] border border-stone-200/80 bg-white p-8 shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
            <h2 className="text-3xl font-cormorant font-bold text-olive-900 mb-6">
              Book Your Session
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="message">
                  What would you like to focus on?
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us a bit about your wellness goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-olive-600 hover:bg-olive-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "BOOK A CONSULTATION"}
              </Button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-olive-200/80 bg-olive-50 p-8 shadow-[0_20px_70px_rgba(73,88,52,0.08)]">
            <h3 className="text-2xl font-cormorant font-bold text-olive-900 mb-4">
              What to Expect
            </h3>
            <p className="text-stone-700 leading-7">
              Many clients appreciate receiving actionable recommendations they can begin
              implementing immediately, often using simple resources already available within
              their daily routines.
            </p>
            <p className="mt-4 text-stone-700 leading-7">
              Our team focuses on practical next steps that fit your lifestyle and support your
              wellness goals with clarity and care.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}