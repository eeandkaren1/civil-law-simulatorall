import { ARTICLES } from "./articles";
import { getScenarioById, getVillageById, SCENARIOS, VILLAGES } from "./gameData";
import { SITE_CONFIG, SITE_IDENTITY } from "./siteConfig";

export type SeoSchemaKind = "website" | "collection" | "article" | "learning-resource";

export type SeoMeta = {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  notFound?: boolean;
  ogType?: "website" | "article";
  imageUrl?: string;
  schemaKind: SeoSchemaKind;
  schemaName?: string;
  datePublished?: string;
};

export const SITE_NAME = SITE_IDENTITY;
export const SITE_DESCRIPTION = `LawVibe 法律風｜以 200 道生活化情境題、法條解析與申論練習，系統化學習台灣民法總則、債編、物權、親屬與繼承。`;

const withBrandDescription = (description: string) => `LawVibe 法律風｜${description}`;

const staticPages: Record<string, Pick<SeoMeta, "title" | "description" | "schemaKind">> = {
  "/": {
    title: `${SITE_CONFIG.product}｜${SITE_CONFIG.brand}｜用故事讀懂台灣民法`,
    description: SITE_DESCRIPTION,
    schemaKind: "website",
  },
  "/about": { title: `關於我們｜${SITE_NAME}`, description: withBrandDescription(`認識${SITE_CONFIG.product}如何用生活情境推廣台灣民法教育。`), schemaKind: "website" },
  "/contact": { title: `聯絡我們｜${SITE_NAME}`, description: withBrandDescription(`聯絡${SITE_CONFIG.product}，提供內容合作、錯誤回報與學習建議。`), schemaKind: "website" },
  "/privacy": { title: `隱私權政策｜${SITE_NAME}`, description: withBrandDescription(`瞭解${SITE_CONFIG.product}如何處理瀏覽器本機學習進度與網站分析資訊。`), schemaKind: "website" },
  "/terms": { title: `服務條款｜${SITE_NAME}`, description: withBrandDescription(`閱讀${SITE_CONFIG.product}的服務條款與法律教育內容使用說明。`), schemaKind: "website" },
  "/knowledge": { title: `民法法條庫｜${SITE_NAME}`, description: withBrandDescription(`依五大編瀏覽${SITE_CONFIG.product}的法條重點與情境學習資源。`), schemaKind: "collection" },
  "/articles": { title: `台灣生活法律文章｜${SITE_NAME}`, description: withBrandDescription("閱讀以日常情境解說台灣民法的原創法律知識文章。"), schemaKind: "collection" },
};

const toolPaths = new Set(["/progress", "/settings", "/daily-challenge", "/wrong-notebook", "/question-explorer"]);

function cleanPath(urlOrPath: string) {
  const rawPath = urlOrPath.split("?")[0] || "/";
  try {
    return decodeURI(rawPath).replace(/\/+$/, "") || "/";
  } catch {
    return rawPath.replace(/\/+$/, "") || "/";
  }
}

export function getSeoForPath(urlOrPath: string): SeoMeta {
  const path = cleanPath(urlOrPath);
  const staticPage = staticPages[path];
  if (staticPage) return { ...staticPage, canonicalPath: path };

  if (toolPaths.has(path)) {
    return {
      title: `${SITE_NAME}｜個人化學習工具`,
      description: SITE_DESCRIPTION,
      noindex: true,
      schemaKind: "website",
    };
  }

  const villageMatch = path.match(/^\/village\/([^/]+)$/);
  if (villageMatch) {
    const village = getVillageById(villageMatch[1]);
    if (!village) return { title: SITE_NAME, description: SITE_DESCRIPTION, noindex: true, notFound: true, schemaKind: "website" };
    return {
      title: `${village.name}：40 道台灣民法情境題｜${SITE_NAME}`,
      description: withBrandDescription(`${village.description}。收錄 40 道生活化台灣民法情境題，包含四選一題目、法條重點與申論練習。`),
      canonicalPath: path,
      schemaKind: "collection",
      schemaName: village.name,
    };
  }

  const scenarioMatch = path.match(/^\/scenario\/([^/]+)$/);
  if (scenarioMatch) {
    const scenario = getScenarioById(scenarioMatch[1]);
    if (!scenario) return { title: SITE_NAME, description: SITE_DESCRIPTION, noindex: true, notFound: true, schemaKind: "website" };
    const village = getVillageById(scenario.villageId);
    return {
      title: `${scenario.title}｜${village?.name ?? "民法情境題"}｜${SITE_NAME}`,
      description: withBrandDescription(`${scenario.story.join(" ")} ${scenario.question}`),
      canonicalPath: path,
      ogType: "article",
      imageUrl: scenario.imageUrl,
      schemaKind: "learning-resource",
      schemaName: scenario.title,
    };
  }

  const articleMatch = path.match(/^\/articles\/([^/]+)$/);
  if (articleMatch) {
    const article = ARTICLES.find((item) => item.id === articleMatch[1]);
    if (!article) return { title: SITE_NAME, description: SITE_DESCRIPTION, noindex: true, notFound: true, schemaKind: "website" };
    return {
      title: `${article.title}｜${SITE_NAME}`,
      description: withBrandDescription(article.subtitle),
      canonicalPath: path,
      ogType: "article",
      schemaKind: "article",
      schemaName: article.title,
      datePublished: article.date,
    };
  }

  return { title: SITE_NAME, description: SITE_DESCRIPTION, noindex: true, notFound: true, schemaKind: "website" };
}

export function getIndexablePaths(): string[] {
  return [
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/knowledge",
    "/articles",
    ...VILLAGES.map((village) => `/village/${village.id}`),
    ...SCENARIOS.map((scenario) => `/scenario/${scenario.id}`),
    ...ARTICLES.map((article) => `/articles/${article.id}`),
  ];
}
