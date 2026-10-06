---
ruleId: cf-rule-ts-forms-and-validation
name: forms-and-validation
description: Design efficient, accessible forms that prevent mistakes, preserve user effort, and make recovery clear.
scope: Forms, fields, validation schemas, form state, submission behavior, and form tests.
stack: typescript
appliesTo: ["src/**/components/**/*.tsx", "src/**/forms/**/*.tsx", "app/**/*.tsx"]
layers: ["ui", "components"]
alwaysApply: false
---

# Forms and Validation

## Reduce effort

- [directive:ts.forms.progressive-disclosure][mode:advisory][verifier:none] Ask only for information required for the current outcome; defer optional or advanced fields through progressive disclosure.
- [directive:ts.forms.meaningful-defaults][mode:advisory][verifier:none] Use meaningful defaults, preserve previously entered values, and avoid asking for data the system already knows.
- [directive:ts.forms.logical-field-grouping][mode:advisory][verifier:none] Group fields by user intent, order them as the user thinks about the task, and use one-column flow unless comparison materially benefits from columns.
- [directive:ts.forms.visible-labels-required][mode:automated-blocking][verifier:test] Use visible labels. Placeholders may show examples but never replace labels.
- [directive:ts.forms.explain-constraints-beforehand][mode:evidence-blocking][verifier:human-evidence] Mark required and optional fields consistently, explain unfamiliar constraints before input, and place help beside the field it supports.
- [directive:ts.forms.semantic-input-types][mode:automated-blocking][verifier:linter] Choose semantic controls, `autocomplete`, `inputmode`, and input types that reduce typing and mobile errors.

## Validate helpfully

- [directive:ts.forms.authoritative-server-validation][mode:evidence-blocking][verifier:human-evidence] Keep one authoritative validation contract across client and server where practical; the server remains authoritative.
- [directive:ts.forms.validate-on-blur-or-submit][mode:evidence-blocking][verifier:human-evidence] Validate on submit and after a field has been meaningfully interacted with. Do not show errors while a user is still typing an untouched value.
- [directive:ts.forms.textual-error-descriptions][mode:automated-blocking][verifier:test] Identify the field and describe the problem in text with a concrete correction. Do not rely on color, icons, or a toast alone.
- [directive:ts.forms.programmatic-error-association][mode:automated-blocking][verifier:test] Associate errors and descriptions programmatically with their controls and set invalid state accessibly.
- [directive:ts.forms.preserve-values-and-focus-invalid][mode:automated-blocking][verifier:test] On failed submission, preserve every valid value, show a form-level summary when multiple or non-field errors exist, and move focus to the summary or first invalid field.
- [directive:ts.forms.map-server-errors-to-fields][mode:automated-blocking][verifier:test] Map expected server errors to the relevant field or form message; reserve generic failure messages for genuinely unexpected errors.

## Submit safely

- [directive:ts.forms.intent-specific-submit-label][mode:advisory][verifier:none] Use a specific action label such as `Create project` rather than `Submit`.
- [directive:ts.forms.disable-only-in-flight][mode:evidence-blocking][verifier:human-evidence] Allow users to attempt submission so validation can explain what remains. Disable submission only when action is impossible or while the same mutation is in flight, and communicate why.
- [directive:ts.forms.prevent-duplicate-submissions][mode:automated-blocking][verifier:test] Prevent duplicate mutations, retain values on failure, and provide an actionable retry path.
- [directive:ts.forms.reset-only-on-confirmed-success][mode:automated-blocking][verifier:test] Close or reset a form only after confirmed success. Announce success programmatically and move focus to the new or changed content when that best continues the workflow.
- [directive:ts.forms.warn-unsaved-changes][mode:evidence-blocking][verifier:human-evidence] Warn before discarding meaningful unsaved changes; do not prompt for untouched or successfully saved forms.

## Verification

Test keyboard-only completion, mobile input behavior, autofill, valid submission, each meaningful validation class, server conflict errors, retry, duplicate-submit prevention, unsaved-change handling, and screen-reader error/status announcements.
