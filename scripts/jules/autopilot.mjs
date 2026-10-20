#!/usr/bin/env node
/**
 * NonGeneric — Jules Orchestration Autopilot
 *
 * Runs one cycle of:
 * 1. Checking Jules cloud session statuses (`dispatch.mjs status`)
 * 2. Reviewing open PRs (`review-prs.mjs`)
 * 3. Squash-merging approved PRs (`merge-approved.mjs`)
 */

import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function runStep(script, args = []) {
  try {
    const out = execFileSync(process.execPath, [join(__dirname, script), ...args], {
      encoding: 'utf8',
    });
    if (out.trim()) console.log(out.trim());
  } catch (err) {
    console.error(`[AUTOPILOT WARN] ${script}: ${err.message}`);
  }
}

console.log(`=== NonGeneric Jules Autopilot (${new Date().toISOString()}) ===`);
runStep('dispatch.mjs', ['status']);
runStep('review-prs.mjs');
runStep('merge-approved.mjs');
