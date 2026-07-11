import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://hackradar.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "daily" as const },
          { path: "/browse", priority: "0.9", changefreq: "daily" as const },
          { path: "/saved", priority: "0.4", changefreq: "monthly" as const },
          { path: "/submit", priority: "0.6", changefreq: "monthly" as const },
          { path: "/settings", priority: "0.3", changefreq: "monthly" as const },
          { path: "/about", priority: "0.5", changefreq: "monthly" as const },
          { path: "/help", priority: "0.5", changefreq: "monthly" as const },
          { path: "/blog/showcase-hackathon-experience", priority: "0.6", changefreq: "monthly" as const },
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
