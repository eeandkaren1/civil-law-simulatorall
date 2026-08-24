import { describe, expect, it } from "vitest";
import { SCENARIOS } from "../shared/gameData";
import {
  addUniqueWrongScenarioId,
  createDailyChallengeScenarioIds,
  filterScenarios,
} from "../shared/learningTools";

describe("learningTools", () => {
  it("同一日期能產生固定、唯一且恰好 10 題的每日挑戰", () => {
    const first = createDailyChallengeScenarioIds(SCENARIOS, "2026-08-18");
    const second = createDailyChallengeScenarioIds(SCENARIOS, "2026-08-18");
    expect(first).toEqual(second);
    expect(first).toHaveLength(10);
    expect(new Set(first).size).toBe(10);
  });

  it("錯題本不會重複收錄同一題", () => {
    expect(addUniqueWrongScenarioId(["general-001"], "general-001")).toEqual(["general-001"]);
    expect(addUniqueWrongScenarioId(["general-001"], "general-002")).toEqual(["general-001", "general-002"]);
  });

  it("可依難易度、村落、法條與關鍵字交叉篩選題目", () => {
    const result = filterScenarios(SCENARIOS, {
      villageId: "general",
      difficulty: "hard",
      articleId: "art15-2",
      query: "輔助宣告",
    });
    expect(result.map((scenario) => scenario.id)).toContain("general-018");
  });
});

