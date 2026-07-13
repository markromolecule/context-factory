---
name: security-review
description: Threat-model and review application changes for trust-boundary, authorization, injection, secrets, data exposure, abuse, and dependency risks.
---

# Security Review

## Workflow

1. Identify assets, actors, entry points, trust boundaries, privileged operations, sensitive data, and external dependencies in scope.
2. Trace untrusted data from entry to storage, output, logs, redirects, files, commands, and outbound requests.
3. Review authentication separately from action- and resource-level authorization, including tenant isolation and default-deny behavior.
4. Check validation, injection defenses, secret handling, public error redaction, concurrency and size limits, replay behavior, and dependency risk.
5. Rank findings by exploitability and impact. Cite the exact file and boundary, describe a credible abuse case, and recommend the smallest effective fix.
6. Add regression tests for fixed vulnerabilities and run the relevant verification suite.

## Output

Separate verified findings from hardening suggestions. Do not claim a vulnerability without a reachable path, and do not claim safety solely because a framework provides defaults.
