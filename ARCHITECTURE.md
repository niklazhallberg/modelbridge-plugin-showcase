# Architecture

How modelBridge is built — design principles, current state, and development practices.

---

## System Design

modelBridge is a three-layer system: a Premiere Pro panel, a local media processing backend, and a cloud operations layer. The panel handles UI and user interaction. The backend handles media extraction, uploads, and downloads. The cloud layer monitors the AI model catalog, manages licensing, and delivers remote updates.

All three layers are designed to operate independently — the panel works offline with cached data, the backend recovers automatically from crashes, and the cloud layer delivers updates without requiring a plugin release. No single point of failure — panel, backend, and cloud layer degrade gracefully if any component is unavailable.

The cloud layer runs autonomously — detecting new models, verifying schemas, and ensuring only working models reach the UI, without manual intervention.

---

## Core Design Principles

**Schema-driven.** No model has hardcoded UI, validation, or pricing logic. Every interface, constraint, and cost estimate is generated at runtime from the model's API specification. This is how 1,000+ models are supported without per-model code — and how new models work immediately without plugin updates. The alternative — maintaining per-model UI code — would require a plugin release for every new model and break whenever a provider updates their API. The schema-driven approach eliminates both failure modes by design.

**Usage-calibrated.** The plugin learns from usage. When a model rejects media, the constraint is remembered and enforced automatically on future attempts. Cost estimates improve as billing history accumulates. Generation time estimates appear after a few uses and converge toward your actual experience the more you generate.

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

**Structured documentation.** The project includes extensive internal documentation — architecture overviews, system deep-dives, convention guides, and behavioral rules. This documentation follows a structured format that is consumable by both human developers and AI coding agents, enabling a new developer to orient within the codebase using standard tooling.

**Test coverage.** Six automated test suites validate the critical paths: error normalization and translation across all fal.ai error formats, cost estimation accuracy across 11 pricing formula types, dual-mode input synchronization and field aliasing, parameter override behavior, visual rendering consistency, and pricing supplement parsing. End-to-end tests verify the full pipeline — from generation request through background polling to timeline import — across four import scenarios (insert, video replace, image replace, audio replace). A classification audit runs every model in the catalog through the schema parser and verifies correct field classification across 10,000+ input fields.

**Conventions and rules.** Coding conventions, commit standards, and architectural rules are documented and enforced consistently. Every error must go through the translation layer — no raw API output reaches users. Every data migration must create a backup first. Every bug fix must check for the same class of problem elsewhere in the codebase.

---

## Platform Integration

### fal.ai

modelBridge integrates with fal.ai at multiple API levels — not just the generation endpoint.

**Model catalog.** The plugin consumes fal.ai's authenticated model listing and browse APIs, including popularity ranking, category classification, and schema endpoints. The catalog is treated as a live data source, not a static list — new models, schema changes, and retirements are detected and handled automatically.

**Schema parsing.** Every model's OpenAPI specification is fetched, parsed, and used to generate the complete UI — input fields, validation rules, media requirements, and parameter constraints. The plugin supports both fal.ai's queue API and platform API endpoints, with automatic fallback between them.

**Pricing.** Cost estimates use fal.ai's official pricing API as one of several sources. The plugin respects fal.ai's published rates and makes no attempt to scrape or infer pricing outside of official endpoints.

**Error specification.** The plugin implements full coverage of fal.ai's error response formats — both structured validation errors (Format A) and infrastructure errors (Format B), including the `X-Fal-Retryable` header, `ctx` structured constraint data, and error documentation URLs. Error types are translated to user-facing language before display.

**Resilience to API changes.** The schema-driven architecture is inherently resilient to changes in fal.ai's model catalog — new models, updated parameters, and revised constraints are absorbed automatically without code changes. Schema fetching uses a fallback chain with stale-cache recovery, so a temporary API issue never blocks the user. If a model endpoint is renamed or retired, the plugin detects the change and handles it gracefully.

### Adobe Premiere Pro

modelBridge is a deep Premiere Pro integration, not a standalone panel that happens to run inside the application.

**Timeline interaction.** The plugin reads and writes to the active sequence — clip selection, track identification, In/Out points, playhead position, and sequence metadata. Generated media is placed on the correct track, at the correct timecode, with frame-accurate positioning.

**Source Monitor.** Results can be opened directly in Premiere Pro's Source Monitor for full-resolution evaluation. Editors can set In/Out points in the Source Monitor and import only the selected range.

**Media awareness.** The plugin reads clip properties from the timeline — dimensions, duration, file path, track index — and uses them for validation, media extraction, and context-aware import decisions (replace in-place vs. insert at playhead vs. route to audio track).

**ExtendScript bridge.** 41 host functions handle communication between the panel and Premiere Pro's scripting engine — covering clip selection, sequence queries, project bin management, timeline manipulation, and fit-to-frame scaling. All host communication is routed through an adapter layer designed to be swapped for UXP equivalents without changing business logic.

---

## Operational Infrastructure

The cloud operations layer is deployed on an edge runtime and runs continuously — multiple times per hour. It is stateless by design; all persistent state is stored in a key-value store that is portable across edge providers.

**Failure recovery.** If the cloud layer is unavailable, the panel continues operating with cached data — the catalog, pricing, and model intelligence all use stale-while-revalidate strategies. When the cloud layer recovers, data refreshes silently in the background.

**Monitoring.** The cloud layer produces structured event logs and sends operator alerts for anomalies — catalog disruptions, licensing events, and schema verification failures. Daily digests summarize catalog health and subscription activity. Instant alerts fire for urgent events that require manual attention.

**Local backend recovery.** The Node.js backend on localhost includes health monitoring, automatic restart on crash, and port conflict detection. If the backend is unreachable, the panel surfaces a clear status message and retries automatically.

---

## Data Architecture

All user data — saved models, settings, generation history, cost logs, and learned constraints — is stored locally on the user's machine. No user data is stored on modelBridge servers. Generated media is downloaded directly from fal.ai to a local project folder.

The cloud operations layer stores catalog state (model availability, schema verification status) and licensing state (subscription status, device identifiers). It does not store user-generated content, prompts, API keys, or personal information beyond what is provided during license activation.

API keys are stored locally and transmitted only to fal.ai directly — never to modelBridge infrastructure. Anonymous error telemetry (error type, model endpoint, plugin version) can be disabled by the user at any time.

Full data architecture, retention policies, and third-party data flows are documented in the [Privacy Policy](https://docs.modelbridge.app/legal/privacy-policy/).

---

## Security & Privacy

User API keys are stored locally and used exclusively for direct communication with fal.ai — they never transit modelBridge infrastructure. The OTA update channel (GitHub raw content) is read-only and carries no user data. License validation transmits only the license key and a device identifier over HTTPS.

The local backend runs on localhost only and is not exposed to the network. Anonymous error telemetry is opt-in (enabled by default, disableable in Settings) and contains no prompts, file paths, media, or personal information.

Comprehensive privacy coverage — including GDPR, CCPA, LGPD, UK GDPR, and AI Act positioning — is published at [docs.modelbridge.app/legal/privacy-policy/](https://docs.modelbridge.app/legal/privacy-policy/).

---

## Scalability

modelBridge is a client-side application — each installation runs its own panel and local backend. There is no shared server infrastructure that becomes a bottleneck as the user base grows.

**Panel and backend.** Run locally per user. Scaling is linear — each new user is an independent instance with no shared state.

**Cloud operations layer.** Runs on an edge runtime with automatic geographic distribution. Catalog monitoring and schema verification are read-heavy workloads against fal.ai's public APIs, bounded by the size of the catalog (currently ~1,000 models), not by the number of modelBridge users.

**OTA delivery.** Served from a global CDN. Static files, no compute per request. Scales to any number of users without infrastructure changes.

**Known limits.** The local backend processes one media extraction at a time per generation. Background generations queue at the fal.ai API level, not locally. The primary scaling constraint is fal.ai's own API rate limits, which apply per user API key.

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

### Proprietary components

- UI rendering and schema-driven interface generation
- Field classification and input parsing
- Cost estimation engine
- Self-learning validation system
- Error translation and handling pipeline
- OTA update infrastructure
- Cloud operations worker (catalog monitoring, insights, licensing)
- All 75+ documentation pages

---

## Platform Roadmap

Adobe is transitioning Premiere Pro extensions from CEP to UXP. A detailed migration plan is in place, covering interface contracts, API mappings, and a phased timeline. The migration architecture isolates all platform-specific code behind adapter interfaces — the goal is to swap implementations without rewriting business logic.

Planned modernization steps include introducing a module bundler (prerequisite for UXP), CI automation for the existing test suites, and incremental type annotations.

---

## Working With the Codebase

The internal documentation follows a structured format that is consumable by both human developers and AI coding agents, enabling a new developer to orient within the codebase using standard tooling. Opening the project in Claude Code, Cursor, or a similar tool gives the agent access to the full project documentation, behavioral rules, and architectural context automatically. Questions about any system, pipeline, or design decision can be answered by the agent directly from the project files.

---

## Further Reading

- [What is modelBridge](https://docs.modelbridge.app/what-is-modelbridge/) — product overview and comparison
- [Schema-Driven UI](https://docs.modelbridge.app/features/schema-driven-ui/) — how the adaptive interface works
- [Cost Estimation](https://docs.modelbridge.app/models/costs/) — confidence tiers and pricing sources
- [Self-Learning Validation](https://docs.modelbridge.app/reference/self-learning/) — how constraints are learned and enforced
- [Error Handling](https://docs.modelbridge.app/troubleshooting/how-errors-work/) — translation pipeline and user-facing messages
- [Privacy Policy](https://docs.modelbridge.app/legal/privacy-policy/) — full data architecture, GDPR/CCPA/LGPD compliance
- [Terms & Conditions](https://docs.modelbridge.app/legal/terms-and-conditions/) — IP, liability, AI Act positioning
- [Compatibility](https://docs.modelbridge.app/reference/compatibility/) — supported platforms and requirements
- [Known Limitations](https://docs.modelbridge.app/reference/limitations/) — honest list of current constraints
