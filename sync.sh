#!/usr/bin/env bash
#
# sync.sh — sync a Claude design export (.zip) into a folder of this repo.
#
# The only manual step is exporting the zip from claude.ai/design (needs your
# login). Everything after that — clean extract, deletion-aware mirror, diff —
# is handled here.
#
# Usage:
#   ./sync.sh                          Sync BOTH folders from the newest matching
#                                      zips in ~/Downloads (see MAPPINGS below).
#   ./sync.sh <zip> <target-folder>    One-off: mirror <zip> into <target-folder>.
#   ./sync.sh --commit "message"       As no-arg sync, then git add+commit+push.
#
# Examples:
#   ./sync.sh
#   ./sync.sh ~/Downloads/MX.zip app_mocks
#   ./sync.sh --commit "Sync mocks + design system"
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOWNLOADS="${HOME}/Downloads"

# project-zip-basename  ->  repo-folder
# The basename is matched WITHOUT the .zip extension; newest match wins.
MAPPINGS=(
  "MX.zip|app_mocks"
  "MX Design System.zip|design_system"
)

cd "$REPO_DIR"

# Mirror one zip into one target folder: extract to a temp dir, then rsync
# --delete so removed files disappear too. Returns nonzero if the zip is missing.
mirror() {
  local zip="$1" target="$2"
  if [[ ! -f "$zip" ]]; then
    echo "  ✗ zip not found: $zip" >&2
    return 1
  fi
  local tmp
  tmp="$(mktemp -d)"
  unzip -o -q "$zip" -d "$tmp"
  mkdir -p "$REPO_DIR/$target"
  # trailing slashes matter: copy CONTENTS of tmp into target, delete extras
  rsync -a --delete "$tmp/" "$REPO_DIR/$target/"
  rm -rf "$tmp"
  local n
  n="$(find "$REPO_DIR/$target" -type f | wc -l | tr -d ' ')"
  echo "  ✓ $target  ($n files)  <- $(basename "$zip")"
}

# Newest file in ~/Downloads whose name equals "$1" (handles spaces).
newest_zip() {
  local name="$1"
  # -t sorts newest-first; head -1 takes it. Null-safe enough for our names.
  ls -t "$DOWNLOADS/$name" 2>/dev/null | head -1
}

sync_all() {
  local pair name folder zip
  for pair in "${MAPPINGS[@]}"; do
    name="${pair%%|*}"
    folder="${pair##*|}"
    zip="$(newest_zip "$name")"
    if [[ -z "$zip" ]]; then
      echo "  ⚠ skipping $folder — no '$name' in $DOWNLOADS" >&2
      continue
    fi
    mirror "$zip" "$folder"
  done
}

# ---- argument handling ----------------------------------------------------
COMMIT_MSG=""
case "${1:-}" in
  --commit)
    COMMIT_MSG="${2:-Sync design from Claude}"
    sync_all
    ;;
  "")
    sync_all
    ;;
  *)
    # one-off: <zip> <target-folder>
    if [[ $# -ne 2 ]]; then
      echo "Usage: ./sync.sh [<zip> <target-folder>] | [--commit \"message\"]" >&2
      exit 2
    fi
    mirror "$1" "$2"
    ;;
esac

# ---- show what changed ----------------------------------------------------
echo
echo "=== git status ==="
git add -A
git status --short
echo
echo "=== diff stat ==="
git diff --cached --stat | tail -30

# ---- optional commit ------------------------------------------------------
if [[ -n "$COMMIT_MSG" ]]; then
  if git diff --cached --quiet; then
    echo
    echo "Nothing changed — no commit."
  else
    echo
    git commit -q -m "$COMMIT_MSG"
    git push
    echo "Committed and pushed: $COMMIT_MSG"
  fi
else
  echo
  echo "Review the diff above, then commit when ready:"
  echo "  git commit -m \"...\" && git push"
fi
