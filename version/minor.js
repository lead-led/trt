import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootPackagePath = path.resolve(currentDirectory, '../package.json');

try {
	if (!fs.existsSync(rootPackagePath)) {
		throw new Error(`Root package.json not found at ${rootPackagePath}`);
	}

	// if (!fs.existsSync(buildPackagePath)) {
	// 	throw new Error(`Build package.json not found at ${buildPackagePath}`);
	// }

	const rawdata = fs.readFileSync(rootPackagePath);
	// @ts-ignore
	const pkg = JSON.parse(rawdata);
	const { version } = pkg;
	const a = version.split('.');
	const major = parseInt(a[0], 10);
	let minor = parseInt(a[1], 10);
	let patch = parseInt(a[2], 10);

	minor += 1;
	patch = 0;

	const newVersion = `${major}.${minor}.${patch}`;

	pkg.version = newVersion;
	const newPackage = JSON.stringify(pkg, null, 2);

	// const rawdataBuild = fs.readFileSync(buildPackagePath);
	// const packageBuild = JSON.parse(rawdataBuild);
	// packageBuild.version = newVersion;
	// const newPackageBuild = JSON.stringify(packageBuild, null, 2);

	fs.writeFileSync(rootPackagePath, newPackage);
	// fs.writeFileSync(buildPackagePath, newPackageBuild);

	console.log('Version updated successfully.');
} catch (error) {
	console.error('An error occurred:', error);
}
