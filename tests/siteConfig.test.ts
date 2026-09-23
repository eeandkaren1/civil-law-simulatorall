import { describe, expect, it } from "vitest";
import { getSeoForPath, SITE_NAME } from "../shared/siteSeo";
import { APP_BASE_PATH, SITE_CONFIG } from "../shared/siteConfig";

describe("static site identity and metadata", () => {
  it("centralizes the LawVibe brand and contact details", () => {
    expect(SITE_CONFIG.brand).toBe("LawVibe 法律風");
    expect(SITE_CONFIG.product).toBe("民法鎮大冒險");
    expect(SITE_CONFIG.contactEmail).toBe("lawvibe2026@gmail.com");
    expect(SITE_CONFIG.copyright).toContain(SITE_CONFIG.brand);
  });

  it("uses the civil subdirectory and branded metadata", () => {
    expect(APP_BASE_PATH).toBe("/civil");
    expect(SITE_NAME).toBe("民法鎮大冒險｜LawVibe 法律風");
    expect(getSeoForPath("/").description.startsWith("LawVibe 法律風｜")).toBe(
      true
    );
    expect(getSeoForPath("/scenario/general-001").title).toContain(
      "LawVibe 法律風"
    );
  });
});
