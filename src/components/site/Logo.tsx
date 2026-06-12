import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Logo({ className = "" }: { className?: string }) {
  const [showImage, setShowImage] = (useState as any)(true);

  return (
    <Link to="/" className={`group inline-flex items-center gap-2 sm:gap-4 ${className} transition-all duration-300 shrink-0 min-w-0`}>
      {showImage ? (
        <img
          src="/logo.png"
          alt="Grandma's Herbals"
          className="h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain rounded-full ring-2 ring-olive-200/60 shadow-md transition-all duration-300 group-hover:ring-olive-400/70 group-hover:shadow-lg shrink-0"
          onError={() => setShowImage(false)}
        />
      ) : (
        <span className="relative grid h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-soft transition-transform group-hover:rotate-6 duration-300 shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 sm:h-8 sm:w-8 md:h-10 md:w-10 transition-all duration-300">
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

      <span className="flex flex-col leading-tight min-w-0">
        <span className="font-serif text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground transition-all duration-300 truncate">
          Grandma's Herbals
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5 transition-all duration-300 hidden sm:block truncate">
          Plant Wisdom From Root To Leaf.
        </span>
      </span>
    </Link>
  );
}