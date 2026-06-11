import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Product functions
export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  return { data, error };
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

// Order functions
export const createOrder = async (userId: string, orderData: any) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        ...orderData,
      },
    ])
    .select();
  return { data, error };
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
};

// Image upload functions
export const uploadProductImage = async (
  file: File,
  productId: string
) => {
  const filename = `${productId}-${Date.now()}.${file.name.split(".").pop()}`;
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(`products/${filename}`, file);
  return { data, error };
};

export const getProductImageUrl = (filename: string) => {
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(`products/${filename}`);
  return data.publicUrl;
};
