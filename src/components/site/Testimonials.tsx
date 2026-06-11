import { useState, useEffect } from "react";
import { Star, Play, Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VideoRecorder } from "./VideoRecorder";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type VideoTestimonial = {
  id: string;
  customer_name: string;
  video_url: string;
  thumbnail_url?: string;
  rating: number;
  comment: string;
  created_at: string;
  featured: boolean;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("video_testimonials")
        .select("*")
        .eq("approved", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching testimonials:", error);
        // If table doesn't exist yet, just show empty state
        setTestimonials([]);
      } else {
        setTestimonials(data || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      // Fail gracefully - show empty state
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmitted = () => {
    setShowRecorder(false);
    setJustSubmitted(true);
    fetchTestimonials();
    // Reset the "just submitted" state after 8 seconds
    setTimeout(() => setJustSubmitted(false), 8000);
  };

  return (
    <section className="bg-gradient-to-b from-cream-100 to-stone-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-olive-500 mb-3">
            Customer Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-olive-800 mb-4">
            What Our Community is Saying
          </h2>
          <p className="text-base text-stone-600 max-w-2xl mx-auto">
            Real stories from real customers. Share your experience and help others discover the
            benefits of natural wellness.
          </p>
        </div>

        {/* Post-submission success banner */}
        {justSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-10 max-w-2xl mx-auto bg-olive-50 border-2 border-olive-300 rounded-2xl p-6 text-center shadow"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-cormorant font-bold text-olive-800 mb-2">
              Thank You — Your Testimonial Was Received!
            </h3>
            <p className="text-stone-600 text-sm">
              Your video has been submitted and is <strong>pending review</strong>.
              Once approved by our team it will appear here automatically.
              We appreciate you sharing your experience! 🌿
            </p>
          </motion.div>
        )}

        {/* Share Your Story CTA */}
        {!showRecorder && !justSubmitted && (
          <div className="mb-16 text-center">
            <Button
              onClick={() => setShowRecorder(true)}
              size="lg"
              className="bg-olive-500 hover:bg-olive-600 text-white rounded-full px-8"
            >
              Share Your Video Testimonial
            </Button>
          </div>
        )}

        {/* Video Recorder */}
        {showRecorder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-10 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-cormorant font-bold text-olive-800 mb-2">
                  Record Your Testimonial
                </h3>
                <p className="text-sm text-stone-600">
                  Share your experience in a short video (30-60 seconds recommended)
                </p>
              </div>
              <VideoRecorder onSubmitted={handleVideoSubmitted} />
              <div className="text-center mt-6">
                <Button
                  onClick={() => setShowRecorder(false)}
                  variant="ghost"
                  className="text-stone-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Testimonials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-olive-500 border-r-transparent"></div>
            <p className="mt-4 text-stone-600">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
            <Quote className="h-16 w-16 mx-auto text-olive-300 mb-4" />
            <h3 className="text-2xl font-cormorant font-bold text-olive-800 mb-2">
              Be the First!
            </h3>
            <p className="text-stone-600 mb-4">
              No testimonials yet. Be the first to share your experience!
            </p>
            <p className="text-sm text-olive-600 font-medium">
              ↑ Click "Share Your Video Testimonial" above to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Video Player */}
                <div
                  className="relative aspect-video bg-stone-900 cursor-pointer group"
                  onClick={() => setSelectedVideo(testimonial)}
                >
                  {selectedVideo?.id === testimonial.id ? (
                    <video
                      src={testimonial.video_url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        src={testimonial.video_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-olive-600 fill-olive-600" />
                        </div>
                      </div>
                    </>
                  )}

                  {testimonial.featured && (
                    <div className="absolute top-3 right-3 bg-olive-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-olive-800 text-lg">
                      {testimonial.customer_name}
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                    "{testimonial.comment}"
                  </p>
                  <p className="text-xs text-stone-400 mt-3">
                    {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
