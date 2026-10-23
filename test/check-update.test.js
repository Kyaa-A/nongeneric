import { it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

function installation(t) {
  const root = mkdtempSync(join(tmpdir(), 'ng-update-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const dir of ['.claude-plugin', '.codex-plugin']) {
    mkdirSync(join(root, dir));
    writeFileSync(join(root, dir, 'plugin.json'), JSON.stringify({ name: 'nongeneric', version: '1.0.0' }));
  }
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'nongeneric', version: '1.0.0' }));
  const preload = join(root, 'fetch.mjs');
  writeFileSync(preload, `import { appendFileSync } from 'node:fs';
globalThis.fetch = async (url, options) => {
  appendFileSync(process.env.NG_TEST_REQUESTS, JSON.stringify({ url: String(url), signal: !!options.signal }) + '\\n');
  if (process.env.NG_TEST_REMOTE === 'offline') throw new Error('offline');
  return { ok: process.env.NG_TEST_REMOTE !== 'http-error', json: async () => JSON.parse(process.env.NG_TEST_REMOTE) };
};`);
  const requests = join(root, 'requests.log');
  return {
    run(platform, remote = { name: 'nongeneric', version: '1.1.0' }, extraEnv = {}, useDefaultRoot = false) {
      return spawnSync(process.execPath, ['--import', pathToFileURL(preload).href,
        resolve('scripts/check-update.js'), '--platform', platform, ...(useDefaultRoot ? [] : ['--root', root, '--data', join(root, 'cache')])], {
        encoding: 'utf8', cwd: useDefaultRoot ? tmpdir() : undefined, env: { ...process.env, NONGENERIC_UPDATE_CHECK: '1', NG_TEST_REQUESTS: requests,
          NG_TEST_REMOTE: typeof remote === 'string' ? remote : JSON.stringify(remote), ...extraEnv },
      });
    },
    requests() { return existsSync(requests) ? readFileSync(requests, 'utf8').trim().split('\n').map(JSON.parse) : []; },
  };
}

it('notifies old Claude and Codex installs with a nonblocking hook response', (t) => {
  const app = installation(t);
  for (const platform of ['claude', 'codex']) {
    const result = app.run(platform);
    assert.equal(result.status, 0, result.stderr);
    const notice = JSON.parse(result.stdout);
    assert.equal(notice.continue, true);
    assert.match(notice.systemMessage, /1\.0\.0 -> 1\.1\.0 update available/);
    assert.match(notice.systemMessage, new RegExp(platform + ' plugin'));
  }
  assert.ok(app.requests().every((r) => r.signal && r.url.startsWith('https://raw.githubusercontent.com/codewithasnari/nongeneric/')));
});

it('caches successful checks and honors opt-out without a request', (t) => {
  const app = installation(t);
  app.run('claude');
  assert.equal(app.run('claude').stdout, '');
  assert.equal(app.requests().length, 1);
  assert.equal(app.run('codex', undefined, { NONGENERIC_UPDATE_CHECK: '0' }).stdout, '');
  assert.equal(app.requests().length, 1);
});

it('silently ignores offline, malformed, unrelated, and non-newer hook results', (t) => {
  const app = installation(t);
  for (const remote of ['offline', 'http-error', 'not-json', null, { name: 'other', version: '9.0.0' },
    { name: 'nongeneric', version: '1.1.0-beta.1' }, { name: 'nongeneric', version: '0.9.0' }]) {
    const result = app.run('claude', remote);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, '');
  }
});

it('prints a readable terminal update notice and checks on each explicit invocation', (t) => {
  const app = installation(t);
  const result = app.run('cli');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /nongeneric 1\.0\.0 -> 1\.1\.0 update available/);
  assert.match(result.stdout, /installation method/);
  app.run('cli');
  assert.equal(app.requests().length, 2);
});

it('distinguishes a current terminal install from an unavailable check', (t) => {
  const app = installation(t);
  assert.match(app.run('cli', { name: 'nongeneric', version: '1.0.0' }).stdout, /No newer version/);
  const result = app.run('cli', 'offline');
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Could not check/);
});

it('resolves the installed manifest without a root argument and explains terminal opt-out', (t) => {
  const app = installation(t);
  const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
  const result = app.run('cli', { name: 'nongeneric', version }, {}, true);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No newer version/);
  const disabled = app.run('cli', undefined, { NONGENERIC_UPDATE_CHECK: '0' });
  assert.equal(disabled.status, 0);
  assert.match(disabled.stdout, /checks disabled/);
  assert.equal(app.requests().length, 1);
});
