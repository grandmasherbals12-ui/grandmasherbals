import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/membership", label: "Membership" },
  { to: "/consultation", label: "Consultation" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/stories", label: "Stories" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-cream-100/80 backdrop-blur-lg border-b border-cream-200 transition-all duration-300">
      <div className="container mx-auto flex py-4 md:py-6 items-center justify-between px-4 transition-all duration-300">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium transition-colors ${
                pathname === link.to
                  ? "text-olive-700"
                  : "text-olive-600 hover:text-olive-800"
              }`}
            >
              {link.label}
              {pathname === link.to && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-olive-500"
                  layoutId="underline"
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <a
            href="tel:+10000000000"
            className="hidden sm:flex items-center gap-2 bg-olive-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-olive-700 transition shrink-0"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-semibold hidden md:inline">Call Us</span>
          </a>
          <Link
            to="/account"
            aria-label="Account"
            className="p-1.5 sm:p-2 text-olive-600 hover:text-olive-800 shrink-0"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative p-1.5 sm:p-2 text-olive-600 hover:text-olive-800 shrink-0"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-olive-500 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-1.5 sm:p-2 text-olive-600 hover:text-olive-800 shrink-0"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cream-200"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md text-olive-600 hover:bg-olive-100"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+10000000000"
                onClick={() => setOpen(false)}
                className="px-4 py-2 mt-2 rounded-md bg-olive-600 text-white hover:bg-olive-700 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}