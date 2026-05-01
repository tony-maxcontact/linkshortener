#!/usr/bin/env node

const input = JSON.parse(process.env.TOOL_OUTPUT ?? '{}');
const { toolName } = input;

if (toolName === 'create' || toolName === 'edit') {
  const { execSync } = require('child_process');
  execSync('npx prettier --write .', { stdio: 'inherit' });
}
