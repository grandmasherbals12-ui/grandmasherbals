import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct, products } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/shop/$productId")({
  head: ({ params }) => {
    const p = getProduct(params.productId);
    return {
      meta: [
        { title: `${p.name} — Grandma's Herbals` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — Grandma's Herbals` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/shop/${p.id}` },
        { property: "og:image", content: p.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const [mainImage, setMainImage] = useState<string>(
    product.images?.[0] ?? product.image
  );
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const { addToCart } = useCart();

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/shop"
          search={{}}
          className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-olive-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.images && product.images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2 px-1">
                {product.images.map((img) => (
                  <button
                    key={img}
                    onClick={() => setMainImage(img)}
                    className={`h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      mainImage === img ? "border-olive-600 scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-olive-500">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-olive-800 mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-3xl font-cormorant text-olive-700 mt-6">
              ${product.price}
            </p>
            <p className="text-gray-500 mt-4 leading-relaxed">
              {product.tagline}
            </p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-olive-500 hover:bg-olive-600"
                onClick={() => addToCart(product, qty)}
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>{product.description}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside">
                      {product.ingredients.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Shipping & Quality</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { icon: Truck, t: "Slow shipping", s: "Carbon-considered" },
                        { icon: ShieldCheck, t: "Organic", s: "Third-party tested" },
                        { icon: Sparkles, t: "Made to order", s: "Within 3 days" },
                      ].map(({ icon: Icon, t, s }) => (
                        <div key={t} className="text-center">
                          <Icon className="h-6 w-6 text-olive-500 mx-auto" />
                          <p className="mt-2 text-sm font-medium">{t}</p>
                          <p className="text-xs text-gray-500">{s}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="bg-olive-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cormorant font-bold text-olive-800 text-center mb-10">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
