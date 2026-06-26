---
name: decision-log
description: Record implementation decisions to .ai/decisions/decisions.md. Append-only, max 10 lines per entry.
user-invocable: true
---

Purpose

Record important implementation decisions.

Only record decisions that are likely to matter beyond a single task. Good candidates are durable constraints, architecture boundaries, rejected alternatives someone may retry later, externally forced choices, and intentional behavior that otherwise looks incorrect.

Save Location

.ai/decisions/decisions.md

Append Format

## YYYY-MM-DD

### Problem

What issue was encountered.

### Decision

What was chosen.

### Reason

Why this choice was made.

### Alternatives Considered

What alternatives were rejected.

Requirements

* Maximum 10 lines per decision
* Append only
* Keep concise
