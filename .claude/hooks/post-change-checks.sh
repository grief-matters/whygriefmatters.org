#!/usr/bin/env bash
# Post-change hook: runs formatting, linting, and typecheck once after Claude finishes responding.
# Always exits 0 to avoid blocking Claude; outputs errors/warnings so Claude can see and fix them.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Get files changed since last commit (unstaged + staged)
changed_files=$(git diff --name-only HEAD 2>/dev/null || true)

if [ -z "$changed_files" ]; then
  echo "No changed files detected — skipping format/lint/typecheck."
  exit 0
fi

# Filter to file types we care about
format_files=$(echo "$changed_files" | grep -E '\.(ts|astro|css|json|md)$' || true)
lint_files=$(echo "$changed_files" | grep -E '\.(ts|astro)$' || true)

has_errors=false

# --- Prettier ---
if [ -n "$format_files" ]; then
  echo "=== Running Prettier ==="
  # shellcheck disable=SC2086
  if ! npx prettier --write $format_files 2>&1; then
    has_errors=true
  fi
  echo ""
fi

# --- ESLint ---
if [ -n "$lint_files" ]; then
  echo "=== Running ESLint ==="
  # shellcheck disable=SC2086
  if ! npx eslint --fix --no-warn-ignored --max-warnings=0 $lint_files 2>&1; then
    has_errors=true
  fi
  echo ""
fi

# --- Astro Check (typecheck) ---
echo "=== Running Astro Check ==="
if ! npx astro check 2>&1; then
  has_errors=true
fi
echo ""

if [ "$has_errors" = true ]; then
  echo "⚠ Some checks reported issues — please review the output above."
else
  echo "All checks passed."
fi

exit 0
