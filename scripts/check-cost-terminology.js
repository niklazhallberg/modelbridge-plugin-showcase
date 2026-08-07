#!/usr/bin/env node
/*
 * Cost-terminology guard (showcase mirror) — enforces the same rule as the
 * plugin repo's .claude/rules/cost-terminology.md, for this repo's buyer-facing
 * Markdown (README, ARCHITECTURE, ROADMAP, …).
 *
 * The dollar modelBridge shows is never fal.ai's invoice — only the usage fal.ai
 * reports x modelBridge's rate, or modelBridge's own formula. So
 * "Billed"/"actual cost"/"real cost"/"actual charge(s)"/"actually billed"/
 * "you were charged"/"billing history" are forbidden in this repo's marketing
 * copy, until a real per-request fal dollar exists (verify_billing endpoint).
 *
 * Use the vocabulary the plugin and docs use:
 *   Metered (fal usage x our rate) / Calculated (our formula) / Estimated (pre-run) /
 *   Learned / From / No price.
 *
 * Legitimate exceptions (copy pointing to fal.ai's OWN dashboard for an uncertain
 * charge, or a reserved/internal identifier) must carry a `cost-term-allow`
 * marker on the same line.
 *
 * Run: node scripts/check-cost-terminology.js   (also wired in CI — see
 * .github/workflows/cost-terminology.yml)
 */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var EXCLUDE_RE = /(^|\/)(node_modules|\.git)(\/|$)/i;

// Same forbidden set as the plugin guard. \bBilled\b matches the rendered word
// but not camelCase identifiers. The (?![-\w]) after "cost" avoids CSS-class /
// hyphen false positives. "actual charge(s)" tolerates an intervening word
// ("actual past charges") and the plural.
var CHECKS = [
  { re: /\bBilled\b/, label: 'Billed' },
  { re: /actual cost(?![-\w])/i, label: 'actual cost' },
  { re: /real cost(?![-\w])/i, label: 'real cost' },
  { re: /actual\s+(?:[\w.]+\s+){0,2}charges?\b/i, label: 'actual charge(s)' },
  { re: /what fal\.?ai charged/i, label: 'what fal.ai charged' },
  { re: /actually billed/i, label: 'actually billed' },
  { re: /you were charged/i, label: 'you were charged' },
  { re: /\bbilling history\b/i, label: 'billing history' }
];

var violations = [];

function scanFile(rel) {
  var abs = path.join(ROOT, rel);
  var text;
  try { text = fs.readFileSync(abs, 'utf8'); } catch (e) { return; }
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var raw = lines[i];
    if (raw.indexOf('cost-term-allow') !== -1) continue;
    for (var c = 0; c < CHECKS.length; c++) {
      if (CHECKS[c].re.test(raw)) {
        violations.push({ file: rel, line: i + 1, term: CHECKS[c].label, text: raw.trim().slice(0, 160) });
      }
    }
  }
}

function walk(relDir) {
  var absDir = path.join(ROOT, relDir);
  var entries;
  try { entries = fs.readdirSync(absDir, { withFileTypes: true }); } catch (e) { return; }
  for (var i = 0; i < entries.length; i++) {
    var name = entries[i].name;
    var rel = relDir ? path.join(relDir, name) : name;
    if (EXCLUDE_RE.test(rel.replace(/\\/g, '/'))) continue;
    if (entries[i].isDirectory()) walk(rel);
    else if (/\.md$/i.test(name)) scanFile(rel);
  }
}

walk('');

var SUGGEST = 'Metered (fal units x our rate) / Calculated (our formula) / Estimated (pre-run) / Learned / From / No price';
if (violations.length) {
  console.error('\nCost-terminology guard FAILED — ' + violations.length + ' forbidden user-facing term(s):\n');
  violations.forEach(function (v) {
    console.error('  ' + v.file + ':' + v.line + '  [' + v.term + ']  ->  use one of: ' + SUGGEST);
    console.error('      ' + v.text);
  });
  console.error('\nIf a use is legitimate (refers to fal.ai\'s own dashboard/invoice, or is a reserved/internal identifier),');
  console.error('add a `cost-term-allow` marker comment on that line.\n');
  process.exit(1);
}
console.log('Cost-terminology guard passed — no forbidden user-facing cost terms.');
process.exit(0);
