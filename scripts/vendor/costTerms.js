// SHARED — loaded by both Node (require) AND browser (<script> in index.html).
// Browser: window.costTerms. Node: module.exports.
//
// CANONICAL SOURCE for the forbidden user-facing cost vocabulary of
// .claude/rules/cost-terminology.md. Enforced at THREE points, for the same
// reason js/shared/linkHosts.js is:
//
//   1. COMMIT time — scripts/check-cost-terminology.js over js/, css/,
//      node/prompts/, index.html, and remote/*.json.
//   2. MERGE time — errorTranslator.mergeRemoteOverrides(), over the OTA
//      error-copy payload. That payload supplies user-facing `action`,
//      `shortMessage` and `ctxTemplate.message`, and _remoteOverrides takes
//      PRECEDENCE over the built-in VALIDATION_TYPE_OVERRIDES — so a payload
//      is the last word on what an error says.
//   3. The docs site's pre-commit (modelbridge-site,
//      starlight-docs/scripts/check-cost-terminology.cjs) requires THIS file
//      through MB_PLUGIN_ROOT or the plugin's local path — since 2026-09-05,
//      when its own copy of the list was found to have drifted on case.
//
// Measured 2026-08-20: injecting "You were charged for this. See the actual
// cost you were Billed." into remote/error-copy.json left the commit guard
// GREEN, because it never scanned remote/. The string would have rendered in a
// customer's error banner. Same shape as the link-host hole found the same day.
//
// Why these words are forbidden at all: fal.ai returns a usage COUNT
// (x-fal-billable-units), never a per-generation dollar. Every figure the
// product shows is units x modelBridge's rate — a calculation, not an invoice.
// "Billed" is reserved until a request-level fal dollar exists.

(function (root) {
  'use strict';

  // Keep in step with CHECKS in scripts/check-cost-terminology.js — that file
  // now imports this list rather than declaring its own.
  var CHECKS = [
    { re: /\bBilled\b/i, label: 'Billed' },
    { re: /actual cost(?![-\w])/i, label: 'actual cost' },
    { re: /real cost(?![-\w])/i, label: 'real cost' },
    { re: /actual\s+(?:[\w.]+\s+){0,2}charges?\b/i, label: 'actual charge(s)' },
    { re: /what fal\.?ai charged/i, label: 'what fal.ai charged' },
    { re: /actually billed/i, label: 'actually billed' },
    { re: /you were charged/i, label: 'you were charged' },
    { re: /\bbilling history\b/i, label: 'billing history' }
  ];

  /** First forbidden term in `text`, or null. */
  function findForbidden(text) {
    if (typeof text !== 'string' || !text) return null;
    for (var i = 0; i < CHECKS.length; i++) {
      if (CHECKS[i].re.test(text)) return CHECKS[i].label;
    }
    return null;
  }

  // A provider's own field description is shown as help text beside the field
  // (the hint under it and the (i) box, on a single card and for the second
  // model of a pair). fal.ai writes "Billed per sample." there (Mirelo SFX
  // num_samples, live test round seven, R70). The words are theirs, the panel
  // showing them is ours, so the forbidden terms are reworded on the way to the
  // screen, for every model. What cannot be reworded is not shown: a sentence
  // that still carries a forbidden term after the rewording is dropped.
  var PROVIDER_REWORDS = [
    [/\bactually billed\b/gi, 'charged'],
    [/\bbilling history\b/gi, 'usage history'],
    [/\bbilled\b/gi, 'charged'],
    [/\bbilling\b/gi, 'pricing'],
    [/\b(actual|real) cost(?![-\w])/gi, 'cost']
  ];
  function _sameCase(from, to) {
    if (from === from.toUpperCase() && from !== from.toLowerCase()) return to.toUpperCase();
    if (from.charAt(0) === from.charAt(0).toUpperCase() && from.charAt(0) !== from.charAt(0).toLowerCase()) return to.charAt(0).toUpperCase() + to.slice(1);
    return to;
  }
  function rewordProviderText(text) {
    if (typeof text !== 'string' || !text) return text;
    var out = text;
    for (var i = 0; i < PROVIDER_REWORDS.length; i++) {
      out = out.replace(PROVIDER_REWORDS[i][0], (function (to) { return function (m) { return _sameCase(m, to); }; })(PROVIDER_REWORDS[i][1]));
    }
    if (findForbidden(out)) {
      out = out.split(/(?<=[.!?])\s+/).filter(function (sentence) { return !findForbidden(sentence); }).join(' ');
    }
    return out;
  }

  var exports = { CHECKS: CHECKS, findForbidden: findForbidden, rewordProviderText: rewordProviderText };

  if (typeof module !== 'undefined' && module.exports) module.exports = exports;
  if (typeof window !== 'undefined') window.costTerms = exports;

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
