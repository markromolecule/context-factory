---
name: forms-and-validation
description: Design efficient, accessible forms that prevent mistakes, preserve user effort, and make recovery clear.
scope: Forms, fields, validation schemas, form state, submission behavior, and form tests.
alwaysApply: false
---

# Forms and Validation

## Reduce effort

- Ask only for information required for the current outcome; defer optional or advanced fields through progressive disclosure.
- Use meaningful defaults, preserve previously entered values, and avoid asking for data the system already knows.
- Group fields by user intent, order them as the user thinks about the task, and use one-column flow unless comparison materially benefits from columns.
- Use visible labels. Placeholders may show examples but never replace labels.
- Mark required and optional fields consistently, explain unfamiliar constraints before input, and place help beside the field it supports.
- Choose semantic controls, `autocomplete`, `inputmode`, and input types that reduce typing and mobile errors.

## Validate helpfully

- Keep one authoritative validation contract across client and server where practical; the server remains authoritative.
- Validate on submit and after a field has been meaningfully interacted with. Do not show errors while a user is still typing an untouched value.
- Identify the field and describe the problem in text with a concrete correction. Do not rely on color, icons, or a toast alone.
- Associate errors and descriptions programmatically with their controls and set invalid state accessibly.
- On failed submission, preserve every valid value, show a form-level summary when multiple or non-field errors exist, and move focus to the summary or first invalid field.
- Map expected server errors to the relevant field or form message; reserve generic failure messages for genuinely unexpected errors.

## Submit safely

- Use a specific action label such as `Create project` rather than `Submit`.
- Allow users to attempt submission so validation can explain what remains. Disable submission only when action is impossible or while the same mutation is in flight, and communicate why.
- Prevent duplicate mutations, retain values on failure, and provide an actionable retry path.
- Close or reset a form only after confirmed success. Announce success programmatically and move focus to the new or changed content when that best continues the workflow.
- Warn before discarding meaningful unsaved changes; do not prompt for untouched or successfully saved forms.

## Verification

Test keyboard-only completion, mobile input behavior, autofill, valid submission, each meaningful validation class, server conflict errors, retry, duplicate-submit prevention, unsaved-change handling, and screen-reader error/status announcements.
