const fs = require('node:fs');

const packageVersion = fs.readFileSync('./package-version.txt', 'utf8');
fs.unlinkSync('./package-version.txt');

const readme = fs.readFileSync('./README.md', 'utf8');
fs.writeFileSync('./README.md', readme.replace(/## (?:\d+\.\d+\.\d+)/, '## '+packageVersion), 'utf8');

const package = fs.readFileSync('./package.json', 'utf8');
fs.writeFileSync('./package.json', package.replace(/"version":(\s*)"(?:\d+\.\d+\.\d+)",/, '"version":$1"'+packageVersion+'",'), 'utf8');