---
name: task-fast
description: Fast path for small requirements. Clarify quickly, create the brief, implement, and verify. Archive automatically on completion.
user-invocable: true
---

Purpose

Handle a small requirement in one continuous workflow with minimal ceremony.

Workflow

1. If a Grill Me compatible skill is available in the current environment, use it for requirement clarification.
2. If no Grill Me compatible skill is available, clarify the requirement yourself with focused questions just far enough to remove ambiguity.
3. Create a concise task brief and save it to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

4. Show the brief before coding.
5. If the user does not object, implement immediately.
6. Verify the result against the acceptance criteria.
7. Archive the brief automatically by moving it to:

.ai/tasks/archive/YYYY-MM-DD-task-name.md

8. Summarize the outcome and any follow-up risks.

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
* No architecture digression
* Only information required for execution

Output

TASK_DONE
