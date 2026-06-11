import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

type CollectionBrowsePageProps = {
  title: string;
  description: string;
  product: Product;
  images: string[];
  backHref?: string;
};

export function CollectionBrowsePage({
  title,
  description,
  product,
  images,
  backHref = "/shop",
}: CollectionBrowsePageProps) {
  const { addToCart } = useCart();

  return (
    <>
      <section className="bg-gradient-to-b from-olive-100 to-stone-50">
        <div className="container mx-auto px-4 py-14 md:py-16">
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-olive-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-olive-500">
            Dedicated Collection
          </p>
          <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-800 md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 md:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-olive-500">Add to cart</p>
              <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">
                {product.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                {product.tagline}
              </p>
            </div>
            <Button
              onClick={() => addToCart(product)}
              className="rounded-full bg-olive-500 px-5 text-white hover:bg-olive-600"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <motion.article
              key={image}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-50/50 p-4 flex items-center justify-center">
                <img
                  src={image}
                  alt={`${title} image ${index + 1}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay with description */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="translate-y-3 transform transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                      {title}
                    </p>
                    <p className="mt-1 text-sm font-semibold font-cormorant text-white">
                      {product.tagline}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/85 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.ingredients.slice(0, 3).map((ing) => (
                        <span
                          key={ing}
                          className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-olive-500">
                    {title}
                  </p>
                  <h3 className="mt-2 text-lg font-cormorant font-bold text-olive-800">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 line-clamp-2">{product.tagline}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-olive-200 text-olive-700 hover:bg-olive-50"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link
                    to="/shop/$productId"
                    params={{ productId: product.id }}
                    search={{}}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-olive-200 text-olive-600 hover:bg-olive-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}