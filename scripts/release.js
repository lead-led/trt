import prompts from 'prompts';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

async function main() {
	console.log('🚀 Starting Release Workflow...');

	// 1. Check for GH_TOKEN
	if (!process.env.GH_TOKEN) {
		console.warn('\n⚠️  WARNING: GH_TOKEN is not set in your environment.');
		console.warn(
			'The local publish step requires this token to upload artifacts to GitHub Releases.',
		);
		const { continueWithoutToken } = await prompts({
			type: 'confirm',
			name: 'continueWithoutToken',
			message: 'Do you want to continue anyway? (Build might fail or not upload)',
			initial: false,
		});
		if (!continueWithoutToken) {
			console.log('Aborting.');
			process.exit(1);
		}
	}

	// 2. Get current version
	const pkgContent = fs.readFileSync(packageJsonPath, 'utf-8');
	const pkg = JSON.parse(pkgContent);
	const currentVersion = pkg.version;
	console.log(`\n📦 Current version: ${currentVersion}`);

	// 3. Prompt for bump
	const { bumpType } = await prompts({
		type: 'select',
		name: 'bumpType',
		message: 'Select version bump type:',
		choices: [
			{ title: 'Patch (x.x.X)', value: 'patch' },
			{ title: 'Minor (x.X.0)', value: 'minor' },
			{ title: 'Major (X.0.0)', value: 'major' },
			{ title: 'Custom', value: 'custom' },
		],
	});

	if (!bumpType) {
		console.log('Cancelled.');
		process.exit(0);
	}

	let newVersion;
	if (bumpType === 'custom') {
		const { customVersion } = await prompts({
			type: 'text',
			name: 'customVersion',
			message: 'Enter custom version:',
		});
		if (!customVersion) {
			console.log('Cancelled.');
			process.exit(0);
		}
		newVersion = customVersion;
	} else {
		const parts = currentVersion.split('.').map(Number);
		if (bumpType === 'major') {
			parts[0]++;
			parts[1] = 0;
			parts[2] = 0;
		} else if (bumpType === 'minor') {
			parts[1]++;
			parts[2] = 0;
		} else {
			parts[2]++;
		}
		newVersion = parts.join('.');
	}

	console.log(`\n✨ New version will be: ${newVersion}`);

	const { confirm } = await prompts({
		type: 'confirm',
		name: 'confirm',
		message: 'Proceed with release? (Updates package.json, commits, tags, pushes, and builds)',
		initial: true,
	});

	if (!confirm) {
		console.log('Cancelled.');
		process.exit(0);
	}

	try {
		// 4. Update package.json
		pkg.version = newVersion;
		// Detect indentation
		const indent = pkgContent.includes('\t') ? '\t' : 2;
		fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, indent) + '\n');
		console.log('\n✅ Updated package.json');

		// 5. Git commit and tag
		console.log('📝 Committing and tagging...');
		execSync(`git add package.json`, { stdio: 'inherit', cwd: rootDir });
		execSync(`git commit -m "chore: release v${newVersion}"`, {
			stdio: 'inherit',
			cwd: rootDir,
		});
		execSync(`git tag v${newVersion}`, { stdio: 'inherit', cwd: rootDir });

		// 6. Push
		console.log('☁️  Pushing to remote...');
		execSync('git push && git push --tags', { stdio: 'inherit', cwd: rootDir });
		console.log(
			'✅ Pushed changes and tags. GitHub Action for Windows build should be triggered.',
		);

		// 7. Run local build
		console.log('\n🔨 Starting local build and publish (Mac/Linux)...');
		execSync('npm run publish:local', { stdio: 'inherit', cwd: rootDir });

		console.log('\n🎉 Release workflow completed successfully!');
	} catch (error) {
		console.error('\n❌ An error occurred during the release process:');
		console.error(error.message);
		process.exit(1);
	}
}

main();
