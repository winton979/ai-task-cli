import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { init } from './init.js';

const cwd = process.cwd();
const cmd = process.argv[2];

const log = {
  info(msg) { console.log(msg); },
  chalk: {
    green(msg) { console.log(chalk.green(msg)); },
    dim(msg) { console.log(chalk.dim(msg)); },
  },
};

function showHelp() {
  console.log(`\
task - Lightweight AI-assisted task workflow

Usage:
  task init     Initialize task workflow in current directory
  task --help   Show this help`);
}

switch (cmd) {
  case 'init':
    init(cwd, { fs, path, log });
    break;
  case undefined:
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}