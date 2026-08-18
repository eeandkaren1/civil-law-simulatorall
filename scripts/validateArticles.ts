import { ARTICLES } from "../shared/articles";

const expectedNewIds = [
  "legal-action-capacity",
  "employer-liability",
  "real-estate-dispute",
  "marriage-property-system",
  "will-and-testament",
  "neighbor-disputes-noise-water",
  "consumer-protection-refund",
  "car-accident-compensation",
  "statute-of-limitations",
  "co-ownership-property",
];

const ids = ARTICLES.map((article) => article.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const missingNewIds = expectedNewIds.filter((id) => !ids.includes(id));
const invalidArticles = ARTICLES.filter(
  (article) =>
    !article.id ||
    !article.title ||
    !article.subtitle ||
    !article.category ||
    !article.date ||
    !Number.isInteger(article.readTime) ||
    article.readTime <= 0 ||
    !article.content ||
    article.content.trim().length < 500 ||
    !Array.isArray(article.tags) ||
    article.tags.length === 0,
);

if (ARTICLES.length !== 20) {
  throw new Error(`Expected 20 articles, found ${ARTICLES.length}`);
}
if (duplicateIds.length > 0) {
  throw new Error(`Duplicate article IDs: ${duplicateIds.join(", ")}`);
}
if (missingNewIds.length > 0) {
  throw new Error(`Missing new article IDs: ${missingNewIds.join(", ")}`);
}
if (invalidArticles.length > 0) {
  throw new Error(`Invalid article records: ${invalidArticles.map((article) => article.id).join(", ")}`);
}

const newArticles = ARTICLES.filter((article) => expectedNewIds.includes(article.id));
const categoryCounts = newArticles.reduce<Record<string, number>>((counts, article) => {
  counts[article.category] = (counts[article.category] ?? 0) + 1;
  return counts;
}, {});

console.log(
  JSON.stringify(
    {
      totalArticles: ARTICLES.length,
      newArticles: newArticles.length,
      categoryCounts,
      shortestNewArticleCharacters: Math.min(...newArticles.map((article) => article.content.length)),
    },
    null,
    2,
  ),
);
