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
context-cli init
context-cli status
context-cli pull
```

### Via Root NPM Scripts:
```sh
npm run cli -- <command>
npm run init
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

### 1. Interactive Project Initialization (`init`)
Launches the streamlined 3-step setup wizard to onboard and bridge Context Factory into any host repository:

1. **Submodule Integration:** Embed Context Factory into `.context-factory` via `git submodule add <url> .context-factory`. If run before submoduling, `init` detects the host environment and offers a hybrid assistant to automatically run or display the command.
2. **Auto-Detection:** Automatically detects whether it is running from within the submodule or from the host root, resolving target directories and relative paths seamlessly.
3. **Numbered Multi-Select IDE Menu:** Scans the host repository for existing editor folders (`.vscode/`, `.cursor/`, `.trae/`, `.agents/`) to recommend defaults, then presents an interactive numbered multi-select prompt:
   - `[1] VS Code` — Scaffolds `.github/copilot-instructions.md`, non-destructive `.vscode/settings.json`, `.vscode/extensions.json`, and `AGENTS.md`.
   - `[2] Antigravity` — Scaffolds `.agents/` live symlinks (`skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, `GEMINI.md`) and `.agents/skills.json`.
   - `[3] Cursor` — Scaffolds modern `.cursor/rules/context-factory.mdc` (with `alwaysApply: true`) alongside `.cursorrules` and `AGENTS.md`.
   - `[4] Trae` — Scaffolds `.trae/rules/project_rules.md` and `AGENTS.md`.
   - `[5] All IDEs` — Bridges all supported editors for mixed-editor teams.

Supports single digits (`1`), comma/space-separated digits (`1, 4` or `1 3`), or direct names (`vscode,trae`).

```sh
# Interactive guided setup (smart scanner & multi-select menu)
context-cli init

# Non-interactive initialization with explicit flags
context-cli init --target ../my-app --ide vscode,trae --method submodule
```

---

### 2. Cross-Repository Bridging (`bridge`)
Generates the complete bridging layer and editor configurations in any target host repository:
- **VS Code & GitHub Copilot:** `.github/copilot-instructions.md`, `.vscode/extensions.json`, and non-destructive JSON merge for `.vscode/settings.json` (preserves existing user font, theme, and tab preferences).
- **Trae AI IDE:** `.trae/rules/project_rules.md` referencing Context Factory's orchestrator contracts, rules, and workflows.
- **Cursor IDE:** Modern `.cursor/rules/context-factory.mdc` rules alongside legacy `.cursorrules`.
- **Antigravity & Gemini:** `.agents/` directory with relative symlinks to `skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, `GEMINI.md`, and `.agents/skills.json`.
- **Universal Entry Point:** `AGENTS.md` orchestrator contract and `docs/tasks/`, `docs/decisions/`, `rules/` scaffolds.
- **Bridge Configuration:** `.context-bridge.json` tracking configured IDE profiles and relative paths.
- **Host `package.json` Scripts:** Injects `context:resolve`, `context:doctor`, `context:update`, and `context:bridge`.

```sh
# Bridge current directory for all IDEs
context-cli bridge

# Bridge specific editors (e.g. Trae and VS Code)
context-cli bridge --target ../my-host-app --ide trae,vscode --method submodule

# Bridge targeting Antigravity specifically with Git Submodule
context-cli bridge --target ../my-host-app --ide antigravity --method submodule

# Bridge in local multi-repo workspace mode
context-cli bridge --target ../my-host-app --ide all --method linked

# Preview changes without writing
context-cli bridge --target ../my-host-app --dry-run

# Force recreation of symlinks and files
context-cli bridge --target ../my-host-app --force
```

---

### 3. Pull Submodule Updates & Auto-Heal (`pull` / `update`)
Pulls the latest changes from upstream Context Factory, auto-heals `.agents/` symlinks, and automatically validates health with `doctor`:
- When run inside a **host repository**, it updates the `.context-factory` submodule via `git submodule update --remote --merge`.
- Automatically restores any missing or broken symlinks.
- Automatically verifies lockfile integrity, syntax, and evaluations post-pull.

```sh
# Pull updates in host repository or factory
context-cli pull

# Pull a specific branch from remote
context-cli pull --branch master

# Automatically stash and restore uncommitted local changes
context-cli pull --autostash

# Use git rebase instead of merge
context-cli pull --rebase

# Skip post-pull doctor health verification
context-cli pull --no-doctor
```

---

### 4. Diagnostics, Health & Auto-Repair (`doctor`)
Runs a comprehensive multi-point health check across:
- **Manifest & Syntax Lint:** Validates YAML frontmatter, schema conformance, and catalog rules.
- **Lockfile Integrity:** Verifies `context-lock.json` against current repository hashes.
- **`.agents` Symlink Integrity:** Validates Antigravity live symlinks and `.agents/skills.json`.
- **Editor Artifact Integrity:** Audits existence and valid contents of Trae (`.trae/rules/project_rules.md`), VS Code (`.github/copilot-instructions.md`), Cursor (`.cursor/rules/context-factory.mdc`), Antigravity (`GEMINI.md`), and universal `AGENTS.md`.
- **Evaluation Suite:** Verifies 100% pass across core evaluation cases.

```sh
# Run doctor diagnostics
context-cli doctor

# Automatically repair broken or missing symlinks and regenerate missing editor rules
context-cli doctor --repair

# Check a specific host repository
context-cli doctor --target ../my-host-app

# Output machine-readable JSON
context-cli doctor --json
```

---

### 5. Automated Synchronization (`sync`)
Automatically scans directory trees, updates `context-manifest.json`, validates `.agents/` symlinks, and regenerates `context-lock.json`.

```sh
context-cli sync
```

---

### 6. Compilation & Bundling (`build` / `compile`)
Compiles the entire factory (rules, skills, workflows, agents, knowledge, schemas, templates, decisions) into a standalone, portable JSON bundle with token estimates.

```sh
# Build bundle to default dist/context-bundle.json
context-cli build

# Custom output destination and minification
context-cli build --out dist/bundle.min.json --minify
```

---

### 7. Linting & Validation (`lint` / `validate`)
Validates schema compliance, frontmatter structure, required workflow sections, and symlink integrity.

```sh
# Run full factory linter
context-cli lint

# Validate a specific JSON file against a schema
context-cli validate schemas/project-profile.schema.json --schema project-profile
```

---

### 8. Evaluation Suite (`eval` / `test`)
Runs unit evaluation cases (`evals/cases/`) and golden dataset executions (`evals/datasets/`).

```sh
# Run all evaluations
context-cli eval

# Run only unit evaluations
context-cli eval --unit
```

---

### 9. Drift & Lock Management (`diff` / `lock`)
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

### 10. Context Resolution & Execution (`resolve` / `run`)
Deterministically resolves relevant context rules and executes 3-stage LLM runs.

```sh
# Resolve matching context for a prompt
context-cli resolve "implement user authentication with JWT"

# Execute a 3-stage LLM context run
context-cli run "implement user authentication" --provider mock
```

---

### 11. Task Scaffolding (`task`)
Manages task plans and phase breakdowns in `docs/tasks/`.

```sh
# Scaffold a new task plan
context-cli task new "Payment gateway integration" --type feature

# List active tasks
context-cli task list
```

---

### 12. Status Overview (`status`)
Displays high-level metrics, inventory counts, and lockfile state.

```sh
context-cli status
```
