import superjson from "superjson";
import type { SeoMeta } from "../../shared/siteSeo";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const normalizeText = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  return Array.from(normalized).slice(0, maxLength).join("") + (Array.from(normalized).length > maxLength ? "…" : "");
};
const normalizedOrigin = () => (process.env.CANONICAL_ORIGIN ?? "").trim().replace(/\/+$/, "");

function buildStructuredData(meta: SeoMeta, canonical: string) {
  const type = meta.schemaKind === "article"
    ? "Article"
    : meta.schemaKind === "learning-resource"
      ? "LearningResource"
      : meta.schemaKind === "collection"
        ? "CollectionPage"
        : "WebSite";
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: meta.schemaName ?? meta.title,
    description: meta.description,
  };
  if (canonical) data.url = canonical;
  if (meta.datePublished) data.datePublished = meta.datePublished;
  if (meta.schemaKind === "learning-resource") data.learningResourceType = "Practice problem";
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function buildHeadTags(meta: SeoMeta) {
  const origin = normalizedOrigin();
  const title = escapeHtml(normalizeText(meta.title, 70));
  const description = escapeHtml(normalizeText(meta.description, 200));
  const canonical = origin && meta.canonicalPath ? `${origin}${meta.canonicalPath}` : "";
  const image = meta.imageUrl?.startsWith("/") && origin ? `${origin}${meta.imageUrl}` : meta.imageUrl;
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="${meta.ogType ?? "website"}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:locale" content="zh_TW" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];
  if (process.env.SITE_NAME) tags.push(`<meta property="og:site_name" content="${escapeHtml(process.env.SITE_NAME)}" />`);
  if (canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`);
    tags.push(`<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  }
  if (image) tags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
  if (meta.noindex || meta.notFound) tags.push(`<meta name="robots" content="noindex, follow" />`);
  if (!meta.noindex && !meta.notFound) tags.push(buildStructuredData(meta, canonical));
  return tags.join("\n");
}

export function composeSsrHtml(template: string, appHtml: string, meta: SeoMeta, dehydratedState: unknown) {
  const serializedState = JSON.stringify(superjson.serialize(dehydratedState)).replace(/</g, "\\u003c");
  return template
    .replace("</body>", () => `<script>window.__RQ_STATE__ = ${serializedState}</script></body>`)
    .replace("<!--app-head-->", () => buildHeadTags(meta))
    .replace("<!--app-html-->", () => appHtml);
}
