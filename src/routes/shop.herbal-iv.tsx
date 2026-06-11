import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CollectionBrowsePage } from "@/components/site/CollectionBrowsePage";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/shop/herbal-iv")({
  head: () => ({
    meta: [
      { title: "Herbal IV — Grandma's Herbals" },
      {
        name: "description",
        content: "Explore Herbal IV as its own dedicated collection page.",
      },
    ],
  }),
  component: HerbalIvPage,
});

function HerbalIvPage() {
  const product = getProduct("5");
  const images = product.images ?? [product.image];

  return (
    <SiteLayout>
      <CollectionBrowsePage
        title="Herbal IV"
        description="Browse all four Herbal IV presentations in one dedicated page with direct add-to-cart actions on every card."
        product={product}
        images={images}
      />
    </SiteLayout>
  );
}
