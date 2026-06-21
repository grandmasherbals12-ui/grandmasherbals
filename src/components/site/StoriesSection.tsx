import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  BookOpen, Heart, MessageSquare, ChevronDown, ChevronUp,
  Star, Send, Plus, Loader2, Quote,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Story = {
  id: string;
  author_name: string;
  title: string;
  content: string;
  story_type: string;
  featured: boolean;
  likes: number;
  created_at: string;
  comments?: Comment[];
};

type Comment = {
  id: string;
  story_id: string;
  commenter_name: string;
  comment: string;
  created_at: string;
};

const STORY_TYPES = [
  { value: "wellness", label: "🌿 Wellness Journey" },
  { value: "testimonial", label: "⭐ Testimonial" },
  { value: "milestone", label: "🏆 Milestone" },
  { value: "journey", label: "🛤️ My Journey" },
];

// ─── Story Card ────────────────────────────────────────────────────────────────

function StoryCard({ story, onCommentAdded }: { story: Story; onCommentAdded: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>(story.comments ?? []);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitComment = async () => {
    if (!commentName.trim() || !commentText.trim()) {
      toast.error("Please enter your name and comment.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("story_comments").insert({
        story_id: story.id,
        commenter_name: commentName,
        comment: commentText,
        is_approved: false,
      });
      if (error) throw error;
      toast.success("Comment submitted! It will appear after review.");
      setCommentName("");
      setCommentText("");
      setShowCommentForm(false);
      onCommentAdded();
    } catch {
      toast.error("Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel = STORY_TYPES.find((t) => t.value === story.story_type)?.label ?? "🌿";
  const dateStr = new Date(story.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
        story.featured ? "border-olive-400 ring-2 ring-olive-200" : "border-stone-200"
      }`}
    >
      {story.featured && (
        <div className="bg-olive-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 text-center">
          ⭐ Featured Story
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-olive-50 text-olive-700 px-2 py-0.5 rounded-full border border-olive-200">
            {typeLabel}
          </span>
          <span className="text-xs text-stone-400 ml-auto">{dateStr}</span>
        </div>

        <h3 className="text-xl font-cormorant font-bold text-olive-800 mb-2">{story.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-olive-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {story.author_name[0]}
          </div>
          <span className="text-sm font-semibold text-stone-700">{story.author_name}</span>
        </div>

        <div className="text-stone-600 text-sm leading-relaxed">
          {expanded ? story.content : story.content.slice(0, 250)}
          {story.content.length > 250 && !expanded && (
            <span className="text-stone-400">...</span>
          )}
        </div>

        {story.content.length > 250 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-olive-600 text-xs font-semibold mt-2 flex items-center gap-1 hover:underline"
          >
            {expanded ? <><ChevronUp className="h-3 w-3" /> Read less</> : <><ChevronDown className="h-3 w-3" /> Read more</>}
          </button>
        )}

        {/* Comments */}
        {comments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-stone-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-stone-300 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {c.commenter_name[0]}
                  </div>
                  <span className="text-xs font-semibold text-stone-600">{c.commenter_name}</span>
                  <span className="text-[10px] text-stone-400 ml-auto">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-stone-600">{c.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-3">
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="text-olive-600 hover:text-olive-700 text-xs ml-auto"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Add Comment
          </Button>
        </div>

        {showCommentForm && (
          <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
            <Input
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your name"
              className="text-sm"
            />
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={submitComment}
                disabled={submitting}
                className="bg-olive-600 hover:bg-olive-700 text-white text-xs rounded-full"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                Submit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCommentForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Submit Story Form ────────────────────────────────────────────────────────

function SubmitStoryForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("wellness");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name || !title || !content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("stories").insert({
        author_id: user?.id ?? null,
        author_name: name,
        author_email: email || null,
        title,
        content,
        story_type: type,
        is_approved: false,
      });
      if (error) throw error;
      toast.success("Your story has been submitted! It will appear after review.");
      setName(""); setEmail(""); setTitle(""); setContent(""); setType("wellness");
      onSubmitted();
    } catch {
      toast.error("Failed to submit story.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-olive-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-olive-100 rounded-full p-2">
          <BookOpen className="h-5 w-5 text-olive-600" />
        </div>
        <div>
          <h3 className="text-xl font-cormorant font-bold text-olive-800">Share Your Story</h3>
          <p className="text-xs text-stone-500">Your journey inspires others. Stories are reviewed before publishing.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Your Name <span className="text-red-400">*</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="First Last" className="mt-1" />
          </div>
          <div>
            <Label>Email (optional)</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Story Type</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {STORY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  type === t.value
                    ? "bg-olive-600 text-white border-olive-600"
                    : "bg-white text-stone-600 border-stone-200 hover:border-olive-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Title <span className="text-red-400">*</span></Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your story a meaningful title..." className="mt-1" />
        </div>
        <div>
          <Label>Your Story <span className="text-red-400">*</span></Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="Share your wellness journey, what changed for you, a milestone you reached..."
            rows={6} className="mt-1" />
        </div>
        <Button
          onClick={submit}
          disabled={submitting}
          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8"
        >
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Submit Story
        </Button>
      </div>
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function StoriesSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*, comments:story_comments(id, commenter_name, comment, created_at)")
      .eq("is_approved", true)
      .eq("story_comments.is_approved", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error) setStories((data as Story[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <section className="bg-gradient-to-b from-cream-100 to-stone-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-olive-600 mb-3">Community</p>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-stone-900 mb-4 tracking-tight leading-none">
            Stories & Milestones
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Real journeys from our Grandma's Herbals community. Share your progress, celebrate milestones,
            and inspire others on their wellness path.
          </p>
        </div>

        {/* Share Button */}
        <div className="text-center mb-10">
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className={`rounded-full px-8 gap-2 ${showForm ? "bg-stone-500 hover:bg-stone-600" : "bg-olive-600 hover:bg-olive-700"} text-white`}
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "Share Your Story"}
          </Button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-12">
            <SubmitStoryForm onSubmitted={() => setShowForm(false)} />
          </motion.div>
        )}

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-olive-500 border-r-transparent" />
            <p className="mt-4 text-stone-500">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
            <Quote className="h-16 w-16 mx-auto text-olive-200 mb-4" />
            <h3 className="text-2xl font-cormorant font-bold text-olive-800 mb-2">Be the First!</h3>
            <p className="text-stone-500 mb-6">No stories yet. Share your wellness journey to inspire the community.</p>
            <Button onClick={() => setShowForm(true)} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full">
              Share Your Story
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} onCommentAdded={fetchStories} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
