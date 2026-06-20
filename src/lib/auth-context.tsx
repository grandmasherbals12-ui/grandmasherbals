import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

// Hardcoded admin email — always treated as admin regardless of DB
const ADMIN_EMAIL = "admin@gmail.com";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role?: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Fetch profile with a 3-second timeout — never throws, never hangs */
async function fetchProfile(userId: string) {
  try {
    const result = await Promise.race([
      supabase.from("users").select("full_name, avatar_url, role").eq("id", userId).maybeSingle(),
      new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000)),
    ]);
    return (result as any)?.data ?? null;
  } catch {
    return null;
  }
}

/** Determine if an email is the admin */
function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/** Build a User object — always gives admin role to the admin email */
function buildUser(
  authUser: { id: string; email?: string },
  profile?: { full_name?: string; avatar_url?: string; role?: string } | null
): User {
  const email = authUser.email || "";
  const role: "user" | "admin" =
    isAdminEmail(email) || profile?.role === "admin" ? "admin" : "user";
  return {
    id: authUser.id,
    email,
    fullName: profile?.full_name ?? undefined,
    avatar: profile?.avatar_url ?? undefined,
    role,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (mounted) setUser(buildUser(session.user, profile));
      }
      if (mounted) setLoading(false);
    });

    // Listen for auth state changes (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted) setUser(buildUser(session.user, profile));
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      // Best-effort profile creation — don't block on it
      supabase.from("users").upsert(
        { id: data.user.id, email, full_name: fullName, role: isAdminEmail(email) ? "admin" : "user" },
        { onConflict: "id" }
      ).then(() => {}); // fire-and-forget
    }
    // onAuthStateChange will pick up the new session and setUser
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange will fire and call setUser — no extra work needed here
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  // isAdmin: true if the admin email is logged in (regardless of DB)
  const isAdmin = !!user && (user.role === "admin" || isAdminEmail(user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
