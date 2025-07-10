#!/usr/bin/env node

const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const binExt = isWindows ? '.cmd' : '';
const exec = path.resolve(__dirname, '../node_modules/.bin/concurrently' + binExt);

if (!fs.existsSync(exec)) {
  console.error('❌ "concurrently" is not installed. Add it as a dependency in @libs/dev.');
  process.exit(1);
}

const pkgPath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error(`❌ package.json not found in ${process.cwd()}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const packageName = pkg.name || 'root';

const devScripts = Object.entries(pkg.scripts || {}).filter(([key]) => key.startsWith('dev:'));

if (devScripts.length === 0) {
  console.log(`❌ No dev:* scripts found in ${pkgPath}`);
  process.exit(1);
}

const colors = ['cyan', 'green', 'magenta', 'blue', 'yellow', 'red', 'gray'];
const repeatedColors = Array.from({length: devScripts.length}, (_, i) => colors[i % colors.length]);

const args = [
  '--raw',
  '--prefix', '[{name}]',
  '--names', devScripts.map(([key]) => `${packageName}:${key}`).join(','),
  '--prefix-colors', repeatedColors.join(','),
  ...devScripts.map(([key]) => `"pnpm run ${key}"`)
];

spawn(exec, args, {stdio: 'inherit', shell: isWindows}).on('exit', code => process.exit(code));
