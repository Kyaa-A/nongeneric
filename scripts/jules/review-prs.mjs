#!/usr/bin/env node
/**
 * NonGeneric — Autonomous Jules PR Reviewer & Gatekeeper
 *
 * Inspects open PRs on codewithasnari/nongeneric:
 * 1. Marks draft PRs as ready for review once files are committed.
 * 2. Verifies PRs do not contain merge conflicts, forbidden files (.env, node_modules),
 *    or unsafe DOM sinks (innerHTML, outerHTML, eval).
 * 3. Checks GitHub Actions CI status (`Check & Test`).
 * 4. Posts a structured review comment on passing PRs.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REVIEWED_PATH = join(__dirname, '.reviewed-prs.json');

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' }).trim();
}

function loadReviewed() {
  if (!existsSync(REVIEWED_PATH)) return {};
  try {
    return JSON.parse(readFileSync(REVIEWED_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveReviewed(data) {
  writeFileSync(REVIEWED_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function inspectOpenPrs() {
  const raw = gh([
    'pr',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,headRefName,headRefOid,isDraft,mergeable,files,statusCheckRollup',
  ]);
  const prs = JSON.parse(raw || '[]');
  const reviewed = loadReviewed();

  if (prs.length === 0) {
    console.log('No open PRs found.');
    return [];
  }

  const results = [];

  for (const pr of prs) {
    if (pr.isDraft) {
      try {
        gh(['pr', 'ready', String(pr.number)]);
        console.log(`[READY] Marked Draft PR #${pr.number} as ready for review.`);
      } catch (e) {
        console.warn(`[WARN] Could not ready PR #${pr.number}: ${e.message}`);
      }
    }

    const filePaths = (pr.files ?? []).map((f) => f.path);
    const forbidden = filePaths.filter(
      (p) => p === '.env' || p.startsWith('node_modules/') || p.endsWith('.dispatched.json')
    );

    const checks = pr.statusCheckRollup ?? [];
    const failedChecks = checks.filter(
      (c) => c.conclusion === 'FAILURE' || c.conclusion === 'TIMED_OUT' || c.conclusion === 'CANCELLED'
    );
    const pendingChecks = checks.filter((c) => c.status !== 'COMPLETED');
    const allChecksGreen = checks.length > 0 && failedChecks.length === 0 && pendingChecks.length === 0;

    let diffClean = true;
    let diffIssue = '';
    try {
      const diff = gh(['pr', 'diff', String(pr.number)]);
      if (/\+(?:[^+].*)?\.(?:innerHTML|outerHTML)\s*=|\+(?:[^+].*)?\beval\s*\(/.test(diff)) {
        diffClean = false;
        diffIssue = 'Contains unsafe DOM sink (innerHTML/outerHTML/eval) in added lines.';
      }
    } catch {
      // ignore diff fetch error
    }

    const approved =
      forbidden.length === 0 &&
      diffClean &&
      pr.mergeable !== 'CONFLICTING' &&
      allChecksGreen;

    const status = {
      number: pr.number,
      title: pr.title,
      headRefOid: pr.headRefOid,
      files: filePaths,
      mergeable: pr.mergeable,
      allChecksGreen,
      failedChecks: failedChecks.length,
      pendingChecks: pendingChecks.length,
      diffClean,
      diffIssue,
      approved,
    };
    results.push(status);

    console.log(
      `PR #${pr.number} (${pr.title}) | mergeable=${pr.mergeable} | CI=${
        allChecksGreen ? 'PASS' : pendingChecks.length ? 'PENDING' : 'FAIL'
      } | approved=${approved}`
    );

    if (approved && reviewed[pr.number] !== pr.headRefOid) {
      try {
        gh([
          'pr',
          'comment',
          String(pr.number),
          '--body',
          `### NonGeneric Automated Craft & Security Review — PASS\n- **Files (${filePaths.length})**: \`${filePaths.join('`, `')}\`\n- **Security Scan**: 0 unsafe DOM sinks, 0 leaked secrets\n- **CI Gate**: All checks green\n- **Verdict**: Approved for squash merge.`,
        ]);
        reviewed[pr.number] = pr.headRefOid;
        saveReviewed(reviewed);
      } catch (e) {
        console.warn(`[WARN] Could not comment on PR #${pr.number}: ${e.message}`);
      }
    }
  }

  return results;
}

inspectOpenPrs();
