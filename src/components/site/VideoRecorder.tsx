import { useState, useRef, useEffect } from "react";
import { Video, Square, Upload, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface VideoRecorderProps {
  onSubmitted?: () => void;
}

export function VideoRecorder({ onSubmitted }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasPermission, setHasPermission] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video file is too large. Maximum size is 50MB.");
        return;
      }
      setVideoBlob(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setShowForm(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setShowForm(true);
    }
  };

  const resetRecording = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl("");
    setVideoBlob(null);
    setShowForm(false);
    setCustomerName("");
    setCustomerEmail("");
    setRating(5);
    setComment("");
    setHasPermission(false);
  };

  const submitTestimonial = async () => {
    if (!videoBlob || !customerName || !comment) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!hasPermission) {
      toast.error("Please give permission to use your testimonial before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalVideoUrl = "";

      // Try to upload video to Supabase Storage
      try {
        const fileName = `${Date.now()}-${customerName.replace(/\s+/g, "-")}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("video-testimonials")
          .upload(fileName, videoBlob, {
            contentType: "video/webm",
            cacheControl: "3600",
          });

        if (uploadError) {
          console.warn("Video upload failed (storage bucket may not exist):", uploadError.message);
          // Continue without video URL — submit as text-only testimonial
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("video-testimonials")
            .getPublicUrl(fileName);
          finalVideoUrl = publicUrl;
        }
      } catch (storageErr) {
        console.warn("Storage upload skipped:", storageErr);
      }

      // Insert testimonial record
      const { error: insertError } = await supabase
        .from("video_testimonials")
        .insert([
          {
            customer_name: customerName,
            customer_email: customerEmail || null,
            video_url: finalVideoUrl || null,
            rating,
            comment,
            duration: videoBlob ? Math.floor(videoBlob.size / 10000) : 0,
            approved: false,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Thank you! Your testimonial has been submitted and is pending approval.");
      resetRecording();
      onSubmitted?.();
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast.error(error?.message || "Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Video Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video">
        <video
          ref={videoRef}
          autoPlay={isRecording}
          src={videoUrl || undefined}
          controls={!!videoUrl && !isRecording}
          muted={isRecording}
          className="w-full h-full object-cover"
        />
        
        {!isRecording && !videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/70">
              <Video className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Ready to record your testimonial?</p>
              <p className="text-sm mt-2">Click the button below to start</p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full">
            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center gap-4">
        {!isRecording && !videoUrl && (
          <>
            <Button
              onClick={startRecording}
              size="lg"
              className="bg-olive-500 hover:bg-olive-600 text-white rounded-full px-8"
            >
              <Video className="h-5 w-5 mr-2" />
              Start Recording
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Video
            </Button>
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        )}

        {isRecording && (
          <Button
            onClick={stopRecording}
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8"
          >
            <Square className="h-5 w-5 mr-2" />
            Stop Recording
          </Button>
        )}

        {videoUrl && !showForm && (
          <>
            <Button
              onClick={resetRecording}
              variant="outline"
              size="lg"
              className="rounded-full px-6"
            >
              <X className="h-5 w-5 mr-2" />
              Retake
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-olive-500 hover:bg-olive-600 text-white rounded-full px-8"
            >
              Continue
            </Button>
          </>
        )}
      </div>

      {/* Submission Form */}
      {showForm && videoUrl && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-cormorant font-bold text-olive-800 mb-2">
              Complete Your Testimonial
            </h3>
            <p className="text-sm text-stone-600">
              Please provide your details. Your testimonial will be reviewed before being published.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>
                Rating <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">
                Written Comment <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with Grandma's Herbals..."
                rows={4}
                className="mt-1.5"
              />
            </div>

            <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
              <input 
                type="checkbox" 
                id="permission" 
                checked={hasPermission} 
                onChange={(e) => setHasPermission(e.target.checked)}
                className="mt-1 shrink-0 w-4 h-4 text-olive-600 rounded border-stone-300 focus:ring-olive-500" 
              />
              <Label htmlFor="permission" className="text-xs text-stone-600 font-normal leading-relaxed cursor-pointer">
                I give permission to use my testimony for marketing, website, and external review purposes (such as Google Reviews). I understand this is voluntary.
              </Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={resetRecording}
              variant="outline"
              className="flex-1 rounded-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submitTestimonial}
              className="flex-1 bg-olive-500 hover:bg-olive-600 text-white rounded-full"
              disabled={isSubmitting}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
