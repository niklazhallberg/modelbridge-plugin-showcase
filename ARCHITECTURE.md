# Architecture

Technical architecture of modelBridge.ai — how the system is designed, not implemented. No source code included.

---

## Three-Layer Runtime

modelBridge runs inside Adobe Premiere Pro as three cooperating layers, each with different runtime constraints:

```
┌────────────────────────────────────────────────────────────┐
│                    Adobe Premiere Pro                       │
│                                                            │
│  Layer 1: CEP Panel                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chromium (CEF) browser instance                     │  │
│  │  ES6 JavaScript · DOM APIs · localStorage            │  │
│  │  Dozens of IIFE modules · No build step              │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │ HTTP (localhost)                  │
│  Layer 2: Node Server   │                                  │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │  Express.js · Spawned as child process               │  │
│  │  Media extraction · File I/O · API proxying          │  │
│  │  Health-checked · Auto-restart on crash              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Layer 3: ExtendScript Bridge                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ES3 JavaScript · Premiere Pro scripting engine      │  │
│  │  Timeline manipulation · Media import · Clip ops     │  │
│  │  String-based IPC · Blocks Premiere UI thread        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Why three layers?** CEP's Chromium browser handles UI and logic but can't touch Premiere's timeline. ExtendScript can manipulate the timeline but runs in an ES3 sandbox with no network access. Node.js bridges the gap — handling filesystem operations, HTTP requests, and media processing that neither layer can do alone.

---

## Schema-Driven UI

The core architectural decision: no model has a hardcoded interface. Every form is generated at runtime from the model's OpenAPI specification — schema in, validated UI out. A multi-tier field classifier determines the correct component for each input (slider, dropdown, media upload, checkbox), with schema-level guards ensuring structural types like enums and booleans are never misclassified by name heuristics. Parsed classifications are versioned and cached, so changes to classification logic automatically invalidate stale data without network calls.

This is infrastructure, not a wrapper. The plugin doesn't know about individual models — it knows about schemas. The same engine works across 500+ models today and will work for whatever launches tomorrow.

---

## Three-Layer Error Handling

Every error passes through a three-layer defense system designed so that users never see raw JSON, never waste money on preventable failures, and never wonder what went wrong.

```
Layer 1: Prevent     Schema-driven preflight catches errors before Generate is clickable
Layer 2: Learn       Self-improving cache saves API error constraints for future preflight
Layer 3: Never Leak  Human-readable translation — WHAT / WHY / WHAT TO DO
```

Each layer handles what the one before it missed. Schema constraints catch known limits. The learning system catches limits the schema didn't declare. And when something truly unexpected happens, the translation layer ensures the user sees a clear, actionable message — never a stack trace or a field name like `start_image_url`.

20+ pattern categories cover every error class: network failures, authentication, billing, rate limiting, content policy, validation (6 specific types), upload/download failures, server errors, and schema failures. Each pattern produces a specific message + recovery action pair.

---

## Self-Learning Constraint Cache

Not every constraint is declared in the schema. A model might accept images without specifying minimum dimensions — until you send one that's too small and the API rejects it.

When an API error contains parseable constraint values, the plugin extracts them, caches them per model, and enforces them at preflight on all future attempts. The system gets smarter the more you use it.

**Learn → Read → Enforce pipeline:**

1. **Learn.** Parse constraint values from the error message using type-specific regex patterns. Save to both localStorage (fast reads) and a durable disk file (survives cache clears and reinstalls).
2. **Read.** On every preflight cycle, merge learned constraints with schema constraints. Schema always wins — learned values only fill gaps.
3. **Enforce.** Compare actual media properties against the merged constraint set. Block invalid media before any API call.

Six constraint types are covered end-to-end: minimum/maximum dimensions, file size, aspect ratio, and video duration. A generic fallback parser handles unknown constraint types by extracting numeric min/max values from any error message.

The first error on an undocumented constraint is unavoidable. Every subsequent attempt on the same model catches it instantly — red border, specific error message, Generate button disabled. No API call, no charge, no waiting.

---

## Media Validation

Media validation runs as a continuous sub-second polling loop rather than event-driven — a deliberate choice because Premiere Pro's selection-change events are unreliable across versions. Each cycle checks selection presence, media type compatibility against the current model's requirements, and updates the UI accordingly. The validation result gates the Generate button and drives contextual labels across all media input fields.

**Dual-source polling** checks both timeline and project bin every 500ms. A change-only approach detects signature changes (not count changes) to decide which source is active. A 1.5-second cooldown prevents flickering when both sources change simultaneously.

**Drop zone integration** allows files dragged from Finder to override polled selections. Dropped files are pinned — polling won't clear them. Mixed mode lets one slot hold a dropped file while the other holds a timeline selection.

---

## Dual-Frame Rendering

Models that accept both a start frame and end frame use a purpose-built dual-column card component instead of stacking slots vertically. Each column displays a media-type icon, title, Required/Optional badge, and thumbnail area.

Selection order is explicit — the first clip selected becomes the Start Frame regardless of timeline position. When both clips are adjacent on the same timeline track (detected in real-time with one-frame tolerance), the generated video can replace both source stills as a single clip spanning their combined duration.

Adjacency detection runs every 500ms alongside media validation, checking same-track positioning and wall-to-wall alignment. A context-aware info bar adapts: green when adjacent, neutral guidance when there's a gap or clips are on different tracks, hidden when either clip is invalid.

---

## Mask Editor

The built-in mask editor provides inpainting capabilities without leaving the panel. A full canvas overlay renders extracted video frames with adjustable brush size and opacity, eraser mode, undo support, and zoom/pan navigation for precision work on high-res frames.

The mask is rendered on a separate canvas layer above the source frame. On generation, it's composited, converted to the format the model expects, and uploaded alongside the source image — all handled transparently as part of the generation request.

---

## Background Generation & Follow Your Generation Panel

AI video generation takes 30 seconds to 5 minutes. Blocking the panel UI during that time is unusable in a professional Premiere Pro workflow. modelBridge decouples generation from the UI — after submission, the Node.js backend handles polling, downloading, and importing while the editor continues working.

The **Follow Your Generation** panel is a persistent DOM zone (`#mb-background-zone-host`) fixed at the bottom of the plugin, outside the per-model generation log. This is the PASS 3 (Option B) architecture — the zone host lives in the main panel DOM, not inside the gen-log. This eliminates the previous "no gen-log → no zone" blind spot and removes scattered reattach calls from `selectModel()`.

**How it works:**

- All active background generations are tracked in JS state (`_rows` map) and rendered into the persistent zone regardless of which model card is currently open
- Each row shows: status dot (orange = running, gray = queued, green = done, red = failed), model name, elapsed timer, current step label, and expand chevron
- Expanded view shows a 5-step progress tracker (Sent → Queued → Generating → Downloading → Importing) with visual state transitions — completed steps turn green with checkmarks, the active step pulses orange
- Step labels in the row header update in real time: "Queued #2" (with fal.ai queue position), "Generating", "Downloading", "Importing", "Imported"
- Expanded rows also display input details (prompt, duration, resolution, aspect ratio, endpoint) so the user always knows which generation is which
- **Auto-dismiss:** when the user navigates to a model whose generation just completed, the row auto-removes and the generation log on that model card is brought to completed state — no manual cleanup needed
- **Failure handling:** failed rows stay visible with red state + "See error" link — never auto-dismissed, always manually dismissable
- **Snackbar notifications:** floating success/failure toasts appear when a background generation completes, with a "View →" or "Details →" action button

**UX decision:** The "Queued" step label renders in gray (waiting state), while Generating/Downloading/Importing render in orange (active states). This distinction was fixed from the initial implementation where Queued incorrectly used the active orange color.

---

## Server Resilience

The Node.js backend is designed to be invisible. A multi-layered resilience system ensures the server stays healthy or recovers automatically:

- **90-second heartbeat** — continuous health monitoring catches issues before they affect the user
- **Automatic crash recovery** — if the server stops responding, the plugin restarts it within seconds
- **Crash budget** — prevents infinite restart loops by tracking failures within a time window
- **Pre-flight health checks** — operations like model search verify server health before starting, triggering recovery preemptively
- **Exponential backoff** — network requests to the AI platform retry up to 3 times (1s, 2s, 4s) before surfacing errors
- **Manual fallback** — a Reload button runs the full recovery sequence when automatic recovery isn't enough

---

## Dual Persistence

State is persisted through two complementary systems. `localStorage` provides fast, synchronous access for session state and caches. Disk-based JSON files provide durability that survives cache clears, plugin updates, and reinstalls.

Critical data is written to both simultaneously:
- **Custom models** — localStorage primary + disk JSON backup
- **Cost history** — localStorage + disk file
- **Learned constraints** — localStorage + disk file
- **API keys** — localStorage + .env file
- **User settings** — localStorage + disk JSON

On startup, disk is the source of truth if localStorage is empty. The system self-heals transparently — a Premiere Pro update that clears the cache causes a brief first-load restore, then everything continues as normal.

---

## No Build Step

The panel layer is dozens of IIFE modules loaded in dependency order via `<script>` tags. No bundler, no transpiler, no module system. CEP extensions load from disk at Premiere startup — there's no network transfer to optimize for, and the Chromium instance caches aggressively. The IIFE pattern provides clean encapsulation where dependencies are explicit (read from `window` at the top) and exports are explicit (assigned to `window` at the bottom).

---

## Four-Layer Pricing Pipeline

Every cost estimate resolves through a four-layer cascade, designed so users never see a wrong price.

```
Layer 1: Supplement     Curated per-model pricing — exact, parameter-aware
Layer 2: API            Official platform pricing API — 100% model coverage, base rates
Layer 3: Family         Heuristic match to related model's curated pricing
Layer 4: Unavailable    Honest "Pricing unavailable" — no fabricated numbers
```

Supplements provide exact pricing that responds to parameter changes in real-time — toggle audio on, switch resolution, change duration, and the estimate updates instantly. The official API provides base rates for every model on the platform but can't account for parameter-dependent surcharges. Family heuristics use a related model's supplement as a rough estimate. When all layers fail, the UI shows "Pricing unavailable" rather than guessing.

All pricing data is sourced from the official platform API — no web scraping. The system was validated through a 24-model audit across 7 generation categories with zero incorrect prices.

Safety guards prevent cross-contamination between model variants with incompatible rate structures, and a drift detection system flags when curated rates diverge from API rates by more than 5%.

---

## Design Principles

- **No build step** — source files are the runtime, no compilation layer to debug through
- **Schema as source of truth** — models define their own UI, the plugin just renders it
- **Errors as data** — translation patterns are declarative, coverage grows with every deployment
- **Self-improving validation** — the plugin learns from failures and prevents them from recurring
- **Dual persistence** — survives cache clears and reinstalls automatically
- **Server invisibility** — the backend should never be something the user thinks about
- **Dark-first design system** — 56 CSS tokens, 8px grid, built to sit alongside Premiere's native UI
