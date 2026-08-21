import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";

/**
 * Generates bridge files for connecting context-factory to a host / consumer repository.
 */
export async function generateBridge({
  target = process.cwd(),
  factoryPath = null,
  agentProfiles = ["all"],
  method = "submodule",
  dryRun = false,
  force = false,
  addNpmScripts = true,
} = {}) {
  const targetDir = isAbsolute(target) ? target : resolve(process.cwd(), target);

  // Compute relative path from targetDir to context-factory root if not explicitly provided
  let relFactoryPath = factoryPath;
  if (!relFactoryPath) {
    if (targetDir === root) {
      relFactoryPath = ".";
    } else {
      const computed = relative(targetDir, root).replaceAll("\\", "/");
      relFactoryPath = computed || ".";
    }
  }

  // Normalize path format for scripts and markdown
  const normalizedFactoryPath = relFactoryPath.startsWith(".") ? relFactoryPath : `./${relFactoryPath}`;
  const scriptPrefix = normalizedFactoryPath === "." ? "node scripts/context.mjs" : `node ${normalizedFactoryPath}/scripts/context.mjs`;
  const cliPrefix = normalizedFactoryPath === "." ? "node app/cli/bin/context-cli.mjs" : `node ${normalizedFactoryPath}/app/cli/bin/context-cli.mjs`;

  const filesToGenerate = [];

  // 1. AGENTS.md (Universal Orchestrator Contract)
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
  filesToGenerate.push({ path: join(targetDir, "AGENTS.md"), content: agentsMdContent, id: "AGENTS.md" });

  // 2. GEMINI.md (Antigravity & Gemini Entry Point)
  const geminiMdContent = `# Gemini & Antigravity Host Entry Point Contract

This repository is bridged to **Context Factory** at \`${normalizedFactoryPath}\`.

## Mandatory Directives

- Consult \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for the authoritative orchestration contract.
- Resolve context via \`${scriptPrefix} resolve "<request>"\`.
- Write task plans to host \`./docs/tasks/\` and architecture decisions to host \`./docs/decisions/\`.
- Follow universal engineering rules from \`${normalizedFactoryPath}/rules/\`.
`;
  filesToGenerate.push({ path: join(targetDir, "GEMINI.md"), content: geminiMdContent, id: "GEMINI.md" });

  // 3. CLAUDE.md (Claude Code Entry Point)
  const claudeMdContent = `# Claude Code Host Project Instructions

This project uses **Context Factory** at \`${normalizedFactoryPath}\` for engineering workflows and standards.

## Execution Rules
- Review \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for orchestrator directives.
- Context resolution: \`${scriptPrefix} resolve "<prompt>"\`.
- Write task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\` in this repository.
- Verify work using \`${scriptPrefix} doctor\`.
`;
  filesToGenerate.push({ path: join(targetDir, "CLAUDE.md"), content: claudeMdContent, id: "CLAUDE.md" });

  // 4. CODEX.md (Codex Entry Point)
  const codexMdContent = `# Codex Host Project Instructions

Context Factory integration: \`${normalizedFactoryPath}\`.
Authoritative contract: \`${normalizedFactoryPath}/orchestrator/SHARED.md\`.

## Commands
- Resolve context: \`${scriptPrefix} resolve "<prompt>"\`
- Run health check: \`${scriptPrefix} doctor\`
`;
  filesToGenerate.push({ path: join(targetDir, "CODEX.md"), content: codexMdContent, id: "CODEX.md" });

  // 5. .cursorrules (Cursor Rules)
  const cursorRulesContent = `# Cursor Rules - Context Factory Bridge

- Refer to \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for shared orchestration directives.
- Use \`${scriptPrefix} resolve "<prompt>"\` to determine relevant rules and skills.
- Save task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
  filesToGenerate.push({ path: join(targetDir, ".cursorrules"), content: cursorRulesContent, id: ".cursorrules" });

  // 6. .windsurfrules (Windsurf Rules)
  const windsurfRulesContent = `# Windsurf Rules - Context Factory Bridge

- Refer to \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for shared orchestration directives.
- Use \`${scriptPrefix} resolve "<prompt>"\` to determine relevant rules and skills.
- Save task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
  filesToGenerate.push({ path: join(targetDir, ".windsurfrules"), content: windsurfRulesContent, id: ".windsurfrules" });

  // 7. .github/copilot-instructions.md (Copilot instructions)
  const copilotContent = `# GitHub Copilot Instructions - Context Factory Bridge

This repository connects to Context Factory at \`${normalizedFactoryPath}\`.
- Read \`${normalizedFactoryPath}/orchestrator/SHARED.md\` for architecture contracts.
- Resolve context: \`${scriptPrefix} resolve "<prompt>"\`.
- Write task plans to \`./docs/tasks/\` and ADRs to \`./docs/decisions/\`.
`;
  filesToGenerate.push({ path: join(targetDir, ".github", "copilot-instructions.md"), content: copilotContent, id: ".github/copilot-instructions.md" });

  // 8. docs/tasks/README.md
  const docsTasksReadme = `# Tasks Directory

This directory stores host-specific task plans, milestones, and phased execution breakdowns.

- Phased plans are generated by the \`plan\` skill and stored in \`./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/\`.
- Templates are loaded from \`${normalizedFactoryPath}/docs/templates/Task.md\` and \`Phase.md\`.
`;
  filesToGenerate.push({ path: join(targetDir, "docs", "tasks", "README.md"), content: docsTasksReadme, id: "docs/tasks/README.md" });

  // 9. docs/decisions/README.md
  const docsDecisionsReadme = `# Architecture Decisions (ADRs)

This directory stores host-specific Architecture Decision Records (ADRs).

- ADRs follow the template in \`${normalizedFactoryPath}/docs/templates/Decision.md\`.
`;
  filesToGenerate.push({ path: join(targetDir, "docs", "decisions", "README.md"), content: docsDecisionsReadme, id: "docs/decisions/README.md" });

  // 10. rules/README.md (Optional local rules extension)
  const rulesReadme = `# Host Project Rules

Place host-specific rules and overrides in this directory.
Universal rules are provided by Context Factory at \`${normalizedFactoryPath}/rules/\`.
`;
  filesToGenerate.push({ path: join(targetDir, "rules", "README.md"), content: rulesReadme, id: "rules/README.md" });

  // 11. .context-bridge.json (Bridge Metadata)
  const bridgeConfig = {
    schemaVersion: 1,
    bridgeVersion: "1.0.0",
    factoryPath: normalizedFactoryPath,
    integrationMethod: method,
    createdAt: new Date().toISOString(),
    scoping: {
      tasks: "./docs/tasks",
      decisions: "./docs/decisions",
      rules: "./rules",
    },
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
  });

  // Filter by requested agent profiles if not 'all'
  const finalFiles = agentProfiles.includes("all")
    ? filesToGenerate
    : filesToGenerate.filter((f) => {
        if ([".context-bridge.json", "docs/tasks/README.md", "docs/decisions/README.md", "rules/README.md"].includes(f.id)) return true;
        if (agentProfiles.includes("agents") && f.id === "AGENTS.md") return true;
        if (agentProfiles.includes("gemini") && f.id === "GEMINI.md") return true;
        if (agentProfiles.includes("claude") && f.id === "CLAUDE.md") return true;
        if (agentProfiles.includes("codex") && f.id === "CODEX.md") return true;
        if (agentProfiles.includes("cursor") && f.id === ".cursorrules") return true;
        if (agentProfiles.includes("windsurf") && f.id === ".windsurfrules") return true;
        if (agentProfiles.includes("copilot") && f.id === ".github/copilot-instructions.md") return true;
        return false;
      });

  const writeResults = [];

  for (const item of finalFiles) {
    let exists = false;
    try {
      await readFile(item.path);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !force) {
      writeResults.push({ path: item.path, id: item.id, status: "skipped (exists)" });
      continue;
    }

    if (!dryRun) {
      await mkdir(dirname(item.path), { recursive: true });
      await writeFile(item.path, item.content, "utf8");
    }

    writeResults.push({ path: item.path, id: item.id, status: dryRun ? "would create" : (exists ? "overwritten" : "created") });
  }

  // 12. Check package.json in host repo
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
        ? `git submodule update --remote --merge ${normalizedFactoryPath} && npm run context:doctor`
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
    dryRun,
    files: writeResults,
    packageJsonUpdated,
  };
}
