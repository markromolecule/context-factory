import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { describe, it } from "node:test";
import { parseRuleCatalog } from "../orchestrator/rules/descriptor-parser.mjs";
import { resolveContext } from "../scripts/context-core.mjs";

const root = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const scopedDirectories = ["common", "foundation", "http", "application"];
const scopedPaths = new Set((await Promise.all(scopedDirectories.map(async (directory) => {
  const files = await readdir(join(root, "rules/laravel", directory));
  return files.filter((file) => file.endsWith(".md")).map((file) => `rules/laravel/${directory}/${file}`);
}))).flat());

describe("Unit 06.02: Laravel common, foundation, HTTP, and application catalog", () => {
  it("classifies every scoped rule with unique Laravel directives and registered evidence modes", async () => {
    const { descriptors, catalogDiagnostics } = await parseRuleCatalog(join(root, "rules"));
    const scoped = descriptors.filter((descriptor) => scopedPaths.has(descriptor.rulePath));
    const directiveIds = scoped.flatMap((descriptor) => descriptor.directives.map((directive) => directive.id));

    assert.equal(catalogDiagnostics.length, 0);
    assert.equal(scoped.length, scopedPaths.size);
    assert.ok(directiveIds.length >= scopedPaths.size);
    assert.equal(new Set(directiveIds).size, directiveIds.length);
    for (const descriptor of scoped) {
      assert.equal(descriptor.stack, "laravel");
      assert.match(descriptor.id, /^cf-rule-laravel-/);
      assert.ok(descriptor.directives.every((directive) => directive.id.startsWith("laravel.")));
    }
  });

  it("binds HTTP validation separately from application actions", async () => {
    const http = await resolveContext("Implement a Laravel FormRequest validation boundary", {
      stack: "laravel",
      scope: ["app/Http/Requests/StoreOrderRequest.php"],
    });
    const application = await resolveContext("Implement a Laravel order action", {
      stack: "laravel",
      scope: ["app/Modules/Orders/Actions/CreateOrderAction.php"],
    });

    assert.ok(http.binding.directives.some((directive) => directive.id === "laravel.http.validation-form-request"));
    assert.ok(!http.binding.directives.some((directive) => directive.id === "laravel.application.business-action"));
    assert.ok(application.binding.directives.some((directive) => directive.id === "laravel.application.business-action"));
    assert.ok(!application.binding.directives.some((directive) => directive.id === "laravel.http.validation-form-request"));
  });

  it("preserves policy prose while adding only frontmatter and directive markers", async () => {
    for (const path of scopedPaths) {
      const content = await readFile(join(root, path), "utf8");
      assert.match(content, /^ruleId:\s+cf-rule-laravel-/m, `${relative(root, path)} requires stable ruleId`);
      assert.match(content, /\[directive:laravel\./, `${relative(root, path)} requires a Laravel directive marker`);
    }
  });
});
