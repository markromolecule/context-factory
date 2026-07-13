---
name: git-commit
description: Create focused, reviewable Conventional Commits without modifying unrelated user work.
scope: Git commits, commit messages, and change-set preparation.
alwaysApply: false
---

# Git Commits

- Commit only when the user or workflow authorizes it.
- Inspect status and diff before staging; never absorb unrelated changes.
- Prefer one coherent behavior change per commit.
- Use `<type>(<optional-scope>): <imperative description>`.
- Keep the subject concise, lowercase after the colon, and without a trailing period.
- Use `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`, or `revert` according to the actual change.
- Explain motivation and consequences in the body when the diff is not self-evident.
- Add `BREAKING CHANGE:` only when consumers must change.
- Never bypass hooks or rewrite shared history without explicit authorization.

Before reporting the commit, provide its hash, subject, verification status, and any intentionally uncommitted files.
