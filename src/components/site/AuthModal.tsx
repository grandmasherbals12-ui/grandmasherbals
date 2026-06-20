import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Leaf } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      toast.success("Welcome back! 🌿");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, signUpName);
      toast.success("Account created! Welcome to Grandma's Herbals 🌿");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-olive-700 to-olive-900 px-8 py-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-cormorant font-bold text-white">
                  {tab === "signin" ? "Welcome Back" : "Join the Community"}
                </h2>
                <p className="text-olive-200 text-sm mt-1">
                  {tab === "signin"
                    ? "Sign in to access your wellness journey"
                    : "Create your free account today"}
                </p>

                {/* Tab toggle */}
                <div className="mt-5 flex bg-white/10 rounded-full p-1 gap-1">
                  <button
                    onClick={() => setTab("signin")}
                    className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                      tab === "signin"
                        ? "bg-white text-olive-800 shadow"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setTab("signup")}
                    className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                      tab === "signup"
                        ? "bg-white text-olive-800 shadow"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7">
                <AnimatePresence mode="wait">
                  {tab === "signin" ? (
                    <motion.form
                      key="signin"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSignIn}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="si-email">Email</Label>
                        <Input
                          id="si-email"
                          type="email"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="mt-1"
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="si-password">Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="si-password"
                            type={showPassword ? "text" : "password"}
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            placeholder="••••••••"
                            className="pr-10"
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-3 font-semibold mt-2"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                      <p className="text-center text-sm text-stone-500 pt-1">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("signup")}
                          className="text-olive-600 font-semibold hover:underline"
                        >
                          Create one
                        </button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="su-name">Full Name</Label>
                        <Input
                          id="su-name"
                          type="text"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="Jane Smith"
                          className="mt-1"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="su-email">Email</Label>
                        <Input
                          id="su-email"
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="mt-1"
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="su-password">Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="su-password"
                            type={showPassword ? "text" : "password"}
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="pr-10"
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="su-confirm">Confirm Password</Label>
                        <Input
                          id="su-confirm"
                          type={showPassword ? "text" : "password"}
                          value={signUpConfirm}
                          onChange={(e) => setSignUpConfirm(e.target.value)}
                          placeholder="Repeat password"
                          className="mt-1"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-3 font-semibold mt-2"
                      >
                        {loading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                      <p className="text-center text-sm text-stone-500 pt-1">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setTab("signin")}
                          className="text-olive-600 font-semibold hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
