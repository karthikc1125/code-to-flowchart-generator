#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { generateMermaid } from '../src/index.mjs';

async function main() {
  const [, , filePath, langArg] = process.argv;
  if (!filePath) {
    console.error('Usage: ast-to-mermaid <file> [language]');
    process.exit(1);
  }
  const code = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
  const mermaid = await generateMermaid({ code, language: langArg || 'auto' });
  process.stdout.write(mermaid + '\n');
}

main().catch(err => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});