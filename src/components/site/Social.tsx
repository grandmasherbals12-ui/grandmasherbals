import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Social() {
  return (
    <section className="bg-cream-100 py-10 md:py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-4xl font-cormorant font-bold text-olive-700">
          Join Our Community
        </h2>
        <p className="mb-6 text-lg text-gray-700">
          Follow us on Instagram for daily wellness tips, behind-the-scenes, and special offers.
        </p>
        <Button asChild size="lg" className="bg-olive-500 hover:bg-olive-600">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="mr-2 h-5 w-5" /> Follow Us
          </a>
        </Button>

        <div className="mx-auto mt-8 w-full max-w-7xl overflow-hidden rounded-3xl border border-stone-200 bg-black shadow-xl aspect-video md:aspect-[21/9] max-h-[460px] md:max-h-[480px]">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/home-video.mp4" type="video/mp4" />
            <source src="/home-video.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
