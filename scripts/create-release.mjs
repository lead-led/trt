#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const allowedLevels = new Set(['patch', 'minor', 'major']);
const level = process.argv[2] ?? 'patch';

if (!allowedLevels.has(level)) {
	console.error(`Unknown release level "${level}". Use patch, minor, or major.`);
	process.exit(1);
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDirectory, '..');

const run = (command, args, options = {}) => {
	const result = spawnSync(command, args, {
		cwd: repoRoot,
		stdio: 'inherit',
		...options,
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}

	return result;
};

const statusResult = spawnSync('git', ['status', '--porcelain'], {
	cwd: repoRoot,
	encoding: 'utf8',
	stdio: ['inherit', 'pipe', 'inherit'],
});

if (statusResult.status !== 0) {
	process.exit(statusResult.status ?? 1);
}

if (statusResult.stdout.trim().length > 0) {
	console.error('Working tree is not clean. Commit or stash changes before releasing.');
	process.exit(1);
}

run('npm', ['run', level]);

const packagePath = path.join(repoRoot, 'package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
const version = pkg.version;

if (typeof version !== 'string' || version.length === 0) {
	console.error('Unable to read version from package.json after bump.');
	process.exit(1);
}

run('git', ['add', 'package.json']);
run('git', ['commit', '-m', `release: v${version}`]);
run('git', ['tag', `v${version}`]);
run('git', ['push']);
run('git', ['push', 'origin', `v${version}`]);

console.log(`Release v${version} created and pushed.`);
