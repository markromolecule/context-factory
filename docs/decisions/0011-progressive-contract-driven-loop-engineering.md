---
title: Progressive Contract-Driven and Loop-Engineered Architecture
type: decision
status: accepted
created: 2026-08-20
tags: [adr, workflow, progressive-delivery, contract-driven, loop-engineering, testing]
---

# 0011 — Progressive Contract-Driven and Loop-Engineered Architecture

## Context

Monolithic code generation ("one-tap creation") frequently fails in production software because models attempt to scaffold complete full-stack systems in a single unverified pass. This creates hallucinated database fields, drifting DTO types, broken API contracts, zero test coverage, and regressions across modules. Furthermore, UI is often drafted before backend contracts are locked and validated on the client side.

## Options considered

1. **Monolithic Fullstack Scaffolding:** Generate all modules and UI simultaneously. Highly prone to cascading failures, unverified drift, and broken contracts.
2. **Horizontal Layer-by-Layer Scaffolding:** Build all database schemas, then all backend services, then all controllers, then all UI. Delays integration verification and creates cross-layer synchronization friction.
3. **Progressive Vertical-Slice Delivery with Dual-Loop Engineering:** Build one self-contained module at a time across its complete vertical slice (`routes → controllers → services → data` + DTOs). Run an Inner Loop for 4-layer testing and compiler diagnostics until 100% green, expose interactive Scalar documentation, validate lightweight client hooks (`useQuery`/`useMutation`), and run an Outer Loop regression gate before promoting to the next module.

## Decision

Adopt option 3. New projects and major capabilities must be built **progressively and incrementally, module-by-module**.

Key architectural pillars:
1. **Pre-planning Grilling Gate:** `@skills/grill-with-docs/SKILL.md` must run and resolve ambiguity before `@skills/implementation-plan/SKILL.md`.
2. **Vertical Module Architecture:** Every module adheres to `routes → controllers → services → data` + Zod DTOs.
3. **Dual-Loop Engineering:**
   - **Inner Loop (Micro Cycle):** Automated test-driven self-correction across 4 backend tiers (`*.data.test.ts`, `*.service.test.ts`, `*.controller.test.ts`, `*.routes.test.ts`) + `tsc --noEmit`.
   - **Outer Loop (Macro Cycle):** Definition of Done (DoD) verification and multi-module global regression testing before advancing from Module $N$ to Module $N+1$.
4. **Client Contract Smoke Test:** Expose verified endpoints in Scalar docs and validate client-side communication with typed `useQuery` / `useMutation` hooks before UI view drafting begins.

## Consequences

- Prevents "one-tap" big-bang failures and eliminates hallucinated types.
- Establishes rock-solid backend foundations with high diagnostic test granularity.
- Ensures all endpoints and client hooks are proven functional before UI drafting.
- Adds structured gating requirements per module phase.

## Validation and review date

Review after 10 modular project deliveries or by 2027-02-20. Measure test pass rates, schema drift incidents, regression counts during module promotion, and client integration friction.
