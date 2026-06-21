import { createFileRoute, Link } from "@tanstack/react-router";
import type { ShowcaseSection } from "@/lib/shop-content";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, products as localProducts, Product, fetchProductsFromSupabase } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { CollectionShowcase } from "@/components/site/CollectionShowcase";
import {
  berryBalanceSection,
  boomMaxSection,
  citrusRestoreSection,
  dailyHydrateSection,
  herbalIvSection,
  merchandiseImages,
  notTodaySections,
  peachFlowSection,
  scentSections,
  tropicalReviveSection,
} from "@/lib/shop-content";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    browse: typeof search.browse === "string" ? search.browse : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Botanical Wellness — Grandma's Herbals" },
      {
        name: "description",
        content:
          "Hand-blended herbal teas, tinctures, oils, and mushroom blends — small batch and made with care.",
      },
      {
        property: "og:title",
        content: "Shop Botanical Wellness — Grandma's Herbals",
      },
      {
        property: "og:description",
        content: "Hand-blended herbal teas, tinctures, oils, and mushroom blends.",
      },
      { property: "og:url", content: "/shop" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { browse } = Route.useSearch();
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [products, setProducts] = useState<Product[]>(localProducts);

  // Load products from Supabase on mount, fall back to local data
  useEffect(() => {
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (q === "" || p.name.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, q, sort]);
  const restOfStore = filtered.filter(
    (product) =>
      ![
        "Herbal IV",
        "Not Today",
        "Boom Max",
        "Peach Flow",
        "Frankincense Ylang Vanilla Candle",
        "Citrus Magnolia Lime Candle",
        "Clove Rose Lemon Candle",
        "Mint Cinnamon Lavender Candle",
      ].includes(product.name),
  );
  const browseProducts = useMemo(() => {
    if (browse === "adult-enhancement") {
      return products.filter((product) => ["Boom Max", "Peach Flow"].includes(product.name));
    }
    if (browse === "herbal-iv") {
      return products.filter((product) => product.name === "Herbal IV");
    }
    if (browse === "not-today") {
      return products.filter((product) => product.name === "Not Today");
    }
    if (browse === "products") {
      return restOfStore;
    }
    return [];
  }, [browse, restOfStore]);

  const merchandiseSection: Omit<ShowcaseSection, "key"> = {
    eyebrow: "Merchandise For Sale",
    title: "Grandma's Herbals Merchandise",
    subtitle: "Branded essentials for the shop.",
    description:
      "Explore our collection of branded mugs, t-shirts, and other merchandise featuring Grandma's Herbals designs.",
    images: merchandiseImages,
    ctaHref: "/shop",
    ctaLabel: "Explore shop",
  };

  // Helper to render a ShowcaseSection without spreading `key` into JSX
  const renderShowcase = (section: ShowcaseSection) => {
    const { key, ...rest } = section;
    return <CollectionShowcase key={key} {...rest} />;
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-[#FAF8F5] to-stone-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-olive-600">Shop</p>
          <h1 className="mt-4 text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-stone-900 tracking-tight leading-none">
            Our Apothecary
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base leading-relaxed text-stone-600">
            Discover curated botanical collections, wellness blends, scent stories, and branded
            merchandise, all presented with intention and clean structure.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center justify-start gap-2 pb-2">
            {categories.map((c) => (
              <Button
                key={c}
                variant={cat === c ? "default" : "ghost"}
                onClick={() => setCat(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  cat === c
                    ? "bg-olive-500 hover:bg-olive-600 text-white"
                    : "text-olive-600 hover:bg-olive-100"
                }`}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="pl-10 w-48"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSort("featured")}>Featured</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("rating")}>Top Rated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("price-asc")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("price-desc")}>
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {browse ? (
          <div className="mb-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-olive-500">Browse Shop</p>
                <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">
                  {browse === "adult-enhancement"
                    ? "Adult Enhancement & Performance"
                    : browse === "herbal-iv"
                      ? "Herbal IV"
                      : browse === "not-today"
                        ? "Not Today"
                        : "Shop Products"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  Browse the product cards directly instead of the editorial collection layout.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {browseProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : cat === "All" ? (
          <>
            {renderShowcase(herbalIvSection)}
            {renderShowcase(tropicalReviveSection)}
            {renderShowcase(berryBalanceSection)}
            {renderShowcase(citrusRestoreSection)}
            {renderShowcase(dailyHydrateSection)}

            <div className="mb-16">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-olive-500">Dedicated Collection</p>
                  <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">NOT TODAY</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    Ten focused wellness stories, each with its own image and content so the full
                    Not Today range can be browsed one by one.
                  </p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start text-olive-700 hover:bg-olive-100 hover:text-olive-800 sm:justify-center"
                >
                  <Link to="/shop/not-today" search={{}}>
                    View collection <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {notTodaySections.map(({ key, ...section }) => (
                  <CollectionShowcase key={key} {...section} />
                ))}
              </div>
            </div>

            <CollectionShowcase {...merchandiseSection} />

            <div className="mb-16">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-olive-500">Aromatherapy & Candles</p>
                  <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">Grandma's Herbals Candles</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    Hand-poured soy aromatherapy candles in four signature scent directions, crafted to elevate every space and ritual.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {scentSections.map(({ key, ...section }) => (
                  <CollectionShowcase key={key} {...section} />
                ))}
              </div>
            </div>

            <div className="mb-16">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-olive-500">Shop Products</p>
                  <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">Browse the rest of the shop</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                    The original product grid remains available for the remaining wellness items.
                  </p>
                </div>
              </div>
              {restOfStore.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {restOfStore.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Adult Enhancement — shown last */}
            {renderShowcase(boomMaxSection)}
            {renderShowcase(peachFlowSection)}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
