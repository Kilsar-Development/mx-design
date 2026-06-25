---
name: sync-design
description: Sync Claude design exports (zips downloaded from claude.ai/design) into this repo's folders, review the diff, and commit. Use when the user says they've downloaded a design zip, asks to sync the design system or app mocks, or wants to update the repo from claude.ai/design.
---

# Sync design exports into the repo

This repo mirrors Claude design projects from claude.ai/design. The user exports a
project as a `.zip` (the one manual step — claude.ai needs their login), and this
skill turns that zip into a reviewed, committed update.

The mechanical work lives in [`sync.sh`](../../../sync.sh) at the repo root. Your job is
to run it, walk the diff with the user, and commit once they're happy.

## Steps

1. **Confirm the zip(s) are downloaded.** They land in `~/Downloads`. The current
   project → folder mappings live in the `MAPPINGS` array at the top of `sync.sh`:
   - `MX.zip` → `app_mocks/`
   - `MX Design System.zip` → `design_system/`
   If the user mentions a project not in `MAPPINGS`, add a line to that array first
   (`"Project Name.zip|target_folder"`), then continue.

2. **Run the sync** from the repo root:
   ```bash
   ./sync.sh
   ```
   This extracts each newest matching zip into its folder via a temp dir + `rsync
   --delete` (so added, edited, AND removed files are all reflected), then stages
   everything and prints `git status` + `git diff --stat`. It does NOT commit.

   For a one-off zip/folder not in the mappings: `./sync.sh <zip> <target-folder>`.

3. **Review the diff with the user.** Show the `--stat` summary. If anything looks
   surprising — a large deletion, a folder emptied, an unexpected new top-level dir —
   surface it and confirm before committing. `git diff --cached` shows full detail for
   text files. Binary changes (fonts, pngs) just show as changed.

4. **Commit and push** once approved. Either:
   ```bash
   git commit -m "Sync <what changed>" && git push
   ```
   or re-run with `./sync.sh --commit "message"` to do sync + commit + push in one shot
   (only do this when the user has pre-approved committing without reviewing).

## Notes

- **Trust the export.** The zip is the complete, untruncated project (unlike per-file
  `DesignSync get_file`, which caps at 256 KiB and truncates large files like
  `web-app.jsx`). Always sync from the zip, never reconstruct file-by-file.
- `app_mocks/_ds/` intentionally holds a duplicate copy of the design system so the
  mocks render standalone. Leave it; it is not drift.
- If `sync.sh` reports "no '<name>.zip' in ~/Downloads", the user hasn't exported it yet
  (or named it differently) — ask them to download it or tell you the actual filename.
