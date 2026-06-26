import tincture from "@/assets/product-tincture.jpg";
import tea from "@/assets/product-tea.jpg";
import mushroom from "@/assets/product-mushroom.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: (typeof categories)[number];
  description: string;
  price: number;
  image: string;
  images?: string[];
  badge?: string;
  ingredients: string[];
  rating: number;
  reviews: number;
  in_stock?: boolean;
};

export const categories = [
  "All",
  "Nervous-System Support",
  "Relaxation & Calm Support",
  "Sleep-Supportive Wellness",
  "Digestive Wellness Support",
  "Energy & Focus Support",
  "Appetite Awareness Support",
  "Breathing Wellness Support",
  "Restorative Lifestyle Support",
  "Aromatherapy & Candles",
  "Wellness Support for Prostate-Conscious Lifestyles",
] as const;

export const products: Product[] = [
  {
    id: "1",
    name: "Calm & Relaxation Tincture",
    tagline: "Find your center, naturally.",
    category: "Nervous-System Support",
    description:
      "A potent, fast-acting tincture to soothe stress and quiet an anxious mind. Made with a blend of nervine herbs to restore balance.",
    price: 38,
    image: tincture,
    badge: "Best Seller",
    ingredients: ["Lavender", "Chamomile", "Lemon Balm", "Organic Cane Alcohol"],
    rating: 4.9,
    reviews: 212,
  },
  {
    id: "2",
    name: "Deep Sleep Herbal Tea",
    tagline: "Drift off to dreamland.",
    category: "Sleep-Supportive Wellness",
    description:
      "A comforting, caffeine-free herbal tea blend designed to promote deep, restorative sleep without morning grogginess.",
    price: 24,
    image: tea,
    ingredients: ["Valerian Root", "Hops", "Passionflower", "Chamomile"],
    rating: 4.8,
    reviews: 189,
  },
  {
    id: "3",
    name: "Focus Gold Mushroom Blend",
    tagline: "Sharpen your mind.",
    category: "Energy & Focus Support",
    description:
      "An adaptogenic mushroom blend featuring Lion's Mane and Cordyceps to support cognitive function, memory, and natural energy levels.",
    price: 45,
    image: mushroom,
    ingredients: ["Lion's Mane", "Cordyceps", "Maca Root", "Cacao"],
    rating: 4.7,
    reviews: 155,
  },
  {
    id: "4",
    name: "Sacred Roots Body Oil",
    tagline: "Nourish your temple.",
    category: "Restorative Lifestyle Support",
    description:
      "A luxurious, fast-absorbing body oil infused with calendula and frankincense to hydrate skin, reduce inflammation, and calm the spirit.",
    price: 52,
    image: "/herbal.png",
    badge: "New",
    ingredients: ["Jojoba Oil", "Calendula", "Frankincense", "Myrrh"],
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "scent-1",
    name: "Frankincense Ylang Vanilla Candle",
    tagline: "Warm, luxurious, and resinous.",
    category: "Aromatherapy & Candles",
    description:
      "Hand-poured soy aromatherapy candle with soft sacred frankincense, exotic floral ylang ylang, and creamy vanilla undertones. Perfect for evening relaxation, prayer, meditation, and self-care rituals.",
    price: 32,
    image: "/scent-1.png",
    badge: "Bestseller",
    ingredients: ["Soy Wax", "Frankincense Essential Oil", "Ylang Ylang", "Vanilla"],
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "scent-2",
    name: "Citrus Magnolia Lime Candle",
    tagline: "Fresh citrus meets soft magnolia.",
    category: "Aromatherapy & Candles",
    description:
      "Hand-poured soy aromatherapy candle with vibrant lime, sweet orange, and clean magnolia petals. Uplifting and energizing — ideal for mornings, kitchens, and spring gatherings.",
    price: 32,
    image: "/scent-2.png",
    ingredients: ["Soy Wax", "Citrus Essential Oil", "Magnolia", "Lime"],
    rating: 4.8,
    reviews: 64,
  },
  {
    id: "scent-3",
    name: "Clove Rose Lemon Candle",
    tagline: "Elegant, vintage, and timeless.",
    category: "Aromatherapy & Candles",
    description:
      "Hand-poured soy aromatherapy candle with spicy clove, velvety rose petals, and bright lemon. Ideal for dinner parties, guest rooms, and special occasions.",
    price: 32,
    image: "/scent-3.png",
    ingredients: ["Soy Wax", "Clove Essential Oil", "Rose", "Lemon"],
    rating: 4.7,
    reviews: 52,
  },
  {
    id: "scent-4",
    name: "Mint Cinnamon Lavender Candle",
    tagline: "Cooling mint, soft lavender, warm cinnamon.",
    category: "Aromatherapy & Candles",
    description:
      "Hand-poured soy aromatherapy candle blending cooling mint, calming lavender, and warming cinnamon. Perfect for bedrooms, wellness spaces, and evening wind-down routines.",
    price: 32,
    image: "/scent-4.png",
    ingredients: ["Soy Wax", "Peppermint Essential Oil", "Cinnamon", "Lavender"],
    rating: 4.8,
    reviews: 71,
  },
];

export const getProduct = (id: string) =>
  products.find((p) => p.id === id) ?? products[0];

// Supabase Product Functions
import { supabase } from "./supabase";

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products from Supabase:", error);
      return products; // Fallback to local data
    }
    return data || products;
  } catch (err) {
    console.error("Error fetching products:", err);
    return products; // Fallback to local data
  }
};

export const fetchProductFromSupabase = async (id: string): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching product from Supabase:", error);
      return getProduct(id); // Fallback to local data
    }
    return data || getProduct(id);
  } catch (err) {
    console.error("Error fetching product:", err);
    return getProduct(id); // Fallback to local data
  }
};