#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';

type Platform = 'claude' | 'codex';

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

async function main(): Promise<void> {
  if (process.env.NONGENERIC_UPDATE_CHECK === '0') return;
  const args = argsToObject(process.argv.slice(2));
  const platform = args?.platform;
  if (!args || (platform !== 'claude' && platform !== 'codex') || !args.root || !args.data) return;
  const config = CONFIG[platform];

  const manifest = JSON.parse(await readFile(join(args.root, config.manifest), 'utf8')) as Manifest;
  if (manifest.name !== 'nongeneric') return;
  const current = parseVersion(manifest.version);
  if (!current) return;

  try {
    if (await freshCache(args.data, platform, manifest.version as string, DEFAULT_TTL_MS)) return;
  } catch {}

  const response = await fetch(new URL(config.remote), { signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS) });
  if (!response.ok) return;
  const remote = (await response.json()) as Manifest;
  if (remote?.name !== 'nongeneric') return;
  const latest = parseVersion(remote.version);
  if (!latest) return;

  try {
    await writeCache(args.data, platform, manifest.version as string);
  } catch {}

  if (isNewer(current, latest)) {
    process.stdout.write(
      `${JSON.stringify({
        continue: true,
        systemMessage: config.message(manifest.version as string, remote.version as string),
      })}\n`
    );
  }
}

await main().catch(() => {});
