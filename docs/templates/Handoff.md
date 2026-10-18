---
title: "{{title}}"
type: handoff
created: "{{iso_timestamp}}"
branch: "{{branch}}"
head: "{{head_commit}}"
dirty_files: {{dirty_count}}
plan: "{{plan_id or none}}"
unit: "{{unit_id or none}}"
---

# Goal - what we're trying to build
<!-- 1-2 sentences on what we are building, then binary done-criteria. -->
{{goal}}

Done when:

- [ ] {{criterion}}

## Current State - where the work stands right now
<!-- Verification must name the command and its result. Use passing | failing | unverified. -->
- **Branch:** `{{branch}}` (HEAD: `{{head_commit}}`)
- **Verification:** {{status}} (`{{command}}` -> {{result}})
- **Blockers / needs user decision:** none

## Files in flight - active files being modified
<!-- Repo-relative paths only. Say what is half-done in each. -->
- `{{relative/path}}`: {{what is half-done}}

## Changes - what's been touched this session
<!-- What changed and why. Include decisions with rationale. No diffs. -->
- {{change}}: {{reason}}

## Failed attempts - why didnt work and why
<!-- One entry per failure. Write "none" if nothing failed. -->
- Tried: {{approach}} | Error: {{message}} | Cause: {{root cause}} | Retry only if: {{condition}}

## Next steps - the single next thing to try
<!-- Exactly one action. Include the expected result. -->
{{command or edit}}. Expected: {{result}}.
