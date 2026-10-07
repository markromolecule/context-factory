import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "node:test";
import { parseRuleCatalog } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const root = process.cwd();
const scopedDirectories = ["database", "security", "presentation", "anti-patterns"];
const scopedPaths = new Set((await Promise.all(scopedDirectories.map(async (directory) => {
  const files = await readdir(join(root, "rules/laravel", directory));
  return files.filter((file) => file.endsWith(".md")).map((file) => `rules/laravel/${directory}/${file}`);
}))).flat());

describe("Unit 06.03: Laravel data, security, presentation, and anti-pattern catalog", () => {
  it("classifies every scoped rule with unique Laravel directives and no parser diagnostics", async () => {
    const { descriptors, catalogDiagnostics } = await parseRuleCatalog(join(root, "rules"));
    const scoped = descriptors.filter((descriptor) => scopedPaths.has(descriptor.rulePath));
    const directiveIds = scoped.flatMap((descriptor) => descriptor.directives.map((directive) => directive.id));

    assert.equal(catalogDiagnostics.length, 0);
    assert.equal(scoped.length, scopedPaths.size);
    assert.ok(directiveIds.length >= scopedPaths.size);
    assert.equal(new Set(directiveIds).size, directiveIds.length);
    assert.ok(scoped.every((descriptor) => descriptor.stack === "laravel"));
  });

  it("binds database, security, and presentation rules only to their declared file boundaries", async () => {
    const migration = await resolveContext("Implement a Laravel migration", { stack: "laravel", scope: ["database/migrations/2026_01_01_create_orders.php"] });
    const policy = await resolveContext("Implement a Laravel authorization policy", { stack: "laravel", scope: ["app/Policies/OrderPolicy.php"] });
    const blade = await resolveContext("Implement a Laravel Blade component", { stack: "laravel", scope: ["resources/views/components/order-card.blade.php"] });

    assert.ok(migration.binding.directives.some((directive) => directive.id === "laravel.database.migrations"));
    assert.ok(policy.binding.directives.some((directive) => directive.id === "laravel.security.authorization"));
    assert.ok(blade.binding.directives.some((directive) => directive.id === "laravel.presentation.blade-components"));
    assert.ok(!blade.binding.directives.some((directive) => directive.id === "laravel.database.migrations"));
  });

  it("makes trust and data constraints blocking while retaining explicit advisory guidance", async () => {
    const { descriptors } = await parseRuleCatalog(join(root, "rules"));
    const scoped = descriptors.filter((descriptor) => scopedPaths.has(descriptor.rulePath));
    const directives = scoped.flatMap((descriptor) => descriptor.directives);
    assert.ok(directives.some((directive) => directive.mode === "automated-blocking" || directive.mode === "evidence-blocking"));
    assert.ok(directives.some((directive) => directive.mode === "advisory"));
    for (const path of scopedPaths) {
      const content = await readFile(join(root, path), "utf8");
      assert.match(content, /^ruleId:\s+cf-rule-laravel-/m);
    }
  });
});
