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

## Error Translation

Raw API errors pass through a declarative pattern-matching pipeline before reaching the user. Each pattern is a self-contained rule — a matcher, a human-readable message template, and recovery suggestions. Adding coverage for a new error type means adding a rule, not changing structure. Unmatched errors are logged with full context, creating a convergence loop where the percentage of unknown errors trends toward zero over time.

## Media Validation

Media validation runs as a continuous sub-second polling loop rather than event-driven — a deliberate choice because Premiere Pro's selection-change events are unreliable across versions. Each cycle checks selection presence, media type compatibility against the current model's requirements, and updates the UI accordingly. The validation result gates the Generate button and drives contextual labels across all media input fields.

## Dual Persistence

State is persisted through two complementary systems. `localStorage` provides fast, synchronous access for session state and caches. Disk-based JSON files (managed through the Node server with atomic writes) provide durability that survives cache clears and reinstalls. Critical data is written to both; on startup, disk is the source of truth if `localStorage` is empty.

## No Build Step

The panel layer is dozens of IIFE modules loaded in dependency order via `<script>` tags. No bundler, no transpiler, no module system. CEP extensions load from disk at Premiere startup — there's no network transfer to optimize for, and the Chromium instance caches aggressively. The IIFE pattern provides clean encapsulation where dependencies are explicit (read from `window` at the top) and exports are explicit (assigned to `window` at the bottom).

---

## Design Principles

- **No build step** — source files are the runtime, no compilation layer to debug through
- **Schema as source of truth** — models define their own UI, the plugin just renders it
- **Errors as data** — translation patterns are declarative, coverage grows with every deployment
- **Dual persistence** — survives cache clears and reinstalls automatically
- **Dark-first design system** — 50+ CSS tokens, 8px grid, built to sit alongside Premiere's native UI
