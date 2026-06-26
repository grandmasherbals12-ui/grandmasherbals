import { useState, useEffect, useRef } from "react";
import { Eye, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ColorMode = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "high-contrast";

const COLOR_MODES: { id: ColorMode; label: string; description: string; preview: string[] }[] = [
  {
    id: "normal",
    label: "Normal Vision",
    description: "Default color palette",
    preview: ["#4a5d23", "#6b7d3e", "#8a9e5c", "#d4c5a0"],
  },
  {
    id: "protanopia",
    label: "Protanopia",
    description: "Red-blind friendly",
    preview: ["#2d5a87", "#4a7ab0", "#6c9bd5", "#c9b88a"],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    description: "Green-blind friendly",
    preview: ["#8b6914", "#a68332", "#c4a155", "#d4c5a0"],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    description: "Blue-yellow friendly",
    preview: ["#8b3a62", "#a35580", "#c073a0", "#d4a0b8"],
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    description: "Maximum readability",
    preview: ["#000000", "#333333", "#666666", "#ffffff"],
  },
];

const STORAGE_KEY = "gh-accessibility-color-mode";

export function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<ColorMode>("normal");
  const panelRef = useRef<HTMLDivElement>(null);

  // Load stored preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
    if (stored && COLOR_MODES.some((m) => m.id === stored)) {
      setActiveMode(stored);
      applyColorMode(stored);
    }
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const applyColorMode = (mode: ColorMode) => {
    const html = document.documentElement;
    // Remove all color mode classes
    COLOR_MODES.forEach((m) => {
      html.classList.remove(`cb-${m.id}`);
    });
    // Apply selected mode (skip normal — it uses defaults)
    if (mode !== "normal") {
      html.classList.add(`cb-${mode}`);
    }
  };

  const selectMode = (mode: ColorMode) => {
    setActiveMode(mode);
    applyColorMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return (
    <div ref={panelRef} className="fixed bottom-6 left-6 z-[999] print:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:ring-offset-2 ${
          activeMode !== "normal"
            ? "bg-olive-700 text-white ring-2 ring-olive-300"
            : "bg-white text-olive-700 border border-stone-200 hover:bg-olive-50"
        }`}
        aria-label="Accessibility color options"
        title="Color Blind Accessibility"
      >
        <Eye className="h-5 w-5" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 left-0 w-72 rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50/50">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Accessibility</h3>
                <p className="text-xs text-stone-500 mt-0.5">Color vision options</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition"
                aria-label="Close accessibility panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Options */}
            <div className="p-3 space-y-1.5 max-h-[340px] overflow-y-auto">
              {COLOR_MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => selectMode(mode.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-olive-50 border-2 border-olive-400 shadow-sm"
                        : "hover:bg-stone-50 border-2 border-transparent"
                    }`}
                    aria-pressed={isActive}
                  >
                    {/* Color Preview Dots */}
                    <div className="flex gap-1 shrink-0">
                      {mode.preview.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-stone-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? "text-olive-800" : "text-stone-700"}`}>
                        {mode.label}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{mode.description}</p>
                    </div>

                    {/* Check */}
                    {isActive && (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-olive-600 text-white shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Changes apply instantly across the entire website and are saved for your next visit.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
