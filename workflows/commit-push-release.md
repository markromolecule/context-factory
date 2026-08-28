---
name: commit-push-release
description: Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.
scope: Version control lifecycle, change-set commit staging, remote synchronization, SemVer release tagging, and deployment triggers.
primaryAgent: devops-agent
participatingAgents: [pm-agent]
rules:
  - rules/global/git-commit.md
  - rules/global/evidence-and-claims.md
skills:
  - verify
  - execute
---

# Commit, Push & Release

## Triggers

Use when a developer or agent is ready to package, commit, push, or release completed and verified work to a remote repository.
Session triggers: `/ship`, `/commit-push-release`, `[SHIP]`, `[COMMIT_PUSH_RELEASE]`.

## Required inputs

- Working directory with tested, completed changes.
- Target branch name (e.g., `main`, `develop`, feature branch) and remote target (e.g., `origin`).
- Commit intent (feature, fix, chore, docs, refactor, perf) and optional scope module.
- Release version bump target (major, minor, patch, or release candidate tag) if releasing a new version.
- Fresh test and lint verification evidence from the active session.

## Applicable rules and skills

- **Rules:** `rules/global/git-commit.md`, `rules/global/security-guardrails.md`, `rules/global/evidence-and-claims.md`.
- **Skills:** `skills/verify/SKILL.md`.
- **Subagents:** `agents/devops-agent/AGENT.md` for CI/CD integration and deployment workflows.

## Phases

1. **Pre-Flight Verification & Cleanliness Check:**
   - Run linter, typecheck, and test suites to verify zero failures (`node scripts/context.mjs doctor` if context/rules were modified).
   - Inspect `git status` to identify all modified, added, and untracked files.
   - Verify that no secrets, `.env` files, private keys, credentials, or temporary build artifacts are present in untracked or modified files (`rules/global/security-guardrails.md`).

2. **Atomic Staging & Diff Inspection:**
   - Stage files intentionally and atomically (prefer specific file staging over blind `git add .` when unrelated files exist).
   - Inspect `git diff --cached` / `git diff --staged` to verify that only expected changes are staged and no unintended formatting or stray debug logs are included.

3. **Conventional Commit Authoring:**
   - Author a clean Conventional Commit message adhering to `rules/global/git-commit.md`:

     ```text
     <type>(<scope>): <imperative subject>

     [optional body explaining motivation and context]

     [optional footer(s) / BREAKING CHANGE]
     ```

   - Execute the commit (`git commit -m "..."`). Never use `--no-verify` to bypass pre-commit hooks.

4. **Remote Branch Synchronization & Push:**
   - Verify the current checked-out branch.
   - If working against a shared branch, pull latest upstream changes with rebase (`git pull --rebase origin <branch>`) to avoid merge conflicts.
   - Push committed changes to the upstream remote repository (`git push origin <branch>`).

5. **SemVer Release Tagging & Changelog (Release Delivery):**
   - If this commit represents a release milestone:
     - Update version numbers across package manifests (e.g., `package.json`, `context-manifest.json`).
     - Create an annotated Git tag per Semantic Versioning (`git tag -a vX.Y.Z -m "Release vX.Y.Z: <summary>"`).
     - Push the tag to remote (`git push origin vX.Y.Z`).
     - Compile release notes summarizing user-visible changes, fixes, and migration notes.

6. **Post-Release Verification & Pipeline Monitoring:**
   - Confirm remote branch received the push.
   - Monitor CI/CD workflow triggers (e.g., GitHub Actions pipeline).
   - Report final release candidate summary, commit hash, tag, and verification status.

## Quality gates

- Pre-commit verification (linting, tests, typechecking) passes with zero errors before staging.
- Staged diff contains zero secrets, tokens, credentials, or unapproved dependencies.
- Commit message strictly conforms to Conventional Commits specification.
- Remote push and tag creation are executed cleanly without bypassed pre-commit or pre-push hooks.

## Stop and escalation conditions

- **Stop immediately** if automated tests, typechecks, or lint checks fail. Fix the underlying issues before committing.
- **Stop immediately** if an untracked or modified `.env`, credential, or sensitive file is detected.
- **Stop for user authorization** before force-pushing or pushing to protected/production branches (e.g., `main`, `master`).
- **Stop and prompt** if merge conflicts arise during upstream rebase.

## Artifacts and completion

- Report commit hash, branch name, tag name (if released), summary of changes pushed, and link to CI/CD pipeline. Never claim a push or release occurred without executing the actual git commands and verifying output.
