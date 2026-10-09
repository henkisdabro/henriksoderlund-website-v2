#!/usr/bin/env bash
# PostToolUse hook: keep pnpm-lock.yaml in sync with package.json.
# Triggered after Edit|Write|MultiEdit. Filters to package.json edits only.
set -euo pipefail

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

case "$file" in
  */package.json|package.json)
    # The edited file's own directory, so an edit in a worktree updates that
    # worktree's lockfile rather than the main checkout's.
    cd "$(dirname "$file")"
    echo "package.json edited - refreshing pnpm-lock.yaml" >&2
    pnpm install --lockfile-only --ignore-scripts >&2
    echo "pnpm-lock.yaml synced" >&2
    ;;
esac
exit 0
