import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  const [showImage, setShowImage] = (useState as any)(true);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showImage) {
      setIsEnlarged(true);
    }
  };

  return (
    <>
      <Link to="/" className={`group inline-flex items-center gap-2 sm:gap-4 ${className} transition-all duration-300 shrink-0 min-w-0`}>
        {showImage ? (
          <img
            src="/logo.png"
            alt="Grandma's Herbals"
            className="h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain rounded-full ring-2 ring-olive-200/60 shadow-md transition-all duration-300 group-hover:ring-olive-400/70 group-hover:shadow-lg shrink-0 cursor-pointer hover:scale-110"
            onError={() => setShowImage(false)}
            onClick={handleLogoClick}
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

      {/* Enlarged Logo Modal */}
      <AnimatePresence>
        {isEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEnlarged(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 md:p-8"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center"
            >
              {/* Enlarged Logo Image - Fully Responsive & Centered */}
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Grandma's Herbals - Enlarged"
                  className="w-[320px] h-[320px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px] xl:w-[640px] xl:h-[640px] object-contain rounded-3xl shadow-2xl ring-4 ring-olive-300/60 bg-white/10 backdrop-blur-sm"
                />
                
                {/* Close Button with X mark - Top Right Corner */}
                <button
                  onClick={() => setIsEnlarged(false)}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 flex items-center justify-center bg-olive-600 hover:bg-olive-700 active:bg-olive-800 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 border-2 border-white/20"
                  aria-label="Close enlarged logo"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 stroke-[3]" />
                </button>
              </div>
              
              {/* Tap instruction for mobile */}
              <div className="absolute -bottom-16 left-0 right-0 text-center md:hidden">
                <p className="text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                  Tap anywhere to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}