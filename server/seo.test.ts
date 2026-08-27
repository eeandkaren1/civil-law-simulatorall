import { describe, expect, it } from "vitest";
import { SCENARIOS } from "../shared/gameData";
import { getIndexablePaths, getSeoForPath } from "../shared/siteSeo";
import { buildRobots, buildSitemap } from "./seo";

describe("搜尋引擎索引資料", () => {
  it("為每道題目建立一個可索引的獨立網址與專屬中繼資料", () => {
    const paths = getIndexablePaths();
    const scenarioPaths = paths.filter((path) => path.startsWith("/scenario/"));
    expect(scenarioPaths).toHaveLength(200);
    expect(new Set(scenarioPaths).size).toBe(200);
    for (const scenario of SCENARIOS) {
      const meta = getSeoForPath(`/scenario/${scenario.id}`);
      expect(meta.canonicalPath).toBe(`/scenario/${scenario.id}`);
      expect(meta.noindex).not.toBe(true);
      expect(meta.title).toContain(scenario.title);
    }
  });

  it("只把內容頁列入網站地圖，並使用正式網域的絕對網址", () => {
    const sitemap = buildSitemap("https://civil-law.example.tw/");
    expect(sitemap).toContain("https://civil-law.example.tw/scenario/inheritance-040");
    expect(sitemap).toContain("https://civil-law.example.tw/articles/legal-action-capacity");
    expect(sitemap).not.toContain("/daily-challenge");
    expect(buildRobots("https://civil-law.example.tw")).toContain("Sitemap: https://civil-law.example.tw/sitemap.xml");
  });

  it("尚未設定正式網域時不產生預覽網址網站地圖", () => {
    expect(buildSitemap("")).toBeNull();
    expect(buildRobots("")).toContain("CANONICAL_ORIGIN is configured");
  });
});
