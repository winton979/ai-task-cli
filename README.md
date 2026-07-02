# task-cli

A workflow methodology for AI coding agents.

Task CLI separates requirement exploration from implementation, so AI agents decide whether complexity is justified **before** they start coding.

**Explore** — Understand the problem. Assess whether additional complexity is warranted.
**Implement** — Solve the accepted problem with the least necessary complexity.
**Review** — Validate against the brief, not against new ideas introduced during coding.

Designed for:

* Claude Code
* Codex CLI
* Mature codebases with frequent bug fixes and small feature iterations

> **Core principle**
> Explore decides whether complexity is justified.
> Implement decides how to satisfy the requirement with the least necessary complexity.

---

## Why task-cli?

### Traditional AI Workflow

```text
Requirement → Solution Design → Code → Review
```

The AI often starts designing before the requirement is fully clarified. Complexity gets introduced during coding, and review happens against whatever the AI produced rather than against the original intent.

### task-cli Workflow

```text
Requirement
    ↓
Explore  ──►  Understand + Challenge
    ↓
Complexity Assessment  ──►  Is added complexity justified?
    ↓
Brief
    ↓
Implement  ──►  Simplest acceptable solution
    ↓
Review  ──►  Validate against the brief
```

Exploration and implementation are intentionally separated.

---

## Core Philosophy

Most AI coding agents fail because they mix exploration and implementation in the same conversation. Task CLI intentionally separates them.

| Stage                     | Question                                   |
| ------------------------- | ------------------------------------------ |
| Explore                   | What problem are we solving?               |
| Complexity Assessment     | Is additional complexity justified?        |
| Implement                 | What is the simplest acceptable solution?  |
| Review                    | Did we satisfy the brief?                  |

This keeps AI agents from over-designing solutions during requirement discovery, and keeps implementation focused on the accepted scope.

---

## Installation

```bash
npm install -g @winton979/task-cli
```

Initialize the workflow in your project:

```bash
task init
```

After initialization, Task CLI creates the `.ai/` workspace and installs workflow skills into both `.claude/skills/` and `.codex/skills/`.

### Prerequisites

Task CLI can use a Grill Me compatible skill for requirement and bug exploration.

Recommended:

```bash
npx add-skill PJ-SBN-593844/skill-grill-me
```

If no Grill Me compatible skill is installed, `task-fast`, `task-explore`, and `bug-explore` fall back to built-in clarification prompts.

---

## Quick Start

### Small Feature / Enhancement

```text
/task-fast
    ↓
clarify + brief + implement + validate
    ↓
/task-review   or   /task-cancel
```

### Larger Requirement

```text
/task-explore  →  TASK_READY  →  /task-implement  →  /task-review  or  /task-cancel
```

### Bug Fix

```text
/bug-explore  →  BUG_READY  →  /bug-fix  →  /bug-review  or  /bug-cancel
```

### CLI Commands

```bash
task init       # initialize workspace and install skills
task refresh    # reinstall managed skills without touching .ai content
task doctor     # check workspace state, skill versions, gitignore rules
task --help
```

---

## Example: Preventing Over-Engineering

**Requirement:** *"Add CSV export."*

### Without task-cli

Common AI behavior — jumps straight into designing:

* `ExportService`
* `ExportRepository`
* `CSVAdapter`
* `Factory`
* new dependency

**Files changed:** 7
**New abstractions:** 4

### With task-cli

Exploration runs first. Complexity Assessment determines that a new project-wide capability is not justified.

Implementation:

* reuse existing export path
* modify two files
* no new dependency

**Files changed:** 2
**New abstractions:** 0

The workflow encourages the simplest acceptable implementation instead of the most elaborate one.

---

## Available Skills

**Task Workflow**

* `task-fast`
* `task-explore`
* `task-implement`
* `task-review`
* `task-cancel`

**Bug Workflow**

* `bug-explore`
* `bug-fix`
* `bug-review`
* `bug-cancel`

**Decision Logging**

* `decision-log`
* `decision-sweep-weekly`

---

## Decision Logging

Task CLI keeps a lightweight decision trail in `.ai/decisions/decisions.md`. Explore and fast-path skills should consult it before finalizing a brief, and pull in only the decisions that materially constrain the current task or bug.

The decisions file is intentionally narrow. It holds durable project invariants and reusable constraints, not a running transcript of every local implementation choice.

### Weekly Decision Sweep

Calling `/decision-log` after every task is easy to forget. As a lower-friction alternative, run once per week (Friday is a natural fit):

```
/decision-sweep-weekly
```

The skill scans archived task and bug briefs from the past 7 days, judges which ones contain a decision worth keeping (cross-task impact, rejected alternatives, counter-intuitive choices, externally driven calls, or instructive cancellations), drafts the entries, and waits for confirmation before writing to `.ai/decisions/decisions.md`. When a draft overlaps with an existing decision, it presents both versions and asks whether to append, revise, merge, supersede, or skip.

Use `decision-log` for in-the-moment recording and `decision-sweep-weekly` for periodic cleanup. Either alone is enough.

---

## Directory Structure

```text
.ai/
├── tasks/
│   ├── active/
│   └── archive/
├── bugs/
│   ├── active/
│   └── archive/
└── decisions/
    └── decisions.md

.claude/skills/
.codex/skills/
```

The `archive/` directories are internal storage, not user-facing steps.

---

## Compared with OpenSpec-Style Workflows

Detailed specification workflows such as OpenSpec can improve alignment, traceability, and consistency for large initiatives, cross-team programs, and process-heavy environments.

The difficulty is that the same level of ceremony does not fit day-to-day engineering. For frequent bug fixes, small features, and fast iteration, the process becomes heavier than the change itself — maintenance overhead grows, documentation quality drifts, and teams gradually stop using the workflow as intended.

Task CLI takes a narrower approach: clarify the requirement, capture only the minimum useful brief, execute against acceptance criteria, review the result, and keep a lightweight decision trail. The goal is a workflow people will actually keep using.

---

## Strengths and Tradeoffs

**Strengths**

* much lower process overhead for bugs, small features, and short iterations
* easier to adopt in mature codebases where engineers already know the product
* encourages real usage because the workflow is short enough to sustain
* keeps enough structure to improve clarity without forcing large documents

**Tradeoffs**

* less suitable for large cross-team initiatives that need formal design traceability
* relies more on engineer judgment and review quality than a full spec process
* stores less long-form historical context than a dedicated spec repository

---

## Upgrading Existing Projects

If a project was initialized with an older version of task-cli, run:

```bash
task refresh
```

This will:

* keep `.ai/tasks`, `.ai/bugs`, and `.ai/decisions`
* remove only managed skills from `.claude/skills/` and `.codex/skills/`: `task-fast`, `task-explore`, `task-implement`, `task-review`, `task-cancel`, `bug-explore`, `bug-fix`, `bug-review`, `bug-cancel`, `decision-log`, `decision-sweep-weekly`
* reinstall the latest versions of those skills

Unrelated custom skills in the same project are left untouched. Inspect the current setup first with `task doctor`.

---

## License

MIT

> Task CLI does not install Grill Me automatically.
> Users remain free to choose any Grill Me compatible implementation, and the explore skills fall back to built-in clarification if none is installed.
