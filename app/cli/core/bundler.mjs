import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import {
  createLock,
  frontmatter,
  readJson,
  readText,
  root,
  sha256,
} from "../../../scripts/context-core.mjs";

/**
 * Compiles the entire Context Factory into a single optimized distribution bundle.
 */
export async function compileBundle({
  out = "dist/context-bundle.json",
  minify = false,
  format = "json",
} = {}) {
  const manifest = await readJson("context-manifest.json");
  const lock = await createLock(manifest);

  const rules = [];
  for (const path of manifest.rules ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    rules.push({
      path,
      name: meta.name || path.split("/").at(-1).replace(/\.md$/, ""),
      description: meta.description || "",
      scope: meta.scope || "",
      alwaysApply: Boolean(meta.alwaysApply),
      content: minify ? minifyMarkdown(raw) : raw,
    });
  }

  const skills = [];
  for (const path of manifest.skills ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    const skillDir = path.split("/").slice(0, 2).join("/");
    const resources = [];
    for (const resPath of manifest.skillResources ?? []) {
      if (resPath.startsWith(skillDir)) {
        resources.push({
          path: resPath,
          content: await readText(resPath),
        });
      }
    }
    skills.push({
      path,
      name: meta.name || path.split("/").at(-2),
      description: meta.description || "",
      content: minify ? minifyMarkdown(raw) : raw,
      resources,
    });
  }

  const workflows = [];
  for (const path of manifest.workflows ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    workflows.push({
      path,
      name: meta.name || path.split("/").at(-1).replace(/\.md$/, ""),
      description: meta.description || "",
      scope: meta.scope || "",
      content: minify ? minifyMarkdown(raw) : raw,
    });
  }

  const agents = [];
  for (const path of manifest.agents ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    agents.push({
      path,
      name: meta.name || path.split("/").at(-2),
      title: meta.title || "",
      role: meta.role || "",
      description: meta.description || "",
      content: minify ? minifyMarkdown(raw) : raw,
    });
  }

  const knowledge = [];
  for (const path of manifest.knowledge ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    knowledge.push({
      path,
      id: meta.id || "",
      title: meta.title || "",
      type: meta.type || "",
      status: meta.status || "",
      content: minify ? minifyMarkdown(raw) : raw,
    });
  }

  const schemas = {};
  for (const path of manifest.schemas ?? []) {
    const schemaName = path.split("/").at(-1).replace(/\.schema\.json$/, "");
    schemas[schemaName] = await readJson(path);
  }

  const templates = {};
  for (const path of manifest.templates ?? []) {
    const templateName = path.split("/").at(-1).replace(/\.md$/, "");
    templates[templateName] = await readText(path);
  }

  const decisions = [];
  for (const path of manifest.decisions ?? []) {
    const raw = await readText(path);
    const meta = frontmatter(raw) || {};
    decisions.push({
      path,
      title: meta.title || path.split("/").at(-1).replace(/\.md$/, ""),
      status: meta.status || "",
      content: minify ? minifyMarkdown(raw) : raw,
    });
  }

  const rawJsonPayload = JSON.stringify({
    schemaVersion: 1,
    contextVersion: manifest.contextVersion,
    generatedAt: new Date().toISOString(),
    lockDigest: lock.digest,
    inventory: {
      ruleCount: rules.length,
      skillCount: skills.length,
      workflowCount: workflows.length,
      agentCount: agents.length,
      knowledgeCount: knowledge.length,
      schemaCount: Object.keys(schemas).length,
      templateCount: Object.keys(templates).length,
      decisionCount: decisions.length,
    },
    orchestrationContract: await readText(manifest.orchestrationContract),
    rules,
    skills,
    workflows,
    agents,
    knowledge,
    schemas,
    templates,
    decisions,
  });

  const bundleDigest = `sha256:${sha256(rawJsonPayload)}`;
  const estimatedTokens = Math.round(rawJsonPayload.length / 3.8);

  const finalBundle = {
    bundleDigest,
    estimatedTokens,
    ...JSON.parse(rawJsonPayload),
  };

  const destination = isAbsolute(out) ? out : resolve(root, out);
  await mkdir(dirname(destination), { recursive: true });

  let fileContent = "";
  if (format === "json") {
    fileContent = minify
      ? JSON.stringify(finalBundle)
      : `${JSON.stringify(finalBundle, null, 2)}\n`;
  } else {
    // Markdown export format
    fileContent = `# Context Factory Bundle v${manifest.contextVersion}\n\nDigest: ${bundleDigest}\nTokens: ~${estimatedTokens}\n\n`
      + `## Rules\n\n` + rules.map((r) => `### ${r.name}\n${r.content}`).join("\n\n---\n\n")
      + `\n\n## Skills\n\n` + skills.map((s) => `### ${s.name}\n${s.content}`).join("\n\n---\n\n");
  }

  await writeFile(destination, fileContent, "utf8");

  return {
    destination,
    contextVersion: manifest.contextVersion,
    lockDigest: lock.digest,
    bundleDigest,
    bytes: Buffer.byteLength(fileContent),
    estimatedTokens,
    counts: finalBundle.inventory,
  };
}

function minifyMarkdown(str) {
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
