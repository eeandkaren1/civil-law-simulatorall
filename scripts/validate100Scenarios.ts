import { SCENARIOS, VILLAGES } from "../shared/gameData";

const expectedTotal = VILLAGES.reduce((total, village) => total + village.totalScenarios, 0);
console.log(`Total scenarios: ${SCENARIOS.length} (Expected: ${expectedTotal})`);

const ids = SCENARIOS.map((s) => s.id);
const uniqueIds = new Set(ids);
console.log(`Unique IDs: ${uniqueIds.size} (Expected: ${expectedTotal})`);

if (ids.length !== uniqueIds.size) {
  console.error("[ERROR] Duplicate scenario IDs found!");
  const counts = ids.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [id, count] of Object.entries(counts)) {
    if (count > 1) console.error(`Duplicate ID: ${id} (${count} times)`);
  }
}

for (const village of VILLAGES) {
  const villageScenarios = SCENARIOS.filter((s) => s.villageId === village.id);
  console.log(`Village ${village.id} (${village.name}): ${villageScenarios.length} scenarios (Expected: ${village.totalScenarios})`);
  if (villageScenarios.length !== village.totalScenarios) {
    console.error(`[ERROR] Village ${village.id} has ${villageScenarios.length} scenarios instead of ${village.totalScenarios}!`);
    process.exitCode = 1;
  }
}
