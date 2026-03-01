# Architecture

Technical architecture of modelBridge.ai for developers who want to understand how the system is designed.

This document describes the design — not the implementation. No source code is included.

---

## Runtime Layers

modelBridge runs inside Adobe Premiere Pro as three cooperating layers, each with different runtime constraints:

```
┌────────────────────────────────────────────────────────────┐
│                    Adobe Premiere Pro                       │
│                                                            │
│  Layer 1: CEP Panel                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chromium (CEF) browser instance                     │  │
│  │  ES6 JavaScript · DOM APIs · localStorage            │  │
│  │  40 modules loaded via <script> tags                 │  │
│  │  No module system · No build step · IIFEs + globals  │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │ HTTP (localhost:3000)             │
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
│  │  Called via csInterface.evalScript() · String returns │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Why three layers?** CEP's Chromium browser handles UI and logic but can't access Premiere's timeline directly. ExtendScript can manipulate the timeline but runs in an ES3 sandbox with no network access. Node.js bridges the gap — handling filesystem operations, HTTP requests, and media processing that neither layer can do alone.

**Communication patterns:**
- Panel → ExtendScript: `csInterface.evalScript('functionName(args)')` — string in, string out, async via callback
- Panel → Node: Standard HTTP requests to `localhost:3000`
- Node → Filesystem: Direct access for media extraction, downloads, and persistence

---

## Module Architecture

The panel layer consists of 40 JavaScript modules loaded in dependency order via 45 `<script>` tags in the HTML entry point. There is no bundler, no transpiler, no module system.

**Why no build step?** CEP extensions load from disk at Premiere Pro startup. A build step adds complexity with no performance benefit — there's no network transfer to optimize for, and the Chromium instance caches aggressively. The IIFE pattern provides clean encapsulation, and explicit load ordering makes dependencies visible rather than implicit.

Each module follows the same pattern: an IIFE that reads its dependencies from `window`, does its work, and exports its public API back to `window`. ~400 global exports across 40 modules.

**Module categories:**

```
┌─────────────────────────────────────────────────┐
│                  UI Layer                        │
│  Model search · Dynamic form renderer ·          │
│  Progress display · Cost display · Mask editor   │
├─────────────────────────────────────────────────┤
│                Logic Layer                       │
│  Schema parser · Field classifier ·              │
│  Media validator · Error translator ·            │
│  Cost calculator · Generation orchestrator       │
├─────────────────────────────────────────────────┤
│              Infrastructure Layer                │
│  Server manager · Data persistence ·             │
│  API communication · State management ·          │
│  CSInterface bridge · Event system               │
└─────────────────────────────────────────────────┘
```

---

## Schema-Driven UI Pipeline

The core architectural decision: no model has a hardcoded interface. Every form is generated at runtime from the model's OpenAPI specification.

```
                    ┌──────────────┐
                    │  OpenAPI     │
                    │  Schema      │
                    │  (JSON)      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Schema     │
                    │   Fetcher    │◄──── 5-min cache TTL
                    │              │      3-endpoint cascade
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Input      │
                    │   Parser     │◄──── Extracts fields, types,
                    │              │      defaults, constraints
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Field      │
                    │   Classifier │◄──── 5-tier priority system
                    │              │      Schema-first guards
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Form      │
                    │   Renderer   │◄──── Maps classified types
                    │              │      to UI components
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Validation  │
                    │   Engine     │◄──── Schema constraints +
                    │              │      media requirements
                    └──────────────┘
```

### Field Classification

The classifier determines what UI component each schema field becomes. It uses a 5-tier priority system:

1. **Provider annotations** — Explicit media type hints from the API provider (highest priority)
2. **Format declarations** — `format: "uri"` or similar OpenAPI format fields
3. **Example values** — Inferred from example data in the schema
4. **Description analysis** — Keywords in the field's description text
5. **Name patterns** — Field name heuristics like `video_url`, `image_path` (lowest priority)

Schema-first guards run before all five tiers: if a field has an `enum` array, it's always a dropdown. If it's `type: boolean`, it's always a checkbox. These guards prevent name-based heuristics from misclassifying fields (e.g., a field named `video_output_type` with an enum is a dropdown, not a media upload).

### Versioned Cache Invalidation

Parsed field classifications are cached alongside model data in `localStorage`. When classification logic changes, a version constant is bumped. On next load, models with stale cache versions are automatically re-parsed from their stored schemas — no network call needed, no user action required.

---

## Error Translation Pipeline

Raw API errors pass through a classification and translation system before reaching the user.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Raw Error   │────▶│  Classifier  │────▶│   Pattern    │
│  Response    │     │              │     │   Matcher    │
│              │     │  HTTP status │     │              │
│  Status code │     │  Body parse  │     │  20+ rules   │
│  Body text   │     │  Type detect │     │  Regex-based │
│  Headers     │     │              │     │  Priority-   │
│              │     │              │     │  ordered     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                          ┌───────▼──────┐
                                          │  Structured  │
                                          │  Output      │
                                          │              │
                                          │  Title       │
                                          │  Message     │
                                          │  Recovery    │
                                          │  steps       │
                                          │  Severity    │
                                          └───────┬──────┘
                                                  │
                                          ┌───────▼──────┐
                                          │     UI       │
                                          │  Renderer    │
                                          │              │
                                          │  Inline      │
                                          │  contextual  │
                                          │  error card  │
                                          └──────────────┘
```

**Design principle:** The error system is declarative. Each pattern is a self-contained rule with a regex matcher, a human-readable message template, and recovery suggestions. Adding a new pattern requires no structural changes — just a new entry in the pattern array.

**Unknown error handling:** Errors that match no pattern are logged structurally with the raw response, model ID, input parameters, and timestamp. This creates a convergence loop: every unmatched error in the logs is a candidate for a new pattern rule. Over time, the percentage of "unknown" errors trends toward zero.

---

## Media Validation System

Media validation runs as a continuous polling loop, not event-driven. This is a deliberate architectural choice imposed by Premiere Pro's limitations.

**Why polling?** Premiere Pro's ExtendScript API does not fire reliable events when the user changes clip selection in the timeline or project panel. The `onSelectionChanged` event exists but is inconsistent across Premiere versions and selection contexts. A 500ms polling loop that queries the current selection state is more reliable than event listeners that may or may not fire.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌──────────┐    ┌──────────────┐    ┌──────────┐ │
│   │ Timeline │    │  Validation  │    │   UI     │ │
│   │ Query    │───▶│  Engine      │───▶│  Update  │ │
│   │ (500ms)  │    │              │    │          │ │
│   └──────────┘    │  Selection   │    │  Media   │ │
│        ▲          │  vs. Model   │    │  card    │ │
│        │          │  requirements│    │  state   │ │
│        │          │              │    │          │ │
│        └──────────┤  Schema      │    │  Hybrid  │ │
│         Poll loop │  constraints │    │  labels  │ │
│                   │              │    │          │ │
│                   │  Media type  │    │  Generate│ │
│                   │  matching    │    │  button  │ │
│                   └──────────────┘    └──────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**What it validates on each cycle:**

1. **Selection presence** — Is anything selected in the timeline or project panel?
2. **Media type match** — Does the selected clip's type (video/image) match what the current model requires?
3. **Primary input priority** — When a model accepts both video and image, does the selection match the *required* input type?
4. **Hybrid field state** — Updates all media input labels to reflect current selection state, showing match/mismatch/empty

The validation result flows into three UI elements simultaneously: the media info card (green/red/empty states), hybrid URL input labels (contextual text), and the Generate button (enabled/disabled).

---

## Persistence Architecture

State is persisted through two complementary systems:

```
┌────────────────────────┐     ┌────────────────────────┐
│     localStorage       │     │     Disk (JSON)         │
│                        │     │                         │
│  Panel session state   │     │  Durable data           │
│  Model cache           │     │  Custom models          │
│  UI preferences        │     │  Cost history           │
│  API key (encrypted)   │     │  User settings          │
│  Onboarding state      │     │  Project/client data    │
│                        │     │                         │
│  Fast · Scoped to CEP  │     │  Survives reinstall     │
│  Lost on cache clear   │     │  Atomic writes          │
└────────────────────────┘     └────────────────────────┘
```

**Why both?** `localStorage` in CEP is fast and synchronous but scoped to the browser instance — clearing Premiere's cache wipes it. Disk persistence via the Node server survives cache clears and reinstalls. Critical data (models, costs, settings) is written to both. On startup, the disk copy is the source of truth if `localStorage` is empty.

**Atomic writes:** Disk writes use a write-to-temp-then-rename pattern to prevent corruption if the process terminates mid-write.

---

## Design Token System

The UI is built on a design token system with 67 CSS custom properties governing color, spacing, typography, and component dimensions.

**Grid:** 8px base unit. All spacing derives from the base: `--space-1` (4px) through `--space-8` (32px+). Component dimensions snap to the grid.

**Color:** Dark theme designed to sit alongside Premiere Pro's native UI. Neutral gray palette with blue accent for interactive elements, semantic colors for success/warning/error states, and reduced-opacity variants for disabled and hover states.

**Typography:** System font stack matching Premiere Pro's interface. Four size stops for hierarchy.

**Why tokens, not a framework?** CEP's Chromium instance loads a fixed set of local files — there's no CDN, no package delivery, no tree-shaking benefit. A token-based system provides consistency and maintainability without the overhead of a CSS framework. Every visual property traces back to a named token, making theme-wide changes trivial.

---

## Generation Pipeline

The complete lifecycle of a generation request:

```
User clicks Generate
        │
        ▼
┌───────────────┐
│  Collect      │  Read all form values from the
│  Inputs       │  schema-generated UI
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Validate     │  Schema constraints + media
│               │  requirements check
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Extract      │  Pull frame/clip from timeline
│  Media        │  via ExtendScript + Node server
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Upload       │  Send media as Base64 data URI
│  to Provider  │  to provider platform
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Submit       │  POST generation request with
│  Request      │  all parameters + media URLs
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Poll for     │  Check status endpoint until
│  Completion   │  complete, failed, or timeout
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Download     │  Fetch result media to local
│  Result       │  filesystem via Node server
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Import to    │  Import file, place on timeline,
│  Timeline     │  auto-scale to sequence size
└───────────────┘
```

**Progress tracking** follows this pipeline — each stage maps to a user-visible state in the Generate button, with contextual messages that set expectations ("In queue..." → "Generating..." → "This model takes a while..." → "Downloading...").

**Background recovery:** If the panel closes during a long-running generation (video models can take minutes), the pending request ID is persisted. On relaunch, the system checks for in-flight requests and resumes polling from where it left off.

---

## Server Lifecycle

The Node.js server is managed as a supervised child process:

1. **Spawn** — Panel startup spawns the server process with environment configuration
2. **Health check** — Periodic HTTP pings to `localhost:3000/health` confirm the server is responsive
3. **Auto-restart** — If health checks fail, the server is killed and respawned with backoff
4. **Graceful shutdown** — Panel close sends a shutdown signal; the server cleans up temp files and exits

**Why a separate server?** CEP's Chromium instance has restricted filesystem access and can't run native binaries. Media extraction (pulling frames from Premiere's media cache), file downloads, and API key storage all require Node.js capabilities that the browser layer doesn't have.

---

## ExtendScript Bridge

The ExtendScript layer is the only code that can directly interact with Premiere Pro's object model. It runs in an ES3 environment — no `let`/`const`, no arrow functions, no Promises, no `JSON` (a polyfill is included).

**19 global functions** handle all Premiere Pro interactions:
- Timeline queries (active sequence, selected clips, track layout)
- Media import (add files to project, insert on timeline)
- Clip manipulation (position, scale, replace)
- Sequence metadata (frame rate, dimensions, duration)

Communication is string-based: the panel calls `csInterface.evalScript('functionName("arg")')` and receives a string result via callback. Complex data is serialized as JSON strings using the polyfill.

**Constraint:** ExtendScript execution blocks Premiere Pro's UI thread. All bridge functions are designed to complete quickly — heavy work (media processing, network I/O) stays in the Node server.

---

## Design Decisions

**No framework (React, Vue, etc.):** CEP's Chromium version is fixed per Premiere Pro release and may lag behind current standards. A framework adds a build step, version management complexity, and potential compatibility issues — all for a single-page panel that benefits more from direct DOM manipulation. The schema-driven renderer generates DOM elements programmatically, which is a natural fit for vanilla JavaScript.

**No TypeScript:** Consistent with the no-build-step philosophy. In a 40-module codebase with a single developer, the documentation and convention system provides the guardrails that TypeScript would offer in a team environment. The tradeoff is explicit and intentional.

**Polling over events:** Premiere Pro's event model is unreliable for selection changes. Rather than build workarounds for inconsistent events, a predictable 500ms poll provides guaranteed state synchronization. The performance cost is negligible — each poll is a single ExtendScript call returning a small string.

**Dual persistence:** Neither `localStorage` alone nor disk alone covers all failure modes. Together, they provide both speed (localStorage is synchronous) and durability (disk survives cache clears). The Node server handles disk I/O so the panel layer stays responsive.

**IIFE module pattern:** In the absence of a module system, IIFEs provide the cleanest encapsulation. Each file is self-contained, dependencies are explicit (read from `window` at the top), and exports are explicit (assigned to `window` at the bottom). The pattern scales to 40+ modules without ambiguity about what depends on what.
