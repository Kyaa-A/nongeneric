#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Platform = 'claude' | 'codex' | 'cli';

interface PlatformConfig {
  manifest: string;
  remote: string;
  message(installed: string, latest: string): string;
}

interface Manifest {
  name?: unknown;
  version?: unknown;
}

interface CacheRecord {
  platform?: unknown;
  version?: unknown;
  checkedAt?: unknown;
}

const CONFIG: Record<Platform, PlatformConfig> = {
  cli: {
    manifest: 'package.json',
    remote: 'https://raw.githubusercontent.com/Kyaa-A/nongeneric/main/package.json',
    message(installed, latest) {
      return `nongeneric ${installed} -> ${latest} update available\nUpdate using your original installation method:\nhttps://github.com/Kyaa-A/nongeneric#keeping-your-installation-current`;
    },
  },
  claude: {
    manifest: '.claude-plugin/plugin.json',
    remote: 'https://raw.githubusercontent.com/Kyaa-A/nongeneric/main/.claude-plugin/plugin.json',
    message(installed, latest) {
      return `nongeneric ${installed} -> ${latest} update available\nRun:\n  claude plugin marketplace update nongeneric\n  claude plugin update nongeneric@nongeneric\nThen restart Claude Code or run /reload-plugins.`;
    },
  },
  codex: {
    manifest: '.codex-plugin/plugin.json',
    remote: 'https://raw.githubusercontent.com/Kyaa-A/nongeneric/main/.codex-plugin/plugin.json',
    message(installed, latest) {
      return `nongeneric ${installed} -> ${latest} update available\nRun:\n  codex plugin marketplace upgrade nongeneric\n  codex plugin remove nongeneric@nongeneric\n  codex plugin add nongeneric@nongeneric\nThen start a new Codex session.`;
    },
  },
};

const CACHE_FILE = 'update-check.json';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 3000;
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function argsToObject(args: string[]): Record<string, string> | null {
  const result: Record<string, string> = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || value === undefined) return null;
    result[key.slice(2)] = value;
  }
  return result;
}

type Semver = readonly [string, string, string];

function parseVersion(value: unknown): Semver | null {
  const match = typeof value === 'string' ? SEMVER.exec(value) : null;
  return match ? [match[1]!, match[2]!, match[3]!] : null;
}

function isNewer(current: Semver, latest: Semver): boolean {
  for (let index = 0; index < 3; index += 1) {
    const currentPart = current[index]!;
    const latestPart = latest[index]!;
    if (latestPart.length !== currentPart.length) {
      return latestPart.length > currentPart.length;
    }
    if (latestPart !== currentPart) return latestPart > currentPart;
  }
  return false;
}

async function freshCache(data: string, platform: Platform, installed: string, ttlMs: number): Promise<boolean> {
  const cache = JSON.parse(await readFile(join(data, CACHE_FILE), 'utf8')) as CacheRecord;
  return (
    cache.platform === platform &&
    cache.version === installed &&
    typeof cache.checkedAt === 'number' &&
    Number.isFinite(cache.checkedAt) &&
    Date.now() - cache.checkedAt >= 0 &&
    Date.now() - cache.checkedAt < ttlMs
  );
}

async function writeCache(data: string, platform: Platform, installed: string): Promise<void> {
  await mkdir(data, { recursive: true, mode: 0o700 });
  const destination = join(data, CACHE_FILE);
  const temporary = join(data, `.${CACHE_FILE}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`);
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(`${JSON.stringify({ platform, version: installed, checkedAt: Date.now() })}\n`);
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporary, destination);
  } finally {
    await handle?.close().catch(() => {});
    await unlink(temporary).catch(() => {});
  }
}

const terminalCheck = process.argv[process.argv.indexOf('--platform') + 1] === 'cli';

async function main(): Promise<void> {
  if (process.env.NONGENERIC_UPDATE_CHECK === '0') {
    if (terminalCheck) process.stdout.write('Update checks disabled by NONGENERIC_UPDATE_CHECK=0.\n');
    return;
  }
  const args = argsToObject(process.argv.slice(2));
  if (!args && terminalCheck) throw new Error('Invalid arguments');
  const platform = args?.platform;
  if (!args || (platform !== 'claude' && platform !== 'codex' && platform !== 'cli')) return;
  if (platform !== 'cli' && (!args.root || !args.data)) return;
  const root = args.root ?? fileURLToPath(new URL('..', import.meta.url));
  const config = CONFIG[platform];

  const manifest = JSON.parse(await readFile(join(root, config.manifest), 'utf8')) as Manifest;
  if (manifest?.name !== 'nongeneric') throw new Error('Invalid installed manifest');
  const current = parseVersion(manifest.version);
  if (!current) throw new Error('Invalid installed version');

  try {
    if (platform !== 'cli' && await freshCache(args.data!, platform, manifest.version as string, DEFAULT_TTL_MS)) return;
  } catch {}

  const response = await fetch(new URL(config.remote), { signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS) });
  if (!response.ok) throw new Error('Update request failed');
  const remote = (await response.json()) as Manifest;
  if (remote?.name !== 'nongeneric') throw new Error('Invalid remote manifest');
  const latest = parseVersion(remote.version);
  if (!latest) throw new Error('Invalid remote version');

  try {
    if (platform !== 'cli') await writeCache(args.data!, platform, manifest.version as string);
  } catch {}

  if (platform === 'cli') {
    process.stdout.write(isNewer(current, latest)
      ? `${config.message(manifest.version as string, remote.version as string)}\n`
      : `No newer version available (installed ${manifest.version}).\n`);
    return;
  }

  if (isNewer(current, latest)) {
    process.stdout.write(
      `${JSON.stringify({
        continue: true,
        systemMessage: config.message(manifest.version as string, remote.version as string),
      })}\n`
    );
  }
}

await main().catch(() => {
  if (terminalCheck) {
    process.stderr.write('Could not check for updates. Check your installation, arguments, and connection.\n');
    process.exitCode = 1;
  }
});
