---
ruleId: cf-rule-global-git-commit
name: git-commit
description: Create focused, reviewable Conventional Commits and ship repository changes without modifying unrelated user work.
scope: Git commits, commit messages, git push, repository shipping, and change-set preparation.
stack: global
appliesTo: [".git/COMMIT_EDITMSG"]
layers: ["delivery"]
alwaysApply: false
---

# Git Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for all git commit messages. Commit message generators in IDEs (e.g., Trae, Cursor, Windsurf) and automated agents must adhere strictly to these rules.

## Commit Message Format

```text
<type>(<optional-scope>): <imperative subject>

[optional body explaining motivation and context]

[optional footer(s) / BREAKING CHANGE]
```

## Commit Types

| Type       | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `feat`     | A new feature, capability, or user-facing change                            |
| `fix`      | A bug fix or defect resolution                                               |
| `docs`     | Documentation changes only (e.g., README, inline docs, guides)               |
| `refactor` | Code refactoring that neither fixes a bug nor adds a feature                 |
| `perf`     | Performance optimization and efficiency improvements                         |
| `test`     | Adding, modifying, or refactoring test cases                                 |
| `build`    | Build system, dependency updates, or external package changes                |
| `ci`       | CI/CD workflows, automation scripts, and pipeline configurations             |
| `chore`    | Routine maintenance, tool configurations, and repo housekeeping              |
| `revert`   | Reverting a previous commit (include target commit hash in body)             |

## Rules and Constraints

1. **Header / Subject Line:**
   - [directive:cf.git.imperative-verbs][mode:automated-blocking][verifier:linter] Use imperative, present-tense verbs (`add`, `fix`, `update`, `refactor` — not `added`, `fixes`, `updating`).
   - [directive:cf.git.lowercase-subject][mode:automated-blocking][verifier:linter] Keep the subject lowercase after the colon (except for proper nouns, acronyms, or IDs).
   - [directive:cf.git.no-trailing-period][mode:automated-blocking][verifier:linter] Do not end the subject line with a period (`.`).
   - [directive:cf.git.subject-length-cap][mode:automated-blocking][verifier:linter] Limit the subject line to 50–72 characters maximum.
2. **Scope (Optional):**
   - [directive:cf.git.lowercase-scope][mode:automated-blocking][verifier:linter] Use lowercase nouns indicating the affected module, component, or domain (e.g., `feat(auth):`, `fix(api):`, `docs(rules):`).
3. **Body (Optional):**
   - [directive:cf.git.blank-line-before-body][mode:automated-blocking][verifier:linter] Separate the subject from the body with a single blank line.
   - [directive:cf.git.explain-why-in-body][mode:advisory][verifier:none] Explain *why* the change was made and the context/consequences, not just restating what the diff shows.
   - [directive:cf.git.wrap-body-width][mode:advisory][verifier:none] Wrap body lines at 72 characters.
4. **Breaking Changes:**
   - [directive:cf.git.breaking-change-syntax][mode:automated-blocking][verifier:linter] Indicate breaking changes by adding `!` before the colon (e.g., `feat(api)!: remove v1 endpoints`) or prefixing the footer with `BREAKING CHANGE: <explanation>`.
5. **AI / IDE Commit Message Generation:**
   - [directive:cf.git.raw-commit-message-text][mode:automated-blocking][verifier:test] When generating commit messages (such as clicking "Generate Commit Message" in Trae, Cursor, or similar IDEs), generate **only** the raw commit message text.
   - [directive:cf.git.no-markdown-fences][mode:automated-blocking][verifier:test] Do not wrap the commit message in markdown code fences (` ``` `), commentary, or conversational filler.
   - [directive:cf.git.focus-on-staged-diff][mode:evidence-blocking][verifier:human-evidence] Focus exclusively on the staged diff; never summarize unstaged or unrelated files.
   - [directive:cf.git.atomic-coherent-changes][mode:evidence-blocking][verifier:human-evidence] Ensure atomic, coherent changes: if multiple disparate changes are detected, identify the primary change or recommend splitting into separate commits.
6. **Safety & Hygiene:**
   - [directive:cf.git.authorized-commits-only][mode:evidence-blocking][verifier:human-evidence] Commit only when the user or workflow explicitly authorizes it.
   - [directive:cf.git.inspect-status-before-staging][mode:evidence-blocking][verifier:human-evidence] Inspect `git status` and `git diff` before staging; never stage secrets, `.env` files, or unintended files.
   - [directive:cf.git.no-bypass-hooks][mode:automated-blocking][verifier:test] Never use `--no-verify` to bypass pre-commit hooks or force push to shared branches without explicit approval.
