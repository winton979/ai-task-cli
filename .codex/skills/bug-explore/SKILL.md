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

8. Before writing the brief, inspect .ai/decisions/decisions.md if it exists and has entries. Pull in only decisions that materially constrain the observed behavior, expected behavior, or likely root cause.
9. Once the bug is sufficiently understood, generate a brief and save it to:

.ai/bugs/active/YYYY-MM-DD-bug-name.md

10. Show the saved brief and stop.

Decision Intake

Before finalizing the brief, inspect .ai/decisions/decisions.md if it exists and contains real entries beyond the title.

Use it narrowly:

* extract only decisions that materially constrain this task
* ignore unrelated historical notes
* treat the file as a source of durable project invariants, not as a second specification
* if relevant decisions exist, summarize them briefly in Context or Constraints instead of copying them verbatim

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
