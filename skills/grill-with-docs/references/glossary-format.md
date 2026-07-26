# Domain Glossary Format

Use an existing project glossary when one exists. Otherwise create `CONTEXT.md` at the repository root unless the repository declares another canonical domain-language location.

```markdown
# Domain Context

One or two sentences defining the bounded context represented here.

## Language

**Canonical term**
: A concise, implementation-neutral definition stating what the concept is and where its boundary ends.

_Avoid_: ambiguous synonym, legacy synonym
```

## Rules

- Choose one canonical term for one concept.
- Define concepts in domain language, not class, table, endpoint, or framework language.
- Distinguish actors, records, events, states, policies, and operations.
- Record meaningful boundaries and invariants, but not feature requirements.
- Put scenarios, defaults, acceptance criteria, and implementation decisions in the task artifact.
- Remove or redirect conflicting synonyms rather than preserving accidental ambiguity.
