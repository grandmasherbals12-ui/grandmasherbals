import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/shop/adult-enhancement")({
  head: () => ({
    meta: [
      { title: "Adult Enhancement & Performance — Grandma's Herbals" },
      {
        name: "description",
        content: "Browse Boom Max and Peach Flow as product cards in a focused collection view.",
      },
    ],
  }),
  component: AdultEnhancementPage,
});

function AdultEnhancementPage() {
  const collection = products.filter((product) =>
    ["Boom Max", "Peach Flow"].includes(product.name),
  );

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-olive-100 to-stone-50">
        <div className="container mx-auto px-4 py-14 md:py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-olive-500">Dedicated Collection</p>
          <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-800 md:text-6xl">
            Adult Enhancement & Performance
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 md:text-lg">
            Browse Boom Max and Peach Flow directly as products in a focused collection view.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collection.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
