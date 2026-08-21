# Context Factory Application Layer (`app/`)

This directory contains the operational tools, applications, and CLI utilities for maintaining, compiling, evaluating, and bridging the **Context Factory** across repositories and IDEs.

## Packages

- **[`app/cli`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli)**: The core Context Factory CLI tool (`context-cli`). Provides commands for:
  - **`bridge`**: Cross-repository bridge generation (`AGENTS.md`, `.cursorrules`, `GEMINI.md`, `CLAUDE.md`, host doc scaffolds, and `package.json` scripts).
  - **`build` / `compile`**: Compiling the entire context factory into standalone bundles with token metrics.
  - **`validate` / `lint` / `doctor`**: Multi-stage linting, schema validation, and health diagnostics.
  - **`run` / `exec` / `resolve`**: 3-stage LLM context execution harness and deterministic matching.
  - **`eval`**: Unit and golden dataset evaluation test suites.
  - **`diff` / `lock`**: Checksum drift detection and lockfile management.
  - **`sync` / `export`**: Automated indexing, manifest synchronization, and package exports.
  - **`task`**: Phased task plan scaffolding and listing.

## Quick Start

```sh
# Run CLI directly
node app/cli/bin/context-cli.mjs --help

# Or via npm scripts
npm run cli -- --help
npm run bridge -- --help
npm run doctor
npm run build
```
