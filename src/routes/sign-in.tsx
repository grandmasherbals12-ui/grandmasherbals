import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In — Grandma's Herbals" },
      {
        name: "description",
        content:
          "Sign in or create your account to access your wellness journey with Grandma's Herbals.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign Up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  // Redirect to account if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/account" });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail || !siPassword) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(siEmail, siPassword);
      toast.success("Welcome back! 🌿");
      navigate({ to: "/account" });
    } catch (err: any) {
      toast.error(
        err?.message || "Sign in failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName || !suEmail || !suPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (suPassword !== suConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (suPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(suEmail, suPassword, suName);
      toast.success("Account created! Welcome to Grandma's Herbals 🌿");
      navigate({ to: "/account" });
    } catch (err: any) {
      toast.error(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-white to-olive-50/40 py-20 sm:py-28 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-olive-100 rounded-full p-3">
                <Leaf className="h-7 w-7 text-olive-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-olive-900 mb-2">
              {tab === "signin" ? "Welcome Back" : "Join the Community"}
            </h1>
            <p className="text-stone-500 text-sm">
              {tab === "signin"
                ? "Sign in to access your wellness journey"
                : "Create your free account today"}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-1 bg-stone-100 rounded-full p-1 mb-8"
          >
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === "signin"
                  ? "bg-white text-olive-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                tab === "signup"
                  ? "bg-white text-olive-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Sign Up
            </button>
          </motion.div>

          {/* Form */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === "signin" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8"
          >
            {tab === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400 pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-5 text-sm font-semibold shadow-lg shadow-olive-900/10"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1.5 rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400 pr-10"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-stone-700 font-semibold text-sm">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    value={suConfirm}
                    onChange={(e) => setSuConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="mt-1.5 rounded-xl border-stone-200 focus:border-olive-400 focus:ring-olive-400"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-5 text-sm font-semibold shadow-lg shadow-olive-900/10"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-xs text-stone-400 mt-6"
          >
            By signing in, you agree to our terms and privacy policy.
          </motion.p>
        </div>
      </section>
    </SiteLayout>
  );
}
