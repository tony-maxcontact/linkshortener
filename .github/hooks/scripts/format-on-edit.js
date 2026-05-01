#!/usr/bin/env node
/**
 * format-on-edit.js
 * Runs ESLint --fix on a file path passed as the first argument.
 * Intended to be invoked by editor "format on save/edit" hooks.
 *
 * Usage:
 *   node .github/hooks/scripts/format-on-edit.js <file>
 */

const { execFileSync } = require('child_process');
const path = require('path');

const [, , filePath] = process.argv;

if (!filePath) {
  console.error('Usage: format-on-edit.js <file>');
  process.exit(1);
}

const absolutePath = path.resolve(filePath);

try {
  execFileSync(
    'npx',
    ['eslint', '--fix', absolutePath],
    { stdio: 'inherit' }
  );
} catch (err) {
  // eslint exits with non-zero when it finds unfixable issues; that is acceptable.
  // Log anything unexpected so problems are still visible.
  if (err && err.status == null) {
    console.error('format-on-edit: unexpected error:', err.message ?? err);
  }
  process.exit(0);
}
