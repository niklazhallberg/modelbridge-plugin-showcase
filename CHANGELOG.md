# Changelog

Curated version history of modelBridge.ai, from proof of concept to production system.

---

## v0.9 — Agency Polish (March 2026)

The "ready for professional use" release. Focus on reliability, cost accountability, and the kind of workflow polish that matters when you're billing clients.

- **Source Monitor preview** — Preview generated results in Premiere's Source Monitor before committing to the timeline, with In/Out point selection
- **Prompt optimization** — AI-powered prompt rewriting that expands brief descriptions into model-optimized prompts
- **Generation progress refinement** — 8-step progress tracking with contextual messages adapted to generation duration
- **Background recovery** — Long-running generations survive panel close and resume on relaunch
- **Button state system** — Generate button reflects exact pipeline stage with visual feedback and completion animation
- **Short prompt warning** — Contextual guidance when prompts are too brief for optimal results

---

## v0.8 — Cost Intelligence (February 2026)

Making AI generation costs visible, trackable, and billable.

- **Real-time cost tracking** — Per-generation cost calculation across 6 pricing model types
- **Project and client organization** — Tag generations to projects and clients for invoicing
- **CSV export** — Export cost history for accounting and client billing
- **Multi-currency support** — USD, EUR, SEK with live conversion
- **Pre-generation estimates** — See what a generation will cost before you commit
- **Cost history persistence** — Dual storage (localStorage + disk) for durability across reinstalls

---

## v0.7 — Error Intelligence (January 2026)

Transforming cryptic API errors into actionable guidance.

- **Error translation pipeline** — 20+ patterns matching raw API errors to plain-language messages with recovery steps
- **Structured unknown logging** — Unmatched errors logged with full context for pattern development
- **Resolution guidance** — Specific pixel-level advice for dimension constraint errors
- **NSFW handling** — Clear messaging and recovery suggestions for safety filter rejections
- **Timeout recovery** — Guidance for long-running generations that exceed expected duration
- **Inline error display** — Contextual error cards replacing generic alert dialogs

---

## v0.6 — Mask Editor (December 2025)

Bringing inpainting workflow entirely inside Premiere Pro.

- **Canvas-based mask editor** — Full-screen painting interface with brush size and opacity controls
- **Zoom and pan navigation** — Scroll to zoom, space-drag to pan, fit-to-view reset
- **Undo system** — Multi-step undo with visual state tracking
- **Auto-format conversion** — Masks automatically converted to the format each model expects
- **Keyboard shortcuts** — Space for hand tool, Cmd+Z for undo, bracket keys for brush size
- **Video frame extraction** — Paint masks directly on frames extracted from timeline clips

---

## v0.5 — Model Discovery (November 2025)

From "pick a model from a list" to "search, discover, and add any model."

- **Model search** — Search across the provider platform's full model catalog with filter chips
- **One-click add** — Add any discovered model to your panel with automatic schema parsing
- **Custom model persistence** — Added models persist across sessions via dual storage
- **Schema caching** — 5-minute TTL cache with 3-endpoint cascade for resilience
- **Category filtering** — Filter models by type: text-to-video, image-to-video, upscaling, style transfer
- **Pagination** — Browse large result sets without performance degradation

---

## v0.4 — Media Validation (November 2025)

Eliminating wasted spend on misconfigured generations.

- **Two-layer validation** — Schema constraints + media type matching, checked before the request leaves your machine
- **Continuous selection monitoring** — 500ms polling loop tracks timeline selection state in real time
- **Hybrid media labels** — Input fields dynamically reflect selection state with match/mismatch/empty indicators
- **Media type enforcement** — Required input type validated against actual selection (video vs. image)
- **Generate button gating** — Button disabled with specific reason when validation fails
- **Media info card** — Visual feedback showing selected clip details and compatibility status

---

## v0.3 — Schema-Driven UI (October 2025)

The architectural pivot that made 300+ models possible.

- **Dynamic form generation** — UI rendered at runtime from OpenAPI schemas, no hardcoded forms
- **Field classification engine** — 5-tier priority system determining the correct UI component for each schema field
- **Schema-first guards** — Enum and boolean fields correctly classified regardless of field name patterns
- **Versioned input cache** — Classification changes auto-invalidate cached inputs without network calls
- **Advanced settings** — Collapsible section for non-essential parameters with schema-provided defaults
- **Constraint enforcement** — Slider ranges, string lengths, and numeric bounds derived from schema

---

## v0.2 — Timeline Integration (October 2025)

Moving from "generate and download" to "generate and edit."

- **Auto-import** — Generated results automatically imported into the active Premiere Pro project
- **Timeline placement** — Results placed at the exact position of the source clip
- **Auto-scaling** — Imported media scaled to match the sequence frame size
- **ExtendScript bridge** — 19 functions for direct Premiere Pro timeline manipulation
- **Node.js backend** — Express server for media extraction, file I/O, and API communication
- **Server lifecycle management** — Auto-spawn, health monitoring, and crash recovery

---

## v0.1 — Proof of Concept (October 2025)

Can an AI generation be triggered from inside Premiere Pro?

- **Single model integration** — One text-to-video model, hardcoded parameters
- **CEP panel** — Basic panel loading inside Premiere Pro via CEP 9.0
- **API communication** — Submit a prompt, poll for completion, download the result
- **Manual import** — Generated file saved to disk, manually imported by the user
- **Dark theme** — Initial UI matching Premiere Pro's native appearance

---

*Built by Niklaz Hallberg, 2025–2026.*
