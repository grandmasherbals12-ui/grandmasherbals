import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Logo({ className = "" }: { className?: string }) {
  const [showImage, setShowImage] = (useState as any)(true);

  return (
    <Link to="/" className={`group inline-flex items-center gap-4 ${className} transition-all duration-300`}>
      {showImage ? (
        <img
          src="/logo.png"
          alt="Grandma's Herbals"
          className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain rounded-full ring-2 ring-olive-200/60 shadow-md transition-all duration-300 group-hover:ring-olive-400/70 group-hover:shadow-lg"
          onError={() => setShowImage(false)}
        />
      ) : (
        <span className="relative grid h-16 w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-soft transition-transform group-hover:rotate-6 duration-300">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 md:h-12 md:w-12 transition-all duration-300">
            <path
              d="M12 21c0-5 3-9 8-10-1 5-4 9-8 10ZM12 21c0-5-3-9-8-10 1 5 4 9 8 10ZM12 21V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      <span className="flex flex-col leading-none">
        <span className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-5xl transition-all duration-300">
          Grandma's Herbals
        </span>
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:text-[12px] lg:text-[14px] mt-1.5 transition-all duration-300">
          Plant Wisdom From Root To Leaf.
        </span>
      </span>
    </Link>
  );
}