# Changelog

Key milestones in the development of modelBridge.ai.

---

## v0.13 — Category Gating & Full E2E Certification (March 2026)

### Model Category System
- **Three-tier category gating** — ALLOWED (11 categories), WARNING (reserved), BLOCKED (13 categories). Five independent gates prevent unsupported models at every entry point: search, addModelById (pre + post schema), addCustomModel, importCustomModel
- **Fail-safe unknown category handling** — new categories from fal.ai are automatically blocked until explicitly allowlisted. No unsafe defaults
- **saveCustomModels() defensive filter** — blocked-category models cannot persist to localStorage or disk, closing the DevTools injection gap

### End-to-End Verification
- **All 11 supported categories pass end-to-end** — text_to_image, image_to_image, text_to_video, image_to_video, video_to_video, text_to_audio, text_to_speech, audio_to_audio, audio_to_video, video_to_audio, speech_to_speech
- **Full pipeline verified per category** — search → add → render → validate → cost → generate → poll → background panel → result extraction → preview → import → cost log
- **Audio pipeline fully functional** — dedicated `insertAudioOnTimeline()` JSX with 3-tier audio track selection (targeted empty > any empty > auto-create)

### QA
- **101-check category gating audit** — 5 entry point gates, 12 normalization variants, 11×13 end-to-end matrix, preview/panel/cost deep-dives. Zero failures
- **277 total tests** across 6 automated CDP suites (94), 6 manual suites (82), and category audit (101)

## v0.12 — Follow Your Generation (March 2026)

### Background Generation Panel
- **Follow Your Generation panel** — persistent zone at the bottom of the plugin tracks all active background generations regardless of which model card is open. Status dot, model name, elapsed timer, step label, and expand chevron per row
- **5-step progress tracker** — Sent → Queued → Generating → Downloading → Importing. Completed steps turn green with checkmarks, active step pulses orange. Step labels update in real time with fal.ai queue position
- **Input details in expanded view** — prompt (italic, truncated), duration, resolution, aspect ratio, endpoint — always know which generation is which
- **Auto-dismiss on navigation** — navigating to a completed model's card auto-removes the background row and brings the gen-log to completed state. No manual cleanup
- **Failure handling** — failed rows stay visible with red state + "See error" link. Never auto-dismissed, always manually dismissable
- **Snackbar notifications** — floating success/failure toasts with "View →" or "Details →" action

### Architecture
- **PASS 3 (Option B) zone host** — persistent `#mb-background-zone-host` element outside the gen-log. Eliminates "no gen-log → no zone" blind spot and removes scattered reattach calls from `selectModel()`

### QA
- **30-check behavioral audit** — visual QA, step progression, auto-dismiss, failure state, inputParams plumbing, edge cases. 29 PASS / 1 FAIL (P3 cosmetic — Queued label color fixed)

## v0.11 — Pricing Intelligence, Smart Import & Audio (March 2026)

### Pricing Intelligence
- **Four-layer pricing pipeline** — curated supplements for exact pricing, official API for base rates (100% model coverage), family heuristics for related models, honest "unavailable" when no data exists. Zero fabricated prices
- **Three explicit UI states** — exact price with live parameter updates, base rate with disclaimer, or "Pricing unavailable" — never a wrong number
- **24-model accuracy audit** — verified across all pricing types and 7 generation categories. Result: zero incorrect prices
- **Audio-aware cost triggers** — toggling audio, voice control, or resolution updates the cost estimate in real-time

### Smart Import
- **Context-aware timeline import** — one button, automatic routing: source-based models replace the original clip in-place; text-based models insert at playhead; audio inserts on audio tracks
- **Contextual instruction texts** — each preview card shows what the import will do before you click: "Replaces the source on the timeline" or "Inserts at the playhead"
- **Preview buttons simplified** — 4 buttons merged to 3: "Save and import to timeline" (smart routing), "Save to project bin", "Discard"

### Audio & TTS
- **Audio preview player** — play TTS and sound effect generations directly in the preview card before importing. Mutual exclusion ensures only one player plays at a time
- **Audio timeline import** — audio generations import directly to Premiere Pro audio tracks

### Dual Mode
- **Selection-driven results** — clickable preview cards with active-state border. Import buttons act on the selected card only
- **Timeline import for Dual Mode** — previously project-bin-only, now supports full timeline import per slot
- **Same-source-clip handling** — when both slots use the same source clip, the second slot auto-switches from "replace" to "insert at playhead" after the first imports

### Reliability
- **Legal compliance** — pricing data sourced exclusively from the official API; web scraping rejected per platform terms of service
- **Family heuristic safety** — prevents pricing cross-contamination between model variants with incompatible rate structures
- **3 CDP-discovered bugs fixed** — generate button disabled for text-only models, argument-order mismatch in readiness checks, text input field ignored in generation logic

## v0.10 — Self-Learning & Resilience (March 2026)

- **Three-layer error handling architecture** — Prevent (schema-driven preflight) → Learn (self-improving constraint cache) → Never Leak (human-readable error translation with WHAT / WHY / WHAT TO DO pattern)
- **Self-learning validation system** — full Learn → Read → Enforce chain for 6 constraint types (dimensions, file size, aspect ratio, video duration), plus generic fallback parser for unknown types
- **Dual persistence for learned constraints** — localStorage + disk file survives CEP cache clears, plugin updates, and reinstalls
- **Adjacent clip detection and direct timeline import** — real-time adjacency detection for interpolation models, generated video replaces both source stills spanning combined duration
- **Server resilience overhaul** — 90-second heartbeat, automatic crash recovery with crash budget, pre-flight health checks, exponential backoff (3 retries), manual Reload fallback
- **Schema-driven file parameter detection** — zero hardcoded model names, priority cascade from schema structural signals
- **Error copy overhaul** — all messages follow WHAT / WHY / WHAT TO DO, no raw JSON or status codes, humanized field names
- **Non-retryable error fail-fast** — 422 validation errors fail immediately, no wasted retries
- **Image dimension fallback** — reads from file via browser Image API when Premiere Pro metadata returns 0x0
- **Rate-limit-aware schema refresh** — per-session cap and backoff to avoid API throttling on cold start

## v0.9 — Dual-Frame & Polish (Late February 2026)

- **Dual-frame selection card** — purpose-built dual-column UI for models accepting start + end frames, with media-type icons, Required/Optional badges, and thumbnails per slot
- **Unified media card design** — all media-requiring models share the same modern card component
- **Intelligent clip ordering** — dual-frame models respect selection order, info notice when order differs from timeline position
- **Drag-and-drop from Finder** — drop files directly onto media card, single/dual-slot modes, mixed mode (drop + poll), pinned files, global drop prevention
- **Mask editor with zoom/pan** — full canvas mask editor for inpainting, adjustable brush size and opacity, eraser mode, zoom and pan for precision on high-res frames
- Source Monitor preview with In/Out point selection before committing results to timeline
- 11-stage generation progress tracking with background recovery for long-running generations (polling up to 30 minutes)
- Prompt optimization that rewrites brief descriptions into model-optimized prompts
- **"New" filter chip and NEW badges** — models added within 14 days show an orange NEW badge; dedicated filter chip for discovery
- **Commercial license filter** — filter chip + badge in search results sourced from API metadata, stored per model for compliance reporting

## v0.8 — Cost & Error Intelligence (February 2026)

- Real-time cost tracking per project and client, with CSV export for invoicing
- Multi-currency support (USD, EUR, SEK) with pre-generation cost estimates
- Error translation system turning raw API errors into plain-language recovery guidance
- HTML report generator — self-contained offline reports with Chart.js, 4 KPIs, cost-by-model and cost-by-deliverable charts, compliance badge
- External AI costs via CSV import for third-party platforms (Midjourney, RunwayML, etc.)
- Deliverable tagging per generation for cost breakdown by output

## v0.5 — Mask Editor & Model Discovery (January 2026)

- Built-in canvas mask editor for inpainting directly on extracted video frames
- Model search and discovery across the full provider catalog with one-click add
- Schema caching and versioned input classification for reliable offline operation
- Project panel selection — dual-source polling (timeline + project bin)

## v0.3 — Schema-Driven UI (November 2025)

- Dynamic form generation from OpenAPI schemas — 500+ models, zero hardcoded interfaces
- Two-layer input validation preventing wasted spend on misconfigured generations
- Continuous media selection monitoring with contextual feedback

## v0.2 — Timeline Integration (October 2025)

- Auto-import, auto-position, auto-scale — generated results land directly on the timeline
- Node.js backend for media extraction, file I/O, and API communication
- ExtendScript bridge for direct Premiere Pro timeline manipulation

## v0.1 — Proof of Concept (October 2025)

- Single model, hardcoded parameters, basic CEP panel inside Premiere Pro
- End-to-end generation: prompt → API → download → manual import

---

Development is ongoing. The architecture established early on still drives the system — no rewrites, continuous improvement.

*Built by Niklaz Hallberg, 2025–2026.*
