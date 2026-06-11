import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CollectionBrowsePage } from "@/components/site/CollectionBrowsePage";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/shop/not-today")({
  head: () => ({
    meta: [
      { title: "Not Today — Grandma's Herbals" },
      {
        name: "description",
        content: "Explore Not Today as its own dedicated collection page.",
      },
    ],
  }),
  component: NotTodayPage,
});

function NotTodayPage() {
  const product = getProduct("6");
  const images = product.images ?? [product.image];

  return (
    <SiteLayout>
      <CollectionBrowsePage
        title="Not Today"
        description="Browse all ten Not Today image variants in one dedicated page with direct add-to-cart actions on every card."
        product={product}
        images={images}
      />
    </SiteLayout>
  );
}
