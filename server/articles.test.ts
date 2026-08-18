import { describe, expect, it } from "vitest";
import { ARTICLES } from "../shared/articles";

const newArticleIds = [
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

describe("legal article content", () => {
  it("contains exactly 20 articles with unique IDs", () => {
    const ids = ARTICLES.map((article) => article.id);
    expect(ARTICLES).toHaveLength(20);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains all ten newly requested Taiwan daily-law articles", () => {
    const ids = new Set(ARTICLES.map((article) => article.id));
    expect(newArticleIds.every((id) => ids.has(id))).toBe(true);
  });

  it("keeps every article renderable with substantive Markdown content", () => {
    for (const article of ARTICLES) {
      expect(article.title.length).toBeGreaterThan(5);
      expect(article.subtitle.length).toBeGreaterThan(10);
      expect(article.content.trim().length).toBeGreaterThan(500);
      expect(article.tags.length).toBeGreaterThan(0);
    }
  });
});
