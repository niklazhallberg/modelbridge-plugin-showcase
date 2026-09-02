#!/usr/bin/env node
/*
 * Cost-terminology guard (showcase mirror) — enforces the same rule as the
 * plugin repo's .claude/rules/cost-terminology.md, for this repo's buyer-facing
 * Markdown (README, ARCHITECTURE, ROADMAP, …) and the OTA JSON payloads.
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
 * marker comment on the same line — or, in a JSON payload where comments cannot
 * exist, a "_costTermAllow": "<reason>" key on the enclosing object.
 *
 * ONE list, one source. The forbidden-term regexes come from the plugin repo's
 * js/shared/costTerms.js, vendored byte-for-byte at scripts/vendor/costTerms.js
 * because CI checks out this repo alone and cannot require across repositories.
 * This guard byte-compares the vendored copy against the plugin source whenever
 * that source is present on disk (every machine that could mint drift has both
 * repos), and FAILS on divergence — drift is an error, not a silent property.
 * Where the source is absent (CI), that is said out loud rather than skipped
 * silently. This repo carried its own copy of the list until 2026-09-02, and it
 * had drifted: the plugin's \bBilled\b went case-insensitive on 2026-08-18 and
 * the copy here stayed case-sensitive, so a rendered lowercase "billed" passed.
 *
 * Run: node scripts/check-cost-terminology.js   (also wired in CI — see
 * .github/workflows/cost-terminology.yml — and in .githooks/pre-commit)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

var ROOT = path.resolve(__dirname, '..');
var EXCLUDE_RE = /(^|\/)(node_modules|\.git)(\/|$)/i;

// ---- Parity: the vendored list must equal the plugin source, where visible ----
var VENDORED = path.join(__dirname, 'vendor', 'costTerms.js');
var SOURCE = process.env.MB_COSTTERMS_SOURCE || path.join(
  os.homedir(),
  'Library/Application Support/Adobe/CEP/extensions/com.fittoframe/js/shared/costTerms.js'
);
if (fs.existsSync(SOURCE)) {
  var vendoredBytes = fs.readFileSync(VENDORED);
  var sourceBytes = fs.readFileSync(SOURCE);
  if (!vendoredBytes.equals(sourceBytes)) {
    console.error('\nCost-terminology guard FAILED — vendored term list has drifted from its source:');
    console.error('  vendored: scripts/vendor/costTerms.js');
    console.error('  source:   ' + SOURCE);
    console.error('\nRe-vendor it (byte-for-byte) and commit the copy together with whatever needed the change:');
    console.error('  cp "' + SOURCE + '" scripts/vendor/costTerms.js\n');
    process.exit(1);
  }
} else {
  // CI has no plugin checkout — the vendored copy is used as-is here, and the
  // parity check runs at commit time on the machine where drift can be minted.
  console.log('costTerms parity: source not present (CI?) — vendored copy used unverified here; parity is enforced by the pre-commit hook where both repos exist.');
}

var CHECKS = require(VENDORED).CHECKS;

var violations = [];
var scanned = 0;

// JSON has no comments, so the `cost-term-allow` line marker cannot exist in a
// payload. Instead an OBJECT may carry "_costTermAllow": "<reason>", which
// exempts that object's own string values and everything under it — the
// JSON-native equivalent, and it forces the reason to be written down exactly
// as the comment form does. Same semantics as the plugin guard's scanJson.
function scanJson(rel, text) {
  var data = JSON.parse(text);
  (function visit(node, trail) {
    if (node === null || node === undefined) return;
    if (typeof node === 'string') {
      for (var c = 0; c < CHECKS.length; c++) {
        if (CHECKS[c].re.test(node)) {
          violations.push({ file: rel, line: trail || '(root)', term: CHECKS[c].label,
                            text: node.trim().slice(0, 160) });
        }
      }
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) visit(node[i], trail + '[' + i + ']');
      return;
    }
    if (typeof node === 'object') {
      if (node._costTermAllow) return;   // exempt this object and everything under it
      var keys = Object.keys(node);
      for (var k = 0; k < keys.length; k++) {
        if (keys[k] === '_costTermAllow') continue;
        visit(node[keys[k]], trail ? trail + '.' + keys[k] : keys[k]);
      }
    }
  })(data, '');
}

function scanLines(rel, text) {
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

function scanFile(rel) {
  var abs = path.join(ROOT, rel);
  var text;
  try { text = fs.readFileSync(abs, 'utf8'); } catch (e) { return; }
  scanned++;
  if (/\.json$/i.test(rel)) {
    // A payload that does not parse still gets scanned — as text lines — so a
    // malformed file cannot slip out of coverage. (_costTermAllow only exists
    // for parseable JSON; an unparseable payload cannot ship anyway.)
    try { scanJson(rel, text); } catch (e) { scanLines(rel, text); }
    return;
  }
  scanLines(rel, text);
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
    else if (/\.(md|json)$/i.test(name)) scanFile(rel);
  }
}

walk('');

// A guard that scanned nothing must not report success. Without this, a bad
// EXCLUDE_RE or a moved ROOT turns the guard into a green light that has looked
// at no files at all — which reads as evidence while proving nothing.
if (scanned === 0) {
  console.error('Cost-terminology guard FAILED — scanned 0 files. Check the extension filter / EXCLUDE_RE / ROOT.');
  process.exit(1);
}

var SUGGEST = 'Metered (fal units x our rate) / Calculated (our formula) / Estimated (pre-run) / Learned / From / No price';
if (violations.length) {
  console.error('\nCost-terminology guard FAILED — ' + violations.length + ' forbidden user-facing term(s):\n');
  violations.forEach(function (v) {
    console.error('  ' + v.file + ':' + v.line + '  [' + v.term + ']  ->  use one of: ' + SUGGEST);
    console.error('      ' + v.text);
  });
  console.error('\nIf a use is legitimate (refers to fal.ai\'s own dashboard/invoice, or is a reserved/internal identifier),');
  console.error('add a `cost-term-allow` marker comment on that line');
  console.error('(or, in a JSON payload, a "_costTermAllow": "<reason>" key on the enclosing object).\n');
  process.exit(1);
}
console.log('Cost-terminology guard passed — ' + scanned + ' files scanned, no forbidden user-facing cost terms.');
process.exit(0);
