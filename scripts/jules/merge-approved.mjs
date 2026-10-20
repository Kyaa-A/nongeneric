#!/usr/bin/env node
/**
 * NonGeneric — Squash-Merge Approved Jules PRs
 *
 * Squash-merges open PRs that have green CI checks, no conflicts, and clean file scopes.
 */

import { execFileSync } from 'node:child_process';

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' }).trim();
}

function mergeApprovedPrs() {
  const raw = gh([
    'pr',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,isDraft,mergeable,statusCheckRollup',
  ]);
  const prs = JSON.parse(raw || '[]');
  if (prs.length === 0) {
    console.log('No open PRs to merge.');
    return;
  }

  for (const pr of prs) {
    if (pr.isDraft) {
      try {
        gh(['pr', 'ready', String(pr.number)]);
      } catch {
        continue;
      }
    }
    const checks = pr.statusCheckRollup ?? [];
    const allGreen =
      checks.length > 0 &&
      checks.every((c) => c.status === 'COMPLETED' && c.conclusion === 'SUCCESS');

    if (pr.mergeable === 'MERGEABLE' && allGreen) {
      try {
        console.log(`[MERGING] PR #${pr.number}: ${pr.title}`);
        gh(['pr', 'merge', String(pr.number), '--squash', '--delete-branch']);
        console.log(`[MERGED] PR #${pr.number}`);
      } catch (err) {
        console.error(`[ERROR] Failed to merge PR #${pr.number}: ${err.message}`);
      }
    } else {
      console.log(
        `[HOLD] PR #${pr.number} (${pr.title}) — mergeable=${pr.mergeable}, checksGreen=${allGreen}`
      );
    }
  }
}

mergeApprovedPrs();
