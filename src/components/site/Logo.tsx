import { Link } from "@tanstack/react-router";
import { useState } from "react";

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

      {/* Enlarged Logo Modal - Fixed positioning */}
      {isEnlarged && (
        <div
          onClick={() => setIsEnlarged(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <img
              src="/logo.png"
              alt="Grandma's Herbals - Enlarged"
              style={{
                width: '400px',
                height: '400px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '4px solid rgba(132, 204, 22, 0.6)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsEnlarged(false)}
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                color: 'white',
                border: '4px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(220, 38, 38, 0.5)',
                transition: 'all 0.2s',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              ✕
            </button>
            
            <div style={{
              position: 'absolute',
              bottom: '-70px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '12px 24px',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}