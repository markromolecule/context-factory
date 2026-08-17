Goal:

- I want to improve the harness for this context-factory.

You can say your thoughts about my idea, so, we are aligned together. 

Context:

- I have `context-factory` which has `docs/` folder that stores all the context information.

Implementation Plan:

- Use `grill-with-docs` to identify open questions and edge cases.
- Resolve and persist goals, scenarios, language, boundaries, and unknowns before `implementation-plan`.
- Do not begin production coding until the plan is approved.

Idea:

I want to include a 

[runner] file under the orhestrator that executes LLM calls & skill hooks. 
[validator] filer under the orchestrator that Validates output against /schemas

[datasets] folder under the evals/ that consist of Golden inputs/outputs
[run-evals] script under the evals/ that Runs workflows against test cases

[harness-cli] script under the script folder CLI entry point to test, build, and run