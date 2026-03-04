# modelBridge.ai

**An Adobe Premiere Pro plugin that puts 500+ AI models inside the editing timeline.**

Video editors leave Premiere Pro dozens of times a day to use AI tools. Export a frame. Open a browser. Upload. Wait. Download. Import. Position. Scale. Repeat for every generation across every model. It's a workflow that turns a 3-second creative decision into a 90-second context switch — and it compounds across an 8-hour edit session.

modelBridge eliminates all of it. Select a clip on the timeline, pick a model, generate. The result lands on your timeline at the exact position and scale of your source clip. No export. No browser. No manual import. One panel, one workflow, every model.

This is the public showcase for the project. The source code lives in a private repository.

---

## At a Glance

- **Up to 2-3x faster creative workflows** — no more switching between editor, browser, and AI platforms
- **Eliminates context switching** — editors stay inside Premiere Pro for all AI generation
- **500+ models, one panel** — every model gets an auto-generated interface from its API spec
- **Three-layer validation** — prevents errors before they happen, learns from the ones that slip through, and translates the rest into plain language
- **Self-learning system** — the plugin gets smarter the more you use it, caching constraints from API errors to prevent repeat failures
- **Cost tracking built in** — per-project, per-client spend tracking with CSV export for invoicing
- **Zero-maintenance model support** — schema-driven architecture means new models work automatically
- **Durable data** — settings, cost history, and custom models survive cache clearing, plugin updates, and reinstalls

---

## What It Does

modelBridge is a CEP panel extension that integrates generative AI directly into Premiere Pro's editing environment. It connects to a provider platform serving 500+ models and makes them accessible through a single, consistent interface.

**Supported generation types:**
- Text-to-video and image-to-video generation
- Video-to-video transformation and style transfer
- Dual-frame interpolation — pick start and end frames, AI generates the motion between them
- Image generation and upscaling
- Inpainting with a built-in mask editor (zoom, pan, adjustable brush)
- Prompt-optimized generation with AI rewriting

**Every model works the same way:** select source media, adjust parameters, generate, result appears on your timeline. The plugin handles media extraction, upload, polling, download, import, and positioning automatically.

---

## Why This Exists

The AI tooling landscape for video editors is fragmented. Each model lives behind its own web interface with its own upload flow, its own parameter naming, its own error messages. Editors who want to experiment across models — comparing a style transfer result from one provider against another — spend more time managing browser tabs than making creative decisions.

Most existing plugins solve this by hardcoding support for a handful of popular models — often locked to a single vendor's AI offering. When a new model launches, you wait for a plugin update. When a model changes its API, things break silently.

modelBridge takes a different approach: **schema-driven architecture**. Instead of hardcoding model interfaces, it reads each model's OpenAPI specification and generates the UI dynamically. Every parameter, every constraint, every validation rule comes from the live schema. When a new model appears on the provider platform, modelBridge supports it automatically — no plugin update required.

---

## Key Capabilities

### Schema-Driven Dynamic UI

Every model on the provider platform publishes an OpenAPI specification describing its inputs, types, constraints, and defaults. modelBridge parses these schemas at runtime and generates a complete, validated form interface for each model.

This means 500+ models each get a purpose-built interface without a single hardcoded form. Sliders have correct min/max ranges. Dropdowns populate from the schema's enum values. Required fields are enforced. Media inputs detect whether the model expects video, image, or either — and validate your selection before the request leaves your machine.

When a model updates its API (adds a parameter, changes a default, deprecates an option), modelBridge picks up the change automatically on next schema fetch. Zero maintenance.

### Three-Layer Error Handling

Every error passes through a three-layer defense system so that raw API errors never reach the user and preventable failures never cost money.

**Layer 1 — Prevent.** Schema-driven preflight validates media against every constraint from the model's OpenAPI schema before Generate is clickable. Dimensions, file size, aspect ratio, video duration — all checked locally, in real-time, with zero model-specific code.

**Layer 2 — Learn.** When an API error contains parseable constraint values (e.g. "Minimum dimensions are 300x300"), the plugin extracts them, caches them per model, and enforces them at preflight on all future attempts. The first error on an undocumented constraint is unavoidable. Every subsequent attempt on the same model catches it instantly — no API call, no charge.

**Layer 3 — Never Leak.** Every error message follows the WHAT / WHY / WHAT TO DO pattern. 20+ pattern categories map raw API responses to plain-language messages with specific recovery steps. No raw JSON, no HTTP status codes, no API field names reach the user.

### Self-Learning Validation

The plugin gets smarter the more you use it. When a model rejects media — wrong dimensions, file too large, unsupported aspect ratio, video too long or too short — the constraint values are parsed from the error message, cached locally per model, and enforced at preflight on all future attempts.

Six constraint types are covered end-to-end: minimum/maximum dimensions, file size, aspect ratio, and video duration. For unknown future constraint types, a generic fallback parser extracts numeric min/max values from any error message and caches them for potential future enforcement.

Learned constraints use dual persistence (fast in-memory reads + durable disk file) and never override schema values — schema is always the source of truth, learned constraints fill the gaps.

### Dual-Frame Selection

Models that accept both a start frame and end frame — like interpolation and morphing models — show a purpose-built dual-column card. Each column displays a media-type icon, title ("Start Frame" / "End Frame"), a Required/Optional badge, and a thumbnail.

Select two clips on the timeline and the plugin maps them to start and end frames based on selection order. When both clips are adjacent on the same track, the generated video can replace both source stills directly on the timeline as a single clip spanning their combined duration.

### Built-In Mask Editor

Inpainting models need masks — regions of the image you want the AI to regenerate. Most workflows require exporting a frame, opening Photoshop or a web tool, painting a mask, exporting it, and uploading alongside the source.

modelBridge includes a full canvas-based mask editor directly in the panel. Paint masks on extracted video frames with adjustable brush size and opacity, eraser mode, undo support, and zoom/pan navigation for precision work on high-res frames. The mask converts and uploads automatically as part of the generation request.

### Timeline-Native Results

Generated content doesn't just download — it integrates. Results are automatically:

- Imported into the active Premiere Pro project
- Placed on the timeline at the exact position of the source clip
- Scaled to match the sequence frame size
- Ready for immediate playback and editing

No dragging files from a download folder. No manual positioning. The result appears exactly where you'd expect it, as if Premiere generated it natively.

### Source Monitor Preview

Before committing a generated result to your timeline, preview it in Premiere Pro's Source Monitor. Set In and Out points to use only the best segment — import only the marked subregion to your timeline. The preview workflow lets you evaluate quality at full resolution in Premiere's native player before making any timeline changes.

### Model Discovery

Finding new models doesn't require leaving the plugin. A live search interface queries the full provider catalog with category filter chips, sort options, and cursor-based pagination.

Each search result shows the model name, category badge, commercial license badge, and description. Models updated within the last 14 days display a "NEW" badge. A commercial-use filter chip lets you show only commercially licensed models — important for agency work where licensing matters.

One-click add fetches the schema, registers the model, and builds its interface. No URL copying, no switching to a browser.

### Real-Time Cost Tracking

Every generation has a cost. modelBridge tracks spending in real time across six pricing model types, with support for USD, EUR, and SEK. Costs are organized by project and client, persisted to disk, and exportable as CSV for invoicing.

A live cost estimate appears before you generate, so there are no surprises. The estimate accounts for the specific model, resolution, duration, and parameters of your request.

External AI costs from other platforms (Midjourney, RunwayML, etc.) can be imported via CSV for a complete picture of total AI spend. Self-contained HTML reports with charts and compliance badges are generated in one click.

### Generation Progress & Recovery

Long-running generations get detailed progress tracking through 11 distinct stages — from submission through queue position, active generation, download, and timeline import. A compact activity log shows elapsed timestamps for every step.

**Background recovery** handles the gap between UI timeouts and actual generation completion. If a generation takes longer than expected, the plugin continues polling in the background — every 30 seconds for up to 30 minutes. If the result arrives while you're editing or after a panel reload, it's automatically downloaded and imported. No lost generations.

### Server Resilience

The local Node.js server that powers the plugin is designed to be invisible. If it works perfectly, you never think about it. If something goes wrong, the plugin handles it.

A 90-second heartbeat monitors server health. If the server crashes — from a bug, a system sleep event, or a resource conflict — the plugin detects the failure and automatically restarts within seconds. A crash budget prevents infinite restart loops. Pre-flight health checks run before operations like model search, triggering recovery before errors are visible.

Network requests to the AI platform automatically retry up to 3 times with exponential backoff (1s, 2s, 4s) before surfacing an error. Transient blips are absorbed silently.

### Prompt Optimization

An optional AI-powered prompt rewriting step that expands brief descriptions into detailed, model-optimized prompts. The optimizer understands model-specific prompt conventions and adds technical detail that improves output quality without requiring prompt engineering expertise.

### Drag-and-Drop from Finder

Skip the import step entirely. Drag an image or video file from Finder directly onto the media card — the plugin uses it for generation without needing to import it into Premiere Pro first. Supports single-slot and dual-slot modes, mixed mode (one slot from Finder, one from timeline), and pinned files that persist until explicitly cleared.

### Durable Data Persistence

Creative work depends on tools that don't lose your setup. CEP's Chromium engine can clear localStorage during cache resets — a single Premiere Pro update could wipe saved models and settings.

modelBridge uses dual persistence: localStorage for fast reads, disk-backed JSON files for durability. Custom models, cost history, learned constraints, and API keys all survive cache clears, plugin updates, and reinstalls. You configure the plugin once. It stays configured.

---

## How It Compares

|  | **modelBridge** | **Traditional AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import → Position |
| **Model selection** | 500+ from one panel | ~5 hardcoded models | Varies wildly |
| **New model support** | Automatic (schema-driven) | Requires plugin update | Requires new account/tab |
| **Input validation** | Three-layer, self-improving | Basic or none | Server-side only (you pay for failures) |
| **Error messages** | Plain language + recovery steps | Raw API errors | Varies wildly |
| **Cost tracking** | Per-project, per-client, CSV export | None | Per-platform, no aggregation |
| **Learning from errors** | Constraint cache improves over time | None | None |
| **Timeline integration** | Auto-positioned + Source Monitor preview | Manual import | Manual import |
| **Inpainting** | Built-in mask editor with zoom/pan | Export to external tool | Platform-specific |
| **Data durability** | Dual persistence (survives reinstalls) | localStorage only | Cloud-dependent |
| **Data stays local** | Media processed locally, sent direct to API | Varies | Often uploaded to third-party servers |

---

## By the Numbers

| Metric | Value |
|---|---|
| AI models supported | 500+ |
| JavaScript modules | 40+ |
| Lines of code | 12,000+ |
| CSS design tokens | 56 |
| Error translation patterns | 20+ |
| Self-learning constraint types | 6 |
| Generation progress stages | 11 |
| Pricing model types supported | 6 |
| UX decisions documented | 280+ |
| Build steps required | 0 |

---

## Technical Overview

modelBridge runs as a three-layer system inside Premiere Pro:

```
┌─────────────────────────────────────────────┐
│             Adobe Premiere Pro              │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │     CEP Panel (Chromium Browser)      │  │
│  │                                       │  │
│  │  40+ JS modules · Dynamic UI engine   │  │
│  │  Schema parser · Validation system    │  │
│  │  Cost tracker · Progress manager      │  │
│  │  Self-learning constraint cache       │  │
│  │          │               │            │  │
│  └──────────┼───────────────┼────────────┘  │
│             │               │               │
│  ┌──────────▼──────────┐    │               │
│  │   Node.js Server    │    │               │
│  │                     │    │               │
│  │  Media extraction   │    │               │
│  │  File upload/download│   │               │
│  │  API key management │    │               │
│  │  Heartbeat monitor  │    │               │
│  └─────────────────────┘    │               │
│                             │               │
│  ┌──────────────────────────▼────────────┐  │
│  │     ExtendScript Bridge (ES3)         │  │
│  │                                       │  │
│  │  Timeline read/write · Media import   │  │
│  │  Clip positioning · Sequence queries  │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
              │
              ▼
     ┌────────────────┐
     │  AI Provider   │
     │  Platform API  │
     └────────────────┘
```

For a deeper look at the architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

For the full version history, see [CHANGELOG.md](CHANGELOG.md).

---

Beta release expected April 2026. Interested in early access? [Reach out](https://www.linkedin.com/in/niklazhallberg/).

---

## About

modelBridge.ai is built by [Niklaz Hallberg](https://niklaz.works). Connect on [LinkedIn](https://www.linkedin.com/in/niklazhallberg/).

Built by Niklaz Hallberg, 2025–2026.
