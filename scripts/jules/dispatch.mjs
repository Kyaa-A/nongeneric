#!/usr/bin/env node
/**
 * NonGeneric — Jules Cloud Session Dispatcher
 *
 * Reads modular isolated task definitions from `scripts/jules/tasks.json` and
 * dispatches parallel cloud sessions to the Jules v1alpha API (`AUTO_CREATE_PR`),
 * tracking session IDs in `scripts/jules/.dispatched.json`.
 *
 * Usage:
 *   node scripts/jules/dispatch.mjs list
 *   node scripts/jules/dispatch.mjs send --wave 1
 *   node scripts/jules/dispatch.mjs send --task NONGEN-101
 *   node scripts/jules/dispatch.mjs status
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '../..');
const TASKS_PATH = join(__dirname, 'tasks.json');
const STATE_PATH = join(__dirname, '.dispatched.json');
const API_BASE = 'https://jules.googleapis.com/v1alpha';

function loadApiKey() {
  if (process.env.JULES_API_KEY) return process.env.JULES_API_KEY.trim();
  const envPath = join(ROOT_DIR, '.env');
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, 'utf8');
    const match = /^JULES_API_KEY=(.+)$/m.exec(raw);
    if (match?.[1]) return match[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return '';
}

function loadTasks() {
  return JSON.parse(readFileSync(TASKS_PATH, 'utf8'));
}

function loadState() {
  if (!existsSync(STATE_PATH)) return { dispatched: {} };
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { dispatched: {} };
  }
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

async function julesRequest(path, options = {}) {
  const apiKey = loadApiKey();
  if (!apiKey) {
    throw new Error('Missing JULES_API_KEY in environment or .env');
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      ...(options.headers ?? {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Jules API ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function dispatchTask(task, repo, startingBranch, state, dryRun = false) {
  if (state.dispatched[task.id]?.sessionName) {
    console.log(`[SKIP] ${task.id} already dispatched -> ${state.dispatched[task.id].sessionName}`);
    return state.dispatched[task.id];
  }

  const body = {
    prompt: task.prompt,
    title: `${task.id}: ${task.title}`,
    sourceContext: {
      source: `sources/github/${repo}`,
      githubRepoContext: {
        startingBranch: startingBranch || 'main',
      },
    },
    automationMode: 'AUTO_CREATE_PR',
  };

  if (dryRun) {
    console.log(`[DRY-RUN] Would dispatch ${task.id}: ${task.title}`);
    return null;
  }

  const response = await julesRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const record = {
    taskId: task.id,
    title: task.title,
    wave: task.wave,
    sessionName: response.name,
    sessionId: response.id,
    state: response.state ?? 'QUEUED',
    dispatchedAt: new Date().toISOString(),
  };

  state.dispatched[task.id] = record;
  saveState(state);
  console.log(`[DISPATCHED] ${task.id} -> ${response.name} (${record.state})`);
  return record;
}

async function checkStatus() {
  const state = loadState();
  const entries = Object.values(state.dispatched);
  if (entries.length === 0) {
    console.log('No Jules sessions dispatched yet.');
    return;
  }

  for (const item of entries) {
    try {
      const data = await julesRequest(`/${item.sessionName}`);
      item.state = data.state ?? item.state;
      const prOutput = (data.outputs ?? []).find((o) => o.pullRequest);
      if (prOutput?.pullRequest?.url) {
        item.prUrl = prOutput.pullRequest.url;
      }
      console.log(
        `${item.taskId.padEnd(12)} | ${(item.state ?? 'UNKNOWN').padEnd(18)} | ${item.sessionName} ${
          item.prUrl ? `| PR: ${item.prUrl}` : ''
        }`
      );
    } catch (err) {
      console.error(`${item.taskId}: error fetching status: ${err.message}`);
    }
  }
  saveState(state);
}

async function main() {
  const args = process.argv.slice(2);
  const sub = args[0] ?? 'list';
  const manifest = loadTasks();
  const state = loadState();

  if (sub === 'list') {
    console.log(`NonGeneric Jules Task Manifest (${manifest.tasks.length} tasks)`);
    for (const t of manifest.tasks) {
      const status = state.dispatched[t.id]?.state ?? 'NOT_SENT';
      console.log(`  [Wave ${t.wave}] ${t.id}: ${t.title} (${status})`);
    }
    return;
  }

  if (sub === 'status') {
    await checkStatus();
    return;
  }

  if (sub === 'send') {
    const dryRun = args.includes('--dry-run');
    const waveIdx = args.indexOf('--wave');
    const taskIdx = args.indexOf('--task');
    const sendAll = args.includes('--all');

    let selected = [];
    if (taskIdx !== -1 && args[taskIdx + 1]) {
      const id = args[taskIdx + 1];
      selected = manifest.tasks.filter((t) => t.id === id);
    } else if (waveIdx !== -1 && args[waveIdx + 1]) {
      const wave = Number.parseInt(args[waveIdx + 1], 10);
      selected = manifest.tasks.filter((t) => t.wave === wave);
    } else if (sendAll) {
      selected = manifest.tasks;
    } else {
      selected = manifest.tasks.filter((t) => t.wave === 1);
    }

    for (const task of selected) {
      await dispatchTask(task, manifest.repo, manifest.branch, state, dryRun);
    }
    return;
  }

  console.error(`Unknown command: ${sub}. Use list | send | status.`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
