import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/lib/products";

type ProductCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  images?: string[];
  backHref?: string;
};

export function ProductCollectionPage({
  eyebrow,
  title,
  description,
  products,
  images,
  backHref = "/shop",
}: ProductCollectionPageProps) {
  const featuredProduct = products[0];
  const galleryImages = images?.length
    ? images
    : featuredProduct?.images?.length
      ? featuredProduct.images
      : featuredProduct
        ? [featuredProduct.image]
        : [];

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
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-olive-500">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-800 md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 md:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-olive-500">
                  Collection preview
                </p>
                <h2 className="mt-2 text-3xl font-cormorant font-bold text-olive-800">
                  {featuredProduct?.name ?? title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {featuredProduct?.tagline ?? description}
                </p>
              </div>
              <p className="text-sm font-medium text-olive-700">
                {galleryImages.length} image{galleryImages.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {galleryImages.map((image, index) => (
                <div
                  key={image}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 p-2 flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${featuredProduct?.name ?? title} image ${index + 1}`}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm font-medium text-olive-800">Image {index + 1}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {featuredProduct?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-olive-500">
              About this collection
            </p>
            <p className="mt-3 text-base leading-7 text-stone-600">{description}</p>
            <div className="mt-6 space-y-4">
              {(galleryImages.length ? galleryImages : [featuredProduct?.image ?? ""]).map(
                (image, index) => (
                  <div
                    key={image}
                    className="flex items-center gap-4 rounded-2xl border border-stone-200 p-3"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      {image ? (
                        <img
                          src={image}
                          alt={`${featuredProduct?.name ?? title} thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium text-olive-800">{featuredProduct?.name ?? title}</p>
                      <p className="text-sm text-stone-500">
                        {featuredProduct?.tagline ?? description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
