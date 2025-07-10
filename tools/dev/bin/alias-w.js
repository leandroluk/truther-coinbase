#!/usr/bin/env node

try {
  require.resolve('chokidar');
} catch {
  console.error('❌ "chokidar-cli" is not installed. Add it as a dependency in @libs/dev.');
  process.exit(1);
}

const {spawn} = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const binExt = isWindows ? '.cmd' : '';

const exec = path.resolve(__dirname, '../node_modules/.bin/chokidar' + binExt);
const execTscAlias = path.resolve(__dirname, '../node_modules/.bin/tsc-alias' + binExt);
const args = ['dist/**/*.js', '-c', `"${execTscAlias}"`];

spawn(exec, args, {stdio: 'inherit', shell: true}).on('exit', (code) => process.exit(code));
