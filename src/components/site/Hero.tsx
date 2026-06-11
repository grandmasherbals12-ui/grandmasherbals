import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Leaf, HeartPulse, Infinity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    type: "image" as const,
    media: "/carousel-1.png",
    alt: "Wellness botanical scene",
    eyebrow: "Integrative Wellness",
    title: "Rooted in Ancient Wisdom. Cultivated for Well-Being.",
    subtitle: "A Heritage of Botanical Wisdom. A Future of Integrative Wellness.",
    description: "Long before wellness became an industry, it was a way of life. True wellness is not merely the absence of discomfort—it is the harmonious relationship between mind, body, spirit, family, community, and the natural world.",
    features: ["Integrative Wellness", "Regenerative Living", "Natural & Organic", "Wholistic Well-Being"],
    primaryCta: { label: "Begin Your Wellness Journey", to: "/assessment" },
    secondaryCta: { label: "Discover Our Story", to: "/about" },
    icon: Sparkles,
  },
  {
    id: 2,
    type: "image" as const,
    media: "/carousel-2.png",
    alt: "Herbal lifestyle scene",
    eyebrow: "Integrative Wellness",
    title: "Wellness Designed Around You",
    subtitle: "Personalized guidance for sustainable support.",
    description: "Every person is unique. Our integrative approach considers nutrition, lifestyle, movement, stress, sleep, mindfulness, and botanical support to help you achieve sustainable wellness.",
    features: ["Personalized Recommendations", "Lifestyle Support", "Herbal Guidance", "Smart Wellness Support"],
    primaryCta: { label: "Explore Consultations", to: "/consultation" },
    icon: HeartPulse,
  },
  {
    id: 3,
    type: "video" as const,
    media: "/carousel-3.mp4",
    alt: "Wellness video scene",
    eyebrow: "Regenerative Wellness",
    title: "Support Your Body’s Natural Ability to Renew",
    subtitle: "Restore resilience, energy, and mobility.",
    description: "Discover wellness strategies focused on restoration, resilience, recovery, circulation, energy, mobility, and long-term vitality.",
    features: ["Recovery Support", "Energy & Vitality", "Active Lifestyle", "Healthy Aging Focus"],
    primaryCta: { label: "Learn More", to: "/about" },
    icon: Infinity,
  },
  {
    id: 4,
    type: "image" as const,
    media: "/carousel-4.png",
    alt: "Botanical products scene",
    eyebrow: "Nature’s Pharmacy",
    title: "Rooted In Nature. Guided By Wisdom.",
    subtitle: "Premium botanicals with modern wellness insight.",
    description: "Premium botanicals, traditional herbal knowledge, and modern wellness insights combined to help support your everyday health goals.",
    features: ["Organic Ingredients", "Small Batch Formulas", "Quality Focused", "Naturally Inspired"],
    primaryCta: { label: "Shop Botanicals", to: "/shop" },
    icon: Leaf,
  },
  {
    id: 5,
    type: "video" as const,
    media: "/carousel-5.mp4",
    alt: "Wellness video scene",
    eyebrow: "Whole Person Wellness",
    title: "Mind • Body • Spirit",
    subtitle: "Well-being that supports the whole person.",
    description: "True wellness supports emotional wellness, mental clarity, personal growth, and overall well-being. Our wholistic approach supports the whole person.",
    features: ["Meditation Support", "Stress Management", "Wellness Coaching", "Guided Resources"],
    primaryCta: { label: "Join Membership", to: "/membership" },
    icon: Sparkles,
  },
  {
    id: 6,
    type: "image" as const,
    media: "/carousel-1.png",
    alt: "Wellness botanical scene",
    eyebrow: "Community Wellness",
    title: "Feel Better. Live Better. Thrive Naturally.",
    subtitle: "A growing community embracing a natural path to vitality.",
    description: "Join a growing community embracing a natural path toward vitality, balance, and lifelong wellness.",
    features: ["Shop the collection", "Join membership", "Book support", "Grow with us"],
    primaryCta: { label: "Shop Now", to: "/shop" },
    secondaryCta: { label: "Join Membership", to: "/membership" },
    icon: ArrowRight,
  },
];

export function Hero() {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
    }

    autoplayRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 7000);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
      }
    };
  }, [api, current]);

  useEffect(() => {
    if (!api) return;

    slides.forEach((slide, index) => {
      if (slide.type !== "video") return;

      const video = videoRefs.current[index];
      if (!video) return;

      if (index === current) {
        video.muted = true;
        video.playbackRate = 1.25;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          // ignore reset issues
        }
      }
    });
  }, [current, api]);

  return (
    <section className="relative w-full overflow-hidden bg-cream-100">
      <div className="relative w-full overflow-hidden">
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="m-0">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="p-0">
                <div className="relative flex flex-col w-full overflow-hidden bg-cream-100">
                  <div className="relative h-[320px] sm:h-[480px] w-full overflow-hidden bg-stone-900/10">
                    {slide.type === "video" ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                        onEnded={() => api?.scrollNext()}
                      >
                        <source src={slide.media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={slide.media}
                        alt={slide.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="relative w-full flex justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-8 md:py-12 z-20">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      className="w-full max-w-4xl bg-white border border-stone-200/50 shadow-xl rounded-3xl p-6 sm:p-8 md:p-10"
                    >
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-olive-200/70 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-olive-700 shadow-sm">
                        <slide.icon className="h-4 w-4" />
                        <span>{slide.eyebrow}</span>
                      </div>

                      <h1 className="max-w-2xl text-3xl font-cormorant font-bold tracking-tight text-olive-950 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
                        {slide.title}
                      </h1>

                      <p className="mt-3 max-w-xl text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-olive-700/80">
                        {slide.subtitle}
                      </p>

                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-700">
                        {slide.description}
                      </p>

                      {/* Numbered Feature Cards (White Cards) */}
                      <div className="mt-6 rounded-[1.6rem] border border-stone-100 bg-stone-50/50 p-4 shadow-sm">
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.35em] text-olive-700">
                          Guided by heritage
                        </p>
                        <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                          {slide.features.slice(0, 4).map((feature, featureIndex) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3 rounded-2xl border border-stone-200/50 bg-white px-3 py-2.5 shadow-sm"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-100 text-[10px] font-bold text-olive-700">
                                0{featureIndex + 1}
                              </span>
                              <span className="text-xs font-semibold text-stone-700 truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                          asChild
                          size="lg"
                          className="bg-olive-600 px-8 text-white shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-olive-700 text-sm font-semibold"
                        >
                          <Link to={slide.primaryCta.to}>
                            {slide.primaryCta.label}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        {slide.secondaryCta ? (
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-olive-300 bg-white px-8 text-olive-800 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-stone-50 text-sm font-semibold"
                          >
                            <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                          </Button>
                        ) : null}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex left-4 lg:left-8 border-white/40 bg-white/70 text-olive-800 shadow-lg backdrop-blur hover:bg-white z-30" />
          <CarouselNext className="hidden md:flex right-4 lg:right-8 border-white/40 bg-white/70 text-olive-800 shadow-lg backdrop-blur hover:bg-white z-30" />

          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:bottom-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
