import test from "node:test";
import assert from "node:assert/strict";
import { lstat, readlink, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import {
  readJson,
  readText,
  frontmatter,
  root,
} from "../../../scripts/context-core.mjs";

test("Unit 01.01: Canonical Workflow Adapter Contract (AC-01, AC-07)", async (t) => {
  const manifest = await readJson("context-manifest.json");
  const workflows = manifest.workflows ?? [];
  assert.ok(workflows.length >= 12, "Manifest must contain at least 12 canonical workflows");

  const existingProceduralSkillNames = new Set(
    (manifest.skills ?? [])
      .filter((s) => !s.startsWith("skills/workflow-entries/"))
      .map((s) => s.split("/").at(-2))
  );

  const expectedEntries = workflows.map((wfPath) => {
    const slug = wfPath.split("/").at(-1).replace(/\.md$/, "");
    return {
      wfPath,
      slug,
      adapterName: `workflow-${slug}`,
      sourceDir: `skills/workflow-entries/workflow-${slug}`,
      sourceFile: `skills/workflow-entries/workflow-${slug}/SKILL.md`,
      codexLink: `.agents/skills/workflow-${slug}`,
      claudeLink: `.claude/skills/workflow-${slug}`,
    };
  });

  await t.test("exact 1-to-1 mapping and no collision with procedural skills", () => {
    const seenNames = new Set();
    for (const entry of expectedEntries) {
      assert.ok(!seenNames.has(entry.adapterName), `Duplicate adapter name: ${entry.adapterName}`);
      seenNames.add(entry.adapterName);

      assert.ok(
        !existingProceduralSkillNames.has(entry.adapterName),
        `Adapter name collides with existing procedural skill: ${entry.adapterName}`
      );
    }
    assert.equal(seenNames.size, workflows.length, "Each canonical workflow must have exactly one unique adapter");
  });

  await t.test("all adapter source files exist with valid metadata and reference canonical workflows", async () => {
    for (const entry of expectedEntries) {
      const fullPath = resolve(root, entry.sourceFile);
      assert.ok(existsSync(fullPath), `Adapter source file must exist: ${entry.sourceFile}`);

      const content = await readText(entry.sourceFile);
      const meta = frontmatter(content);
      assert.ok(meta, `Adapter must have YAML frontmatter: ${entry.sourceFile}`);

      const keys = Object.keys(meta).sort();
      assert.deepEqual(keys, ["description", "name"], `Adapter frontmatter must only contain name and description: ${entry.sourceFile}`);
      assert.equal(meta.name, entry.adapterName, `Adapter name must match folder name: ${entry.sourceFile}`);
      assert.ok(meta.description && meta.description.length > 10, `Adapter description must be descriptive: ${entry.sourceFile}`);

      // Must identify canonical workflow path and require reading it
      assert.ok(
        content.includes(entry.wfPath),
        `Adapter must explicitly reference canonical workflow path ${entry.wfPath}: ${entry.sourceFile}`
      );
      assert.match(
        content,
        /read.*canonical/i,
        `Adapter must instruct host to read the canonical workflow file: ${entry.sourceFile}`
      );

      // Must delegate to resolver
      assert.match(
        content,
        /node scripts\/context\.mjs resolve/i,
        `Adapter must instruct host to pass actual user request to resolver: ${entry.sourceFile}`
      );

      // Must defer authorization and quality gates
      assert.match(
        content,
        /gates|stop|defer|authority|shared contract/i,
        `Adapter must defer gates and authorization to the workflow and shared contract: ${entry.sourceFile}`
      );

      // Canonical workflow file must exist on disk
      assert.ok(
        existsSync(resolve(root, entry.wfPath)),
        `Referenced canonical workflow must exist on disk: ${entry.wfPath}`
      );
    }
  });

  await t.test("adapters do not duplicate phase or gate policy bodies (SRP & reject duplicate policy)", async () => {
    const forbiddenPolicyHeadings = [
      "## Phases",
      "## Quality gates",
      "## Stop and escalation conditions",
      "## Required inputs",
      "## Applicable rules and skills",
      "## Artifacts and completion",
    ];

    for (const entry of expectedEntries) {
      if (!existsSync(resolve(root, entry.sourceFile))) continue;
      const content = await readText(entry.sourceFile);
      for (const heading of forbiddenPolicyHeadings) {
        assert.ok(
          !content.includes(heading),
          `Adapter ${entry.sourceFile} must not duplicate policy section '${heading}' from canonical workflow`
        );
      }
    }
  });

  await t.test("host discovery entries in .agents/skills (Codex) exist and point to valid adapter sources", async () => {
    const agentsSkillsDir = resolve(root, ".agents/skills");
    assert.ok(existsSync(agentsSkillsDir), ".agents/skills directory must exist");

    for (const entry of expectedEntries) {
      const linkPath = resolve(root, entry.codexLink);
      assert.ok(existsSync(linkPath), `Codex entry link must exist: ${entry.codexLink}`);

      const stat = await lstat(linkPath);
      assert.ok(stat.isSymbolicLink(), `Codex entry must be a symbolic link: ${entry.codexLink}`);

      const rawTarget = await readlink(linkPath);
      const resolvedTarget = resolve(agentsSkillsDir, rawTarget);
      assert.ok(existsSync(resolvedTarget), `Codex link target must exist and not dangle: ${entry.codexLink} -> ${rawTarget}`);
      assert.equal(
        resolvedTarget,
        resolve(root, entry.sourceDir),
        `Codex link must resolve to source adapter dir ${entry.sourceDir}`
      );
    }
  });

  await t.test("host discovery entries in .claude/skills (Claude Code) exist and point to valid adapter sources", async () => {
    const claudeSkillsDir = resolve(root, ".claude/skills");
    assert.ok(existsSync(claudeSkillsDir), ".claude/skills directory must exist");

    for (const entry of expectedEntries) {
      const linkPath = resolve(root, entry.claudeLink);
      assert.ok(existsSync(linkPath), `Claude Code entry link must exist: ${entry.claudeLink}`);

      const stat = await lstat(linkPath);
      assert.ok(stat.isSymbolicLink(), `Claude Code entry must be a symbolic link: ${entry.claudeLink}`);

      const rawTarget = await readlink(linkPath);
      const resolvedTarget = resolve(claudeSkillsDir, rawTarget);
      assert.ok(existsSync(resolvedTarget), `Claude link target must exist and not dangle: ${entry.claudeLink} -> ${rawTarget}`);
      assert.equal(
        resolvedTarget,
        resolve(root, entry.sourceDir),
        `Claude link must resolve to source adapter dir ${entry.sourceDir}`
      );
    }
  });

  await t.test("validator contract helper detects missing, duplicate, stale, or broken entries", async () => {
    const { validateWorkflowEntries } = await import("../../../scripts/validate-context.mjs");
    assert.equal(typeof validateWorkflowEntries, "function", "validateWorkflowEntries function must be exported");

    // Live validation must pass with zero errors
    const liveErrors = await validateWorkflowEntries({ root, manifest });
    assert.deepEqual(liveErrors, [], "Current factory state must pass workflow entry validation without errors");

    // Synthetic test: missing workflow entry
    const mockManifestWithExtraWf = {
      ...manifest,
      workflows: [...manifest.workflows, "workflows/non-existent-synthetic-workflow.md"],
    };
    const missingErrors = await validateWorkflowEntries({ root, manifest: mockManifestWithExtraWf });
    assert.ok(
      missingErrors.some((e) => e.includes("non-existent-synthetic-workflow")),
      "Validation must flag missing entry for unmapped workflow"
    );

    // Synthetic test: stale workflow entry
    const mockManifestMissingWf = {
      ...manifest,
      workflows: manifest.workflows.slice(1), // remove one workflow
    };
    const staleErrors = await validateWorkflowEntries({ root, manifest: mockManifestMissingWf });
    assert.ok(
      staleErrors.some((e) => e.includes("Stale or unmapped workflow entry")),
      "Validation must flag stale entry not in manifest workflows"
    );
  });
});
