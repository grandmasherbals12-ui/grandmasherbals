import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ShowcaseSection } from "@/lib/shop-content";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type CollectionShowcaseProps = ShowcaseSection & {
  className?: string;
};

export function CollectionShowcase({
  eyebrow,
  title,
  subtitle,
  description,
  overlayTitle,
  overlaySubtitle,
  highlights = [],
  images = [],
  items = [],
  ctaHref,
  ctaLabel = "View collection",
  className = "",
}: CollectionShowcaseProps) {
  const previewImages = images.slice(0, 4);

  return (
    <motion.section
      className={`mb-16 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-gradient-to-br from-olive-50 via-stone-50 to-cream-100 p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-olive-500">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-cormorant font-bold text-olive-800 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-stone-500">{subtitle}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              {description}
            </p>

            {highlights.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-olive-200 bg-white/90 px-3 py-1 text-xs font-medium text-olive-700"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            ) : null}

            {ctaHref ? (
              <Button asChild className="mt-8 rounded-full bg-olive-500 px-5 text-white hover:bg-olive-600">
                <Link to={ctaHref}>
                  {ctaLabel}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            {previewImages.length > 0 ? (
              previewImages.map((image, index) => (
                <div key={image} className="group relative min-h-56 overflow-hidden bg-stone-100 p-4 flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${title} preview ${index + 1}`}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient base overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/0 transition-opacity duration-300" />

                  {overlayTitle ? (
                    <div className="absolute left-4 top-4 max-w-[80%] rounded-2xl border border-white/20 bg-black/35 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/75">
                        {eyebrow}
                      </p>
                      <p className="mt-1 text-lg font-cormorant font-bold leading-tight">
                        {overlayTitle}
                      </p>
                      {overlaySubtitle ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/80">
                          {overlaySubtitle}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Hover description overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="translate-y-3 transform transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
                        {eyebrow}
                      </p>
                      <p className="mt-1 text-sm font-semibold font-cormorant text-white leading-tight">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-white/80 line-clamp-2">
                        {subtitle}
                      </p>
                      {highlights.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {highlights.slice(0, 2).map((h) => (
                            <span
                              key={h}
                              className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sm:col-span-2 flex min-h-72 items-center justify-center bg-gradient-to-br from-stone-100 to-olive-50 p-8 text-center">
                <div className="max-w-md">
                  <p className="text-xs uppercase tracking-[0.3em] text-olive-500">{eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-cormorant font-bold text-olive-800">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="border-t border-stone-200 bg-stone-50 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {item.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 p-2 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Hover text overlay on item images */}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-xs font-semibold font-cormorant text-white leading-snug">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-[10px] text-white/75">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-lg font-cormorant font-bold text-olive-800">
                        {item.title}
                      </h3>
                      {item.subtitle ? (
                        <p className="text-sm uppercase tracking-[0.22em] text-stone-500">
                          {item.subtitle}
                        </p>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="text-sm leading-6 text-stone-600">{item.description}</p>
                    ) : null}
                    {item.notes && item.notes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.notes.map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-olive-50 px-3 py-1 text-[11px] font-medium text-olive-700"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
