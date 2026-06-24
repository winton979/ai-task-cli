---
name: bug-explore
description: Investigate a bug and generate a fix brief in one step, without writing code.
user-invocable: true
---

Purpose

Investigate a bug and leave behind a ready-to-fix brief.

Rules

1. If a Grill Me compatible skill is available in the current environment, use it for bug exploration.
2. If no Grill Me compatible skill is available, ask focused questions and drive the investigation yourself.
3. Do not write code.
4. Do not suggest fixes before enough evidence exists.
5. Identify root cause candidates.
6. Request evidence whenever possible.
7. Separate:

   * observed behavior
   * expected behavior
   * assumptions

8. Once the bug is sufficiently understood, generate a brief and save it to:

.ai/bugs/active/YYYY-MM-DD-bug-name.md

9. Show the saved brief and stop.

Bug Brief Format

# Problem

Observed issue.

# Expected Behavior

Expected result.

# Suspected Root Cause

Most likely cause.

# Evidence

Supporting observations.

# Constraints

Technical limitations.

# Acceptance Criteria

Conditions proving the bug is fixed.

When sufficient evidence exists output:

BUG_READY
