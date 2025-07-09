#!/usr/bin/env node
const {spawn} = require('child_process');
const chokidar = require('chokidar');
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');


const red = str => `\x1b[31m${str}\x1b[0m`;
const green = str => `\x1b[32m${str}\x1b[0m`;
const cyan = str => `\x1b[36m${str}\x1b[0m`;
const bold = str => `\x1b[1m${str}\x1b[0m`;

const ROOT = process.cwd();

const patterns = process.argv.slice(2);

if (patterns.length === 0) {
  console.error('❌ You must pass at least one glob pattern as an argument..');
  process.exit(1);
}

const isWindows = process.platform === 'win32';

/** @param  {...any} args */
function log(...args) {
  console.log('[watch-build]', ...args);
}

/** @returns {Map<string, string>} */
function findAllPackages() {
  const entries = fg.sync('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', '**/.next/**'],
    absolute: true,
  });

  const map = new Map();
  for (const file of entries) {
    try {
      const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (pkg.name) {
        map.set(path.normalize(path.dirname(file)), pkg.name);
      }
    } catch (error) {
      log(error.message);
      process.exit(1);
    }
  }
  return map;
}

/**
 * @param {Map<string, string>} pkgMap
 * @param {string} filePath
 * @returns {string | null}
 */
function findClosestPackage(pkgMap, filePath) {
  let dir = path.dirname(path.resolve(filePath));
  const root = path.resolve(ROOT);

  while (dir.startsWith(root)) {
    if (pkgMap.has(dir)) {
      return pkgMap.get(dir);
    }

    const next = path.dirname(dir);
    if (next === dir) break;
    dir = next;
  }

  return null;
}
const pkgMap = findAllPackages();

/** @type {Set<string>} */
const scheduled = new Set();

function debounceFn(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const runBuilds = debounceFn(() => {
  const list = Array.from(scheduled);
  scheduled.clear();
  list.forEach(pkg => {
    log(`📦 Rebuilding ${bold(cyan(pkg))}`);
    const proc = spawn('pnpm', ['--filter', pkg, 'build'], {
      cwd: ROOT,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';

    proc.stderr.on('data', data => {
      stderr += data.toString();
    });

    proc.on('exit', code => {
      if (code !== 0 || stderr.trim()) {
        log(`❌ ${red('Build failed')} for ${bold(cyan(pkg))}:\n${stderr.trim()}`);
      } else {
        log(`✅ Build done for ${bold(green(pkg))}`);
      }
    });
  });
}, 300);


/** @param {string} pkgName */
function scheduleBuild(pkgName) {
  scheduled.add(pkgName);
  runBuilds();
}

const ignorePattern = (pathStr) => {
  const normalizedPath = pathStr.split(path.sep).join('/');
  return [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/out/',
    '/.next/',
    '/.turbo/',
  ].some(matcher => normalizedPath.includes(matcher));
};
async function main() {
  const globPatterns = await Array.fromAsync(fs.promises.glob(patterns))

  const watcher = chokidar.watch(globPatterns, {
    cwd: ROOT,
    ignored: ignorePattern,
    ignoreInitial: true,
  });

  watcher.on('all', (_, filePath) => {
    const abs = path.resolve(ROOT, filePath);
    const pkgName = findClosestPackage(pkgMap, abs);
    if (pkgName) scheduleBuild(pkgName);
  });

  log('👀 Watching for changes on patterns:', patterns.join(', '));

}
void main()
