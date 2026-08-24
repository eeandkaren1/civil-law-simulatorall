import { describe, expect, it } from "vitest";
import { SCENARIOS, VILLAGES, LAW_ARTICLES, ACHIEVEMENTS, getScenariosByVillage, getScenarioById, getVillageById, getArticleById } from "../shared/gameData";
import { GAME_ROUTES, getScenarioPath, getVillagePath } from "../shared/gameRoutes";

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

  it("should match each village's configured scenario count", () => {
    for (const village of VILLAGES) {
      expect(getScenariosByVillage(village.id)).toHaveLength(village.totalScenarios);
    }
  });

  it("should expose every general batch 3 scenario through the general village data path", () => {
    const generalScenarioIds = getScenariosByVillage("general").map((scenario) => scenario.id);
    expect(generalScenarioIds).toEqual(expect.arrayContaining([
      "general-031",
      "general-032",
      "general-033",
      "general-034",
      "general-035",
    ]));
    for (const scenarioId of generalScenarioIds.filter((id) => id.startsWith("general-03"))) {
      expect(SCENARIOS.find((scenario) => scenario.id === scenarioId)).toBeDefined();
    }
  });

  it("should resolve every general batch 3 route parameter to its scenario data", () => {
    for (const scenarioId of ["general-031", "general-032", "general-033", "general-034", "general-035"]) {
      const scenario = getScenarioById(scenarioId);
      expect(scenario?.id).toBe(scenarioId);
      expect(scenario?.villageId).toBe("general");
    }
  });

  it("should expose forty general village cards and resolve every general batch 4 route parameter", () => {
    const generalScenarios = getScenariosByVillage("general");
    expect(generalScenarios).toHaveLength(40);
    expect(generalScenarios.map((scenario) => scenario.id)).toEqual(expect.arrayContaining([
      "general-036",
      "general-037",
      "general-038",
      "general-039",
      "general-040",
    ]));
    for (const scenarioId of ["general-036", "general-037", "general-038", "general-039", "general-040"]) {
      const scenario = getScenarioById(scenarioId);
      expect(scenario?.id).toBe(scenarioId);
      expect(scenario?.title).toBeTruthy();
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should keep obligation batch 1 route data available as the village expands", () => {
    const obligationScenarios = getScenariosByVillage("obligation");
    expect(obligationScenarios).toHaveLength(getVillageById("obligation")!.totalScenarios);
    expect(obligationScenarios.map((scenario) => scenario.id)).toEqual(expect.arrayContaining([
      "obligation-021",
      "obligation-022",
      "obligation-023",
      "obligation-024",
      "obligation-025",
    ]));
    for (const scenarioId of ["obligation-021", "obligation-022", "obligation-023", "obligation-024", "obligation-025"]) {
      const scenario = getScenarioById(scenarioId);
      expect(scenario?.villageId).toBe("obligation");
      expect(scenario?.choices).toHaveLength(4);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should resolve every obligation batch 2 route parameter to complete scenario data", () => {
    for (const scenarioId of ["obligation-026", "obligation-027", "obligation-028", "obligation-029", "obligation-030"]) {
      const scenario = getScenarioById(scenarioId);
      expect(scenario?.villageId).toBe("obligation");
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose obligation batch 3 cards and resolve their scenario routes", () => {
    const obligationScenarioIds = getScenariosByVillage("obligation").map((scenario) => scenario.id);
    expect(obligationScenarioIds).toEqual(expect.arrayContaining([
      "obligation-031", "obligation-032", "obligation-033", "obligation-034", "obligation-035",
    ]));
    for (const scenarioId of ["obligation-031", "obligation-032", "obligation-033", "obligation-034", "obligation-035"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("obligation");
      expect(scenario?.title).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose obligation batch 4 cards and resolve their scenario routes", () => {
    const obligationScenarioIds = getScenariosByVillage("obligation").map((scenario) => scenario.id);
    expect(getVillageById("obligation")?.totalScenarios).toBe(40);
    expect(obligationScenarioIds).toEqual(expect.arrayContaining([
      "obligation-036", "obligation-037", "obligation-038", "obligation-039", "obligation-040",
    ]));
    for (const scenarioId of ["obligation-036", "obligation-037", "obligation-038", "obligation-039", "obligation-040"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("obligation");
      expect(scenario?.choices).toHaveLength(4);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose property batch 1 cards and resolve their scenario routes", () => {
    const propertyScenarioIds = getScenariosByVillage("property").map((scenario) => scenario.id);
    expect(propertyScenarioIds).toHaveLength(getVillageById("property")!.totalScenarios);
    expect(propertyScenarioIds).toEqual(expect.arrayContaining([
      "property-021", "property-022", "property-023", "property-024", "property-025",
    ]));
    for (const scenarioId of ["property-021", "property-022", "property-023", "property-024", "property-025"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("property");
      expect(scenario?.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose property batch 2 cards and resolve their scenario routes", () => {
    const propertyScenarioIds = getScenariosByVillage("property").map((scenario) => scenario.id);
    expect(propertyScenarioIds).toEqual(expect.arrayContaining([
      "property-026", "property-027", "property-028", "property-029", "property-030",
    ]));
    for (const scenarioId of ["property-026", "property-027", "property-028", "property-029", "property-030"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("property");
      expect(scenario?.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose property batch 3 cards and resolve their scenario routes", () => {
    const propertyScenarioIds = getScenariosByVillage("property").map((scenario) => scenario.id);
    expect(propertyScenarioIds).toEqual(expect.arrayContaining([
      "property-031", "property-032", "property-033", "property-034", "property-035",
    ]));
    for (const scenarioId of ["property-031", "property-032", "property-033", "property-034", "property-035"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("property");
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose property batch 4 cards and resolve their scenario routes", () => {
    const propertyScenarioIds = getScenariosByVillage("property").map((scenario) => scenario.id);
    expect(getVillageById("property")?.totalScenarios).toBe(40);
    expect(propertyScenarioIds).toEqual(expect.arrayContaining([
      "property-036", "property-037", "property-038", "property-039", "property-040",
    ]));
    for (const scenarioId of ["property-036", "property-037", "property-038", "property-039", "property-040"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("property");
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose family batch 1 cards and resolve their scenario routes", () => {
    const familyScenarioIds = getScenariosByVillage("family").map((scenario) => scenario.id);
    expect(familyScenarioIds).toHaveLength(getVillageById("family")!.totalScenarios);
    expect(familyScenarioIds).toEqual(expect.arrayContaining([
      "family-021", "family-022", "family-023", "family-024", "family-025",
    ]));
    for (const scenarioId of ["family-021", "family-022", "family-023", "family-024", "family-025"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("family");
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose family batch 2 cards and resolve their scenario routes", () => {
    const familyScenarioIds = getScenariosByVillage("family").map((scenario) => scenario.id);
    expect(familyScenarioIds).toHaveLength(getVillageById("family")!.totalScenarios);
    expect(familyScenarioIds).toEqual(expect.arrayContaining([
      "family-026", "family-027", "family-028", "family-029", "family-030",
    ]));
    for (const scenarioId of ["family-026", "family-027", "family-028", "family-029", "family-030"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("family");
      expect(scenario?.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should expose family batch 3 cards and resolve their scenario routes", () => {
    const familyScenarioIds = getScenariosByVillage("family").map((scenario) => scenario.id);
    expect(getVillageById("family")?.totalScenarios).toBe(35);
    expect(familyScenarioIds).toEqual(expect.arrayContaining([
      "family-031", "family-032", "family-033", "family-034", "family-035",
    ]));
    for (const scenarioId of ["family-031", "family-032", "family-033", "family-034", "family-035"]) {
      const scenario = getScenarioById(scenarioId);
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
      expect(scenario?.villageId).toBe("family");
      expect(scenario?.title).toBeTruthy();
      expect(scenario?.question).toBeTruthy();
      expect(scenario?.relatedArticles.length).toBeGreaterThan(0);
    }
  });

  it("should build the same village and scenario routes used by the game router", () => {
    expect(GAME_ROUTES.village).toBe("/village/:villageId");
    expect(GAME_ROUTES.scenario).toBe("/scenario/:scenarioId");
    expect(getVillagePath("obligation")).toBe("/village/obligation");
    for (const scenarioId of [
      "obligation-021", "obligation-022", "obligation-023", "obligation-024", "obligation-025",
      "obligation-026", "obligation-027", "obligation-028", "obligation-029", "obligation-030",
    ]) {
      expect(getScenarioPath(scenarioId)).toBe(`/scenario/${scenarioId}`);
    }
  });

  it("should keep scenario IDs and titles unique", () => {
    expect(new Set(SCENARIOS.map((scenario) => scenario.id)).size).toBe(SCENARIOS.length);
    expect(new Set(SCENARIOS.map((scenario) => scenario.title)).size).toBe(SCENARIOS.length);
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

  it("each related article should exist in the law article library", () => {
    const articleIds = new Set(LAW_ARTICLES.map((article) => article.id));
    for (const scenario of SCENARIOS) {
      for (const articleId of scenario.relatedArticles) {
        expect(articleIds.has(articleId)).toBe(true);
      }
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
