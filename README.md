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
task --help
```

After initialization, Task CLI creates the `.ai/` workspace and installs workflow skills.

---

## Recommended Workflow

### Small Feature / Enhancement

```text
/task-fast
    ↓
Grill Me
    ↓
task brief generated
    ↓
/task-implement
    ↓
/task-review
```

### Larger Requirement

```text
/task-explore
    ↓
TASK_READY
    ↓
/task-brief
    ↓
/task-implement
    ↓
/task-review
```

### Bug Fix

```text
/bug-explore
    ↓
BUG_READY
    ↓
/bug-brief
    ↓
/bug-fix
    ↓
/bug-review
```

---

## Available Skills

### Task Workflow

* task-fast
* task-explore
* task-brief
* task-implement
* task-review

### Bug Workflow

* bug-explore
* bug-brief
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
└── skills/
```

---

## Philosophy

Task CLI is intentionally lightweight.

Instead of maintaining large specifications, it focuses on:

1. Clarifying requirements before coding
2. Capturing execution context in concise briefs
3. Reviewing work against acceptance criteria
4. Keeping a lightweight decision history

The goal is to improve quality without slowing down iteration speed.


> Task CLI does not install Grill Me automatically.
> Users remain free to choose any Grill Me compatible implementation.