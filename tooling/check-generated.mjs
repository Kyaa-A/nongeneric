import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const CORE_FILES = [
  'types.js',
  'rules-registry.js',
  'detector.js',
  'catalog.js',
  'concept-seed.js',
  'tokens.js',
  'motion-planner.js',
  'auditor.js',
  'nongeneric.js',
];

const output = await mkdtemp(join(tmpdir(), 'nongeneric-generated-'));

try {
  const compiler = resolve('node_modules/typescript/bin/tsc');
  const result = spawnSync(process.execPath, [compiler, '--outDir', output], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const filename of CORE_FILES) {
    const [generated, committed] = await Promise.all([
      readFile(join(output, filename), 'utf8'),
      readFile(resolve('scripts', filename), 'utf8'),
    ]);
    assert.equal(committed, generated, `${filename} is stale; run npm run build`);
  }
} finally {
  await rm(output, { recursive: true, force: true });
}
