import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, rm, writeFile, readFile, symlink, lstat, readlink } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  generateBridge,
  buildSharedEnforcementDirectives,
  detectInstalledIdes,
  verifySymlinkHealth,
  repairBridgeSymlinks,
  createRelativeSymlink,
} from "../../../app/cli/core/bridge-generator.mjs";
import {
  auditEditorConfigurations,
  auditEnforcementCapabilities,
  inspectBridgeFileContent,
  handleDoctorCommand,
} from "../../../app/cli/commands/doctor.mjs";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures", "mock-bridge-conformance-host");

test("Unit 04.02: Cross-Editor Bridge and Doctor Conformance Parity (AC-09, SC-07)", async (t) => {
  await rm(FIXTURES_DIR, { recursive: true, force: true });
  await mkdir(FIXTURES_DIR, { recursive: true });

  t.after(async () => {
    await rm(FIXTURES_DIR, { recursive: true, force: true });
  });

  await t.test("buildSharedEnforcementDirectives produces consistent authoritative policy across formats", () => {
    const numbered = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".context-factory",
      scriptPrefix: "node .context-factory/scripts/context.mjs",
      cliPrefix: "node .context-factory/app/cli/bin/context-cli.mjs",
      format: "numbered",
    });
    assert.match(numbered, /1\. \*\*Shared Contract:\*\*/);
    assert.match(numbered, /\.context-factory\/orchestrator\/SHARED\.md/);
    assert.match(numbered, /node \.context-factory\/scripts\/context\.mjs resolve/);
    assert.match(numbered, /node \.context-factory\/app\/cli\/bin\/context-cli\.mjs preflight/);
    assert.match(numbered, /Host Verification/);
    assert.match(numbered, /execute configured host verification checks/);
    assert.match(numbered, /Stop on FAIL or BLOCKED/);
    assert.match(numbered, /Do not replace test or verification evidence with self-attestation/);

    const bullet = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".",
      scriptPrefix: "node scripts/context.mjs",
      cliPrefix: "node app/cli/bin/context-cli.mjs",
      format: "bullet",
    });
    assert.match(bullet, /- \*\*Shared Contract:\*\*/);
    assert.match(bullet, /- \*\*Preflight Verification:\*\*/);
    assert.match(bullet, /- \*\*Host Verification:\*\*/);
    assert.match(bullet, /- \*\*Fail-Closed Gate:\*\*/);
    assert.match(bullet, /doctor checks factory health, not task completion/);
    assert.match(bullet, /plan:check/);

    const table = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".",
      format: "table",
    });
    assert.match(table, /\|\s*`\/resolve`\s*\|/);
    assert.match(table, /\|\s*`\/preflight`\s*\|/);
    assert.match(table, /\|\s*`\/doctor`\s*\|/);
    assert.doesNotMatch(table, /\|\s*`\/conform`\s*\|/);
  });

  await t.test("inspectBridgeFileContent validates required authoritative gates and detects omissions", () => {
    const validContent = `
# Editor Instructions
- Shared: .context-factory/orchestrator/SHARED.md
- Run resolve: node scripts/context.mjs resolve "<prompt>"
- Run preflight: context-cli preflight "<prompt>"
- Run conform: context-cli conform "<prompt>"
- Fail closed on FAIL or BLOCKED; no self-attestation
`;
    const validInspection = inspectBridgeFileContent(validContent);
    assert.strictEqual(validInspection.valid, true);
    assert.strictEqual(validInspection.missingGates.length, 0);

    const weakenedContent = `
# Legacy Editor Instructions
- Run resolve: node scripts/context.mjs resolve "<prompt>"
`;
    const weakenedInspection = inspectBridgeFileContent(weakenedContent);
    assert.strictEqual(weakenedInspection.valid, false);
    assert.ok(weakenedInspection.missingGates.includes("shared-contract (SHARED.md)"));
    assert.ok(weakenedInspection.missingGates.includes("preflight command"));
    assert.ok(weakenedInspection.missingGates.includes("fail-closed gate"));
  });

  await t.test("repository entry points route to current contracts without worktree instructions", async () => {
    const entryPoints = [
      "README.md",
      "orchestrator/SHARED.md",
    ];
    for (const path of entryPoints) {
      const content = await readFile(join(process.cwd(), path), "utf8");
      if (path === "README.md") {
        assert.match(content, /orchestrator\/SHARED(?:\.md)?/, `${path} must point to the shared contract`);
      }
      assert.doesNotMatch(content, /intra-worktree|isolated worktrees|skills\/(?:context|plan|execute|test|review)\/SKILL\.md/i,
        `${path} must not use obsolete task terms or skill paths`);
    }
  });

  await t.test("generates all 8 supported editor profiles with complete authoritative gates (AC-09)", async () => {
    const allIdesHost = join(FIXTURES_DIR, "all-ides-host");
    await mkdir(allIdesHost, { recursive: true });

    await generateBridge({
      target: allIdesHost,
      factoryPath: process.cwd(),
      ide: ["all"],
      method: "submodule",
      dryRun: false,
    });

    const expectedProfiles = [
      { file: "AGENTS.md", ide: "universal" },
      { file: "GEMINI.md", ide: "antigravity" },
      { file: "CLAUDE.md", ide: "claude" },
      { file: "CODEX.md", ide: "codex" },
      { file: ".cursorrules", ide: "cursor" },
      { file: join(".cursor", "rules", "context-factory.mdc"), ide: "cursor" },
      { file: ".windsurfrules", ide: "windsurf" },
      { file: join(".trae", "rules", "project_rules.md"), ide: "trae" },
      { file: join(".github", "copilot-instructions.md"), ide: "vscode" },
    ];

    for (const profile of expectedProfiles) {
      const fullPath = join(allIdesHost, profile.file);
      assert.strictEqual(existsSync(fullPath), true, `Profile ${profile.file} must be generated`);
      const content = await readFile(fullPath, "utf8");

      assert.match(content, /SHARED\.md/, `${profile.file} must reference SHARED.md`);
      assert.match(content, /resolve/, `${profile.file} must require context resolution`);
      assert.match(content, /preflight/, `${profile.file} must require preflight verification`);
      assert.match(content, /Host Verification|lint, typecheck, test, build/i, `${profile.file} must require host verification`);
      assert.match(content, /fail|FAIL|BLOCKED|self-attestation/i, `${profile.file} must declare fail-closed policy`);
      assert.match(content, /doctor checks factory health, not task completion/, `${profile.file} must distinguish factory health from task completion`);
      assert.doesNotMatch(content, /intra-worktree|isolated worktrees/i, `${profile.file} must not instruct obsolete task checkout behavior`);

      const inspection = inspectBridgeFileContent(content);
      assert.strictEqual(inspection.valid, true, `${profile.file} must satisfy gate inspection`);
    }

    const audit = await auditEditorConfigurations(allIdesHost);
    assert.strictEqual(audit.passed, true);
    assert.strictEqual(audit.brokenCount, 0);
    assert.strictEqual(audit.missingCount, 0);
    assert.ok(audit.healthyCount >= 8);
  });

  await t.test("doctor audit rejects editor profile with weakened or missing gates", async () => {
    const weakenedHost = join(FIXTURES_DIR, "weakened-host");
    await mkdir(weakenedHost, { recursive: true });

    await generateBridge({
      target: weakenedHost,
      factoryPath: process.cwd(),
      ide: ["claude", "trae", "vscode"],
      method: "submodule",
      dryRun: false,
    });

    let initialAudit = await auditEditorConfigurations(weakenedHost);
    assert.strictEqual(initialAudit.passed, true);

    // Intentionally strip preflight command from CLAUDE.md
    const claudePath = join(weakenedHost, "CLAUDE.md");
    const originalClaude = await readFile(claudePath, "utf8");
    const weakenedClaude = originalClaude
      .replace(/.*preflight.*/g, "");
    await writeFile(claudePath, weakenedClaude, "utf8");

    const auditAfterWeakening = await auditEditorConfigurations(weakenedHost);
    assert.strictEqual(auditAfterWeakening.passed, false);
    assert.ok(auditAfterWeakening.brokenCount >= 1);

    const claudeItem = auditAfterWeakening.items.find((i) => i.name === "CLAUDE.md");
    assert.ok(claudeItem);
    assert.match(claudeItem.status, /weakened contract/);
    assert.match(claudeItem.status, /preflight/);
  });

  await t.test("doctor reports enforcement capabilities separately from instruction file existence", async () => {
    const capabilities = await auditEnforcementCapabilities();
    assert.ok(capabilities);
    assert.ok(Array.isArray(capabilities.adapters));
    assert.strictEqual(capabilities.adapters.some((a) => a.stack === "laravel"), false);
    assert.ok(capabilities.supportedStacks.includes("typescript"));
    assert.strictEqual(capabilities.supportedStacks.includes("laravel"), false);
    assert.deepStrictEqual(capabilities.unsupportedStacks, []);
    assert.strictEqual(capabilities.fullyEnforcedFromFilesAlone, false);
    assert.strictEqual(capabilities.instructionOnlyProfiles, true);

    const audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.fullyEnforcedFromFilesAlone, false);
    assert.ok(audit.enforcementSummary.includes("procedural guidance only"));
  });

  await t.test("doctor CLI output displays enforcement capabilities and differentiates stack support", async () => {
    const testHost = join(FIXTURES_DIR, "all-ides-host");
    let capturedJson = null;

    const originalLog = console.log;
    try {
      console.log = (output) => {
        try {
          const parsed = JSON.parse(output);
          if (parsed && parsed.checks) capturedJson = parsed;
        } catch { }
      };

      await handleDoctorCommand([], { target: testHost, json: true });
    } finally {
      console.log = originalLog;
    }

    assert.ok(capturedJson, "Doctor JSON output must be produced");
    assert.strictEqual(capturedJson.checks.editorIntegrity.fullyEnforcedFromFilesAlone, false);
    assert.ok(capturedJson.checks.enforcementCapabilities);
    assert.deepStrictEqual(capturedJson.checks.enforcementCapabilities.supportedStacks, ["typescript"]);
    assert.deepStrictEqual(capturedJson.checks.enforcementCapabilities.unsupportedStacks, []);
    assert.strictEqual(capturedJson.checks.enforcementCapabilities.enforcementMode, "repository-cli");
  });
});

test("Unit 02.01: Ownership-Aware Host Bridge and Repair (AC-04, AC-05, AC-06)", async (t) => {
  const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures", "mock-unit-02-01-host");
  await rm(FIXTURES_DIR, { recursive: true, force: true });
  await mkdir(FIXTURES_DIR, { recursive: true });

  t.after(async () => {
    await rm(FIXTURES_DIR, { recursive: true, force: true });
  });

  await t.test("detectInstalledIdes narrows Antigravity detection to avoid misidentifying Codex skills (AC-06)", async () => {
    const codexOnlyHost = join(FIXTURES_DIR, "codex-only-host");
    await rm(codexOnlyHost, { recursive: true, force: true });
    await mkdir(join(codexOnlyHost, ".agents", "skills", "workflow-feature-delivery"), { recursive: true });

    const idesWithOnlySkills = detectInstalledIdes(codexOnlyHost);
    assert.strictEqual(idesWithOnlySkills.includes("antigravity"), false, ".agents/skills alone must NOT trigger antigravity detection");

    // Adding an Antigravity marker triggers antigravity detection
    await writeFile(join(codexOnlyHost, "GEMINI.md"), "# Gemini Entry Point", "utf8");
    const idesWithGemini = detectInstalledIdes(codexOnlyHost);
    assert.strictEqual(idesWithGemini.includes("antigravity"), true, "GEMINI.md must trigger antigravity detection");
  });

  await t.test("linked host generates independent Codex and Claude discovery symlinks (AC-04, AC-06)", async () => {
    const linkedHost = join(FIXTURES_DIR, "linked-host");
    await rm(linkedHost, { recursive: true, force: true });
    await mkdir(linkedHost, { recursive: true });

    // Test 1: Only codex IDE profile
    await generateBridge({
      target: linkedHost,
      factoryPath: process.cwd(),
      ide: ["codex"],
      method: "linked",
      dryRun: false,
    });

    assert.ok(existsSync(join(linkedHost, ".agents", "skills")), "Codex profile must create .agents/skills");
    assert.strictEqual(existsSync(join(linkedHost, ".claude", "skills")), false, "Codex-only profile must NOT create .claude/skills");
    assert.strictEqual(existsSync(join(linkedHost, ".agents", "rules")), false, "Codex-only profile must NOT create legacy Antigravity rules link");

    // Test 2: Only claude IDE profile
    const claudeHost = join(FIXTURES_DIR, "claude-host");
    await rm(claudeHost, { recursive: true, force: true });
    await mkdir(claudeHost, { recursive: true });

    await generateBridge({
      target: claudeHost,
      factoryPath: process.cwd(),
      ide: ["claude"],
      method: "linked",
      dryRun: false,
    });

    assert.ok(existsSync(join(claudeHost, ".claude", "skills")), "Claude profile must create .claude/skills");
    assert.strictEqual(existsSync(join(claudeHost, ".agents")), false, "Claude-only profile must NOT create .agents");

    // Test 3: Both codex and claude
    const bothHost = join(FIXTURES_DIR, "both-host");
    await rm(bothHost, { recursive: true, force: true });
    await mkdir(bothHost, { recursive: true });

    await generateBridge({
      target: bothHost,
      factoryPath: process.cwd(),
      ide: ["codex", "claude"],
      method: "linked",
      dryRun: false,
    });

    const expectedWorkflows = [
      "workflow-architecture-change",
      "workflow-commit-push-release",
      "workflow-context-maintenance",
      "workflow-database-migration",
      "workflow-defect-resolution",
      "workflow-feature-delivery",
    ];

    for (const slug of expectedWorkflows) {
      const codexEntry = join(bothHost, ".agents", "skills", slug);
      const claudeEntry = join(bothHost, ".claude", "skills", slug);

      assert.ok(existsSync(codexEntry), `Codex entry ${slug} must exist`);
      assert.ok(existsSync(claudeEntry), `Claude entry ${slug} must exist`);

      const codexStat = await lstat(codexEntry);
      assert.ok(codexStat.isSymbolicLink(), `Codex entry ${slug} must be a symlink`);
      const claudeStat = await lstat(claudeEntry);
      assert.ok(claudeStat.isSymbolicLink(), `Claude entry ${slug} must be a symlink`);

      assert.ok(existsSync(join(codexEntry, "SKILL.md")), `Codex target for ${slug} must contain SKILL.md`);
      assert.ok(existsSync(join(claudeEntry, "SKILL.md")), `Claude target for ${slug} must contain SKILL.md`);
    }
  });

  await t.test("submodule host links resolve correctly to embedded submodule path (AC-04)", async () => {
    const subHost = join(FIXTURES_DIR, "submodule-host");
    await rm(subHost, { recursive: true, force: true });
    await mkdir(subHost, { recursive: true });

    const subFactory = join(subHost, ".context-factory");
    await mkdir(join(subFactory, "skills", "workflows", "feature-delivery"), { recursive: true });
    await writeFile(
      join(subFactory, "context-manifest.json"),
      JSON.stringify({
        contextVersion: "1.0.0",
        skills: [],
        workflows: ["skills/workflows/feature-delivery/SKILL.md"],
      }),
      "utf8"
    );
    await writeFile(
      join(subFactory, "skills", "workflows", "feature-delivery", "SKILL.md"),
      "---\nname: feature-delivery\ndescription: test\n---\n## Phases\n## Quality gates\n## Stop and escalation conditions",
      "utf8"
    );

    await generateBridge({
      target: subHost,
      factoryPath: ".context-factory",
      ide: ["codex", "claude"],
      method: "submodule",
      dryRun: false,
    });

    const codexEntry = join(subHost, ".agents", "skills", "workflow-feature-delivery");
    const claudeEntry = join(subHost, ".claude", "skills", "workflow-feature-delivery");

    assert.ok(existsSync(codexEntry), "Codex entry in submodule host must exist");
    assert.ok(existsSync(claudeEntry), "Claude entry in submodule host must exist");

    const codexRaw = await readlink(codexEntry);
    const claudeRaw = await readlink(claudeEntry);

    assert.ok(codexRaw.includes(".context-factory"), "Codex symlink must point into .context-factory");
    assert.ok(claudeRaw.includes(".context-factory"), "Claude symlink must point into .context-factory");
    assert.ok(existsSync(join(codexEntry, "SKILL.md")));
    assert.ok(existsSync(join(claudeEntry, "SKILL.md")));
  });

  await t.test("preserves existing unowned files and symlinks on collision without clobbering (AC-04)", async () => {
    const collisionHost = join(FIXTURES_DIR, "collision-host");
    await rm(collisionHost, { recursive: true, force: true });
    await mkdir(join(collisionHost, ".agents", "skills"), { recursive: true });
    await mkdir(join(collisionHost, ".claude", "skills"), { recursive: true });

    // Place an unowned file where .agents/skills/workflow-feature-delivery would go
    const customContent = "CUSTOM USER UNOWNED WORKFLOW";
    const collidingFilePath = join(collisionHost, ".agents", "skills", "workflow-feature-delivery");
    await writeFile(collidingFilePath, customContent, "utf8");

    // Place an unowned symlink where .claude/skills/workflow-feature-delivery would go
    const unownedTarget = join(collisionHost, "custom-target");
    await mkdir(unownedTarget, { recursive: true });
    const collidingClaudeLink = join(collisionHost, ".claude", "skills", "workflow-feature-delivery");
    await symlink(unownedTarget, collidingClaudeLink, "dir");

    // Run generateBridge
    const res = await generateBridge({
      target: collisionHost,
      factoryPath: process.cwd(),
      ide: ["codex", "claude"],
      method: "linked",
      dryRun: false,
    });

    // 1. Assert content bytes are unchanged
    const fileBytes = await readFile(collidingFilePath, "utf8");
    assert.strictEqual(fileBytes, customContent, "Unowned colliding file must remain completely untouched");

    const linkTarget = await readlink(collidingClaudeLink);
    assert.strictEqual(linkTarget, unownedTarget, "Unowned colliding symlink must remain untouched");

    // 2. Assert collision reported in bridge result
    assert.strictEqual(res.hasCollisions, true, "Bridge result must report hasCollisions: true");
    const codexItem = res.files.find((f) => f.path === collidingFilePath || f.id?.includes("workflow-feature-delivery"));
    assert.ok(codexItem, "Collision item must be recorded in result files");
    assert.match(codexItem.status, /collision/i, "Collision status must be reported");

    // 3. Test repairBridgeSymlinks with force: true - MUST STILL NOT CLOBBER!
    await repairBridgeSymlinks(collisionHost, { force: true });
    const fileBytesAfterRepair = await readFile(collidingFilePath, "utf8");
    assert.strictEqual(fileBytesAfterRepair, customContent, "repair with force: true must NOT overwrite unowned file");

    // 4. Audit reports collision
    const health = await verifySymlinkHealth(collisionHost);
    assert.strictEqual(health.passed, false, "Health check must fail when collision is detected");
    assert.ok(health.collisionCount >= 1, "Health check must report collisionCount >= 1");
    const collisionEntry = health.links.find((l) => l.name.includes("workflow-feature-delivery"));
    assert.ok(collisionEntry, "Collision entry must be in audit link list");
    assert.match(collisionEntry.status, /collision/i, "Audit status must indicate collision");
  });

  await t.test("missing declared factory path fails closed without falling back to local factory root (AC-05)", async () => {
    const missingFactoryHost = join(FIXTURES_DIR, "missing-factory-host");
    await rm(missingFactoryHost, { recursive: true, force: true });
    await mkdir(missingFactoryHost, { recursive: true });

    await assert.rejects(
      async () => {
        await generateBridge({
          target: missingFactoryHost,
          factoryPath: "./nonexistent-factory-path",
          ide: ["codex", "claude"],
          method: "submodule",
          dryRun: false,
        });
      },
      (err) => {
        assert.match(err.message, /nonexistent-factory-path/);
        return true;
      },
      "Must reject when declared factory path does not exist"
    );

    assert.strictEqual(existsSync(join(missingFactoryHost, ".agents")), false);
    assert.strictEqual(existsSync(join(missingFactoryHost, ".claude")), false);
  });

  await t.test("rerun idempotence: running generateBridge twice leaves links skipped (up to date)", async () => {
    const idemHost = join(FIXTURES_DIR, "idempotence-host");
    await rm(idemHost, { recursive: true, force: true });
    await mkdir(idemHost, { recursive: true });

    const firstRun = await generateBridge({
      target: idemHost,
      factoryPath: process.cwd(),
      ide: ["codex", "claude"],
      method: "linked",
      dryRun: false,
    });
    assert.ok(firstRun.files.some((f) => f.status === "created"));

    const secondRun = await generateBridge({
      target: idemHost,
      factoryPath: process.cwd(),
      ide: ["codex", "claude"],
      method: "linked",
      dryRun: false,
    });
    const symlinks = secondRun.files.filter((f) => f.category === "symlink");
    assert.ok(symlinks.length > 0);
    for (const sym of symlinks) {
      assert.strictEqual(sym.status, "skipped (up to date)", `Symlink ${sym.id} must be skipped on rerun`);
    }
  });

  await t.test("destination appearing between planning and mutation is detected without clobbering (concurrency)", async () => {
    const raceHost = join(FIXTURES_DIR, "race-host");
    await rm(raceHost, { recursive: true, force: true });
    await mkdir(join(raceHost, ".agents", "skills"), { recursive: true });

    const linkPath = join(raceHost, ".agents", "skills", "workflow-race");
    const targetPath = join(process.cwd(), "skills", "workflow-entries", "workflow-feature-delivery");

    // Simulate an unexpected unowned file appearing right at linkPath before mutation
    await writeFile(linkPath, "UNOWNED CONCURRENT FILE", "utf8");

    const res = await createRelativeSymlink({
      linkPath,
      targetPath,
      type: "dir",
      force: true, // even with force: true!
    });

    assert.match(res.status, /collision/i, "createRelativeSymlink must detect collision on pre-existing unowned file");
    assert.strictEqual(res.collision, true);

    const content = await readFile(linkPath, "utf8");
    assert.strictEqual(content, "UNOWNED CONCURRENT FILE", "Unowned file content must remain intact");
  });
});
