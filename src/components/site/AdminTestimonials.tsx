import { useState, useEffect } from "react";
import { Star, Check, X, Trash2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

type VideoTestimonial = {
  id: string;
  customer_name: string;
  customer_email?: string;
  video_url: string;
  thumbnail_url?: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
  featured: boolean;
};

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      let query = supabase.from("video_testimonials").select("*").order("created_at", { ascending: false });

      if (filter === "pending") {
        query = query.eq("approved", false);
      } else if (filter === "approved") {
        query = query.eq("approved", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase Error Details:", error);
        throw error;
      }
      
      setTestimonials(data || []);
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      toast.error(`Failed to load testimonials: ${error?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from("video_testimonials")
        .update({ approved: true })
        .eq("id", id);

      if (error) throw error;

      toast.success("Testimonial approved!");
      fetchTestimonials();
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast.error("Failed to approve testimonial");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("video_testimonials")
        .update({ featured: !currentFeatured })
        .eq("id", id);

      if (error) throw error;

      toast.success(currentFeatured ? "Removed from featured" : "Marked as featured!");
      fetchTestimonials();
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const deleteTestimonial = async (id: string, videoUrl: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      // Extract file name from URL
      const fileName = videoUrl.split("/").pop();

      // Delete from storage
      if (fileName) {
        await supabase.storage.from("video-testimonials").remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase.from("video_testimonials").delete().eq("id", id);

      if (error) throw error;

      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  const pendingCount = testimonials.filter((t) => !t.approved).length;
  const approvedCount = testimonials.filter((t) => t.approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-2">
          Manage Video Testimonials
        </h2>
        <p className="text-stone-600">
          Review, approve, and manage customer video testimonials
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "all"
              ? "text-olive-700 border-b-2 border-olive-500"
              : "text-stone-500 hover:text-olive-600"
          }`}
        >
          All ({testimonials.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            filter === "pending"
              ? "text-olive-700 border-b-2 border-olive-500"
              : "text-stone-500 hover:text-olive-600"
          }`}
        >
          Pending ({pendingCount})
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "approved"
              ? "text-olive-700 border-b-2 border-olive-500"
              : "text-stone-500 hover:text-olive-600"
          }`}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-olive-500 border-r-transparent"></div>
          <p className="mt-4 text-stone-600">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl">
          <p className="text-stone-600">No testimonials found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl border-2 overflow-hidden ${
                testimonial.approved ? "border-green-200" : "border-orange-200"
              }`}
            >
              <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                {/* Video Preview */}
                <div className="relative">
                  <video
                    src={testimonial.video_url}
                    controls
                    className="w-full aspect-video rounded-xl bg-stone-900 object-cover"
                  />
                  {testimonial.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-cormorant font-bold text-olive-800">
                          {testimonial.customer_name}
                        </h3>
                        {testimonial.customer_email && (
                          <p className="text-sm text-stone-500">{testimonial.customer_email}</p>
                        )}
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-stone-700 leading-relaxed">{testimonial.comment}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-stone-500">
                    <span>
                      Submitted:{" "}
                      {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        testimonial.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {testimonial.approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {!testimonial.approved && (
                      <Button
                        onClick={() => approveTestimonial(testimonial.id)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}

                    {testimonial.approved && (
                      <Button
                        onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                        variant="outline"
                        className="rounded-full"
                        size="sm"
                      >
                        <Award className="h-4 w-4 mr-1" />
                        {testimonial.featured ? "Unfeature" : "Feature"}
                      </Button>
                    )}

                    <Button
                      onClick={() => deleteTestimonial(testimonial.id, testimonial.video_url)}
                      variant="outline"
                      className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
