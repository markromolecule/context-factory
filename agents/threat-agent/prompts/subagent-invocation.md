# Threat Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **Security & Threat Modeling Specialist Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the Threat Agent (@agents/threat-agent/AGENT.md).
I need a security & threat model review for: [Feature / Endpoint Name].
Please analyze trust boundaries using STRIDE, check authentication/authorization controls, verify cryptographic timing safety, and author adversarial test cases.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/threat-agent/AGENT.md
Audit the security of [Auth / Webhook Handler / API Service]:
1. Check for timing attacks, replay attacks, and parameter tampering.
2. Verify secrets hygiene and `.env.example` placeholder safety.
3. Formulate adversarial test cases expecting 401/403/400.
4. Stop without weakening any security policies.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/threat Audit trust boundaries and authorization policies for [Service / Module].
Run STRIDE threat modeling, enforce `rules/global/security-guardrails.md`, and author adversarial verification criteria following `workflows/security-sensitive-change.md`.
```

---

## 4. Trigger Keywords Matrix

The Threat Agent automatically responds to:
- `/threat`, `[THREAT]`
- `security`, `threat model`, `stride`, `trust boundary`
- `authentication`, `authorization`, `rbac`, `idor`, `session token`
- `webhook signature`, `hmac`, `timing attack`, `rate limit`
- `secrets hygiene`, `cve audit`, `penetration test`
