/**
 * FSTI UWG - QA Automation Utils
 * Senior QA Automation Engineer
 * Utilitas bersama untuk pengujian E2E tanpa browser binary (jsdom + static analysis)
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf-8');
}

function loadDOM(htmlRel, opts = {}) {
  const html = readFile(htmlRel);
  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    ...opts
  });
  return { dom, html };
}

function checkCssContains(patterns) {
  const css = readFile('css/style.css') + '\n' + readFile('css/tailwind.css');
  return patterns.map(p => {
    const regex = typeof p === 'string' ? new RegExp(p, 'i') : p;
    return regex.test(css);
  });
}

function logResult(scenario, testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const time = new Date().toISOString();
  const line = `[${time}] [${scenario}] ${icon} ${testName} :: ${status}${details ? ' | ' + details : ''}`;
  console.log(line);
  return { scenario, testName, status, details, timestamp: time };
}

module.exports = { readFile, loadDOM, checkCssContains, logResult, ROOT };
