#!/usr/bin/env bash
# PostToolUse hook: keep package-lock.json in sync with package.json.
# Triggered after Edit|Write|MultiEdit. Filters to package.json edits only.
set -euo pipefail

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

case "$file" in
  */package.json|package.json)
    project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
    cd "$project_dir"
    echo "package.json edited - refreshing package-lock.json" >&2
    npm install --package-lock-only --ignore-scripts --no-audit --no-fund >&2
    echo "package-lock.json synced" >&2
    ;;
esac
exit 0
