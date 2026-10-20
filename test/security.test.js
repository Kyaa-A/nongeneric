import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

describe('NonGeneric Security & Supply-Chain Verification', () => {
  it('ships with zero runtime dependencies in package.json', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    assert.equal(pkg.dependencies, undefined, 'Runtime dependencies must be empty');
  });

  it('ensures .env is git-ignored and no tracked file contains API keys or secrets', () => {
    const gitignore = readFileSync('.gitignore', 'utf8');
    assert.match(gitignore, /^\.env$/m);

    const trackedOutput = execFileSync('git', ['ls-files'], { encoding: 'utf8' });
    const trackedFiles = trackedOutput.split(/\r?\n/).filter(Boolean);

    for (const file of trackedFiles) {
      assert.notEqual(file, '.env', '.env must never be tracked by git');
      const content = readFileSync(file, 'utf8');
      assert.doesNotMatch(
        content,
        /AQ\.Ab8RN6[A-Za-z0-9_-]+/,
        `Tracked file ${file} must never contain hardcoded Jules API keys`
      );
    }
  });

  it('ensures examples/crafted-knightvision.html uses safe DOM methods and never uses innerHTML or eval', () => {
    const html = readFileSync('examples/crafted-knightvision.html', 'utf8');
    assert.doesNotMatch(html, /\.(?:innerHTML|outerHTML)\s*=/);
    assert.doesNotMatch(html, /\beval\s*\(/);
  });
});
