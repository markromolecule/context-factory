---
name: git-commit
description: Create focused, reviewable Conventional Commits and ship repository changes without modifying unrelated user work.
scope: Git commits, commit messages, git push, repository shipping, and change-set preparation.
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
   - Use imperative, present-tense verbs (`add`, `fix`, `update`, `refactor` — not `added`, `fixes`, `updating`).
   - Keep the subject lowercase after the colon (except for proper nouns, acronyms, or IDs).
   - Do not end the subject line with a period (`.`).
   - Limit the subject line to 50–72 characters maximum.
2. **Scope (Optional):**
   - Use lowercase nouns indicating the affected module, component, or domain (e.g., `feat(auth):`, `fix(api):`, `docs(rules):`).
3. **Body (Optional):**
   - Separate the subject from the body with a single blank line.
   - Explain *why* the change was made and the context/consequences, not just restating what the diff shows.
   - Wrap body lines at 72 characters.
4. **Breaking Changes:**
   - Indicate breaking changes by adding `!` before the colon (e.g., `feat(api)!: remove v1 endpoints`) or prefixing the footer with `BREAKING CHANGE: <explanation>`.
5. **AI / IDE Commit Message Generation:**
   - When generating commit messages (such as clicking "Generate Commit Message" in Trae, Cursor, or similar IDEs), generate **only** the raw commit message text.
   - Do not wrap the commit message in markdown code fences (` ``` `), commentary, or conversational filler.
   - Focus exclusively on the staged diff; never summarize unstaged or unrelated files.
   - Ensure atomic, coherent changes: if multiple disparate changes are detected, identify the primary change or recommend splitting into separate commits.
6. **Safety & Hygiene:**
   - Commit only when the user or workflow explicitly authorizes it.
   - Inspect `git status` and `git diff` before staging; never stage secrets, `.env` files, or unintended files.
   - Never use `--no-verify` to bypass pre-commit hooks or force push to shared branches without explicit approval.
