# Changelog

Key milestones in the development of modelBridge.ai.

---

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
