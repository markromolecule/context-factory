import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  parseRuleDescriptor,
  parseRuleCatalog
} from "../orchestrator/rules/descriptor-parser.mjs";
import { loadSchema, validateSchema } from "../orchestrator/validator.mjs";

describe("Unit 01.02: Rule Descriptor Parser and Pilot Rules", () => {
  describe("Inline Marker and Frontmatter Parsing", () => {
    it("parses valid Markdown with inline directive markers", async () => {
      const markdown = `---
ruleId: cf-rule-ts-type-safety
name: type-safety
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services"]
description: Strict TypeScript type safety rules.
---

# Type Safety

## Strict typing standards

- [directive:ts.type-safety.ban-any][mode:automated-blocking][verifier:typechecker] Ban any. Use unknown when incoming data types are indeterminate.
- [directive:ts.type-safety.no-loose-objects][mode:automated-blocking][verifier:typechecker] Avoid loose Object, object, or {} types.
`;

      const { descriptor, diagnostics, unsupported } = parseRuleDescriptor(
        markdown,
        "rules/typescript/common/type-safety.md"
      );

      assert.equal(diagnostics.filter((d) => d.level === "error").length, 0);
      assert.equal(descriptor.id, "cf-rule-ts-type-safety");
      assert.equal(descriptor.stack, "typescript");
      assert.equal(descriptor.directives.length, 2);

      const d1 = descriptor.directives[0];
      assert.equal(d1.id, "ts.type-safety.ban-any");
      assert.equal(d1.mode, "automated-blocking");
      assert.equal(d1.verifier.type, "typechecker");
      assert.match(d1.statement, /^Ban any\./);
      assert.match(d1.contentHash, /^sha256:[a-f0-9]{64}$/);
      assert.match(descriptor.sourceHash, /^sha256:[a-f0-9]{64}$/);

      // Contract test against rule-descriptor.schema.json
      const schema = await loadSchema("rule-descriptor.schema.json");
      const validation = validateSchema(descriptor, schema);
      assert.equal(validation.valid, true, `Schema validation errors: ${validation.errors.join(", ")}`);
    });

    it("rejects duplicate directive IDs", () => {
      const markdown = `---
ruleId: cf-rule-dup
stack: global
---
- [directive:ts.common.dup-id][mode:automated-blocking][verifier:linter] First statement.
- [directive:ts.common.dup-id][mode:automated-blocking][verifier:linter] Second statement with duplicate ID.
`;
      const { diagnostics } = parseRuleDescriptor(markdown, "rules/test.md");
      const error = diagnostics.find((d) => /duplicate.*directive.*id/i.test(d.message));
      assert.ok(error, "Expected duplicate directive ID diagnostic");
    });

    it("rejects invalid mode or verifier", () => {
      const markdown = `---
ruleId: cf-rule-invalid
stack: global
---
- [directive:ts.common.invalid-mode][mode:super-blocking][verifier:magic] Invalid mode and verifier.
`;
      const { diagnostics } = parseRuleDescriptor(markdown, "rules/test.md");
      assert.ok(diagnostics.some((d) => /mode/i.test(d.message)));
    });

    it("rejects directive marker without a statement", () => {
      const markdown = `---
ruleId: cf-rule-empty
stack: global
---
- [directive:ts.common.no-statement][mode:advisory][verifier:none]   
`;
      const { diagnostics } = parseRuleDescriptor(markdown, "rules/test.md");
      assert.ok(diagnostics.some((d) => /statement/i.test(d.message)));
    });

    it("reports unmarked guidance as unsupported without synthesizing advisory success (SC-08)", () => {
      const markdown = `---
name: legacy-rule
stack: typescript
---
# Legacy Rule
- Unmarked directive item that was not yet migrated.
- Another plain bullet item.
`;
      const { descriptor, unsupported } = parseRuleDescriptor(markdown, "rules/legacy.md");
      assert.equal(descriptor.directives.length, 0);
      assert.equal(unsupported.length, 2);
      assert.equal(unsupported[0].statement, "Unmarked directive item that was not yet migrated.");
    });
  });

  describe("Pilot Rule Files Contract Validation", () => {
    const pilotFiles = [
      "rules/typescript/common/type-safety.md",
      "rules/typescript/common/runtime-validation.md",
      "rules/typescript/common/module-and-imports.md",
      "rules/global/architecture-conformance.md"
    ];

    for (const rulePath of pilotFiles) {
      it(`parses pilot rule ${rulePath} and validates against schema`, async () => {
        const fullPath = join(process.cwd(), rulePath);
        const content = await readFile(fullPath, "utf8");
        const { descriptor, diagnostics } = parseRuleDescriptor(content, rulePath);

        const errors = diagnostics.filter((d) => d.level === "error");
        assert.equal(errors.length, 0, `Diagnostics errors in ${rulePath}: ${errors.map((e) => e.message).join("; ")}`);
        assert.ok(descriptor.directives.length > 0, `Expected at least one directive in ${rulePath}`);

        // Validate all directive IDs match dot-delimited lowercase convention
        for (const dir of descriptor.directives) {
          assert.match(dir.id, /^[a-z0-9]+(\.[a-z0-9_-]+)+$/, `Directive ID "${dir.id}" must be lowercase and dot-delimited`);
        }

        // Schema validation
        const schema = await loadSchema("rule-descriptor.schema.json");
        const validation = validateSchema(descriptor, schema);
        assert.equal(validation.valid, true, `Schema errors in ${rulePath}: ${validation.errors.join(", ")}`);
      });
    }

    it("computes catalog coverage reporting migrated vs unsupported directives", async () => {
      const catalog = await parseRuleCatalog(join(process.cwd(), "rules"));
      assert.ok(catalog.coverage.totalRules >= 4);
      assert.ok(catalog.coverage.migratedRules >= 4);
      assert.ok(catalog.coverage.totalDirectives > 0);
      assert.ok(catalog.coverage.unsupportedCount >= 0);
    });
  });
});
