import type { Scenario } from "./gameData";

export const DAILY_CHALLENGE_SIZE = 10;

export type DifficultyFilter = "all" | Scenario["difficulty"];

export interface ScenarioFilters {
  query?: string;
  villageId?: string;
  difficulty?: DifficultyFilter;
  articleId?: string;
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createSeed(seedText: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

/** 同一日期與同一題庫永遠得到相同的 10 題，重整頁面不會改變挑戰內容。 */
export function createDailyChallengeScenarioIds(
  scenarios: Pick<Scenario, "id">[],
  dateKey: string,
  size = DAILY_CHALLENGE_SIZE
): string[] {
  const ids = scenarios.map((scenario) => scenario.id);
  const random = seededRandom(createSeed(`${dateKey}:${ids.join("|")}`));
  const shuffled = [...ids];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.min(size, shuffled.length));
}

export function filterScenarios(
  scenarios: Scenario[],
  filters: ScenarioFilters
): Scenario[] {
  const normalizedQuery = filters.query?.trim().toLocaleLowerCase("zh-TW") ?? "";

  return scenarios.filter((scenario) => {
    const searchSource = [
      scenario.title,
      scenario.chapter,
      scenario.question,
      scenario.legalBasis,
      ...scenario.tags,
      ...scenario.story,
    ]
      .join(" ")
      .toLocaleLowerCase("zh-TW");

    const matchesQuery = !normalizedQuery || searchSource.includes(normalizedQuery);
    const matchesVillage = !filters.villageId || filters.villageId === "all" || scenario.villageId === filters.villageId;
    const matchesDifficulty = !filters.difficulty || filters.difficulty === "all" || scenario.difficulty === filters.difficulty;
    const matchesArticle = !filters.articleId || filters.articleId === "all" || scenario.relatedArticles.includes(filters.articleId);

    return matchesQuery && matchesVillage && matchesDifficulty && matchesArticle;
  });
}

export function addUniqueWrongScenarioId(existingIds: string[], scenarioId: string): string[] {
  return existingIds.includes(scenarioId) ? existingIds : [...existingIds, scenarioId];
}

/** 收藏清單採純ID陣列，讓瀏覽器本機進度與未來同步資料都能共用此切換規則。 */
export function toggleFavoriteScenarioId(existingIds: string[], scenarioId: string): string[] {
  return existingIds.includes(scenarioId)
    ? existingIds.filter((id) => id !== scenarioId)
    : [...existingIds, scenarioId];
}
