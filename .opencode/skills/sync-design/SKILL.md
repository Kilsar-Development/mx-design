---
name: sync-design
description: Sync Claude design export zips from ~/Downloads into app_mocks and design_system, review the diff, and commit after approval. Use when the user says sync design, sync mocks, update mocks, or mentions a downloaded claude.ai/design export.
---

# Sync design exports

This repository mirrors projects exported from claude.ai/design. The user downloads
the zip; the repository's `sync.sh` performs the deletion-aware mirror.

## Workflow

1. Inspect `~/Downloads` for the newest export matching each mapping in `sync.sh`.
   Browser-numbered copies such as `MX(1).zip` and `MX (2).zip` count as matches.
   Current mappings are:
   - `MX.zip` to `app_mocks/`
   - `MX Design System.zip` to `design_system/`
2. Before syncing, compare candidate modification times and report which exports will
   be used. If a requested project has no export, ask the user to download it or give
   the actual filename. If the user mentions an unmapped project, add its
   `"Project Name.zip|target_folder"` mapping to `sync.sh` first.
3. Run `./sync.sh` from the repository root. For an unmapped one-off export, run
   `./sync.sh <zip> <target-folder>`.
4. Review `git status --short`, `git diff --cached --stat`, and relevant text diffs.
   Surface surprising deletions, emptied folders, or unexpected top-level directories.
5. Show the diff summary to the user and get approval before committing and pushing.
   Once approved, run `git commit -m "Sync <what changed>" && git push`.

## Rules

- Trust the zip as the complete project; never reconstruct an export file-by-file.
- `app_mocks/_ds/` intentionally duplicates the design system so mocks render
  standalone. Do not treat it as drift.
- `sync.sh` stages changes but does not commit unless called with `--commit`. Use
  `--commit` only when the user explicitly pre-approved commit and push.
- Do not stage or commit unrelated pre-existing worktree changes.
