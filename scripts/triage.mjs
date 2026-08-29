#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { root } from "./context-core.mjs";

/**
 * Executes repository discovery scan and generates structured findings.
 */
export async function runTriage({ dryRun = false, source = "Automated Discovery", finding = null } = {}) {
  const inboxPath = join(root, "docs/tasks/INBOX.md");
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  let findings = [];

  if (finding) {
    findings.push(finding);
  } else {
    // 1. Inspect recent git log
    let recentCommits = [];
    try {
      const gitLog = execSync("git log -n 3 --oneline", { cwd: root, encoding: "utf8" }).trim();
      recentCommits = gitLog ? gitLog.split("\n") : [];
    } catch {
      recentCommits = ["Initial commit or git unavailable"];
    }

    // 2. Check for working tree status
    let dirtyFiles = [];
    try {
      const gitStatus = execSync("git status --porcelain", { cwd: root, encoding: "utf8" }).trim();
      dirtyFiles = gitStatus ? gitStatus.split("\n") : [];
    } catch {
      dirtyFiles = [];
    }

    const latestCommit = recentCommits[0] || "HEAD";
    const commitHash = latestCommit.split(" ")[0];

    const findingId = `F-${timeId}-${Math.floor(100 + Math.random() * 900)}`;
    const description = dirtyFiles.length > 0
      ? `Discovered ${dirtyFiles.length} uncommitted file modifications in workspace`
      : `Scanned repository at commit ${commitHash} — context and health verified`;
    const category = dirtyFiles.length > 0 ? "drift / medium" : "maintenance / low";
    const action = dirtyFiles.length > 0
      ? "Review workspace diff via `context-cli diff` or commit"
      : "No immediate remediation required; log discovery record";

    findings.push({
      id: findingId,
      date: dateStr,
      source: `${source} (${commitHash})`,
      category,
      description,
      action,
      status: "new",
    });
  }

  if (dryRun) {
    console.log(`\n--- Triage Discovery Dry Run [${findings.length} findings] ---\n`);
    for (const f of findings) {
      console.log(`ID:          ${f.id}`);
      console.log(`Date:        ${f.date}`);
      console.log(`Source:      ${f.source}`);
      console.log(`Category:    ${f.category}`);
      console.log(`Description: ${f.description}`);
      console.log(`Action:      ${f.action}`);
      console.log(`Status:      ${f.status}`);
      console.log("------------------------------------------");
    }
    return { findings, inboxUpdated: false, dryRun: true };
  }

  // Update docs/tasks/INBOX.md if file exists
  if (existsSync(inboxPath)) {
    let inboxContent = await readFile(inboxPath, "utf8");
    const rowsToAdd = findings.map(
      (f) => `| ${f.id} | ${f.date} | ${f.source} | ${f.category} | ${f.description} | ${f.action} | ${f.status} |`
    );

    // Look for Active Findings table marker
    const tableHeaderMarker = "| ID | Discovered Date | Source | Category / Severity | Description | Proposed Action / Promoted Task | Status |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |";
    if (inboxContent.includes(tableHeaderMarker)) {
      inboxContent = inboxContent.replace(
        tableHeaderMarker,
        `${tableHeaderMarker}\n${rowsToAdd.join("\n")}`
      );
      await writeFile(inboxPath, inboxContent, "utf8");
    }
  }

  return { findings, inboxUpdated: true, dryRun: false };
}

// Direct CLI invocation
if (process.argv[1]?.endsWith("triage.mjs")) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const isJson = args.includes("--json");

  runTriage({ dryRun })
    .then((result) => {
      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
      } else if (!dryRun) {
        console.log(`\n Discovery scan complete: ${result.findings.length} findings recorded in docs/tasks/INBOX.md\n`);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error(`Triage discovery failed: ${err.message}`);
      process.exit(1);
    });
}
