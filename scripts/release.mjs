import 'dotenv/config.js';
import { spawn } from 'node:child_process';

const args = [
  '--config',
  'electron-builder.json',
  '--publish',
  'always',
  '-mw',
];

const child = spawn('electron-builder', args, {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
