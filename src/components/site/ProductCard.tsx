import type { Product } from "@/lib/products";
import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <Link to="/shop/$productId" params={{ productId: product.id }} search={{}} className="block">
        <div className="relative overflow-hidden bg-stone-50/50 p-4 flex items-center justify-center">
          <motion.img
            src={product.images?.[0] ?? product.image}
            alt={product.name}
            className="h-56 w-full object-contain transition-transform duration-500 group-hover:scale-105"
            transition={{ duration: 0.5 }}
          />

          {/* Hover overlay with description */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="translate-y-4 transform p-4 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-1">
                {product.category}
              </p>
              <p className="text-sm md:text-base leading-snug text-white/95 max-h-[140px] overflow-y-auto pr-1">
                {product.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {product.ingredients.slice(0, 3).map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-olive-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="truncate text-xl font-cormorant font-bold text-olive-700">
            {product.name}
          </h3>
          <p className="mt-1 text-base text-stone-500 line-clamp-1">{product.tagline}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-semibold text-olive-600">${product.price}</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-base text-stone-600">{product.rating}</span>
              <span className="text-sm text-stone-400">({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick actions overlay — appears on hover */}
      <div className="flex gap-2 px-4 pb-4">
        <Button
          size="sm"
          className="flex-1 rounded-full bg-olive-500 text-sm text-white shadow transition-all duration-200 hover:bg-olive-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ transitionDelay: "60ms" }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            addToCart(product);
          }}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          Add to Cart
        </Button>
        <Link
          to="/shop/$productId"
          params={{ productId: product.id }}
          search={{}}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-olive-200 text-olive-600 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-olive-50"
          style={{ transitionDelay: "80ms" }}
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
