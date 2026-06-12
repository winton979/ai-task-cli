# task-cli

Lightweight task workflow for AI-assisted development.

Designed for:

* Claude Code
* Codex CLI
* Mature projects with frequent bug fixes and small feature iterations

Task CLI provides a lightweight alternative to heavyweight spec-driven workflows by combining:

* Requirement clarification (via Grill Me)
* Brief generation
* Implementation
* Review
* Decision logging

---

## Installation

```bash
npm install -g @winton979/task-cli
```

Initialize the workflow in your project:

```bash
task init
```

---

## Prerequisites

Task CLI relies on a Grill Me compatible skill for requirement exploration.

Recommended:

```bash
npx add-skill PJ-SBN-593844/skill-grill-me
```

Compatible Grill Me implementations may also work.

---

## Usage

```bash
task init
task refresh
task doctor
task --help
```

After initialization, Task CLI creates the `.ai/` workspace and installs workflow skills into both `.claude/skills/` and `.codex/skills/`.

Use `task refresh` in existing projects to remove and reinstall only the workflow skills managed by task-cli. It does not delete your `.ai` briefs, archives, or decision log.

Use `task doctor` to check whether the required directories exist, whether managed skills are missing or outdated, and whether the `.gitignore` rules are present.

---

## Recommended Workflow

### Small Feature / Enhancement

```text
/task-fast
    ↓
clarify + brief + implement + validate + archive
    ↓
/task-review
```

### Larger Requirement

```text
/task-explore
    ↓
TASK_READY
    ↓
/task-implement
    ↓
/task archived
    ↓
/task-review
```

### Bug Fix

```text
/bug-explore
    ↓
BUG_READY
    ↓
/bug-fix
    ↓
/bug archived
    ↓
/bug-review
```

---

## Available Skills

### Task Workflow

* task-fast
* task-explore
* task-implement
* task-review

### Bug Workflow

* bug-explore
* bug-fix
* bug-review

### Other

* decision-log

---

## Directory Structure

```text
.ai/
├── tasks/
│   ├── active/
│   └── archive/
│
├── bugs/
│   ├── active/
│   └── archive/
│
├── decisions/
│   └── decisions.md
│
├── .claude/skills/
└── .codex/skills/
```

---

## Philosophy

Task CLI is intentionally lightweight.

Instead of maintaining large specifications, it focuses on:

1. Clarifying requirements before coding
2. Capturing execution context in concise briefs
3. Executing with validation and lightweight archiving
4. Reviewing work against acceptance criteria
5. Keeping a lightweight decision history

The goal is to improve quality without slowing down iteration speed.


## Can This Be Simpler?

Yes. The main simplification is to collapse the old 4-step paths:

* `task-explore` now includes brief generation.
* `bug-explore` now includes bug brief generation.
* `task-implement` and `bug-fix` now validate and archive the brief when the work is complete.

That leaves these practical flows:

* Explore only: `/task-explore` or `/bug-explore`
* Execute and archive: `/task-implement` or `/bug-fix`
* Review: `/task-review` or `/bug-review`
* One-shot small work: `/task-fast`

## Upgrading Existing Projects

If a project was initialized with an older version of task-cli, run:

```bash
task refresh
```

This will:

* keep `.ai/tasks`, `.ai/bugs`, and `.ai/decisions`
* remove only these managed skills from `.claude/skills/` and `.codex/skills/`: `task-fast`, `task-explore`, `task-implement`, `task-review`, `bug-explore`, `bug-fix`, `bug-review`, `decision-log`
* reinstall the latest versions of those skills

This avoids touching unrelated custom skills in the same project.

Before refreshing, you can inspect the current setup with:

```bash
task doctor
```

> Task CLI does not install Grill Me automatically.
> Users remain free to choose any Grill Me compatible implementation.
