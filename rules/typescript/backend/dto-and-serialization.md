---
ruleId: cf-rule-ts-dto-and-serialization
name: dto-and-serialization
description: Keep each backend operation's validated request, domain values, persistence inputs, and public response explicitly separate.
scope: Backend request schemas, DTO types, controllers, response mappers, and serialized API outputs.
stack: typescript
appliesTo: ["src/modules/**/*.schema.ts", "src/modules/**/*.types.ts", "src/modules/**/*.mapper.ts", "src/modules/**/*.controller.ts", "src/features/**/*.schema.ts", "src/features/**/*.types.ts", "src/features/**/*.mapper.ts", "src/features/**/*.controller.ts"]
layers: ["controllers", "services", "data"]
alwaysApply: true
---

# DTO and Serialization

## Per-operation boundary contract

- [directive:ts.dto.request-schema-boundary][mode:evidence-blocking][verifier:human-evidence] Define one operation request schema at the transport boundary and derive its request type from that schema. Use `ts.runtime-validation.parse-boundary-data` and `ts.runtime-validation.infer-types-from-schemas` for parsing and type derivation details.
- [directive:ts.dto.domain-persistence-separation][mode:evidence-blocking][verifier:human-evidence] Explicitly map validated request DTO values to domain values and persistence inputs. A service accepts domain values and typed dependencies; do not pass `req` or `res` into a service or use a transport DTO as a persistence model.
- [directive:ts.dto.public-response-whitelist][mode:evidence-blocking][verifier:human-evidence] Explicitly map domain or persistence values to a public response with a named whitelist of fields. An internal field is not serialized merely because it exists on a returned row; see `ts.controllers.no-leak-internals` for response-safety ownership.
- [directive:ts.dto.nullable-output-contract][mode:evidence-blocking][verifier:human-evidence] Define the public meaning of missing, `undefined`, and `null` for each response field. Keep optionality deliberate at the public boundary instead of forwarding storage representation.

## Reuse

- [directive:ts.dto.reuse-output-mappers][mode:advisory][verifier:none] Reuse the same explicit output mapper for a single result and each item in a collection when their public contract is the same.

Malformed input must not reach the service. Keep request parsing and validation rules in `runtime-validation.md`; keep controller error mapping in `controllers-and-routes.md` rather than repeating either policy here.
