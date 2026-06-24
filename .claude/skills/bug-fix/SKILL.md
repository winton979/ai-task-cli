---
name: bug-fix
description: Fix the latest active bug brief and validate the result. Archive automatically when complete.
user-invocable: true
---

Purpose

Fix a bug from the latest file in .ai/bugs/active/.

Rules

1. Read the latest relevant brief from .ai/bugs/active/.
2. Minimize changes.
3. Avoid unrelated refactoring.
4. Fix root cause, not symptoms.
5. Preserve existing behavior.
6. Explain reasoning.
7. Validate the fix before stopping.
8. If the bug is fixed, archive the brief automatically by moving it to .ai/bugs/archive/.

Output

## Root Cause

Confirmed cause.

## Fix

Changes made.

## Validation

Verification performed.

