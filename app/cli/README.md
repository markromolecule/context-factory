# Context Factory CLI (`@app/cli`)

A zero-dependency, pure ESM command-line interface for maintaining, validating, evaluating, compiling, and bridging **Context Factory** across workspaces.

---

## Installation & Execution

The CLI is written in pure Node.js ESM without external dependencies. It works immediately out of the box with zero `npm install` requirements.

### Direct Node Invocation:
```sh
node app/cli/bin/context-cli.mjs <command> [options]
```

### Global CLI (via `npm link`):
```sh
npm link
context-cli --help
context-cli status
context-cli pull
```

### Via Root NPM Scripts:
```sh
npm run cli -- <command>
npm run bridge
npm run pull
npm run build
npm run doctor
npm run lint
npm run eval
npm run sync
npm run lock
npm run diff
```

---

## Command Reference

### 1. Pull Submodule Updates (`pull` / `update`)
Pulls the latest changes from upstream Context Factory and automatically validates health with `doctor`:
- When run inside a **host repository**, it updates the `.context-factory` submodule via `git submodule update --remote --merge`.
- When run inside the **factory repository**, it pulls latest changes from origin.
- Automatically verifies lockfile integrity, syntax, and evaluations post-pull.

```sh
# Pull updates in host repository or factory
context-cli pull

# Pull a specific branch from remote (e.g. master or main)
context-cli pull --branch master

# Automatically stash and restore uncommitted local changes
context-cli pull --autostash

# Use git rebase instead of merge
context-cli pull --rebase

# Skip post-pull doctor health verification
context-cli pull --no-doctor

# Machine-readable JSON output
context-cli pull --json
```

---

### 2. Cross-Repository Bridging (`bridge`)
Generates the complete bridging layer in any target/consumer repository:
- `AGENTS.md` (Universal orchestration contract for Antigravity, Cursor, Claude Code, and Copilot)
- `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`
- `docs/tasks/README.md` and `docs/decisions/README.md` (Host-scoped document scaffolds)
- `rules/README.md` (Host project rules override folder)
- `.context-bridge.json` (Host bridge configuration)
- Injects npm scripts (`context:resolve`, `context:doctor`, `context:bridge`, `context:update`) into host `package.json`.

```sh
# Generate bridge in current directory
context-cli bridge

# Generate bridge for a target repository
context-cli bridge --target ../my-host-app --method submodule

# Preview changes without writing
context-cli bridge --target ../my-host-app --dry-run

# Target specific IDE agent formats
context-cli bridge --target ../my-host-app --agents cursor,claude,gemini
```

---

### 3. Compilation & Bundling (`build` / `compile`)
Compiles the entire factory (rules, skills, workflows, agents, knowledge, schemas, templates, decisions) into a standalone, portable JSON or Markdown bundle with token estimates.

```sh
# Build bundle to default dist/context-bundle.json
context-cli build

# Custom output destination and minification
context-cli build --out dist/bundle.min.json --minify

# Output as JSON
context-cli build --json
```

---

### 4. Diagnostics & Health (`doctor`)
Runs a comprehensive multi-point health check across manifest linting, lockfile currency, and evaluation test suites.

```sh
context-cli doctor
```

---

### 5. Linting & Validation (`lint` / `validate`)
Validates schema compliance, frontmatter structure, required workflow sections, and broken links.

```sh
# Run full factory linter
context-cli lint

# Validate a specific JSON file against a schema
context-cli validate schemas/project-profile.schema.json --schema project-profile
```

---

### 6. Evaluation Suite (`eval` / `test`)
Runs unit evaluation cases (`evals/cases/`) and golden dataset executions (`evals/datasets/`).

```sh
# Run all evaluations
context-cli eval

# Run only unit evaluations
context-cli eval --unit

# Filter by test name or ID
context-cli eval --filter defect

# Run against a live provider
context-cli eval --provider openai --model gpt-4o
```

---

### 7. Drift & Lock Management (`diff` / `lock`)
Tracks and enforces consistency between disk files, `context-manifest.json`, and `context-lock.json`.

```sh
# Check if lockfile is current
context-cli lock --check

# Regenerate context-lock.json
context-cli lock

# Show diff / drift between disk and lockfile
context-cli diff
```

---

### 8. Automated Synchronization (`sync`)
Automatically scans directory trees, updates `context-manifest.json`, and regenerates `context-lock.json`.

```sh
context-cli sync
```

---

### 9. Context Resolution & Execution (`resolve` / `run`)
Deterministically resolves relevant context rules and executes 3-stage LLM runs.

```sh
# Resolve matching context for a prompt
context-cli resolve "implement user authentication with JWT"

# Execute a 3-stage LLM context run
context-cli run "implement user authentication" --provider mock
```

---

### 10. Task Scaffolding (`task`)
Manages task plans and phase breakdowns in `docs/tasks/`.

```sh
# Scaffold a new task plan
context-cli task new "Payment gateway integration" --type feature

# List active tasks
context-cli task list
```

---

### 11. Status Overview (`status`)
Displays high-level metrics, inventory counts, and lockfile state.

```sh
context-cli status
```
