import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is Concierge Wellness Care?",
    answer: "Grandma's Herbals Concierge Wellness Care is a personalized, premium wellness support program. We design custom botanical blends based on your health history, intake forms, and lifestyle choices, while offering guided mindfulness practices, meal protocols, and dedicated consultations to support your physical and emotional vitality."
  },
  {
    question: "Is this medical treatment?",
    answer: "No. Grandma's Herbals services and botanical formulations are strictly educational and wellness-supportive in nature. We do not diagnose, treat, mitigate, or prevent medical conditions. We strongly encourage you to collaborate with licensed healthcare professionals regarding any medical concerns or prescription treatments."
  },
  {
    question: "How are custom botanical recommendations created?",
    answer: "Our recommendations are crafted by combining traditional Creole, Native American, and West African plant wisdom with modern dietary insights. We analyze your digital intake files, wellness objectives, and current supplement routine to design small-batch herbal formulas custom-tailored to your system's priorities."
  },
  {
    question: "Can I upload or submit daily progress reports?",
    answer: "Yes. Members can log into their secure Wellness Journal dashboard daily to log metrics such as morning energy, joint comfort, mood, and walking stamina. These entries are compiled into structured 3-day or 10-day averages to help track consistency and compounding progress."
  },
  {
    question: "How often do members receive support?",
    answer: "Depending on your membership package (Tiers I, II, or III), you receive tailored reports, continuous email check-ins, and schedule-based consultations (1 to 3 ten-minute consultations monthly) directly with our advisory specialists."
  },
  {
    question: "Can I book consultations?",
    answer: "Yes. Consultations can be requested directly via our Booking Portal. Sessions are scheduled based on practitioner availability and focused on lifestyle optimization, herbal guidelines, and dietary support."
  },
  {
    question: "Are your ingredients organic and safe?",
    answer: "Yes, we source only premium, organic, wildcrafted, and sustainably harvested plant ingredients. All blends undergo medication-interaction screening during formulation to ensure they complement your existing health protocols safely."
  },
  {
    question: "What focus areas are monitored in the progress reports?",
    answer: "Our tracking systems monitor physical and cognitive indicators including walking comfort, joint stiffness, motivation, sleep support, mood stability, mental clarity, and blood flow/circulation relaxation."
  },
  {
    question: "How do I cancel my membership?",
    answer: "You can easily modify, cancel, or pause your concierge membership plan at any time through the Settings tab inside your secure Wellness Journal dashboard, with no cancellation fees or hidden terms."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-olive-50/20 py-20 sm:py-24">
      {/* Visual background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-olive-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-amber-100/35 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-olive-200/70 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-olive-700 shadow-sm mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>F.A.Q.</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-cormorant font-bold text-olive-900 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Find answers to commonly asked questions about our concierge wellness care, organic formulas, and custom lifestyle tracking.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white border border-stone-200/80 hover:border-olive-300/60 shadow-sm rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif text-lg font-semibold text-stone-800 hover:text-olive-800 transition-colors"
                >
                  <span className="pr-4 leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-olive-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-stone-600 border-t border-stone-100/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
