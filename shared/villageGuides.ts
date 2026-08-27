import { ARTICLES } from "./articles";
import { getArticleById, getScenariosByVillage, getVillageById, type LawArticle, type Scenario } from "./gameData";

const VILLAGE_GUIDE_CONFIG: Record<string, { articleCategories: string[]; learningGoal: string }> = {
  general: { articleCategories: ["民法入門"], learningGoal: "先建立行為能力、意思表示與法律行為的判斷骨架。" },
  obligation: { articleCategories: ["契約法", "民法入門"], learningGoal: "依序練習契約成立、履行、違約與損害賠償的判斷。" },
  property: { articleCategories: ["物權法", "民法入門"], learningGoal: "從所有權變動出發，理解不動產、動產與相鄰關係的界線。" },
  family: { articleCategories: ["親屬法", "民法入門"], learningGoal: "以婚姻、親子、監護與扶養的生活情境建立概念順序。" },
  inheritance: { articleCategories: ["繼承法", "民法入門"], learningGoal: "掌握繼承開始、順位、遺產管理與分割的程序性問題。" },
};

export type VillageGuide = {
  villageName: string;
  learningGoal: string;
  totalScenarios: number;
  chapters: Array<{ name: string; count: number }>;
  featuredScenarios: Scenario[];
  keyLawArticles: LawArticle[];
  recommendedArticles: typeof ARTICLES;
};

/**
 * 導讀不另存一份重複內容，而是由已發布的題庫、法條與文章即時計算。
 * 未來新增題目或文章後，村落頁會自然反映新的章節分布與推薦資源。
 */
export function getVillageGuide(villageId: string): VillageGuide | undefined {
  const village = getVillageById(villageId);
  if (!village) return undefined;

  const scenarios = getScenariosByVillage(villageId);
  const config = VILLAGE_GUIDE_CONFIG[villageId] ?? {
    articleCategories: ["民法入門"],
    learningGoal: "依主題由淺入深閱讀情境題、法條與延伸文章。",
  };

  const chapterCounts = new Map<string, number>();
  const lawArticleCounts = new Map<string, number>();
  for (const scenario of scenarios) {
    chapterCounts.set(scenario.chapter, (chapterCounts.get(scenario.chapter) ?? 0) + 1);
    for (const articleId of scenario.relatedArticles) {
      lawArticleCounts.set(articleId, (lawArticleCounts.get(articleId) ?? 0) + 1);
    }
  }

  const chapters = Array.from(chapterCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hant"));

  const keyLawArticles = Array.from(lawArticleCounts.entries())
    .sort(([firstId, firstCount], [secondId, secondCount]) => secondCount - firstCount || firstId.localeCompare(secondId))
    .map(([articleId]) => getArticleById(articleId))
    .filter((article): article is LawArticle => Boolean(article))
    .slice(0, 3);

  const featuredScenarios = (["easy", "medium", "hard"] as const)
    .map((difficulty) => scenarios.find((scenario) => scenario.difficulty === difficulty))
    .filter((scenario): scenario is Scenario => Boolean(scenario));

  const recommendedArticles = ARTICLES
    .filter((article) => config.articleCategories.includes(article.category))
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 3);

  return {
    villageName: village.name,
    learningGoal: config.learningGoal,
    totalScenarios: scenarios.length,
    chapters,
    featuredScenarios,
    keyLawArticles,
    recommendedArticles,
  };
}
