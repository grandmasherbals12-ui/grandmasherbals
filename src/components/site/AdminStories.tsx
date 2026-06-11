import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Trash2, Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Story = {
  id: string;
  author_name: string;
  author_email: string;
  title: string;
  content: string;
  story_type: string;
  is_approved: boolean;
  featured: boolean;
  likes: number;
  created_at: string;
  comment_count?: number;
};

type Comment = {
  id: string;
  story_id: string;
  commenter_name: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

export function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<"stories" | "comments">("stories");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("stories").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("story_comments").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setStories((s as Story[]) ?? []);
    setComments((c as Comment[]) ?? []);
    setLoading(false);
  };

  const approveStory = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("stories").update({ is_approved: approved }).eq("id", id);
    if (!error) {
      toast.success(approved ? "Story approved!" : "Story hidden.");
      setStories((prev) => prev.map((s) => s.id === id ? { ...s, is_approved: approved } : s));
    }
  };

  const featureStory = async (id: string, featured: boolean) => {
    const { error } = await supabase.from("stories").update({ featured }).eq("id", id);
    if (!error) {
      toast.success(featured ? "Story featured!" : "Story unfeatured.");
      setStories((prev) => prev.map((s) => s.id === id ? { ...s, featured } : s));
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm("Delete this story and all its comments?")) return;
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (!error) {
      toast.success("Story deleted.");
      setStories((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const approveComment = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("story_comments").update({ is_approved: approved }).eq("id", id);
    if (!error) {
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, is_approved: approved } : c));
      toast.success(approved ? "Comment approved!" : "Comment hidden.");
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("story_comments").delete().eq("id", id);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
      </div>
    );
  }

  const pendingStories = stories.filter((s) => !s.is_approved).length;
  const pendingComments = comments.filter((c) => !c.is_approved).length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("stories")}
          className={`px-4 py-2 text-sm rounded-t-lg font-medium transition flex items-center gap-2 ${
            activeTab === "stories" ? "bg-card border border-border border-b-card text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          📚 Stories
          {pendingStories > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingStories}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 text-sm rounded-t-lg font-medium transition flex items-center gap-2 ${
            activeTab === "comments" ? "bg-card border border-border border-b-card text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Comments
          {pendingComments > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingComments}</span>
          )}
        </button>
      </div>

      {/* Stories */}
      {activeTab === "stories" && (
        <div className="space-y-4">
          {stories.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No stories yet.</p>
          )}
          {stories.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl border bg-card p-5 shadow-soft transition ${
                s.is_approved ? "border-border" : "border-yellow-300 bg-yellow-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!s.is_approved && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full font-bold">
                        ⏳ Pending Review
                      </span>
                    )}
                    {s.featured && (
                      <span className="text-xs bg-olive-100 text-olive-700 border border-olive-300 px-2 py-0.5 rounded-full font-bold">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="text-xs text-stone-400 uppercase tracking-wide">{s.story_type}</span>
                    <span className="text-xs text-stone-400 ml-auto">
                      {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">by <strong>{s.author_name}</strong> {s.author_email && `(${s.author_email})`}</p>
                  <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{s.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {comments.filter((c) => c.story_id === s.id).length} comment(s)
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={s.is_approved ? "outline" : "default"}
                    onClick={() => approveStory(s.id, !s.is_approved)}
                    className={`rounded-full text-xs gap-1 ${s.is_approved ? "" : "bg-green-600 hover:bg-green-700 text-white border-green-600"}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {s.is_approved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => featureStory(s.id, !s.featured)}
                    className={`rounded-full text-xs gap-1 ${s.featured ? "border-yellow-400 text-yellow-700" : ""}`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {s.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteStory(s.id)}
                    className="rounded-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments */}
      {activeTab === "comments" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Commenter</th>
                <th className="px-5 py-4">Comment</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comments.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No comments yet.</td></tr>
              )}
              {comments.map((c) => (
                <tr key={c.id} className={`hover:bg-secondary/40 ${!c.is_approved ? "bg-yellow-50/30" : ""}`}>
                  <td className="px-5 py-4 font-medium">{c.commenter_name}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">{c.comment}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.is_approved ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {c.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full text-xs"
                      onClick={() => approveComment(c.id, !c.is_approved)}>
                      {c.is_approved ? "Hide" : "Approve"}
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full text-xs text-red-500 hover:text-red-700"
                      onClick={() => deleteComment(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
