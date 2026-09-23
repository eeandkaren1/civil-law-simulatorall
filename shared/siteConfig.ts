export const SITE_CONFIG = {
  brand: "LawVibe 法律風",
  product: "民法鎮大冒險",
  contactEmail: "lawvibe2026@gmail.com",
  copyright: "© 2026 LawVibe 法律風｜民法鎮大冒險｜All Rights Reserved.",
} as const;

/** Static hosting mount point reserved for the main site's civil-law section. */
export const APP_BASE_PATH = "/civil";

export const SITE_IDENTITY = `${SITE_CONFIG.product}｜${SITE_CONFIG.brand}`;

export function getPublicAssetPath(path: string): string {
  return `${APP_BASE_PATH}/${path.replace(/^\/+/, "")}`;
}
