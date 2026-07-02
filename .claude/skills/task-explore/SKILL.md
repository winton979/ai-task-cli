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
6. Before writing the brief, inspect .ai/decisions/decisions.md if it exists and has entries. Pull in only decisions that materially constrain this task.
7. Once the requirement is clear, generate a concise task brief and save it to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

8. Show the saved brief and stop.

Decision Intake

Before finalizing the brief, inspect .ai/decisions/decisions.md if it exists and contains real entries beyond the title.

Use it narrowly:

* extract only decisions that materially constrain this task
* ignore unrelated historical notes
* treat the file as a source of durable project invariants, not as a second specification
* if relevant decisions exist, summarize them briefly in Context or Constraints instead of copying them verbatim

Complexity Assessment

Before finalizing the brief, assess whether the requirement justifies added complexity.

* Treat added complexity as a cost that must be justified by the requirement.
* Flag any indication that the requirement may require:

  - new project-wide capability
  - new dependency
  - cross-cutting architectural change

  as a Risk, not a plan.
* When complexity appears justified, do not design the solution here. Simply record that additional implementation effort is likely required.

Task Brief Format

# Goal

What should be achieved.

# Context

Relevant project background.

# Constraints

Business or technical limitations. When materially supported by the exploration, record complexity expectations such as:

- A new dependency does not currently appear necessary.
- Existing project boundaries likely remain sufficient.
- Cross-cutting changes do not currently appear justified.

# Risks

Potential pitfalls.

# Acceptance Criteria

Clear success conditions.

Requirements

* Maximum 500 words
* No code
* No architecture design
* Stay implementation-agnostic; describe constraints, not solutions
* Only information required for execution

When complete output:

TASK_READY
