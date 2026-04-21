# Architecture

How modelBridge is built — design principles, current state, and development practices.

---

## System Design

modelBridge is a three-layer system: a Premiere Pro panel, a local media processing backend, and a cloud operations layer. The panel handles UI and user interaction. The backend handles media extraction, uploads, and downloads. The cloud layer monitors the AI model catalog, manages licensing, and delivers remote updates.

All three layers are designed to operate independently — the panel works offline with cached data, the backend recovers automatically from crashes, and the cloud layer delivers updates without requiring a plugin release. No single point of failure — panel, backend, and cloud layer degrade gracefully if any component is unavailable.

The cloud layer runs autonomously — detecting new models, verifying schemas, and ensuring only working models reach the UI, without manual intervention.

---

## Core Design Principles

**Schema-driven.** No model has hardcoded UI, validation, or pricing logic. Every interface, constraint, and cost estimate is generated at runtime from the model's API specification. This is how 1,000+ models are supported without per-model code — and how new models work immediately without plugin updates.

**Self-improving.** The plugin learns from usage. When a model rejects media, the constraint is remembered and enforced automatically on future attempts. Cost estimates improve as billing history accumulates. Generation time estimates appear after a few uses. The system gets more accurate the longer you use it.

**Resilient.** User data survives cache clears, application updates, and plugin reinstalls. Automatic backup before every data migration. Silent recovery when primary storage is unavailable. No "start over from scratch" scenarios.

**Remotely updatable.** Error handling, pricing data, model intelligence, and feature flags are delivered over-the-air. When something changes in the AI ecosystem, the response reaches users within an hour — without a plugin release, without user action.

**Defensive.** All external data is parsed defensively — invalid values are rejected before they reach business logic. Validation runs before every generation to prevent wasted API credits.

---

## Scale

| | |
|---|---|
| Supported AI models | 1,000+ across 11 categories |
| Panel codebase | Tens of thousands of lines of JavaScript and CSS |
| Design system | Token-driven — visual consistency across every surface |
| Documentation site | 75+ pages across guides, reference, Academy, and legal |
| Automated tests | 94 CDP tests + 49 end-to-end tests + classification audit |
| Built by | One developer — designed for team collaboration and handover |

---

## Development Practices

**Structured documentation.** The project includes extensive internal documentation — architecture overviews, system deep-dives, convention guides, and behavioral rules. This documentation is designed to be consumed by both developers and AI development agents, making it straightforward to navigate the codebase and understand design decisions with tool assistance.

**Test coverage.** Six automated test suites validate core systems: error handling, cost display, dual mode, input overrides, visual rendering, and pricing. End-to-end tests verify the full pipeline from generation through timeline import. A classification audit checks every model in the catalog against the schema parser.

**Conventions and rules.** Coding conventions, commit standards, and architectural rules are documented and enforced consistently. Every error must go through the translation layer — no raw API output reaches users. Every data migration must create a backup first. Every bug fix must check for the same class of problem elsewhere in the codebase.

---

## Platform Integration

### fal.ai

modelBridge integrates with fal.ai at multiple API levels — not just the generation endpoint.

**Model catalog.** The plugin consumes fal.ai's authenticated model listing and browse APIs, including popularity ranking, category classification, and schema endpoints. The catalog is treated as a live data source, not a static list — new models, schema changes, and retirements are detected and handled automatically.

**Schema parsing.** Every model's OpenAPI specification is fetched, parsed, and used to generate the complete UI — input fields, validation rules, media requirements, and parameter constraints. The plugin supports both fal.ai's queue API and platform API endpoints, with automatic fallback between them.

**Pricing.** Cost estimates use fal.ai's official pricing API as one of several sources. The plugin respects fal.ai's published rates and makes no attempt to scrape or infer pricing outside of official endpoints.

**Error specification.** The plugin implements full coverage of fal.ai's error response formats — both structured validation errors (Format A) and infrastructure errors (Format B), including the `X-Fal-Retryable` header, `ctx` structured constraint data, and error documentation URLs. Error types are translated to user-facing language before display.

### Adobe Premiere Pro

modelBridge is a deep Premiere Pro integration, not a standalone panel that happens to run inside the application.

**Timeline interaction.** The plugin reads and writes to the active sequence — clip selection, track identification, In/Out points, playhead position, and sequence metadata. Generated media is placed on the correct track, at the correct timecode, with frame-accurate positioning.

**Source Monitor.** Results can be opened directly in Premiere Pro's Source Monitor for full-resolution evaluation. Editors can set In/Out points in the Source Monitor and import only the selected range.

**Media awareness.** The plugin reads clip properties from the timeline — dimensions, duration, file path, track index — and uses them for validation, media extraction, and context-aware import decisions (replace in-place vs. insert at playhead vs. route to audio track).

**ExtendScript bridge.** 41 host functions handle communication between the panel and Premiere Pro's scripting engine — covering clip selection, sequence queries, project bin management, timeline manipulation, and fit-to-frame scaling.

---

## Dependencies & Licensing

### Proprietary code

The modelBridge codebase — panel JavaScript, CSS design system, Cloudflare Worker, schema parsing engine, cost estimation system, error handling pipeline, and all documentation — is proprietary. No open-source components are forked or vendored into the core codebase.

### External service dependencies

| Dependency | Role | License / Terms |
|---|---|---|
| fal.ai API | AI model generation, schema, pricing, catalog | Commercial API — user authenticates with their own key |
| LemonSqueezy | Subscription billing, license validation | Commercial SaaS — webhook integration |
| GitHub raw content | OTA delivery (error docs, pricing, feature flags) | Public CDN — read-only, no user data sent |

### Local runtime dependencies

| Dependency | Role | License |
|---|---|---|
| Node.js + Express | Local backend server | MIT |
| FFmpeg / FFprobe | Media extraction (video frames, audio, metadata) | LGPL-2.1 / GPL-2 (used as external process, not linked) |
| Sharp | Image processing (thumbnails, format conversion) | Apache-2.0 |

FFmpeg is invoked as an external process — not linked or bundled — which preserves LGPL compliance. All other runtime dependencies are permissively licensed.

### What is not dependent on third parties

- UI rendering and schema-driven interface generation — fully proprietary
- Field classification and input parsing — fully proprietary
- Cost estimation engine (5-layer cascade, 11 formula types) — fully proprietary
- Self-learning validation system — fully proprietary
- Error translation and handling pipeline — fully proprietary
- OTA update infrastructure — fully proprietary
- Cloud operations worker (catalog monitoring, insights, licensing) — fully proprietary
- All 75+ documentation pages — fully proprietary

---

## Platform Roadmap

Adobe is transitioning Premiere Pro extensions from CEP to UXP. A detailed migration plan is in place, covering interface contracts, API mappings, and a phased timeline. The migration architecture isolates all platform-specific code behind adapter interfaces — the goal is to swap implementations without rewriting business logic.

Planned modernization steps include introducing a module bundler (prerequisite for UXP), CI automation for the existing test suites, and incremental type annotations.

---

## Working With the Codebase

The project is structured for AI-agent-assisted development. Opening the codebase in Claude Code, Cursor, or a similar tool gives the agent access to the full project documentation, behavioral rules, and architectural context automatically. The documentation is machine-readable by design — questions about any system, pipeline, or design decision can be answered by the agent directly from the project files.
