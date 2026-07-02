---
name: task-implement
description: Implement the latest active task brief and validate it. Archive automatically when complete.
user-invocable: true
---

Purpose

Implement a task from the latest file in .ai/tasks/active/.

Rules

1. Read the latest relevant brief from .ai/tasks/active/.
2. Follow the acceptance criteria strictly.
3. Prefer minimal changes.
4. Respect existing project conventions.
5. Avoid unnecessary refactoring.
6. State assumptions explicitly.
7. Validate the result before stopping.
8. If the work is complete, archive the brief automatically by moving it to .ai/tasks/archive/.

When making implementation decisions

* Reuse existing helpers, patterns, and APIs before introducing new ones.
* Before introducing a new abstraction, confirm that extending existing code would not satisfy the requirement.
* Choose the simplest implementation that satisfies the acceptance criteria.
* Introduce a new dependency or abstraction only when no in-project option exists, and state why.
* Do not optimize for hypothetical future reuse.

Output

## Plan

Short implementation plan.

## Changes

Files modified.

## Validation

How acceptance criteria were satisfied.

