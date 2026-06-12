import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            fullName: data?.full_name,
            avatar: data?.avatar_url,
          });
        } catch {
          // Profile row may not exist yet — set basic user info
          setUser({
            id: session.user.id,
            email: session.user.email || "",
          });
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            fullName: data?.full_name,
            avatar: data?.avatar_url,
          });
        } catch {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });

      setUser({
        id: data.user.id,
        email,
        fullName,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      setUser({
        id: data.user.id,
        email: data.user.email || "",
        fullName: userData?.full_name,
        avatar: userData?.avatar_url,
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
