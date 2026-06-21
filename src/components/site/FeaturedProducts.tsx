import { products, Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end border-b border-stone-200/60 pb-5 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-olive-600 mb-2">Apothecary</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-cormorant font-bold text-stone-900 tracking-tight leading-none uppercase">
              Featured Products
            </h2>
          </div>
          <Button asChild variant="ghost" className="text-olive-600 hover:text-olive-700 font-semibold">
            <Link to="/shop" search={{ browse: undefined }}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
