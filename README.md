# modelBridge.ai

**An Adobe Premiere Pro plugin that puts 300+ AI models inside the editing timeline.**

Video editors leave Premiere Pro dozens of times a day to use AI tools. Export a frame. Open a browser. Upload. Wait. Download. Import. Position. Scale. Repeat for every generation across every model. It's a workflow that turns a 3-second creative decision into a 90-second context switch — and it compounds across an 8-hour edit session.

modelBridge eliminates all of it. Select a clip on the timeline, pick a model, generate. The result lands on your timeline at the exact position and scale of your source clip. No export. No browser. No manual import. One panel, one workflow, every model.

This is the public showcase for the project. The source code lives in a private repository.

---

## At a Glance

- **Up to 2-3x faster creative workflows** — no more switching between editor, browser, and AI platforms
- **Eliminates context switching** — editors stay inside Premiere Pro for all AI generation
- **300+ models, one panel** — every model gets an auto-generated interface from its API spec
- **Cost tracking built in** — per-project, per-client spend tracking with CSV export for invoicing
- **Two-layer validation** — catches errors before the request leaves your machine, preventing wasted spend
- **Zero-maintenance model support** — schema-driven architecture means new models work automatically

---

## What It Does

modelBridge is a CEP panel extension that integrates generative AI directly into Premiere Pro's editing environment. It connects to a provider platform serving 300+ models and makes them accessible through a single, consistent interface.

**Supported generation types:**
- Text-to-video and image-to-video generation
- Video-to-video transformation and style transfer
- Image generation and upscaling
- Inpainting with a built-in mask editor
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

This means 300+ models each get a purpose-built interface without a single hardcoded form. Sliders have correct min/max ranges. Dropdowns populate from the schema's enum values. Required fields are enforced. Media inputs detect whether the model expects video, image, or either — and validate your selection before the request leaves your machine.

When a model updates its API (adds a parameter, changes a default, deprecates an option), modelBridge picks up the change automatically on next schema fetch. Zero maintenance.

### Two-Layer Input Validation

Most AI platforms charge you for failed requests. Upload the wrong resolution, miss a required field, send an image to a video-only model — you pay for the attempt and get an error message back.

modelBridge validates everything against the live schema before the request leaves your machine:

- **Schema-level validation** checks types, ranges, required fields, and format constraints against the OpenAPI spec
- **Media validation** confirms your selected clip matches what the model expects — right media type, extractable content, compatible format

Two layers, zero wasted spend. Every generation that reaches the API has already passed the same checks the API will run server-side.

### Intelligent Error Translation

AI model APIs return errors designed for developers, not editors. `"422 Unprocessable Entity: resolution must be divisible by 8"` means nothing to someone mid-edit.

modelBridge intercepts every error response and runs it through a declarative, pattern-based translation system. A growing library of error patterns maps raw API responses to plain-language messages with specific recovery steps — resolution constraints become cropping advice, safety filter rejections become prompt suggestions, timeouts become status guidance.

The system is designed to improve over time. Unmatched errors are logged structurally, creating a feedback loop where every new error type becomes a candidate for the next translation rule. Coverage converges toward zero unknowns.

### Timeline-Native Results

Generated content doesn't just download — it integrates. Results are automatically:

- Imported into the active Premiere Pro project
- Placed on the timeline at the exact position of the source clip
- Scaled to match the sequence frame size
- Ready for immediate playback and editing

No dragging files from a download folder. No manual positioning. The result appears exactly where you'd expect it, as if Premiere generated it natively.

### Built-In Mask Editor

Inpainting models need masks — regions of the image you want the AI to regenerate. Most workflows require exporting a frame, opening Photoshop or a web tool, painting a mask, exporting it, and uploading alongside the source.

modelBridge includes a full canvas-based mask editor directly in the panel. Paint masks on extracted video frames with adjustable brush size and opacity, undo support, and zoom/pan navigation. The mask converts and uploads automatically as part of the generation request.

### Source Monitor Preview

Before committing a generated result to your timeline, preview it in Premiere Pro's Source Monitor. Set In and Out points to use only the best segment. The preview workflow lets you evaluate quality at full resolution in Premiere's native player before making any timeline changes.

### Real-Time Cost Tracking

Every generation has a cost. modelBridge tracks spending in real time across six pricing model types, with support for USD, EUR, and SEK. Costs are organized by project and client, persisted to disk, and exportable as CSV for invoicing.

A live cost estimate appears before you generate, so there are no surprises. The estimate accounts for the specific model, resolution, duration, and parameters of your request.

### 8-Step Generation Progress

Long-running generations (video models can take 2–5 minutes) get detailed progress tracking through 8 distinct stages — from submission through queue position, active generation, download, and timeline import. If the panel closes mid-generation, recovery logic picks up where it left off on relaunch.

### Prompt Optimization

An optional AI-powered prompt rewriting step that expands brief descriptions into detailed, model-optimized prompts. The optimizer understands model-specific prompt conventions and adds technical detail that improves output quality without requiring prompt engineering expertise.

---

## How It Compares

|  | **modelBridge** | **Traditional AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import → Position |
| **Model selection** | 300+ from one panel | ~5 hardcoded models | Varies wildly |
| **New model support** | Automatic (schema-driven) | Requires plugin update | Requires new account/tab |
| **Input validation** | Two-layer, pre-request | Basic or none | Server-side only (you pay for failures) |
| **Error messages** | Plain language + recovery steps | Raw API errors | Varies wildly |
| **Cost tracking** | Per-project, per-client, CSV export | None | Per-platform, no aggregation |
| **Client organization** | Built-in project/client tagging | None | Manual folder management |
| **Timeline integration** | Auto-positioned | Manual import | Manual import |
| **Inpainting** | Built-in mask editor | Export to external tool | Platform-specific |
| **Data stays local** | Media processed locally, sent direct to API | Varies | Often uploaded to third-party servers |

---

## By the Numbers

| Metric | Value |
|---|---|
| AI models supported | 300+ |
| JavaScript modules | 40+ |
| Lines of code | 10,000+ |
| CSS design tokens | 50+ |
| Error translation patterns | 20+ |
| Generation progress stages | 8 |
| Pricing model types supported | 6 |
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
│  │          │               │            │  │
│  └──────────┼───────────────┼────────────┘  │
│             │               │               │
│  ┌──────────▼──────────┐    │               │
│  │   Node.js Server    │    │               │
│  │                     │    │               │
│  │  Media extraction   │    │               │
│  │  File upload/download│   │               │
│  │  API key management │    │               │
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
