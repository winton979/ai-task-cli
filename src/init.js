import chalk from 'chalk';

const TASK_ACTIVE_DIR = '.ai/tasks/active';
const TASK_ARCHIVE_DIR = '.ai/tasks/archive';
const BUG_ACTIVE_DIR = '.ai/bugs/active';
const BUG_ARCHIVE_DIR = '.ai/bugs/archive';
const DECISIONS_FILE = '.ai/decisions/decisions.md';
const CLAUDE_SKILLS_DIR = '.claude/skills';
const CODEX_SKILLS_DIR = '.codex/skills';
const GITIGNORE_BLOCK = [
  '# task workflow',
  '.ai/tasks/active/*.md',
  '.ai/bugs/active/*.md',
].join('\n');

const GRILL_ME_HINTS = [
  'grill-me',
  'skill-grill-me',
  'grill me',
];

const SKILLS = {
  'task-fast': {
    name: 'task-fast',
    description: 'Fast path for small requirements. Clarify quickly, create the brief, implement, and verify. Archive automatically on completion.',
    content: `---
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
`,
  },

  'task-explore': {
    name: 'task-explore',
    description: 'Clarify a requirement and generate the execution brief in one step, without implementing.',
    content: `---
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
`,
  },

  'task-implement': {
    name: 'task-implement',
    description: 'Implement the latest active task brief and validate it. Archive automatically when complete.',
    content: `---
name: task-implement
description: Implement the latest active task brief and validate it. Archive automatically when complete.
user-invocable: true
---

Purpose

Implement a task from the latest file in .ai/tasks/active/.

Rules

1. Read the latest relevant brief from .ai/tasks/active/.
2. Follow the acceptance criteria strictly.
3. Prefer minimal changes.
4. Respect existing project conventions.
5. Avoid unnecessary refactoring.
6. State assumptions explicitly.
7. Validate the result before stopping.
8. If the work is complete, archive the brief automatically by moving it to .ai/tasks/archive/.

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
    description: 'Review the latest task implementation against the corresponding task brief.',
    content: `---
name: task-review
description: Review the latest task implementation against the corresponding task brief.
user-invocable: true
---

Purpose

Review implementation against the corresponding task brief.

Rules

1. Use the latest matching brief from .ai/tasks/active/ or .ai/tasks/archive/.
2. Review the actual changes, not just the intent.

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

  'task-cancel': {
    name: 'task-cancel',
    description: 'Discard the current task analysis output and implementation changes for this attempt.',
    content: `---
name: task-cancel
description: Discard the current task analysis output and implementation changes for this attempt.
user-invocable: true
---

Purpose

Abandon the current task attempt completely.

Rules

1. Target only the current task attempt.
2. Discard the current task brief and any analysis artifacts created for this attempt.
3. Discard code changes made for this attempt.
4. Do not archive the task brief.
5. Do not keep partial implementation.
6. Do not preserve temporary conclusions from this attempt as accepted decisions.
7. Do not touch unrelated historical archives, other active briefs, or user-authored changes outside this attempt.
8. If the exact changed files are uncertain, stop and ask for confirmation before deleting or reverting anything.

Output

TASK_CANCELLED
`,
  },

  'bug-explore': {
    name: 'bug-explore',
    description: 'Investigate a bug and generate a fix brief in one step, without writing code.',
    content: `---
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
`,
  },

  'bug-fix': {
    name: 'bug-fix',
    description: 'Fix the latest active bug brief and validate the result. Archive automatically when complete.',
    content: `---
name: bug-fix
description: Fix the latest active bug brief and validate the result. Archive automatically when complete.
user-invocable: true
---

Purpose

Fix a bug from the latest file in .ai/bugs/active/.

Rules

1. Read the latest relevant brief from .ai/bugs/active/.
2. Minimize changes.
3. Avoid unrelated refactoring.
4. Fix root cause, not symptoms.
5. Preserve existing behavior.
6. Explain reasoning.
7. Validate the fix before stopping.
8. If the bug is fixed, archive the brief automatically by moving it to .ai/bugs/archive/.

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
    description: 'Review the latest bug fix against the corresponding bug brief.',
    content: `---
name: bug-review
description: Review the latest bug fix against the corresponding bug brief.
user-invocable: true
---

Purpose

Review implementation against the corresponding bug brief.

Rules

1. Use the latest matching brief from .ai/bugs/active/ or .ai/bugs/archive/.
2. Check whether the reported root cause was truly addressed.

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

  'bug-cancel': {
    name: 'bug-cancel',
    description: 'Discard the current bug analysis output and code changes for this attempt.',
    content: `---
name: bug-cancel
description: Discard the current bug analysis output and code changes for this attempt.
user-invocable: true
---

Purpose

Abandon the current bug-fix attempt completely.

Rules

1. Target only the current bug-fix attempt.
2. Discard the current bug brief and any analysis artifacts created for this attempt.
3. Discard code changes made for this attempt.
4. Do not archive the bug brief.
5. Do not keep partial fixes.
6. Do not preserve temporary conclusions from this attempt as accepted decisions.
7. Do not touch unrelated historical archives, other active briefs, or user-authored changes outside this attempt.
8. If the exact changed files are uncertain, stop and ask for confirmation before deleting or reverting anything.

Output

BUG_CANCELLED
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

  'decision-sweep-weekly': {
    name: 'decision-sweep-weekly',
    description: 'Weekly sweep of recent task and bug briefs to decide which deserve a decision-log entry. Proposes entries for confirmation before appending.',
    content: `---
name: decision-sweep-weekly
description: Weekly sweep of recent task and bug briefs to decide which deserve a decision-log entry. Proposes entries for confirmation before appending.
user-invocable: true
---

Purpose

Batch-review the past week of work and sediment only the decisions that outlive a single task. Replaces per-task reminders with one weekly pass.

When to Run

Run once per week, ideally on Friday. May also run ad-hoc after a busy stretch.

Workflow

1. Scan briefs created in the last 7 days under .ai/tasks/archive/ and .ai/bugs/archive/. Filter by filename date prefix YYYY-MM-DD. If a brief lacks a date prefix, fall back to filesystem mtime.
2. For cancelled briefs in either archive, treat the abandonment itself as potential decision material.
3. Evaluate each brief against the Sediment Conditions below.
4. For each candidate, draft a decision entry using the four-section format.
5. Present a single review list: every scanned brief with a verdict (write / skip / insufficient info), then the proposed drafts grouped at the end.
6. Do NOT append anything yet. Wait for the user to confirm which drafts to keep, edit, or drop.
7. Only after confirmation, append the approved entries to .ai/decisions/decisions.md, oldest first, under the matching YYYY-MM-DD section heading.
8. Report what was appended and what was skipped.

Sediment Conditions

A brief becomes a decision entry if it satisfies any of:

* Cross-task impact: the choice constrains how future tasks must be written.
* A concrete alternative was rejected and someone could plausibly pick it later.
* Counter-intuitive choice: code reads like an anti-pattern but is intentional.
* Externally driven: compliance, performance, compatibility, or a third-party API limit forced the call.
* A cancelled attempt whose failure is itself a useful conclusion.

Skip Conditions

* Affects only the implementation detail of one task.
* A temporary or unsettled conclusion.
* A bare fact with no decision behind it.

Entry Format

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
* One date section per day; multiple decisions on the same day stack under the same heading
* Never edit or delete prior entries
`,
  },
};

const MANAGED_SKILL_NAMES = Object.values(SKILLS).map((skill) => skill.name);

function skillFilePath(path, cwd, skillRoot, skillName) {
  return path.join(cwd, skillRoot, skillName, 'SKILL.md');
}

function hasGrillMeHint(value) {
  const normalized = value.toLowerCase();
  return GRILL_ME_HINTS.some((hint) => normalized.includes(hint));
}

function detectLocalGrillMeSkill(fs, path, cwd, skillRoot) {
  const root = path.join(cwd, skillRoot);
  if (!fs.existsSync(root)) {
    return null;
  }

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (MANAGED_SKILL_NAMES.includes(entry.name)) {
      continue;
    }

    if (hasGrillMeHint(entry.name)) {
      return entry.name;
    }

    const skillPath = path.join(root, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      continue;
    }

    const content = fs.readFileSync(skillPath, 'utf-8');
    const metadata = content
      .split('---')
      .slice(1, 2)
      .join('\n');

    if (hasGrillMeHint(metadata)) {
      return entry.name;
    }
  }

  return null;
}

function logCheck(log, ok, label, detail) {
  if (ok) {
    log.chalk.green(`  OK   ${label}${detail ? ` - ${detail}` : ''}`);
    return;
  }
  console.log(chalk.yellow(`  WARN ${label}${detail ? ` - ${detail}` : ''}`));
}

function ensureDir(fs, path, baseDir, relativeDir, log) {
  const full = path.join(baseDir, relativeDir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    log.chalk.green(`  ✓ ${relativeDir}`);
    return;
  }
  log.chalk.dim(`  - ${relativeDir} (exists)`);
}

function ensureFile(fs, path, filePath, content, log) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    log.chalk.green(`  ✓ ${path.relative(process.cwd(), filePath)}`);
    return;
  }
  log.chalk.dim(`  - ${path.relative(process.cwd(), filePath)} (exists)`);
}

function installSkills(fs, path, cwd, skillRoot, log) {
  ensureDir(fs, path, cwd, skillRoot, log);
  for (const skill of Object.values(SKILLS)) {
    const skillDir = path.join(cwd, skillRoot, skill.name);
    const skillFile = skillFilePath(path, cwd, skillRoot, skill.name);

    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    if (!fs.existsSync(skillFile)) {
      fs.writeFileSync(skillFile, skill.content);
      log.chalk.green(`  ✓ ${skillRoot}/${skill.name}`);
    } else {
      log.chalk.dim(`  - ${skillRoot}/${skill.name} (exists)`);
    }
  }
}

function removeManagedSkills(fs, path, cwd, skillRoot, log) {
  const rootPath = path.join(cwd, skillRoot);
  if (!fs.existsSync(rootPath)) {
    log.chalk.dim(`  - ${skillRoot} (missing)`);
    return;
  }

  for (const skillName of MANAGED_SKILL_NAMES) {
    const skillDir = path.join(rootPath, skillName);
    if (!fs.existsSync(skillDir)) {
      log.chalk.dim(`  - ${skillRoot}/${skillName} (missing)`);
      continue;
    }

    fs.rmSync(skillDir, { recursive: true, force: true });
    log.chalk.green(`  ✓ removed ${skillRoot}/${skillName}`);
  }
}

function updateGitignore(fs, path, cwd, log) {
  const gitignorePath = path.join(cwd, '.gitignore');
  const existing = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf-8')
    : '';

  if (existing.includes('# task workflow')) {
    log.chalk.dim('  - .gitignore (task workflow block exists)');
    return;
  }

  const prefix = existing.trimEnd();
  const next = prefix ? `${prefix}\n\n${GITIGNORE_BLOCK}\n` : `${GITIGNORE_BLOCK}\n`;
  fs.writeFileSync(gitignorePath, next);
  log.chalk.green('  ✓ .gitignore updated');
}

export function init(cwd, { fs, path, log }) {
  const dirs = [
    '.ai',
    TASK_ACTIVE_DIR,
    TASK_ARCHIVE_DIR,
    BUG_ACTIVE_DIR,
    BUG_ARCHIVE_DIR,
    '.ai/decisions',
  ];

  log.info('Creating directory structure...');
  for (const dir of dirs) {
    ensureDir(fs, path, cwd, dir, log);
  }

  const decisionsPath = path.join(cwd, DECISIONS_FILE);
  ensureFile(fs, path, decisionsPath, '# Decisions Log\n\n', log);

  log.info('\nInstalling workflow skills...');
  installSkills(fs, path, cwd, CLAUDE_SKILLS_DIR, log);
  installSkills(fs, path, cwd, CODEX_SKILLS_DIR, log);

  log.info('\nUpdating ignore rules...');
  updateGitignore(fs, path, cwd, log);

  log.info(`\nTask workflow initialized. Recommended flows:
  fast:  task-fast
  task:  task-explore -> task-implement -> task-review | task-cancel
  bug:   bug-explore -> bug-fix -> bug-review | bug-cancel
  other: decision-log
  sweep: decision-sweep-weekly`);
}

export function refresh(cwd, { fs, path, log }) {
  const dirs = [
    '.ai',
    TASK_ACTIVE_DIR,
    TASK_ARCHIVE_DIR,
    BUG_ACTIVE_DIR,
    BUG_ARCHIVE_DIR,
    '.ai/decisions',
  ];

  log.info('Ensuring directory structure...');
  for (const dir of dirs) {
    ensureDir(fs, path, cwd, dir, log);
  }

  const decisionsPath = path.join(cwd, DECISIONS_FILE);
  ensureFile(fs, path, decisionsPath, '# Decisions Log\n\n', log);

  log.info('\nRefreshing managed workflow skills...');
  removeManagedSkills(fs, path, cwd, CLAUDE_SKILLS_DIR, log);
  removeManagedSkills(fs, path, cwd, CODEX_SKILLS_DIR, log);
  installSkills(fs, path, cwd, CLAUDE_SKILLS_DIR, log);
  installSkills(fs, path, cwd, CODEX_SKILLS_DIR, log);

  log.info('\nUpdating ignore rules...');
  updateGitignore(fs, path, cwd, log);

  log.info(`\nTask workflow refreshed. Managed skills reinstalled:
  fast:  task-fast
  task:  task-explore -> task-implement -> task-review | task-cancel
  bug:   bug-explore -> bug-fix -> bug-review | bug-cancel
  other: decision-log
  sweep: decision-sweep-weekly`);
}

export function doctor(cwd, { fs, path, log }) {
  const checks = [];
  const requiredDirs = [
    '.ai',
    TASK_ACTIVE_DIR,
    TASK_ARCHIVE_DIR,
    BUG_ACTIVE_DIR,
    BUG_ARCHIVE_DIR,
    '.ai/decisions',
    CLAUDE_SKILLS_DIR,
    CODEX_SKILLS_DIR,
  ];

  log.info('Checking task workflow setup...');

  for (const dir of requiredDirs) {
    const full = path.join(cwd, dir);
    const exists = fs.existsSync(full);
    checks.push(exists);
    logCheck(log, exists, dir, exists ? 'present' : 'missing');
  }

  const decisionsPath = path.join(cwd, DECISIONS_FILE);
  const decisionsExists = fs.existsSync(decisionsPath);
  checks.push(decisionsExists);
  logCheck(log, decisionsExists, DECISIONS_FILE, decisionsExists ? 'present' : 'missing');

  for (const skillRoot of [CLAUDE_SKILLS_DIR, CODEX_SKILLS_DIR]) {
    for (const skill of Object.values(SKILLS)) {
      const skillPath = skillFilePath(path, cwd, skillRoot, skill.name);
      if (!fs.existsSync(skillPath)) {
        checks.push(false);
        logCheck(log, false, `${skillRoot}/${skill.name}`, 'missing');
        continue;
      }

      const content = fs.readFileSync(skillPath, 'utf-8');
      const matches = content === skill.content;
      checks.push(matches);
      logCheck(
        log,
        matches,
        `${skillRoot}/${skill.name}`,
        matches ? 'current' : 'outdated, run `task refresh`'
      );
    }
  }

  const grillMeFindings = [
    [CLAUDE_SKILLS_DIR, detectLocalGrillMeSkill(fs, path, cwd, CLAUDE_SKILLS_DIR)],
    [CODEX_SKILLS_DIR, detectLocalGrillMeSkill(fs, path, cwd, CODEX_SKILLS_DIR)],
  ];

  for (const [skillRoot, skillName] of grillMeFindings) {
    if (skillName) {
      logCheck(log, true, `${skillRoot} Grill Me companion`, `detected ${skillName}`);
      continue;
    }

    console.log(chalk.yellow(
      `  WARN ${skillRoot} Grill Me companion - not detected locally; task-fast, task-explore, and bug-explore will use built-in clarification fallback`
    ));
  }

  const gitignorePath = path.join(cwd, '.gitignore');
  const gitignore = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf-8')
    : '';
  const hasGitignoreBlock = gitignore.includes(GITIGNORE_BLOCK);
  checks.push(hasGitignoreBlock);
  logCheck(
    log,
    hasGitignoreBlock,
    '.gitignore',
    hasGitignoreBlock ? 'task workflow rules present' : 'missing task workflow rules'
  );

  const okCount = checks.filter(Boolean).length;
  const totalCount = checks.length;
  const allGood = okCount === totalCount;

  log.info(`\nSummary: ${okCount}/${totalCount} checks passed.`);
  if (allGood) {
    log.chalk.green('Task workflow is healthy.');
    return;
  }

  console.log(chalk.yellow('Recommended next step: run `task refresh` to reinstall managed skills and repair setup.'));
}
