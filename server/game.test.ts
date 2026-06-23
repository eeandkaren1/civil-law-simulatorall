import { describe, expect, it } from "vitest";
import { SCENARIOS, VILLAGES, LAW_ARTICLES, ACHIEVEMENTS, getScenariosByVillage, getVillageById, getArticleById } from "../shared/gameData";

describe("gameData - Villages", () => {
  it("should have exactly 5 villages", () => {
    expect(VILLAGES).toHaveLength(5);
  });

  it("should have all required village IDs", () => {
    const ids = VILLAGES.map((v) => v.id);
    expect(ids).toContain("general");
    expect(ids).toContain("obligation");
    expect(ids).toContain("property");
    expect(ids).toContain("family");
    expect(ids).toContain("inheritance");
  });

  it("should have correct village names", () => {
    const names = VILLAGES.map((v) => v.name);
    expect(names).toContain("總則村");
    expect(names).toContain("債編村");
    expect(names).toContain("物權村");
    expect(names).toContain("親屬村");
    expect(names).toContain("繼承村");
  });

  it("should find village by ID", () => {
    const village = getVillageById("general");
    expect(village).toBeDefined();
    expect(village?.name).toBe("總則村");
  });
});

describe("gameData - Scenarios", () => {
  it("should have scenarios for each village", () => {
    for (const village of VILLAGES) {
      const scenarios = getScenariosByVillage(village.id);
      expect(scenarios.length).toBeGreaterThan(0);
    }
  });

  it("each scenario should have exactly 4 choices", () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.choices).toHaveLength(4);
    }
  });

  it("each scenario should have exactly one correct choice", () => {
    for (const scenario of SCENARIOS) {
      const correctChoices = scenario.choices.filter((c) => c.isCorrect);
      expect(correctChoices).toHaveLength(1);
    }
  });

  it("each scenario should have relatedArticles", () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("each scenario should have essayPrompt and essayHint", () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.essayPrompt).toBeTruthy();
      expect(scenario.essayHint).toBeTruthy();
    }
  });

  it("should have valid difficulty levels", () => {
    const validDifficulties = ["easy", "medium", "hard"];
    for (const scenario of SCENARIOS) {
      expect(validDifficulties).toContain(scenario.difficulty);
    }
  });
});

describe("gameData - LawArticles", () => {
  it("should have law articles for each village", () => {
    for (const village of VILLAGES) {
      const articles = LAW_ARTICLES.filter((a) => a.villageId === village.id);
      expect(articles.length).toBeGreaterThan(0);
    }
  });

  it("should find article by ID", () => {
    const article = getArticleById("art6");
    expect(article).toBeDefined();
  });

  it("each article should have required fields", () => {
    for (const article of LAW_ARTICLES) {
      expect(article.id).toBeTruthy();
      expect(article.number).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.content).toBeTruthy();
      expect(article.villageId).toBeTruthy();
    }
  });
});

describe("gameData - Achievements", () => {
  it("should have required achievements", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(ids).toContain("first_attempt");
    expect(ids).toContain("three_streak");
    expect(ids).toContain("law_scholar");
  });

  it("should have correct achievement titles", () => {
    const titles = ACHIEVEMENTS.map((a) => a.title);
    expect(titles).toContain("初次嘗試");
    expect(titles).toContain("三連勝");
    expect(titles).toContain("法學博士");
  });

  it("first_attempt should trigger after 1 attempt", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "first_attempt");
    expect(achievement).toBeDefined();
    const result = achievement!.condition({
      totalAttempts: 1,
      totalCorrect: 1,
      currentStreak: 1,
      maxStreak: 1,
      completedVillages: [],
      completedScenarios: ["s1"],
      unlockedArticles: [],
    });
    expect(result).toBe(true);
  });

  it("three_streak should trigger after 3 consecutive correct answers", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "three_streak");
    expect(achievement).toBeDefined();
    const result = achievement!.condition({
      totalAttempts: 3,
      totalCorrect: 3,
      currentStreak: 3,
      maxStreak: 3,
      completedVillages: [],
      completedScenarios: [],
      unlockedArticles: [],
    });
    expect(result).toBe(true);
  });

  it("law_scholar should trigger when all 5 villages are completed", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "law_scholar");
    expect(achievement).toBeDefined();
    const result = achievement!.condition({
      totalAttempts: 50,
      totalCorrect: 45,
      currentStreak: 5,
      maxStreak: 10,
      completedVillages: ["general", "obligation", "property", "family", "inheritance"],
      completedScenarios: [],
      unlockedArticles: [],
    });
    expect(result).toBe(true);
  });
});

describe("auth.logout", () => {
  it("should be importable from routers", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
  });
});
