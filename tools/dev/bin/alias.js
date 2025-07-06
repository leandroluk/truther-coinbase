#!/usr/bin/env node

try {
  require.resolve('tsc-alias');
} catch {
  console.error('❌ "tsc-alias" is not installed. Add it as a dependency in @libs/dev.');
  process.exit(1);
}

const {spawn} = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const binExt = isWindows ? '.cmd' : '';

const exec = path.resolve(__dirname, '../node_modules/.bin/tsc-alias' + binExt);
spawn(exec, {stdio: 'inherit', shell: true}).on('exit', code => process.exit(code));
