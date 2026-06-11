import { useQuery } from "@tanstack/react-query";
import { fetchProductsFromSupabase, fetchProductFromSupabase, Product } from "@/lib/products";

// Hook to fetch all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProductsFromSupabase,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductFromSupabase(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
