export const GAME_ROUTES = {
  home: "/",
  village: "/village/:villageId",
  scenario: "/scenario/:scenarioId",
} as const;

export function getVillagePath(villageId: string): string {
  return `/village/${villageId}`;
}

export function getScenarioPath(scenarioId: string): string {
  return `/scenario/${scenarioId}`;
}
