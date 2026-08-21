import { extname, join } from "node:path";
import {
  createLock,
  filesUnder,
  manifestPaths,
  readJson,
  readText,
  root,
} from "../../../scripts/context-core.mjs";
import { writeFile } from "node:fs/promises";

/**
 * Discovers factory files and syncs context-manifest.json and context-lock.json.
 */
export async function syncFactoryInventory({ writeLock = true } = {}) {
  const currentManifest = await readJson("context-manifest.json");

  const actualAgents = (await filesUnder("agents")).filter((p) => extname(p) === ".md").sort();
  const actualRules = (await filesUnder("rules")).filter((p) => extname(p) === ".md").sort();
  const actualSkills = (await filesUnder("skills")).filter((p) => p.endsWith("/SKILL.md")).sort();
  const actualSkillResources = (await filesUnder("skills")).filter((p) => !p.endsWith("/SKILL.md")).sort();
  const actualWorkflows = (await filesUnder("workflows")).filter((p) => extname(p) === ".md").sort();
  const actualKnowledge = (await filesUnder("knowledge")).filter((p) => extname(p) === ".md").sort();
  const actualSchemas = (await filesUnder("schemas")).filter((p) => extname(p) === ".json").sort();
  const actualTemplates = (await filesUnder("docs/templates")).filter((p) => extname(p) === ".md").sort();
  const actualDecisions = (await filesUnder("docs/decisions"))
    .filter((p) => /\/\d{4}-[^/]+\.md$/.test(p))
    .sort();
  const actualTools = [
    ...(await filesUnder("scripts")).filter((p) => extname(p) === ".mjs"),
    ...(await filesUnder("orchestrator")).filter((p) => extname(p) === ".mjs"),
    ...(await filesUnder("evals")).filter((p) => extname(p) === ".mjs"),
  ].sort();
  const actualAutomation = (await filesUnder(".github/workflows"))
    .filter((p) => [".yml", ".yaml"].includes(extname(p)))
    .sort();
  const actualEvaluations = (await filesUnder("evals/cases")).filter((p) => extname(p) === ".json").sort();
  const actualDatasets = (await filesUnder("evals/datasets")).filter((p) => extname(p) === ".json").sort();

  const updatedManifest = {
    ...currentManifest,
    agents: actualAgents,
    rules: actualRules,
    skills: actualSkills,
    skillResources: actualSkillResources,
    workflows: actualWorkflows,
    knowledge: actualKnowledge,
    schemas: actualSchemas,
    templates: actualTemplates,
    decisions: actualDecisions,
    tools: actualTools,
    automation: actualAutomation,
    evaluations: actualEvaluations,
    datasets: actualDatasets,
  };

  const manifestPath = join(root, "context-manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(updatedManifest, null, 2)}\n`, "utf8");

  let lockResult = null;
  if (writeLock) {
    const lock = await createLock(updatedManifest);
    const lockPath = join(root, "context-lock.json");
    await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    lockResult = lock;
  }

  return {
    manifest: updatedManifest,
    lock: lockResult,
    counts: {
      agents: actualAgents.length,
      rules: actualRules.length,
      skills: actualSkills.length,
      skillResources: actualSkillResources.length,
      workflows: actualWorkflows.length,
      knowledge: actualKnowledge.length,
      schemas: actualSchemas.length,
      templates: actualTemplates.length,
      decisions: actualDecisions.length,
      tools: actualTools.length,
      evaluations: actualEvaluations.length,
      datasets: actualDatasets.length,
    },
  };
}
