import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import consultationImage from "@/assets/consultation.jpg";

export function ConsultationSection({ showHeader = true }: { showHeader?: boolean }) {
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
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-stone-50 to-olive-50/40 px-4 py-16">
        <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-olive-600" />
          <h2 className="text-4xl font-cormorant font-bold text-olive-900">Consultation Requested</h2>
          <p className="mt-4 text-stone-600 leading-7">
            Your consultation request has been received. We will review your availability and follow up with next steps.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full bg-olive-600 hover:bg-olive-700 text-white px-8 py-5">
              <a href="https://calendly.com" target="_blank" rel="noreferrer">Book with Calendly</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-olive-200 text-olive-700 px-8 py-5">
              <a href="https://calendar.google.com" target="_blank" rel="noreferrer">Google Appointment</a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full">
      {/* Intro Block */}
      {showHeader && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-stone-50 py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-olive-100/30 blur-3xl" />
            <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-amber-50/40 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.35em] text-olive-600 mb-3"
            >
              Custom Wellness Guidance
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl font-cormorant font-bold text-stone-900 tracking-tight leading-tight uppercase"
            >
              Personalized Wellness Consultations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed text-stone-600"
            >
              Every wellness journey is unique. Our consultation experience is designed to help you explore natural wellness options through an integrative approach that may include lifestyle recommendations, botanical guidance, nutritional support, wellness education, and personalized strategies tailored to your goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto mt-8 max-w-4xl rounded-3xl border border-stone-200/80 bg-white/70 p-6 text-left shadow-[0_20px_70px_rgba(73,88,52,0.06)] backdrop-blur sm:p-8"
            >
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Whether you are seeking greater vitality, improved balance, enhanced resilience, stress management support, or overall wellness guidance, our team works with you to identify practical next steps that fit your lifestyle.
                </p>
                <p>
                  Many clients appreciate receiving actionable recommendations they can begin implementing immediately, often using simple resources already available within their daily routines.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.25em] text-olive-700 border-t border-stone-100 pt-4">
                <span>• Integrative</span>
                <span>• Regenerative</span>
                <span>• Natural</span>
                <span>• Wholistic</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Form and Info Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-stretch">
          {/* Features Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-between rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm"
          >
            <div>
              <h3 className="text-3xl font-cormorant font-bold text-stone-900 mb-6 uppercase tracking-tight leading-none">
                Wellness Services
              </h3>
              <div className="space-y-3.5 text-stone-700">
                {[
                  "Comprehensive Wellness Assessments",
                  "Bespoke Botanical Recommendations",
                  "Guided Lifestyle & Habit Optimization",
                  "Personalized Nutrition & Meal Protocols",
                  "Ongoing Progress Monitoring",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3.5 rounded-2xl bg-olive-50/50 px-4 py-4 border border-olive-100/40">
                    <CheckCircle2 className="h-5.5 w-5.5 text-olive-600 shrink-0" />
                    <span className="font-semibold text-stone-800 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 font-semibold">
                <a href="#booking-form">GET STARTED NOW</a>
              </Button>
            </div>
          </motion.div>

          {/* Photo Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] overflow-hidden border border-stone-200 shadow-sm"
          >
            <img
              src={consultationImage}
              alt="Herbal consultation setup"
              className="h-full w-full object-cover min-h-[350px]"
            />
          </motion.div>
        </div>

        {/* Booking Form and Expectation Card */}
        <div id="booking-form" className="mt-12 grid gap-12 md:grid-cols-2 md:items-start">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <h3 className="text-3xl font-cormorant font-bold text-stone-900 mb-6 tracking-tight">
              Book Your Session
            </h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-stone-600">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-stone-600">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-stone-600">Preferred Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  What would you like to focus on?
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us a bit about your wellness goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 font-semibold shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "BOOK A CONSULTATION"}
              </Button>
              {!isAuthenticated && (
                <Link 
                  to="/account" 
                  className="block text-center text-xs text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100 transition-colors rounded-xl p-3 border border-amber-100 mt-2"
                >
                  * Note: Please register or log in first to submit your booking.
                </Link>
              )}
            </form>
          </div>

          <div className="rounded-[2rem] border border-olive-200 bg-olive-50/50 p-8 shadow-sm">
            <h3 className="text-2xl font-cormorant font-bold text-olive-900 mb-4">
              What to Expect
            </h3>
            <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
              <p>
                Our consultations are held in a secure, digital space focused completely on your wellbeing. You will work one-on-one with a specialist who will evaluate your daily routines, diet, stress factors, and goals.
              </p>
              <p>
                Many clients appreciate receiving actionable recommendations they can begin implementing immediately, often using simple resources already available within their daily routines.
              </p>
              <p>
                Following the session, you will receive a comprehensive wellness summary containing lifestyle adjustments, botanical protocols, and specialized guides tailored specifically for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
