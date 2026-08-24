import { LAW_ARTICLES, SCENARIOS } from "../shared/gameData.ts";

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
}

const articleIds = new Set(LAW_ARTICLES.map((article) => article.id));
const missingArticleLinks = SCENARIOS.flatMap((scenario) => scenario.relatedArticles
  .filter((articleId) => !articleIds.has(articleId))
  .map((articleId) => ({ scenarioId: scenario.id, title: scenario.title, articleId })));

console.log(JSON.stringify({
  totalScenarios: SCENARIOS.length,
  duplicateIds: duplicates(SCENARIOS.map((scenario) => scenario.id)),
  duplicateTitles: duplicates(SCENARIOS.map((scenario) => scenario.title)),
  missingArticleLinks,
}, null, 2));
