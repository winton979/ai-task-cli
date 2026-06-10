import { readFileSync } from 'node:fs';

const SKILLS = {
  'task-fast': {
    name: 'task-fast',
    description: 'Fast path for small requirements. Invoke Grill Me, generate task brief, save to .ai/tasks/active/.',
    content: `---
name: task-fast
description: Fast path for small requirements. Invoke Grill Me, generate task brief, save to .ai/tasks/active/.
user-invocable: true
---

Purpose

Fast path for small requirements and optimizations.

Workflow

1. Invoke the installed Grill Me skill.
2. Continue requirement clarification until Grill Me completes.
3. Generate a task brief automatically.
4. Save the brief to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

5. Present the brief.
6. Wait for approval before implementation.

Output

TASK_BRIEF_READY
`,
  },

  'task-explore': {
    name: 'task-explore',
    description: 'Clarify requirements before implementation. Invoke Grill Me until the task is understood.',
    content: `---
name: task-explore
description: Clarify requirements before implementation. Invoke Grill Me until the task is understood.
user-invocable: true
---

Purpose

Clarify requirements before implementation.

Workflow

1. Invoke the installed Grill Me skill.
2. Continue until Grill Me determines the task is sufficiently understood.
3. Do not write code.
4. Do not create implementation plans.
5. Focus only on requirement clarification.

When complete output:

TASK_READY
`,
  },

  'task-brief': {
    name: 'task-brief',
    description: 'Convert a completed Grill Me discussion into a concise task brief saved to .ai/tasks/active/.',
    content: `---
name: task-brief
description: Convert a completed Grill Me discussion into a concise task brief saved to .ai/tasks/active/.
user-invocable: true
---

Purpose

Convert the completed Grill Me discussion into a concise execution brief.

Save Location

.ai/tasks/active/YYYY-MM-DD-task-name.md

Naming Convention

YYYY-MM-DD-short-task-name.md

Example

2026-06-10-resize-handle.md

Output Format

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
* No implementation details
* No architecture design
* Only information required for execution

After generation:

1. Save the file.
2. Show the content.
3. Wait for approval.
`,
  },

  'task-implement': {
    name: 'task-implement',
    description: 'Implement the task using task.md. Follow acceptance criteria strictly.',
    content: `---
name: task-implement
description: Implement the task using task.md. Follow acceptance criteria strictly.
user-invocable: true
---

Purpose

Implement the task using task.md.

Rules

1. Follow task.md strictly.
2. Follow acceptance criteria strictly.
3. Prefer minimal changes.
4. Respect existing project conventions.
5. Avoid unnecessary refactoring.
6. State assumptions explicitly.
7. Keep implementation focused.

Output

## Plan

Short implementation plan.

## Changes

Files modified.

## Validation

How acceptance criteria were satisfied.
`,
  },

  'task-review': {
    name: 'task-review',
    description: 'Review implementation against task.md. Evaluate completion, edge cases, maintainability, and risks.',
    content: `---
name: task-review
description: Review implementation against task.md. Evaluate completion, edge cases, maintainability, and risks.
user-invocable: true
---

Purpose

Review implementation against task.md.

Evaluate

1. Goal completion
2. Acceptance criteria coverage
3. Edge cases
4. Maintainability
5. Performance impact
6. Security impact
7. Regression risks

Output

## Pass/Fail

Overall assessment.

## Findings

Issues found.

## Suggestions

Optional improvements.

## Missing Acceptance Criteria

Anything not fully implemented.
`,
  },

  'bug-explore': {
    name: 'bug-explore',
    description: 'Investigate a bug before fixing it. Identify root cause candidates, separate observed vs expected behavior.',
    content: `---
name: bug-explore
description: Investigate a bug before fixing it. Identify root cause candidates, separate observed vs expected behavior.
user-invocable: true
---

Purpose

Investigate a bug before fixing it.

Rules

1. Do not write code.
2. Do not suggest fixes immediately.
3. Identify root cause candidates.
4. Ask one question at a time.
5. Request evidence whenever possible.
6. Separate:

   * observed behavior
   * expected behavior
   * assumptions

When sufficient evidence exists output:

BUG_READY
`,
  },

  'bug-brief': {
    name: 'bug-brief',
    description: 'Summarize bug investigation into a brief saved to .ai/bugs/active/.',
    content: `---
name: bug-brief
description: Summarize bug investigation into a brief saved to .ai/bugs/active/.
user-invocable: true
---

Purpose

Summarize bug investigation.

Save Location

.ai/bugs/active/YYYY-MM-DD-bug-name.md

Naming Convention

YYYY-MM-DD-short-bug-name.md

Example

2026-06-10-iframe-resize.md

Output Format

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

After generation

1. Save the file.
2. Show the content.
3. Wait for approval.
`,
  },

  'bug-fix': {
    name: 'bug-fix',
    description: 'Fix the bug using bug.md. Minimize changes, fix root cause not symptoms.',
    content: `---
name: bug-fix
description: Fix the bug using bug.md. Minimize changes, fix root cause not symptoms.
user-invocable: true
---

Purpose

Fix the bug using bug.md.

Rules

1. Minimize changes.
2. Avoid unrelated refactoring.
3. Fix root cause, not symptoms.
4. Preserve existing behavior.
5. Explain reasoning.

Output

## Root Cause

Confirmed cause.

## Fix

Changes made.

## Validation

Verification performed.
`,
  },

  'bug-review': {
    name: 'bug-review',
    description: 'Review bug fix against bug.md. Check root cause, regression risks, side effects.',
    content: `---
name: bug-review
description: Review bug fix against bug.md. Check root cause, regression risks, side effects.
user-invocable: true
---

Purpose

Review implementation against bug.md.

Check

1. Root cause addressed
2. Regression risks
3. Side effects
4. Edge cases
5. Test coverage

Output

## Pass/Fail

Assessment.

## Risks

Potential issues.

## Recommendations

Further improvements.
`,
  },

  'decision-log': {
    name: 'decision-log',
    description: 'Record implementation decisions to .ai/decisions/decisions.md. Append-only, max 10 lines per entry.',
    content: `---
name: decision-log
description: Record implementation decisions to .ai/decisions/decisions.md. Append-only, max 10 lines per entry.
user-invocable: true
---

Purpose

Record important implementation decisions.

Save Location

.ai/decisions/decisions.md

Append Format

## YYYY-MM-DD

### Problem

What issue was encountered.

### Decision

What was chosen.

### Reason

Why this choice was made.

### Alternatives Considered

What alternatives were rejected.

Requirements

* Maximum 10 lines per decision
* Append only
* Keep concise
`,
  },
};

export function init(cwd, { fs, path, log }) {
  // Directory structure
  const dirs = [
    '.ai',
    '.ai/tasks/active',
    '.ai/tasks/archive',
    '.ai/bugs/active',
    '.ai/bugs/archive',
    '.ai/decisions',
    '.claude/skills',
  ];

  log.info('Creating directory structure...');
  for (const dir of dirs) {
    const full = path.join(cwd, dir);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      log.chalk.green(`  ✓ ${dir}`);
    } else {
      log.chalk.dim(`  - ${dir} (exists)`);
    }
  }

  // Create decisions.md placeholder
  const decisionsPath = path.join(cwd, '.ai/decisions/decisions.md');
  if (!fs.existsSync(decisionsPath)) {
    fs.writeFileSync(decisionsPath, '# Decisions Log\n\n');
    log.chalk.green('  ✓ .ai/decisions/decisions.md');
  } else {
    log.chalk.dim('  - .ai/decisions/decisions.md (exists)');
  }

  // Create skill files
  log.info('\nInstalling workflow skills...');
  for (const [key, skill] of Object.entries(SKILLS)) {
    const skillDir = path.join(cwd, '.claude/skills', skill.name);
    const skillFile = path.join(skillDir, 'SKILL.md');

    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    if (!fs.existsSync(skillFile)) {
      fs.writeFileSync(skillFile, skill.content);
      log.chalk.green(`  ✓ ${skill.name}`);
    } else {
      log.chalk.dim(`  - ${skill.name} (exists)`);
    }
  }

  // Create or append .gitignore
  const gitignorePath = path.join(cwd, '.gitignore');
  const gitignoreEntry = '\n# task workflow\n.ai/tasks/active/*.md\n.ai/bugs/active/*.md\n';
  let existing = '';
  if (fs.existsSync(gitignorePath)) {
    existing = fs.readFileSync(gitignorePath, 'utf-8');
  }
  if (!existing.includes('# task workflow')) {
    fs.writeFileSync(gitignorePath, existing.trimEnd() + gitignoreEntry);
    log.chalk.green('  ✓ .gitignore updated');
  }

  log.info(`\nTask workflow initialized. Skills available:
  task:  fast, explore, brief, implement, review
  bug:   explore, brief, fix, review
  other: decision-log`);
}