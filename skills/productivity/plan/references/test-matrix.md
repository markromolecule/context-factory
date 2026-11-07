# Choosing verification for a unit

Read when assigning unit tests. Choose by changed seam, and state what a missed failure would look like. Use the host's actual configured commands; do not invent a test runner.

| Change | Verification to consider |
|---|---|
| Isolated function or module behavior | Unit cases for success, boundaries, and brief-specified errors |
| Component, process, network, or database seam | Integration test with realistic collaborators |
| Layering or dependency boundary | Architecture test or explicit dependency checklist |
| Public API, schema, event, or CLI contract | Contract tests and affected consumer checks |
| Data schema or stored state | Forward migration and rollback tests |
| Authorization, permissions, or untrusted input | Negative and abuse cases |
| Hot path, latency budget, or query indexing | Benchmark with an explicit threshold |
| Complete user journey or CLI workflow | End-to-end or acceptance test |
| Behavior-preserving refactor | Existing tests; characterization tests first if current behavior is insufficiently covered |

Record each selected type with a concrete case and command. Explain why a category is unnecessary when its seam is present but cannot reasonably be exercised in the unit.
