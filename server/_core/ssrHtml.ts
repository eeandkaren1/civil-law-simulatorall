import superjson from "superjson";
import type { SeoMeta } from "../../shared/siteSeo";
import { getArticleById, getScenarioById, getVillageById, getScenariosByVillage } from "../../shared/gameData";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const normalizeText = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  return Array.from(normalized).slice(0, maxLength).join("") + (Array.from(normalized).length > maxLength ? "…" : "");
};
const normalizedOrigin = () => (process.env.CANONICAL_ORIGIN ?? "").trim().replace(/\/+$/, "");

function buildBreadcrumb(items: Array<{ name: string; path?: string }>, origin: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(origin && item.path ? { item: `${origin}${item.path}` } : {}),
    })),
  };
}

function buildScenarioStructuredData(meta: SeoMeta, canonical: string, origin: string) {
  const scenarioId = meta.canonicalPath?.match(/^\/scenario\/([^/]+)$/)?.[1];
  const scenario = scenarioId ? getScenarioById(scenarioId) : undefined;
  if (!scenario) return undefined;

  const village = getVillageById(scenario.villageId);
  const correctChoice = scenario.choices.find((choice) => choice.isCorrect);
  const relatedLawArticles = scenario.relatedArticles
    .map((articleId) => getArticleById(articleId))
    .filter((article) => Boolean(article));

  const learningResource: Record<string, unknown> = {
    "@type": "LearningResource",
    ...(canonical ? { "@id": `${canonical}#learning-resource`, url: canonical } : {}),
    name: scenario.title,
    description: normalizeText(`${scenario.story.join(" ")} ${scenario.question}`, 300),
    inLanguage: "zh-TW",
    learningResourceType: "Practice problem",
    educationalUse: "self-assessment",
    isAccessibleForFree: true,
    teaches: scenario.legalBasis ?? scenario.tags.join("、"),
    about: [
      ...scenario.tags.map((tag) => ({ "@type": "DefinedTerm", name: tag })),
      ...relatedLawArticles.map((article) => ({
        "@type": "DefinedTerm",
        name: `${article!.number} ${article!.title}`,
        description: normalizeText(article!.content, 180),
      })),
    ],
    mainEntity: {
      "@type": "Question",
      name: scenario.question,
      text: scenario.question,
      inLanguage: "zh-TW",
      ...(correctChoice ? {
        acceptedAnswer: {
          "@type": "Answer",
          text: correctChoice.text,
          comment: correctChoice.explanation,
        },
      } : {}),
      suggestedAnswer: scenario.choices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => ({ "@type": "Answer", text: choice.text, comment: choice.explanation })),
    },
  };

  const breadcrumb = buildBreadcrumb([
    { name: "民法鎮大冒險", path: "/" },
    { name: village?.name ?? "民法情境題", path: village ? `/village/${village.id}` : undefined },
    { name: scenario.title, path: meta.canonicalPath },
  ], origin);

  return [learningResource, breadcrumb];
}

function buildVillageStructuredData(meta: SeoMeta, canonical: string, origin: string) {
  const villageId = meta.canonicalPath?.match(/^\/village\/([^/]+)$/)?.[1];
  const village = villageId ? getVillageById(villageId) : undefined;
  if (!village) return undefined;

  const scenarios = getScenariosByVillage(village.id);
  const collection: Record<string, unknown> = {
    "@type": "CollectionPage",
    ...(canonical ? { "@id": `${canonical}#collection`, url: canonical } : {}),
    name: `${village.name}：台灣民法情境題`,
    description: meta.description,
    inLanguage: "zh-TW",
    isPartOf: { "@type": "WebSite", name: "民法鎮大冒險", ...(origin ? { url: origin } : {}) },
    numberOfItems: scenarios.length,
    hasPart: scenarios.map((scenario) => ({
      "@type": "LearningResource",
      name: scenario.title,
      ...(origin ? { url: `${origin}/scenario/${scenario.id}` } : {}),
    })),
  };

  return [collection, buildBreadcrumb([
    { name: "民法鎮大冒險", path: "/" },
    { name: village.name, path: meta.canonicalPath },
  ], origin)];
}

function buildStructuredData(meta: SeoMeta, canonical: string) {
  const origin = normalizedOrigin();
  const type = meta.schemaKind === "article"
    ? "Article"
    : meta.schemaKind === "learning-resource"
      ? "LearningResource"
      : meta.schemaKind === "collection"
        ? "CollectionPage"
        : "WebSite";
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [],
  };
  const specializedData = meta.schemaKind === "learning-resource"
    ? buildScenarioStructuredData(meta, canonical, origin)
    : meta.schemaKind === "collection"
      ? buildVillageStructuredData(meta, canonical, origin)
      : undefined;
  const defaultData: Record<string, unknown> = {
    "@type": type,
    ...(canonical ? { "@id": `${canonical}#page`, url: canonical } : {}),
    name: meta.schemaName ?? meta.title,
    description: normalizeText(meta.description, 300),
    inLanguage: "zh-TW",
    ...(meta.datePublished ? { datePublished: meta.datePublished } : {}),
  };
  (data["@graph"] as unknown[]).push(...(specializedData ?? [defaultData]));
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
