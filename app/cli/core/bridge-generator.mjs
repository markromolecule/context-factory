import { existsSync } from "node:fs";
import { cp, lstat, mkdir, readFile, readlink, rm, symlink, unlink, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";

/**
 * Detects the package manager used in the target directory by checking lockfiles.
 * Returns 'pnpm', 'yarn', 'bun', or 'npm'.
 */
export function detectPackageManager(targetDir = process.cwd()) {
  if (existsSync(join(targetDir, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(targetDir, "yarn.lock"))) return "yarn";
  if (existsSync(join(targetDir, "bun.lockb")) || existsSync(join(targetDir, "bun.lock"))) return "bun";
  if (existsSync(join(targetDir, "package-lock.json"))) return "npm";
  return "npm";
}

/**
 * Creates a symbolic link with relative target and fallback handling.
 */
export async function createRelativeSymlink({
  linkPath,
  targetPath,
  type = "dir",
  dryRun = false,
  force = false,
}) {
  const linkDir = dirname(linkPath);
  const relTarget = relative(linkDir, targetPath).replaceAll("\\", "/");

  let existingStat = null;
  try {
    existingStat = await lstat(linkPath);
  } catch {
    existingStat = null;
  }

  if (existingStat) {
    if (existingStat.isSymbolicLink()) {
      const currentTarget = (await readlink(linkPath).catch(() => null))?.replaceAll("\\", "/");
      if (currentTarget === relTarget && !force) {
        return { path: linkPath, target: relTarget, status: "skipped (up to date)", isSymlink: true };
      }
      if (!dryRun) {
        await rm(linkPath, { recursive: true, force: true });
      }
    } else if (!force) {
      return { path: linkPath, target: relTarget, status: "skipped (exists, not symlink)", isSymlink: false };
    } else if (!dryRun) {
      try {
        await rm(linkPath, { recursive: true, force: true });
      } catch {
        // Fallback
      }
    }
  }

  if (dryRun) {
    return {
      path: linkPath,
      target: relTarget,
      status: existingStat ? "would update" : "would create",
      isSymlink: true,
    };
  }

  await mkdir(linkDir, { recursive: true });

  const symlinkType = process.platform === "win32"
    ? (type === "dir" ? "junction" : "file")
    : (type === "dir" ? "dir" : "file");

  try {
    await symlink(relTarget, linkPath, symlinkType);
    return {
      path: linkPath,
      target: relTarget,
      status: existingStat ? "updated" : "created",
      isSymlink: true,
    };
  } catch (err) {
    // Windows non-admin fallback: attempt directory copy if symlink failed
    if (process.platform === "win32" && err.code === "EPERM") {
      try {
        await cp(targetPath, linkPath, { recursive: type === "dir" });
        return {
          path: linkPath,
          target: relTarget,
          status: "created (copied fallback)",
          isSymlink: false,
        };
      } catch (cpErr) {
        return {
          path: linkPath,
          target: relTarget,
          status: `failed (${err.message})`,
          error: err,
          isSymlink: false,
        };
      }
    }
    return {
      path: linkPath,
      target: relTarget,
      status: `failed (${err.message})`,
      error: err,
      isSymlink: false,
    };
  }
}

/**
 * Normalizes requested IDE profiles from flags.
 */
export function normalizeIdeProfiles(input = ["all"]) {
  const rawList = Array.isArray(input) ? input : (typeof input === "string" ? input.split(",") : ["all"]);
  const cleaned = rawList.map((s) => s.trim().toLowerCase()).filter(Boolean);

  if (cleaned.length === 0 || cleaned.includes("all") || cleaned.includes("*")) {
    return ["antigravity", "gemini", "cursor", "windsurf", "claude", "copilot", "codex"];
  }

  const result = new Set();
  for (const item of cleaned) {
    if (item === "antigravity" || item === "agy") {
      result.add("antigravity");
      result.add("gemini");
    } else if (item === "gemini") {
      result.add("gemini");
      result.add("antigravity");
    } else if (["cursor", "windsurf", "claude", "copilot", "codex"].includes(item)) {
      result.add(item);
    }
  }

  return Array.from(result);
}

/**
 * Generates bridge files and .agents symlinks for connecting context-factory to a host / consumer repository.
 */
export async function generateBridge({
  target = process.cwd(),
  factoryPath = null,
  ide = ["all"],
  agentProfiles = null,
  method = "submodule",
  packageManager = null,
  pm = null,
  dryRun = false,
  force = false,
  addNpmScripts = true,
} = {}) {
  const targetDir = isAbsolute(target) ? target : resolve(process.cwd(), target);
  const activePm = (packageManager || pm || detectPackageManager(targetDir)).toLowerCase();
  const pmRun = activePm === "yarn" ? "yarn" : (activePm === "bun" ? "bun run" : `${activePm} run`);

  // Compute absolute and relative paths to context-factory
  let absFactoryPath;
  let relFactoryPath = factoryPath;

  if (relFactoryPath) {
    absFactoryPath = isAbsolute(relFactoryPath) ? relFactoryPath : resolve(targetDir, relFactoryPath);
  } else {
    if (targetDir === root) {
      relFactoryPath = ".";
      absFactoryPath = root;
    } else {
      const computed = relative(targetDir, root).replaceAll("\\", "/");
      relFactoryPath = computed || ".";
      absFactoryPath = root;
    }
  }

  // Normalize path format for scripts and markdown
  const normalizedFactoryPath = relFactoryPath.startsWith(".") ? relFactoryPath : `./${relFactoryPath}`;
  const scriptPrefix = normalizedFactoryPath === "." ? "node scripts/context.mjs" : `node ${normalizedFactoryPath}/scripts/context.mjs`;
  const cliPrefix = normalizedFactoryPath === "." ? "node app/cli/bin/context-cli.mjs" : `node ${normalizedFactoryPath}/app/cli/bin/context-cli.mjs`;

  const activeIdes = normalizeIdeProfiles(agentProfiles || ide);
  const isAll = (agentProfiles || ide).includes("all") || (agentProfiles || ide).includes("*");

  const filesToGenerate = [];

  if (targetDir !== root) {
    // 1. AGENTS.md (Universal Orchestrator Contract) - Always generated
    const agentsMdContent = `# Host Project AI Agent Instructions & Context Factory Bridge

This repository uses **Context Factory** (located at \`${normalizedFactoryPath}\`) for development standards, rules, workflows, subagents, and skills.

## Mandatory Directives & Agent Execution Contract

1. **Shared Contract:** Read the shared orchestration contract in \`${normalizedFactoryPath}/orchestrator/SHARED.md\` before executing tasks.
2. **Context Resolution:** Deterministically resolve required context before non-trivial changes:
   \`${scriptPrefix} resolve "<task description>"\`
3. **Universal Standards:** Follow rules in \`${normalizedFactoryPath}/rules/\`, workflows in \`${normalizedFactoryPath}/workflows/\`, and skills in \`${normalizedFactoryPath}/skills/\`.
4. **Project Specifics:** Combine universal factory rules with project-specific rules in \`./rules/\` or \`./.agents/rules/\`.

## Generated Documentation Scoping Contract

- **Task Plans & Breakdowns:** All implementation plans, phase breakdowns, and task files MUST be written to \`./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/\` in **this host repository**, NEVER inside \`${normalizedFactoryPath}\`.
- **Architecture Decisions (ADRs):** All architectural decision records MUST be saved to \`./docs/decisions/\` in **this host repository**.
- **Templates:** Always load templates from \`${normalizedFactoryPath}/docs/templates/Task.md\`, \`Phase.md\`, and \`Decision.md\`.

## Session Slash Commands & Quick Actions

| Command | Action | Execution |
| :--- | :--- | :--- |
| \`/plan\`, \`[PLAN]\` | Scaffold phased plan in \`./docs/tasks/\` | \`${scriptPrefix} task:new "<title>"\` |
| \`/resolve\` | Resolve matching context rules & skills | \`${scriptPrefix} resolve "<prompt>"\` |
| \`/doctor\` | Verify context and lock health | \`${scriptPrefix} doctor\` |
`;
  filesToGenerate.push({ path: join(targetDir, "AGENTS.md"), content: agentsMdContent, id: "AGENTS.md", category: "contract" });

  // 2. GEMINI.md (Antigravity & Gemini Entry Point)
  if (isAll || activeIdes.includes("gemini") || activeIdes.includes("antigravity")) {
    const geminiMdContent = `# Gemini & Antigravity Host Entry Point Contract

This repository is bridged to **Context Factory** at \`${normalizedFactoryPath}\`.

## Mandatory Directives

- Consult \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for the authoritative orchestration contract.
- Resolve context via \`${scriptPrefix} resolve "<request>"\`.
- Write task plans to host \`./docs/tasks/\` and architecture decisions to host \`./docs/decisions/\`.
- Follow universal engineering rules from \`${normalizedFactoryPath}/rules/\`.
`;
    filesToGenerate.push({ path: join(targetDir, "GEMINI.md"), content: geminiMdContent, id: "GEMINI.md", category: "contract" });
  }

  // 3. CLAUDE.md (Claude Code Entry Point)
  if (isAll || activeIdes.includes("claude")) {
    const claudeMdContent = `# Claude Code Host Project Instructions

This project uses **Context Factory** at \`${normalizedFactoryPath}\` for engineering workflows and standards.

## Execution Rules
- Review \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for orchestrator directives.
- Context resolution: \`${scriptPrefix} resolve "<prompt>"\`.
- Write task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\` in this repository.
- Verify work using \`${scriptPrefix} doctor\`.
`;
    filesToGenerate.push({ path: join(targetDir, "CLAUDE.md"), content: claudeMdContent, id: "CLAUDE.md", category: "contract" });
  }

  // 4. CODEX.md (Codex Entry Point)
  if (isAll || activeIdes.includes("codex")) {
    const codexMdContent = `# Codex Host Project Instructions

Context Factory integration: \`${normalizedFactoryPath}\`.
Authoritative contract: \`${normalizedFactoryPath}/orchestrator/SHARED.md\`.

## Commands
- Resolve context: \`${scriptPrefix} resolve "<prompt>"\`
- Run health check: \`${scriptPrefix} doctor\`
`;
    filesToGenerate.push({ path: join(targetDir, "CODEX.md"), content: codexMdContent, id: "CODEX.md", category: "contract" });
  }

  // 5. .cursorrules (Cursor Rules)
  if (isAll || activeIdes.includes("cursor")) {
    const cursorRulesContent = `# Cursor Rules - Context Factory Bridge

- Refer to \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for shared orchestration directives.
- Use \`${scriptPrefix} resolve "<prompt>"\` to determine relevant rules and skills.
- Save task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
    filesToGenerate.push({ path: join(targetDir, ".cursorrules"), content: cursorRulesContent, id: ".cursorrules", category: "contract" });
  }

  // 6. .windsurfrules (Windsurf Rules)
  if (isAll || activeIdes.includes("windsurf")) {
    const windsurfRulesContent = `# Windsurf Rules - Context Factory Bridge

- Refer to \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for shared orchestration directives.
- Use \`${scriptPrefix} resolve "<prompt>"\` to determine relevant rules and skills.
- Save task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
    filesToGenerate.push({ path: join(targetDir, ".windsurfrules"), content: windsurfRulesContent, id: ".windsurfrules", category: "contract" });
  }

  // 7. .github/copilot-instructions.md (Copilot instructions)
  if (isAll || activeIdes.includes("copilot")) {
    const copilotContent = `# GitHub Copilot Instructions - Context Factory Bridge

This repository connects to Context Factory at \`${normalizedFactoryPath}\`.
- Read \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for architecture contracts.
- Resolve context: \`${scriptPrefix} resolve "<prompt>"\`.
- Write task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
    filesToGenerate.push({ path: join(targetDir, ".github", "copilot-instructions.md"), content: copilotContent, id: ".github/copilot-instructions.md", category: "contract" });
  }

  // 8. Common Scaffolding: docs/tasks/README.md, docs/decisions/README.md, rules/README.md
  filesToGenerate.push({
    path: join(targetDir, "docs", "tasks", "README.md"),
    content: `# Tasks Directory\n\nThis directory stores host-specific task plans, milestones, and phased execution breakdowns.\n\n- Phased plans are generated by the \`plan\` skill and stored in \`./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/\`.\n- Templates are loaded from \`${normalizedFactoryPath}/docs/templates/Task.md\` and \`Phase.md\`.\n`,
    id: "docs/tasks/README.md",
    category: "scaffold",
  });

  filesToGenerate.push({
    path: join(targetDir, "docs", "decisions", "README.md"),
    content: `# Architecture Decisions (ADRs)\n\nThis directory stores host-specific Architecture Decision Records (ADRs).\n\n- ADRs follow the template in \`${normalizedFactoryPath}/docs/templates/Decision.md\`.\n`,
    id: "docs/decisions/README.md",
    category: "scaffold",
  });

    filesToGenerate.push({
      path: join(targetDir, "rules", "README.md"),
      content: `# Host Project Rules\n\nPlace host-specific rules and overrides in this directory.\nUniversal rules are provided by Context Factory at \`${normalizedFactoryPath}/rules/\`.\n`,
      id: "rules/README.md",
      category: "scaffold",
    });
  }

  // 9. Antigravity & Agentic IDE Symlinks (.agents/)
  const symlinksToCreate = [];
  if (isAll || activeIdes.includes("antigravity") || activeIdes.includes("gemini")) {
    const dotAgentsDir = join(targetDir, ".agents");

    // Discover factory skills for per-skill symlink creation
    let factorySkills = [];
    try {
      const manifestPath = join(absFactoryPath, "context-manifest.json");
      const m = JSON.parse(await readFile(manifestPath, "utf8"));
      factorySkills = m.skills || [];
    } catch {}

    // Skills directory entries for skills.json
    const skillsRelDir = targetDir === absFactoryPath ? "skills" : join(normalizedFactoryPath, "skills").replaceAll("\\", "/");
    const skillsJsonConfig = {
      entries: [
        { path: `${skillsRelDir}/engineering` },
        { path: `${skillsRelDir}/productivity` },
      ],
    };

    filesToGenerate.push({
      path: join(dotAgentsDir, "skills.json"),
      content: `${JSON.stringify(skillsJsonConfig, null, 2)}\n`,
      id: ".agents/skills.json",
      category: "config",
    });

    const symlinkDefs = [
      { id: ".agents/rules", name: "rules", type: "dir" },
      { id: ".agents/agents", name: "agents", type: "dir" },
      { id: ".agents/workflows", name: "workflows", type: "dir" },
      { id: ".agents/AGENTS.md", name: "AGENTS.md", type: "file" },
      { id: ".agents/GEMINI.md", name: "GEMINI.md", type: "file" },
    ];

    for (const def of symlinkDefs) {
      const linkPath = join(dotAgentsDir, def.name);
      const sourcePath = join(absFactoryPath, def.name);
      symlinksToCreate.push({
        id: def.id,
        linkPath,
        sourcePath,
        type: def.type,
      });
    }

    // Clean up old single .agents/skills symlink if present
    const dotAgentsSkillsDir = join(dotAgentsDir, "skills");
    try {
      const s = await lstat(dotAgentsSkillsDir);
      if (s.isSymbolicLink()) {
        if (!dryRun) {
          await rm(dotAgentsSkillsDir, { force: true });
        }
      }
    } catch {}

    // Create individual symlinks for each skill under .agents/skills/
    for (const skillPath of factorySkills) {
      const parts = skillPath.split("/");
      const skillName = parts[parts.length - 2];
      const relSkillDir = parts.slice(0, -1).join("/");
      const linkPath = join(dotAgentsSkillsDir, skillName);
      const sourcePath = join(absFactoryPath, relSkillDir);
      symlinksToCreate.push({
        id: `.agents/skills/${skillName}`,
        linkPath,
        sourcePath,
        type: "dir",
      });
    }
  }

  // 10. .context-bridge.json (Bridge Metadata for Host Repositories)
  if (targetDir !== root) {
    const bridgeConfig = {
      schemaVersion: 1,
      bridgeVersion: "1.2.0",
      factoryPath: normalizedFactoryPath,
      integrationMethod: method,
      packageManager: activePm,
      ides: activeIdes,
      createdAt: new Date().toISOString(),
      scoping: {
        tasks: "./docs/tasks",
        decisions: "./docs/decisions",
        rules: "./rules",
        agents: "./.agents",
      },
      symlinks: symlinksToCreate.map((s) => ({
        id: s.id,
        target: relative(dirname(s.linkPath), s.sourcePath).replaceAll("\\", "/"),
        type: s.type,
      })),
      commands: {
        resolve: `${scriptPrefix} resolve`,
        bundle: `${scriptPrefix} bundle`,
        doctor: `${scriptPrefix} doctor`,
        cli: `${cliPrefix}`,
      },
    };

    filesToGenerate.push({
      path: join(targetDir, ".context-bridge.json"),
      content: `${JSON.stringify(bridgeConfig, null, 2)}\n`,
      id: ".context-bridge.json",
      category: "config",
    });
  }

  // Write contract and scaffold files
  const fileResults = [];
  for (const item of filesToGenerate) {
    let exists = false;
    try {
      await readFile(item.path);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !force) {
      fileResults.push({ path: item.path, id: item.id, status: "skipped (exists)", category: item.category, isSymlink: false });
      continue;
    }

    if (!dryRun) {
      await mkdir(dirname(item.path), { recursive: true });
      await writeFile(item.path, item.content, "utf8");
    }

    fileResults.push({
      path: item.path,
      id: item.id,
      status: dryRun ? "would create" : (exists ? "overwritten" : "created"),
      category: item.category,
      isSymlink: false,
    });
  }

  // Create symlinks
  const symlinkResults = [];
  for (const sym of symlinksToCreate) {
    const symRes = await createRelativeSymlink({
      linkPath: sym.linkPath,
      targetPath: sym.sourcePath,
      type: sym.type,
      dryRun,
      force,
    });
    symlinkResults.push({
      id: sym.id,
      path: symRes.path,
      target: symRes.target,
      status: symRes.status,
      category: "symlink",
      isSymlink: symRes.isSymlink,
    });
  }

  // 11. Check package.json in host repo
  let packageJsonUpdated = false;
  const hostPkgPath = join(targetDir, "package.json");
  try {
    const pkgContent = await readFile(hostPkgPath, "utf8");
    const pkg = JSON.parse(pkgContent);
    pkg.scripts = pkg.scripts || {};

    const scriptsToAdd = {
      "context:resolve": `${scriptPrefix} resolve`,
      "context:bundle": `${scriptPrefix} bundle`,
      "context:doctor": `${scriptPrefix} doctor`,
      "context:update": method === "submodule"
        ? `git submodule update --remote --merge ${normalizedFactoryPath} && ${pmRun} context:doctor`
        : `${scriptPrefix} doctor`,
      "context:bridge": `${cliPrefix} bridge --target .`,
      "context:cli": `${cliPrefix}`,
    };

    let modified = false;
    for (const [key, val] of Object.entries(scriptsToAdd)) {
      if (!pkg.scripts[key] || force) {
        pkg.scripts[key] = val;
        modified = true;
      }
    }

    if (modified && addNpmScripts) {
      if (!dryRun) {
        await writeFile(hostPkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
      }
      packageJsonUpdated = true;
    }
  } catch {
    // No package.json in host repo
  }

  return {
    targetDir,
    factoryPath: normalizedFactoryPath,
    method,
    ides: activeIdes,
    dryRun,
    files: [...fileResults, ...symlinkResults],
    symlinks: symlinkResults,
    packageJsonUpdated,
  };
}

/**
 * Diagnostic utility to audit symlink health in Context Factory or a bridged host repository.
 */
export async function verifySymlinkHealth(targetDir = process.cwd()) {
  const dotAgentsDir = join(targetDir, ".agents");
  let hasDotAgents = false;
  try {
    const s = await lstat(dotAgentsDir);
    hasDotAgents = s.isDirectory();
  } catch {
    hasDotAgents = false;
  }

  // Load manifest skills to verify per-skill links
  let factorySkills = [];
  try {
    let factoryPath = targetDir;
    if (existsSync(join(targetDir, ".context-bridge.json"))) {
      const bridge = JSON.parse(await readFile(join(targetDir, ".context-bridge.json"), "utf8"));
      if (bridge.factoryPath) factoryPath = resolve(targetDir, bridge.factoryPath);
    } else if (existsSync(join(targetDir, "context-factory", "context-manifest.json"))) {
      factoryPath = join(targetDir, "context-factory");
    }
    const manifestPath = join(factoryPath, "context-manifest.json");
    const m = JSON.parse(await readFile(manifestPath, "utf8"));
    factorySkills = m.skills || [];
  } catch {}

  const expectedLinks = [
    { name: "rules", type: "dir" },
    { name: "agents", type: "dir" },
    { name: "workflows", type: "dir" },
    { name: "AGENTS.md", type: "file" },
    { name: "GEMINI.md", type: "file" },
  ];

  for (const skillPath of factorySkills) {
    const parts = skillPath.split("/");
    const skillName = parts[parts.length - 2];
    if (skillName) {
      expectedLinks.push({ name: `skills/${skillName}`, type: "dir" });
    }
  }

  const linkStatuses = [];
  let brokenCount = 0;
  let missingCount = 0;
  let healthyCount = 0;

  for (const item of expectedLinks) {
    const linkPath = join(dotAgentsDir, item.name);
    try {
      const stat = await lstat(linkPath);
      if (stat.isSymbolicLink()) {
        const rawTarget = await readlink(linkPath);
        const resolvedPath = resolve(dirname(linkPath), rawTarget);
        try {
          await lstat(resolvedPath);
          healthyCount++;
          linkStatuses.push({ name: item.name, path: linkPath, target: rawTarget, status: "healthy", isSymlink: true });
        } catch {
          brokenCount++;
          linkStatuses.push({ name: item.name, path: linkPath, target: rawTarget, status: "broken (target not found)", isSymlink: true });
        }
      } else {
        linkStatuses.push({ name: item.name, path: linkPath, status: "regular file/dir", isSymlink: false });
      }
    } catch {
      missingCount++;
      linkStatuses.push({ name: item.name, path: linkPath, status: "missing", isSymlink: false });
    }
  }

  // Check .agents/skills.json
  const skillsJsonPath = join(dotAgentsDir, "skills.json");
  try {
    const skillsJson = JSON.parse(await readFile(skillsJsonPath, "utf8"));
    if (Array.isArray(skillsJson.entries) && skillsJson.entries.length > 0) {
      healthyCount++;
      linkStatuses.push({ name: "skills.json", path: skillsJsonPath, status: "healthy", isSymlink: false });
    } else {
      brokenCount++;
      linkStatuses.push({ name: "skills.json", path: skillsJsonPath, status: "invalid schema", isSymlink: false });
    }
  } catch {
    missingCount++;
    linkStatuses.push({ name: "skills.json", path: skillsJsonPath, status: "missing", isSymlink: false });
  }

  const totalCount = expectedLinks.length + 1;
  const passed = hasDotAgents && brokenCount === 0 && missingCount === 0 && healthyCount === totalCount;
  return {
    passed,
    hasDotAgents,
    brokenCount,
    missingCount,
    healthyCount,
    totalCount,
    links: linkStatuses,
  };
}

/**
 * Re-creates or repairs missing and broken symlinks in target directory.
 */
export async function repairBridgeSymlinks(targetDir = process.cwd(), flags = {}) {
  let factoryPath = flags.factoryPath || flags.factory || null;
  let ide = flags.ide || ["all"];
  let method = flags.method || "submodule";

  // 1. Check local .gitmodules first (if host repo embeds context-factory as a git submodule)
  try {
    const gitModules = await readFile(join(targetDir, ".gitmodules"), "utf8");
    if (gitModules.includes("context-factory")) {
      const match = gitModules.match(/path\s*=\s*(.+)/);
      if (match) {
        const p = match[1].trim();
        if (existsSync(join(targetDir, p))) {
          factoryPath = p;
          method = "submodule";
        }
      }
    }
  } catch {}

  // 2. Check local directories if submodule is embedded
  if (!factoryPath) {
    if (existsSync(join(targetDir, "context-factory", "context-manifest.json"))) {
      factoryPath = "context-factory";
      method = "submodule";
    } else if (existsSync(join(targetDir, ".context-factory", "context-manifest.json"))) {
      factoryPath = ".context-factory";
      method = "submodule";
    }
  }

  // 3. Fallback to existing .context-bridge.json
  if (!factoryPath) {
    try {
      const bridgeJson = JSON.parse(await readFile(join(targetDir, ".context-bridge.json"), "utf8"));
      if (bridgeJson.factoryPath) factoryPath = bridgeJson.factoryPath;
      if (bridgeJson.ides) ide = bridgeJson.ides;
      if (bridgeJson.integrationMethod) method = bridgeJson.integrationMethod;
    } catch {
      // If inside context-factory itself
      if (targetDir === root) {
        factoryPath = ".";
      }
    }
  }

  return generateBridge({
    target: targetDir,
    factoryPath: factoryPath || ".",
    ide,
    method,
    force: true,
    addNpmScripts: true,
  });
}
