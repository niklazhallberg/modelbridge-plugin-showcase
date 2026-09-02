// SHARED — loaded by both Node (require) AND browser (<script> in index.html).
// Browser: window.costTerms. Node: module.exports.
//
// CANONICAL SOURCE for the forbidden user-facing cost vocabulary of
// .claude/rules/cost-terminology.md. Enforced at TWO points, for the same
// reason js/shared/linkHosts.js is:
//
//   1. COMMIT time — scripts/check-cost-terminology.js over js/, css/,
//      node/prompts/, index.html, and remote/*.json.
//   2. MERGE time — errorTranslator.mergeRemoteOverrides(), over the OTA
//      error-copy payload. That payload supplies user-facing `action`,
//      `shortMessage` and `ctxTemplate.message`, and _remoteOverrides takes
//      PRECEDENCE over the built-in VALIDATION_TYPE_OVERRIDES — so a payload
//      is the last word on what an error says.
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

  var exports = { CHECKS: CHECKS, findForbidden: findForbidden };

  if (typeof module !== 'undefined' && module.exports) module.exports = exports;
  if (typeof window !== 'undefined') window.costTerms = exports;

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
