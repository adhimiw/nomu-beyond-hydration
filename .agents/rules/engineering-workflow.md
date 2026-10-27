# Gentle-AI Engineering Workflow Rules

Follow these deterministic engineering principles for every modification, feature, and commit in this project.

## 1. Work-Unit Commits
- **One purpose per commit**: A commit must represent an independent, deliverable behavior, fix, migration, or doc update.
- **Never commit by file type**: Do not create a commit with only models, then a commit with only services, then tests. Keep the code, its tests, and its documentation together in the same work unit.
- **Rollback boundary**: Each commit must be cleanly revertible without breaking unrelated work.
- **Line count guard**: Keep changes focused (aim under 400 lines per commit/PR). For larger changes, use chained/stacked work units.
- **Conventional Commits**: Format commit messages as `feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`, `test(...)`.

## 2. Cognitive Load Reduction
- When designing or documenting components and architectures, design for human and agent reviewability.
- Provide clear diffs and rationale. Explain the *why* and the *impact*, not just the file list.

## 3. Systematic Issue Root Resolution
- When fixing a bug, locate and fix the true root cause rather than patching symptoms with superficial defensive code.
- Write a regression test verifying the fix before marking an issue resolved.
