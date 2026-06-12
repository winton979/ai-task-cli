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

const SKILLS = {
  'task-fast': {
    name: 'task-fast',
    description: 'Fast path for small requirements. Clarify quickly, create the brief, implement, verify, and archive.',
    content: `---
name: task-fast
description: Fast path for small requirements. Clarify quickly, create the brief, implement, verify, and archive.
user-invocable: true
---

Purpose

Handle a small requirement in one continuous workflow with minimal ceremony.

Workflow

1. Clarify the requirement just enough to remove ambiguity.
2. Create a concise task brief and save it to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

3. Show the brief before coding.
4. If the user does not object, implement immediately.
5. Verify the result against the acceptance criteria.
6. Move the brief to:

.ai/tasks/archive/YYYY-MM-DD-task-name.md

7. Summarize the outcome and any follow-up risks.

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

1. Explore the requirement through focused questions.
2. Continue until the task is sufficiently understood.
3. Do not write code.
4. Do not create implementation details.
5. Once the requirement is clear, generate a concise task brief and save it to:

.ai/tasks/active/YYYY-MM-DD-task-name.md

6. Show the saved brief and stop.

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
    description: 'Implement the latest active task brief, validate it, and archive it when complete.',
    content: `---
name: task-implement
description: Implement the latest active task brief, validate it, and archive it when complete.
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
8. If the work is complete, move the brief to .ai/tasks/archive/.

Output

## Plan

Short implementation plan.

## Changes

Files modified.

## Validation

How acceptance criteria were satisfied.

## Archive

Whether the brief was archived.
`,
  },

  'task-review': {
    name: 'task-review',
    description: 'Review the latest task implementation against the active or archived task brief.',
    content: `---
name: task-review
description: Review the latest task implementation against the active or archived task brief.
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

1. Do not write code.
2. Do not suggest fixes before enough evidence exists.
3. Identify root cause candidates.
4. Ask focused questions.
5. Request evidence whenever possible.
6. Separate:

   * observed behavior
   * expected behavior
   * assumptions

7. Once the bug is sufficiently understood, generate a brief and save it to:

.ai/bugs/active/YYYY-MM-DD-bug-name.md

8. Show the saved brief and stop.

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
    description: 'Fix the latest active bug brief, validate the result, and archive the brief when complete.',
    content: `---
name: bug-fix
description: Fix the latest active bug brief, validate the result, and archive the brief when complete.
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
8. If the bug is fixed, move the brief to .ai/bugs/archive/.

Output

## Root Cause

Confirmed cause.

## Fix

Changes made.

## Validation

Verification performed.

## Archive

Whether the brief was archived.
`,
  },

  'bug-review': {
    name: 'bug-review',
    description: 'Review the latest bug fix against the active or archived bug brief.',
    content: `---
name: bug-review
description: Review the latest bug fix against the active or archived bug brief.
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

const MANAGED_SKILL_NAMES = Object.values(SKILLS).map((skill) => skill.name);

function skillFilePath(path, cwd, skillRoot, skillName) {
  return path.join(cwd, skillRoot, skillName, 'SKILL.md');
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
  task:  task-explore -> task-implement -> task-review
  bug:   bug-explore -> bug-fix -> bug-review
  other: decision-log`);
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
  task:  task-explore -> task-implement -> task-review
  bug:   bug-explore -> bug-fix -> bug-review
  other: decision-log`);
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
