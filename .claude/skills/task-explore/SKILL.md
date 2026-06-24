---
name: task-explore
description: Clarify a requirement and generate the execution brief in one step, without implementing.
user-invocable: true
---

Purpose

Clarify requirements and leave behind a ready-to-execute brief.

Workflow

1. If a Grill Me compatible skill is available in the current environment, use it for requirement exploration.
2. If no Grill Me compatible skill is available, explore the requirement yourself through focused questions.
3. Continue until the task is sufficiently understood.
4. Do not write code.
5. Do not create implementation details.
6. Once the requirement is clear, generate a concise task brief and save it to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

7. Show the saved brief and stop.

Task Brief Format

# Goal

What should be achieved.

# Context

Relevant project background.

# Constraints

Business or technical limitations.

# Risks

Potential pitfalls.

# Acceptance Criteria

Clear success conditions.

Requirements

* Maximum 500 words
* No code
* No architecture design
* Only information required for execution

When complete output:

TASK_READY
