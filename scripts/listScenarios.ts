import { SCENARIOS, VILLAGES } from "../shared/gameData";

for (const village of VILLAGES) {
  const scenarios = SCENARIOS.filter((scenario) => scenario.villageId === village.id);
  console.log(`\n${village.id} ${village.name} (${scenarios.length}/${village.totalScenarios})`);
  for (const scenario of scenarios) {
    console.log(`${scenario.id}\t${scenario.title}\t${scenario.chapter}\t${scenario.difficulty}\t${scenario.imageUrl ?? ""}`);
  }
}
