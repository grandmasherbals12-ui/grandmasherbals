import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Intake Form — Grandma's Herbals" },
      {
        name: "description",
        content: "Complete your concierge wellness intake after payment.",
      },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  const { user, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [goals, setGoals] = useState("");
  const [healthConcerns, setHealthConcerns] = useState("");
  const [medications, setMedications] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please log in to complete your intake.");
      return;
    }

    if (!fullName.trim() || !age.trim() || !goals.trim() || !healthConcerns.trim()) {
      toast.error("Please complete the required intake fields.");
      return;
    }

    setSubmitting(true);
    try {
      const goalList = goals
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

      const mergedNotes = [
        `Health concerns: ${healthConcerns}`,
        medications ? `Medications: ${medications}` : null,
        bloodPressure ? `Blood Pressure: ${bloodPressure}` : null,
        bloodSugar ? `Blood Sugar: ${bloodSugar}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase.from("member_profiles").upsert({
        id: user.id,
        full_name: fullName,
        age: Number(age),
        email: user.email,
        primary_goals: goalList,
        health_notes: mergedNotes,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Intake submitted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Unable to submit intake form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-olive-50 via-white to-stone-50 px-4 py-16">
          <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Complete</p>
            <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-900">Intake Received</h1>
            <p className="mt-4 text-stone-600 leading-7">
              Your concierge wellness intake has been saved. Your welcome letter is ready next.
            </p>
            <Button asChild className="mt-8 rounded-full bg-olive-600 text-white hover:bg-olive-700">
              <Link to="/welcome">View Welcome Letter</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-olive-50 via-white to-stone-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">After Payment</p>
            <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-900">Intake Form</h1>
            <p className="mt-3 text-stone-600 leading-7">
              Complete this form after checkout so we can personalize your wellness welcome letter and protocol.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="goals">Goals</Label>
                  <Textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="List your main wellness goals" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="healthConcerns">Health Concerns</Label>
                  <Textarea id="healthConcerns" value={healthConcerns} onChange={(e) => setHealthConcerns(e.target.value)} placeholder="Describe concerns or symptoms" required />
                </div>
                <div>
                  <Label htmlFor="medications">Medications</Label>
                  <Input id="medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="List current medications" />
                </div>
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input id="bloodPressure" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} placeholder="e.g. 120/80" />
                </div>
                <div>
                  <Label htmlFor="bloodSugar">Blood Sugar</Label>
                  <Input id="bloodSugar" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} placeholder="e.g. 94 fasting" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else we should know?" />
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="rounded-full bg-olive-600 text-white hover:bg-olive-700">
                {submitting ? "Saving..." : "Submit Intake"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
