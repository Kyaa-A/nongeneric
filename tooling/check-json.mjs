import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.codex-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.agents/plugins/marketplace.json',
  'hooks/hooks.json',
  'hooks/codex-hooks.json',
];

const documents = Object.fromEntries(
  await Promise.all(
    files.map(async (file) => [file, JSON.parse(await readFile(file, 'utf8'))])
  )
);
const version = documents['package.json'].version;

assert.equal(documents['.claude-plugin/plugin.json'].version, version);
assert.equal(documents['.codex-plugin/plugin.json'].version, version);
assert.equal(documents['.cursor-plugin/plugin.json'].version, version);
assert.equal(documents['.agents/plugins/marketplace.json'].plugins[0].version, version);
