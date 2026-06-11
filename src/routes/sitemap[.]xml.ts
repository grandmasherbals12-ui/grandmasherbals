import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

const BASE_URL = "";
const paths = ["/", "/shop", "/consultation", "/about", "/cart", "/account"];

export const Route = createFileRoute("/sitemap.xml")({
  component: Sitemap,
});

function Sitemap() {
  const urls = paths.map(
    (p) =>
      `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
  );
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");

  return React.createElement(
    "pre",
    { style: { padding: "2rem", whiteSpace: "pre-wrap" } },
    xml
  );
}