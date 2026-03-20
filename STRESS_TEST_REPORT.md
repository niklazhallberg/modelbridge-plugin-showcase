# modelBridge — Stress Test Report

## Overview

Comprehensive stress testing conducted March 5–13, 2026 across six test suites covering error handling, dual mode edge cases, preview/import actions, timeline replacement, server crash recovery, and background generation tracking. Testing performed via Chrome DevTools Protocol (CDP) at `localhost:8089`, code path analysis, DOM mutation monitoring, and state injection against a live Premiere Pro 2025 (v25.x) environment.

All tests targeted the panel layer (JS/HTML/CSS in Chromium) and the Node.js backend (`node/server.js` on port 3000). ExtendScript (JSX) functions were exercised through their `CSInterface.evalScript()` call sites.

---

## Test Suites

### Suite 1 — Error System (Tests 1–14)

Validated the three-layer error defense: schema-driven preflight, self-learning constraint cache, and human-readable error translation.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| 1 | Preflight blocks undersized image (128x128 on 300x300 min) | Pass | Red border, "INVALID MEDIA", Generate disabled |
| 2 | Preflight blocks oversized video file (>500 MB default) | Pass | File size read via ExtendScript, specific error with numbers |
| 3 | Preflight blocks out-of-range aspect ratio | Pass | Computed ratio compared against min/max from schema |
| 4 | Preflight blocks video too long (exceeds max duration) | Pass | Clip duration from Premiere metadata |
| 5 | 0x0 dimension fallback via browser Image API | Pass | CEP Chromium `file://` access reads dimensions when Premiere returns 0x0 |
| 6 | Self-learning: constraint parsed from 422 error, saved per model | Pass | Dual persistence (localStorage + disk file) |
| 7 | Self-learning: learned constraint enforced on next selection | Pass | Preflight catches previously-unknown limit without API call |
| 8 | Self-learning: acknowledgment shows only on first learn | Pass | "Requirement saved" suppressed on repeat errors for same model |
| 9 | UNKNOWN error fallback — no raw API text leaked to user | Pass | Fixed during testing — raw text replaced with static message (`4b8a36e`) |
| 10 | Continue Anyway path — extractedMedia guard | Pass | Fixed during testing — `typeof` check added (`962805e`) |
| 11 | Error banners: WHAT / WHY / WHAT TO DO pattern | Pass | 17 pattern categories verified |
| 12 | Sticky banners for AUTH, BALANCE, SERVER_DOWN | Pass | Persistent flag prevents auto-dismiss; X button still works (`3fa1e93`) |
| 13 | Persistent banner visual indicator + z-index | Pass | Fixed during testing — explicit z-index prevents overlap (`941fff2`) |
| 14 | Clickable fal.ai URLs in error banners | Pass | `data-open-url` spans, HTML escape bypass for static strings (`98f40bc`) |

### Suite 2 — Dual Mode Edge Cases (Tests 15–28)

Validated parallel generation, field compatibility, cost tracking, and model-switching behavior in Dual Mode.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| 15 | Incompatible media types blocked (image + video model pairing) | Pass | Fixed during testing — `_incompatible` flag + `canGenerate()` block (`89d0227`) |
| 16 | Incompatibility warning shown regardless of shared input count | Pass | Fixed during testing — removed `&& sharedKeys.length === 0` condition (`89d0227`) |
| 17 | Gap field validation via data model (not DOM) | Pass | Fixed during testing — `_secondaryFieldValues` data model first, DOM fallback (`89d0227`) |
| 18 | Gap fields validate when DOM elements absent (programmatic switch) | Pass | Previously silently skipped required-field checks |
| 19 | Field alias resolution (prompt/multi_prompt, aspect_ratio/video_size) | Pass | `checkCompatibility()` resolves aliases correctly |
| 20 | Cost preview reads shared fields from primary form | Pass | Accurate dual mode cost estimate |
| 21 | Secondary param normalization for cost preview | Pass | Invalid values clamped to secondary's min/max |
| 22 | Cost preview uses alias resolution for secondary model | Pass | Prevents stale/default values in estimate |
| 23 | Parallel generation — both models complete independently | Pass | Each slot polls and completes on its own schedule |
| 24 | Per-model completion guard — no preview flicker | Pass | Fixed during testing — guards all completion operations per model slot (`b702d6b`) |
| 25 | Toggle dual mode off clears all state | Pass | `_incompatible`, `_secondaryFieldValues`, `_secondaryModel` all reset |
| 26 | Same-model pairing blocked | Pass | `canGenerate()` detects same primary/secondary |
| 27 | Schema diff renders shared inputs, gap warnings, manual mode | Pass | `renderSchemaDiff()` UI verified |
| 28 | Dual mode error vocabulary — banners don't specify model slot | Documented | Known limitation — only preview cards label per-model. Tech debt. |

### Suite 3 — Preview & Import Actions (Tests A–J)

Validated the dual mode preview decision bar: import, dismiss, retry, and edge case behavior.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| A | Import primary only — secondary remains in preview | Pass | Fixed during testing — sequential import no longer destroys dual bar (`c50b8e7`) |
| B | Import secondary only — primary remains in preview | Pass | In-place "Imported" state, other slot stays active |
| C | Import both — both results import in correct order | Pass | Fixed during testing — `importBoth()` now uses direct CSInterface calls (`c50b8e7`, sub-bug B) |
| D | Dismiss all — neither result imports, clean state | Pass | Fixed during testing — `discardAll()` now deletes files directly (`c50b8e7`, sub-bug A) |
| E | Import A then import B — sequential import works | Pass | Each slot imports independently, dual bar persists |
| F | One model failed, one succeeded — preview state | Pass | Retry button functional for failed slot (`c50b8e7`) |
| G | Dismiss during active generation | Pass | Warning state communicated, no orphaned polls |
| H | Network drop after generation, before import | Pass | Locally cached result used, clear error if not downloaded |
| I | Rapid click import — no duplicate imports | Pass | Fixed during testing — `_actionInProgress` flag + immediate button disable (`c50b8e7`) |
| J | Preview UI at minimum panel width | Pass | Both preview cards visible, import buttons accessible, text truncates |

**Sub-bugs discovered and fixed:**
- `importBoth()` routed through `PreviewDecision.show` which silently failed for the secondary slot (no DOM container exists). Fixed: direct CSInterface calls.
- `discardAll()` routed through `PreviewDecision.onDiscard` which silently bailed because `showDual` never populated `activeDecisions`. Fixed: direct file deletion.

### Suite 4 — Replace on Timeline (Tests K–P)

Validated the `replaceClipOnTimeline()` and `replaceTwoClipsOnTimeline()` functions for single-clip and dual-frame interpolation models.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| K | Single clip replace at exact timeline position | Pass | `overwriteClip()` at captured `clip.start.seconds` |
| L | Dual-frame replace — adjacent clips replaced by single generated video | Pass | `replaceTwoClipsOnTimeline()` handles two-clip removal + span calculation |
| M | Clip identity validation — source deleted/moved between generation and import | Pass | Fixed during testing — falls back to Project Bin import with warning banner (`20cd53a`) |
| N | Adjacent clip detection — same track, wall-to-wall within 0.01s tolerance | Pass | Real-time 500ms polling validated |
| O | Non-adjacent clips — gap between clips on same track | Pass | Neutral info bar with guidance shown |
| P | Non-adjacent clips — different tracks | Pass | Neutral info bar with guidance shown |

### Suite 5 — Server & Node.js Crash Recovery (Tests Q–Z)

Validated the self-healing Node.js server, fetch timeouts, and graceful degradation when the backend is unavailable.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| Q | Server crash — automatic recovery via keep-alive heartbeat | Pass | 90-second heartbeat detects crash, recovery sequence fires |
| R | Server crash — generation in progress survives | Pass | Background recovery polling (30s intervals, 30min window) |
| S | Fetch timeout on poll endpoint (30s) | Pass | Fixed during testing — AbortController timeout on all 11 fetch calls (`d0d1c85`) |
| T | Fetch timeout on extract endpoint (60s) | Pass | Per-endpoint timeout calibration |
| U | Fetch timeout on upload/download endpoint (120s) | Pass | Longer timeout for large file operations |
| V | Hung server no longer freezes UI indefinitely | Pass | Timeout message matches existing errorTranslator TIMEOUT pattern |
| W | ENOENT — Node.js binary not found at spawn | Pass | Fixed during testing — specific "Node.js was not found" banner with install link (`d0d1c85`) |
| X | ENOENT — skip crash retry loop (node won't appear by retrying) | Pass | Suppresses "Restart server" button when binary missing |
| Y | Generate button disabled when server is down | Pass | Fixed during testing — `isServerDown()` API + `setBanner()` broadcasts re-evaluation (`d0d1c85`) |
| Z | Empty catch blocks — observability audit | Pass | ~40 empty catch blocks replaced with `console.debug` or `console.warn` (`2fc8f9e`) |

---

## Gaps Found & Fixed

| Gap | Severity | Commit | Status |
|-----|----------|--------|--------|
| UNKNOWN error fallback leaks raw API text | High | `4b8a36e` | Fixed |
| `extractedMedia` undefined reference in Continue Anyway path | High | `962805e` | Fixed |
| Incompatible media types not enforced in Dual Mode | High | `89d0227` | Fixed |
| Gap field validation via DOM — silently skipped when elements absent | High | `89d0227` | Fixed |
| `importBoth()` silently fails for secondary slot | High | `c50b8e7` | Fixed |
| `discardAll()` doesn't delete files (silent bail) | Medium | `c50b8e7` | Fixed |
| Sequential import destroys dual bar | Medium | `c50b8e7` | Fixed |
| `retryFailed()` non-functional | Medium | `c50b8e7` | Fixed |
| Rapid click import creates duplicates | Medium | `c50b8e7` | Fixed |
| Clip identity not validated before timeline replace | Medium | `20cd53a` | Fixed |
| Per-model completion guard missing — preview flicker | Medium | `b702d6b` | Fixed |
| Fetch calls to localhost:3000 have no timeout | Medium | `d0d1c85` | Fixed |
| ENOENT not detected when node binary missing | Medium | `d0d1c85` | Fixed |
| Generate button stays enabled when server is down | Low | `d0d1c85` | Fixed |
| Persistent error banners auto-dismiss (AUTH, BALANCE) | Low | `3fa1e93` | Fixed |
| Error banner z-index overlap | Low | `941fff2` | Fixed |
| ~40 empty catch blocks (no observability) | Low | `2fc8f9e` | Fixed |
| Incompatibility warning hidden when models share any inputs | Low | `89d0227` | Fixed |

---

### Suite 6 — Follow Your Generation (Tests FYG-01–FYG-30)

Behavioral audit of the Follow Your Generation background generation panel. Conducted March 13, 2026 via static code analysis, CSS token verification, and JS logic review.

| # | Description | Result | Notes |
|---|-------------|--------|-------|
| FYG-01 | Zone host persists outside gen-log (PASS 3 Option B) | Pass | `#mb-background-zone-host` is a sibling of model panel container |
| FYG-02 | Rows persist across model switches | Pass | JS state `_rows` re-rendered into zone on navigation |
| FYG-03 | Status dot color: orange for running | Pass | CSS class `.running` |
| FYG-04 | Status dot color: gray for queued | Pass | Queued uses step 2 with no active class — gray default |
| FYG-05 | Status dot color: green for complete | Pass | CSS class `.complete` |
| FYG-06 | Status dot color: red for failed | Pass | CSS class `.failed` |
| FYG-07 | Elapsed timer updates every 1s | Pass | `_timerInterval` runs `_updateElapsedTimers()` at 1s interval |
| FYG-08 | Step tracker: 5 steps render correctly | Pass | Sent → Queued → Generating → Downloading → Importing |
| FYG-09 | Step tracker: completed steps turn green | Pass | `.done` class applied to steps < current |
| FYG-10 | Step tracker: active step pulses orange | Pass | `.active` class on current step |
| FYG-11 | Step transitions from fal.ai status | Pass | `IN_QUEUE` → step 2, `IN_PROGRESS` → step 3 |
| FYG-12 | Queue position shown in header | Pass | "Queued #N" suffix when step 2 + queuePosition present |
| FYG-13 | Header step label: "Queued" is gray, not orange | Pass | P3 fix applied — `active` class only for steps ≥ 3 |
| FYG-14 | Header step label: "Generating" is orange | Pass | `active` class applied for steps 3–5 |
| FYG-15 | Accordion expand/collapse | Pass | Single-row accordion via `_toggleExpand()` |
| FYG-16 | Details grid: prompt (italic, truncated) | Pass | Truncated to 80 chars with ellipsis, `.gen-log-bg-detail-prompt` class |
| FYG-17 | Details grid: duration displayed | Pass | Appended with "s" suffix |
| FYG-18 | Details grid: resolution displayed | Pass | Raw value from inputParams |
| FYG-19 | Details grid: aspect ratio displayed | Pass | Raw value from inputParams |
| FYG-20 | Details grid: endpoint displayed | Pass | Always shown when modelPath exists |
| FYG-21 | Auto-dismiss on navigation to completed model | Pass | `_maybeDismissOnNav()` removes row + calls `GenerationLog.completeBg()` |
| FYG-22 | Failed rows NOT auto-dismissed | Pass | `_maybeDismissOnNav()` only matches `status === 'complete'` |
| FYG-23 | Failed rows manually dismissable | Pass | Dismiss button present for failed status |
| FYG-24 | "See error" button navigates to model | Pass | Calls `_navigateToModel()` via `selectModel()` |
| FYG-25 | "View result" button navigates to model | Pass | Same navigation path as error button |
| FYG-26 | Snackbar notification on completion | Pass | `_showSnackbar('success', ...)` with 7s auto-dismiss |
| FYG-27 | Snackbar notification on failure | Pass | `_showSnackbar('failed', ...)` with action button |
| FYG-28 | inputParams plumbing from generation to row | Pass | `addRow()` accepts `inputParams` parameter |
| FYG-29 | Zone hides when no rows remain | Pass | `has-bg-rows` class removed, timer stopped |
| FYG-30 | Copy download URL on failed row | Pass | Clipboard write with "Copied!" feedback |

## Known Limitations (Tech Debt)

Documented but not yet addressed. See `CLAUDE.md` for full tech debt inventory.

| Limitation | Scope | Roadmap Phase |
|------------|-------|---------------|
| No input length limit — prompt fields accept 10k+ chars | Dual Mode | Post-launch |
| Silent secondary clamping — numeric values auto-clamped without notification | Dual Mode | Post-launch |
| Error banners don't specify primary vs secondary model slot | Dual Mode | Post-launch |
| Cost history not tagged — dual generation costs log as independent rows | Dual Mode | Post-launch |
| No Replace on Timeline in Dual Mode — data infrastructure exists, UI missing | Dual Mode | Post-launch P1 |
| Shared source not communicated — preview header doesn't indicate source clip | Dual Mode | Post-launch |
| `serverManager.js` macOS only — `lsof` and Homebrew paths hardcoded | Server | Phase 6 |
| `generationLog.js` hardcoded POSIX path separators | Logging | Phase 6 |
| Pricing supplements — no UI indicator when remote data fails to load | Pricing | Phase 5 |

---

## Testing Methodology

- **Live runtime testing** via Chrome DevTools Protocol (CDP) at `localhost:8089`, connected to the CEP Chromium browser running inside Premiere Pro 2025
- **Code path analysis** to verify control flow through error handling, validation, and state management paths
- **DOM mutation monitoring** to detect unintended UI side effects (flicker, orphaned elements, stale state)
- **State injection and manipulation** via DevTools console — simulating failures, network drops, and race conditions by directly calling internal APIs
- **Cross-platform scope**: macOS only (the only supported platform). Windows-specific gaps documented as tech debt.
- **No automated test suite**: modelBridge has no build step, no test runner, and no linter. All testing is manual via DevTools + code review. A schema test suite is planned (Phase 1, item 4).

---

## Category Gating & End-to-End Audit (2026-03-20)

Full verification that (1) no unsupported model can be added or generate, and (2) every supported model category works end-to-end. Code path analysis + static verification across all entry points.

### Part 1 — Gating: 5 entry points verified

| Entry point | Gate function | Status |
|---|---|---|
| Search results | `buildResultRow()` → `isCategoryBlocked()` | PASS |
| Direct endpoint add | `addModelById()` — 2 gates (pre-schema + post-schema) | PASS |
| JSON import | `importCustomModel()` | PASS |
| addCustomModel() direct call | Category gate at top of function | PASS |
| Already-added blocked models | `buildModelCardHTML()` visual gate | PASS |

12 category normalization variants tested (kebab, snake, upper, camelCase). Unknown categories default to blocked (fail-safe). No persistent DevTools bypass possible.

### Part 2 — End-to-End: all 11 categories PASS

| # | Category | Output | Search | Add | Render | Validate | Cost | Generate | Poll | BG Panel | Result | Preview | Import | Cost Log |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | text_to_image | image | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 2 | image_to_image | image | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 3 | text_to_video | video | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 4 | image_to_video | video | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 5 | video_to_video | video | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 6 | text_to_audio | audio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 7 | text_to_speech | audio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 8 | audio_to_audio | audio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 9 | audio_to_video | video | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 10 | video_to_audio | audio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 11 | speech_to_speech | audio | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

### Parts 3–5 — Preview, Active Gen Panel, Cost System: all PASS

- **Image preview:** render, Source Monitor, Show in Finder, import, multi-image gallery
- **Video preview:** render, fit-to-frame, two-clip replacement, Source Monitor
- **Audio preview:** HTML5 player, play/pause/seek, error handler, audio track import (3-tier selection)
- **Background removal:** alpha guidance text with correct styling
- **Active Gen Panel:** output-type-aware notifications, step tracker, expiry warnings (20h/24h)
- **Cost system:** 11 pricing types across all categories, 3 badge states, breakdown drawer, currency switching

3 info-level issues found and fixed in commit `ca88421`.

---

## Summary

| Metric | Count |
|--------|-------|
| Total tests (manual + audit) | 183 |
| Pass (manual suites 1–6) | 81 |
| Documented as tech debt (manual) | 1 (Test 28 — dual mode error vocabulary) |
| Pass (category gating audit) | 101 (5 gates + 12 normalization + 11×7 e2e + 17 preview/panel/cost) |
| Gaps found during testing | 22 |
| Gaps fixed during testing | 22 |
| Commits from stress test fixes | 11 |
