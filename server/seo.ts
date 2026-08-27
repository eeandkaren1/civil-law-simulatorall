import { ARTICLES } from "../shared/articles";
import { getIndexablePaths } from "../shared/siteSeo";

const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function normalizedCanonicalOrigin(origin = process.env.CANONICAL_ORIGIN ?? "") {
  return origin.trim().replace(/\/+$/, "");
}

export function buildRobots(origin = process.env.CANONICAL_ORIGIN ?? "") {
  const canonicalOrigin = normalizedCanonicalOrigin(origin);
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /progress",
    "Disallow: /settings",
    "Disallow: /daily-challenge",
    "Disallow: /wrong-notebook",
    "Disallow: /question-explorer",
    canonicalOrigin ? `Sitemap: ${canonicalOrigin}/sitemap.xml` : "# Sitemap is enabled after CANONICAL_ORIGIN is configured.",
    "",
  ].join("\n");
}

export function buildSitemap(origin = process.env.CANONICAL_ORIGIN ?? "") {
  const canonicalOrigin = normalizedCanonicalOrigin(origin);
  if (!canonicalOrigin) return null;
  const articleDates = new Map(ARTICLES.map((article) => [`/articles/${article.id}`, article.date]));
  const entries = getIndexablePaths().map((path) => {
    const lastmod = articleDates.get(path);
    return `  <url>\n    <loc>${xmlEscape(`${canonicalOrigin}${path}`)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
