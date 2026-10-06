---
ruleId: cf-rule-global-1-3-1
name: 1-3-1-rule
description: Compare one problem statement, three viable approaches, and one recommendation for material technical decisions.
scope: Architecture choices, risky tradeoffs, and ambiguous technical problems.
stack: global
appliesTo: ["docs/**/*.md", "docs/**/*.mdx"]
layers: ["documentation", "architecture"]
alwaysApply: false
---

# 1-3-1 Decision Framework

Use this framework only when a real decision remains. Do not force it onto routine edits, direct factual questions, or tasks whose approach is already specified.

## 1 — Define

- [directive:cf.global.1-3-1-define][mode:evidence-blocking][verifier:human-evidence] State the problem, evidence, constraints, and success condition in one compact section. Separate verified facts from assumptions.

## 3 — Compare

Offer exactly three viable approaches. For each, state:

- [directive:cf.global.1-3-1-compare-options][mode:evidence-blocking][verifier:human-evidence] State how it works, advantages, costs and failure modes, and when to choose it for each of the three viable approaches.

Make the options materially different. Do not pad the list with an obviously inferior choice.

## 1 — Recommend

- [directive:cf.global.1-3-1-recommend][mode:evidence-blocking][verifier:human-evidence] Choose one approach and justify it against current constraints, maintenance burden, reversibility, and complexity. Give concrete next steps and validation criteria.

If new evidence invalidates the comparison, revise the decision rather than defending the original recommendation.
