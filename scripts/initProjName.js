#!/usr/bin/env node
/**
 * Interactive script to rename the project throughout the codebase.
 * Run via: npm run initProjName
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TEMPLATE_NAME = 'angular-20-template';
const TEMPLATE_PASCAL_NAME = 'Angular20Template';

const FILES_TO_UPDATE = [
  'package.json',
  'package-lock.json',
  'angular.json',
  'README.md',
  'Gruntfile.js',
  'temp_gruntfile.js',
  'STANDARDS.md',
  '.cursor/skills/toch-standards-skill/reference/01-meta-versions-structure.md'
];

const PASCAL_FILES_TO_UPDATE = [
  'src/index.html'
];

function replaceProjectName(content, newName) {
  return content.split(TEMPLATE_NAME).join(newName);
}

function toPascalCase(kebab) {
  return kebab.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter new project name (kebab-case, e.g. my-project): ', (projName) => {
  const trimmed = projName.trim();

  if (!trimmed || !/^[a-z][a-z0-9-]*$/.test(trimmed)) {
    console.error('Invalid project name. Use kebab-case (e.g. my-project).');
    rl.close();
    process.exit(1);
  }

  if (trimmed === TEMPLATE_NAME) {
    console.error(`Project name is already "${TEMPLATE_NAME}". Choose a different name.`);
    rl.close();
    process.exit(1);
  }

  const root = path.resolve(__dirname, '..');
  let updatedCount = 0;
  let skippedCount = 0;

  FILES_TO_UPDATE.forEach((relPath) => {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipped ${relPath} (not found)`);
      skippedCount += 1;
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const updated = replaceProjectName(content, trimmed);

    if (updated === content) {
      console.log(`No changes in ${relPath}`);
      return;
    }

    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Updated ${relPath}`);
    updatedCount += 1;
  });

  const newPascalName = toPascalCase(trimmed);

  PASCAL_FILES_TO_UPDATE.forEach((relPath) => {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipped ${relPath} (not found)`);
      skippedCount += 1;
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const updated = content.split(TEMPLATE_PASCAL_NAME).join(newPascalName);

    if (updated === content) {
      console.log(`No changes in ${relPath}`);
      return;
    }

    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Updated ${relPath} (title: ${newPascalName})`);
    updatedCount += 1;
  });

  console.log(`\nProject renamed to "${trimmed}". ${updatedCount} file(s) updated.`);
  if (skippedCount > 0) {
    console.log(`${skippedCount} file(s) skipped (missing).`);
  }
  console.log('Review changes before committing.');

  rl.close();
});
