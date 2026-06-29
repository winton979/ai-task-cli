# task-cli

Lightweight task workflow for AI-assisted development.

Designed for:

* Claude Code
* Codex CLI
* Mature projects with frequent bug fixes and small feature iterations

Task CLI provides a lightweight alternative to heavyweight spec-driven workflows by combining:

* Requirement clarification (prefer Grill Me, fallback built in)
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

Task CLI can use a Grill Me compatible skill for requirement and bug exploration.

Recommended:

```bash
npx add-skill PJ-SBN-593844/skill-grill-me
```

Compatible Grill Me implementations may also work.

If no Grill Me compatible skill is installed, `task-fast`, `task-explore`, and `bug-explore` fall back to built-in clarification prompts.

When `.ai/decisions/decisions.md` contains real entries, those skills should inspect it before finalizing a brief and pull in only the decisions that materially constrain the current task or bug.

---

## Usage

```bash
task init
task refresh
task doctor
task --help
```

After initialization, Task CLI creates the `.ai/` workspace and installs workflow skills into both `.claude/skills/` and `.codex/skills/`.

Use `task refresh` in existing projects to remove and reinstall only the workflow skills managed by task-cli. It does not delete your `.ai` briefs, internal archives, or decision log.

Use `task doctor` to check whether the required directories exist, whether managed skills are missing or outdated, whether a local Grill Me companion was detected, and whether the `.gitignore` rules are present.

---

## Recommended Workflow

### Small Feature / Enhancement

```text
/task-fast
    ↓
clarify + brief + implement + validate
    ↓
/task-review
    or
/task-cancel
```

### Larger Requirement

```text
/task-explore
    ↓
TASK_READY
    ↓
/task-implement
    ↓
/task-review
    or
/task-cancel
```

### Bug Fix

```text
/bug-explore
    ↓
BUG_READY
    ↓
/bug-fix
    ↓
/bug-review
    or
/bug-cancel
```

---

## Available Skills

### Task Workflow

* task-fast
* task-explore
* task-implement
* task-review
* task-cancel

### Bug Workflow

* bug-explore
* bug-fix
* bug-review
* bug-cancel

### Other

* decision-log
* decision-sweep-weekly

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

## Weekly Decision Sweep

Calling `/decision-log` after every task is easy to forget. As a lower-friction alternative, run `decision-sweep-weekly` once per week (Friday is a natural fit):

```
/decision-sweep-weekly
```

The skill scans archived task and bug briefs from the past 7 days, judges which ones contain a decision worth keeping (cross-task impact, rejected alternatives, counter-intuitive choices, externally driven calls, or instructive cancellations), drafts the entries, and waits for confirmation before writing anything to `.ai/decisions/decisions.md`. When a draft overlaps with or updates an existing decision, it should present the old and new versions together and ask whether to append, revise, merge, supersede, or skip.

Use `decision-log` for in-the-moment recording and `decision-sweep-weekly` for periodic cleanup. Either alone is enough; using both is fine.

The decisions file is intentionally narrow. It is meant to hold durable project invariants and reusable constraints, not a running transcript of every local implementation choice. The default write mode should still be append, but revisions to existing entries are reasonable when explicitly reviewed and confirmed by the user.

## Philosophy

Task CLI is intentionally lightweight.

Instead of maintaining large specifications, it focuses on:

1. Clarifying requirements before coding
2. Capturing execution context in concise briefs
3. Executing with validation while archiving automatically in the background
4. Reviewing work against acceptance criteria
5. Keeping a lightweight decision history

The goal is to improve quality without slowing down iteration speed.

That decision history is meant to be selectively reusable. Explore and fast-path skills should consult it to avoid violating existing project decisions, but only the parts that materially constrain the current work belong in the new brief.

## Compared with OpenSpec-Style Workflows

Task CLI is designed as a lightweight alternative to heavier spec-driven systems such as OpenSpec.

Detailed specification workflows can improve alignment, traceability, and consistency. They are often the right choice for large initiatives, cross-team programs, and environments with strong process requirements.

The difficulty is that the same level of ceremony does not always fit day-to-day engineering work. For frequent bug fixes, small features, and fast iteration, the process can become heavier than the change itself. When that happens, maintenance overhead increases, documentation quality starts to drift, and teams gradually stop using the workflow as originally intended.

Task CLI takes a narrower and more pragmatic approach:

* clarify the requirement
* capture only the minimum useful brief
* execute against acceptance criteria
* review the result
* keep a lightweight decision trail

The goal is not to replace specification systems in every context. It is to provide a workflow that people will actually keep using during day-to-day engineering work.

## Strengths and Tradeoffs

Task CLI is optimized for execution speed and sustained adoption rather than full process coverage.

Strengths:

* much lower process overhead for bugs, small features, and short iterations
* easier to adopt in mature codebases where engineers already know the product context
* encourages real usage because the workflow is short enough to sustain
* keeps enough structure to improve clarity without forcing large documents

Tradeoffs:

* less suitable for large cross-team initiatives that need formal design traceability
* relies more on engineer judgment and review quality than a full specification process
* stores less long-form historical context than a dedicated spec repository

## Recommended Workflow Model

Task CLI keeps the user-facing flow short:

* `task-fast`
* `task-explore -> task-implement -> task-review` or `task-cancel`
* `bug-explore -> bug-fix -> bug-review` or `bug-cancel`

The `archive/` directories remain as internal storage. They are not separate user steps in the recommended workflow.

## Upgrading Existing Projects

If a project was initialized with an older version of task-cli, run:

```bash
task refresh
```

This will:

* keep `.ai/tasks`, `.ai/bugs`, and `.ai/decisions`
* remove only these managed skills from `.claude/skills/` and `.codex/skills/`: `task-fast`, `task-explore`, `task-implement`, `task-review`, `task-cancel`, `bug-explore`, `bug-fix`, `bug-review`, `bug-cancel`, `decision-log`, `decision-sweep-weekly`
* reinstall the latest versions of those skills

This avoids touching unrelated custom skills in the same project.

Before refreshing, you can inspect the current setup with:

```bash
task doctor
```

## License

MIT

> Task CLI does not install Grill Me automatically.
> Users remain free to choose any Grill Me compatible implementation, and the explore skills fall back to built-in clarification if none is installed.
