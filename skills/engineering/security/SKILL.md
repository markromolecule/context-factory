---
name: security
description: Threat-model and review application changes for trust-boundary, authorization, injection, secrets, data exposure, abuse, and dependency risks (/sec, /security, [SEC]).
---

# Security Review

## Workflow

1. Identify assets, actors, entry points, trust boundaries, privileged operations, sensitive data, and external dependencies in scope.
2. Trace untrusted data from entry to storage, output, logs, redirects, files, commands, and outbound requests.
3. Review authentication separately from action- and resource-level authorization, including tenant isolation and default-deny behavior.
4. Check validation, injection defenses, secret handling, public error redaction, concurrency and size limits, replay behavior, and dependency risk.
5. Rank findings by exploitability and impact. Cite the exact file and boundary, describe a credible abuse case, and recommend the smallest effective fix.
6. Add regression tests for fixed vulnerabilities and run the relevant verification suite.

## Output artifact

- Threat assessment and findings section in task ledger or dedicated audit artifact (`docs/security/YYYY-MM-DD-<slug>.md`).
- Negative / abuse-case regression tests verifying identified boundary defenses.

## Completion

A security review session is complete when:
- All entry points and trust boundaries in scope are traced.
- Verified findings are distinguished from general hardening suggestions.
- Exploitability and impact are ranked with concrete, reproducible abuse cases.
- Smallest safe mitigations and corresponding regression tests are identified.
- Zero unverified vulnerability or safety claims are made.
