import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-cream-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-olive-700">
              Personalized botanical wellness rooted in family tradition, gentle
              rituals, and the quiet wisdom of plants.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-olive-200 text-olive-600 transition hover:bg-olive-500 hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Shop",
                links: [
                  ["Herbal Blends", "/shop"],
                  ["Wellness Teas", "/shop"],
                  ["Mushrooms", "/shop"],
                  ["Plant Extracts", "/shop"],
                ],
              },
              {
                title: "Wellness",
                links: [
                  ["Consultations", "/consultation"],
                  ["Breathwork Library", "/breathwork"],
                  ["Chair Stretch Series", "/chair-stretch"],
                  ["Our Story", "/about"],
                  ["Journal", "/account"],
                  ["Gift Cards", "/shop"],
                ],
              },
              {
                title: "Support",
                links: [
                  ["Contact", "/about"],
                  ["Shipping", "/about"],
                  ["Returns", "/about"],
                  ["FAQ", "/about"],
                  ["Wellness Chatbot", "/chatbot"],
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-cormorant font-bold text-lg text-olive-800">
                  {col.title}
                </h4>
                <ul className="space-y-3 text-sm text-olive-700">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link to={href} className="transition hover:text-olive-500">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center text-sm text-olive-600">
          <p>&copy; {new Date().getFullYear()} Grandma's Herbal Haven. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-olive-800">Privacy Policy</a>
            <a href="#" className="hover:text-olive-800">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}