import fs from 'fs';
import path from 'path';

const key = process.argv[3];
const value = process.argv[4];
const filePath = process.argv[2];

if (!key || !value || !filePath) {
  console.error('Missing arguments');
  process.exit(1);
}

const file = fs.readFileSync(path.resolve(filePath), 'utf-8');
const newFile = file.replace(new RegExp(key, 'g'), value);

fs.writeFileSync(path.resolve(filePath), newFile, 'utf-8');

// Path: replacer.js
