# modelBridge.app


**Every AI model. Inside Premiere Pro. Automatically.**

Other plugins hardcode 5–20 models, break when APIs change, and charge you through proprietary credit systems. modelBridge takes a different approach — a schema-driven engine that reads any model's API specification and generates the interface automatically. When fal.ai releases a new model tomorrow, your plugin supports it today. No update required.

850+ models · 11 categories · Real-time cost estimates · Your own API key — no markup on AI costs.

**modelBridge grows with the AI industry.** New models appear automatically as fal.ai expands its catalog — no plugin update needed. The model catalog refreshes every 30 minutes, or hit Refresh for instant access to the latest releases. The toolkit you buy today is more powerful next month, and the month after that, without you lifting a finger.

<!-- Screenshots will go here — see bottom of README for capture list -->

Full documentation available here:<br>
https://docs.modelbridge.app/what-is-modelbridge/

---

## Key Features

**Schema-driven dynamic UI.** Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs — all generated from the model's OpenAPI specification. Not hardcoded. Not simplified. The full model, as its creators intended.

**Smart timeline import.** One button. The plugin knows what to do. Select a clip, generate with an image-to-video model, and the result replaces your source clip in-place — exact position, exact duration, exact scale. Generate from a text prompt, and the result inserts at the playhead on the first empty track. Generate audio, and it lands on the right audio track. A live preview bar tells you exactly what will happen before you click — updated as you move the playhead. Your original source clip stays in the project bin — nothing is ever destroyed.

**Dual Mode.** Run the same prompt against two models simultaneously. Results appear as selectable cards — click one, import it, then the other auto-selects for your next decision. Both results get full timeline import, even when sharing the same source clip.

**Real-time cost & time estimates.** Before you generate, you see what it will cost and how long it will take. Change the duration — the cost updates. Toggle audio — the cost updates. The time estimate learns from your previous generations — after three runs, the plugin shows "~45 sec" or "~2–3 min" based on actual history. Four cost confidence tiers. No fabricated numbers.

**Follow Your Generation.** Every generation runs in the background — switch models, browse, keep editing. A persistent panel tracks all active jobs with real-time progress: Sent → Queued → Generating → Downloading → Importing. Each row shows status, model name, elapsed time, and current step. Failed rows stay visible with clear error links — never auto-dismissed.

**3-click voice changer & full audio pipeline.** Select a voice clip on the timeline, click Generate. The AI-converted voice imports directly to the first empty audio track. No export. No browser. No re-import. 10+ audio models: ElevenLabs Voice Changer, Dubbing, TTS, multi-voice dialogue, AI music, sound effects, and transcription. Preview audio inline before importing.

**Built-in mask editor.** Paint inpainting masks directly in the panel — adjustable brush, zoom, pan, eraser, undo. No Photoshop roundtrip.

**Dual-frame interpolation.** Select a start frame and end frame on your timeline. The AI generates the motion between them. Adjacent clips get replaced as a single clip spanning their combined duration.

**Source Monitor preview.** Evaluate results at full resolution in Premiere Pro's Source Monitor. Set In/Out points to import just the best segment.

**Mobile Preview.** Send results to your phone with one tap. Review on the screen your audience uses. Scan a QR code once, then your latest generation is always in the app.

**Your models, organized.** Your 3 most recently used models always appear at the top of the dropdown — no scrolling, no searching for what you just used. Pin your favorites for one-click access. Filter by category (Img-to-Vid, Txt-to-Vid, TTS, and more) to find the right tool fast. Every dropdown in the plugin is searchable and scrollable — type to filter, scroll to browse.

**Prompt optimization.** One click rewrites your description into a model-optimized prompt — without requiring prompt engineering expertise.

**Drag-and-drop from Finder.** Drag a file onto the media card — skip the Premiere Pro import step. Mix sources: one slot from your timeline, one from Finder.

---

## A Living System That Grows With the AI Industry

Most plugins are frozen in time — the tool you install is the tool you get. modelBridge is different. It's a living system: three adaptive mechanisms continuously expand its capabilities, sharpen its accuracy, and deepen its knowledge — without shipping a single update.

**Growing model catalog.** When fal.ai releases a new AI model, modelBridge discovers it automatically. The model catalog refreshes every 30 minutes in the background — or hit the Refresh button for instant access to brand-new models. Need a specific model right now? Paste its fal.ai endpoint ID and it's ready in seconds. If the local catalog doesn't have what you're looking for, the plugin automatically searches fal.ai's live API as a fallback. The toolkit you buy today is more powerful next month — and the month after that. 850+ models today, more every week.

**Self-improving validation.** The first time a model rejects your image for being too small, modelBridge extracts the exact requirement from the error — minimum dimensions, maximum file size, duration limits, aspect ratio constraints — and remembers it permanently. Next time, it catches the problem *before* any API call, before any money is spent. The same protection applies across six constraint types: image dimensions, file size, aspect ratio, and video duration (both minimum and maximum). Every failed generation teaches the system something new. After a few weeks of use, the plugin knows more about each model's real-world limits than the models' own documentation. These learned requirements survive restarts, cache clears, and plugin updates — they're saved to disk, not just browser memory.

**Learned time estimation.** After three successful generations with any model, modelBridge starts showing estimated generation time: "~45 sec" or "~2–3 min." The estimates are built entirely from your own usage history — median-based, rounded up slightly so the actual time usually comes in under the estimate. During generation, the estimate tracks progress: "Almost done..." when you're close, "Still working..." if it takes longer than usual. No hardcoded data. No guessing. The system simply watches, learns, and gets more accurate over time.

The result: a plugin that evolves alongside the AI industry. It absorbs new models, learns from every interaction, and gets measurably better the more you use it. Install it today and it's more capable next month — not because of an update, but because the system itself grew.

---

## How It Works

1. **Search and add** — Browse 850+ AI models from the fal.ai catalog. Smart, forgiving search — type what you're looking for and find it, even with typos or abbreviations. Search "klinh" and still find Kling. Search "upscale" and find Super Resolution models. Search "tts" and find Text to Speech. Filter by category, or paste any fal.ai endpoint ID directly for instant access. Add any model with one click.

2. **Configure and estimate** — The plugin generates a custom interface from the model's schema. Set your parameters, see the cost estimate update in real time. 9 validation gates check your inputs before any API call.

3. **Generate and import** — Click Generate. The result downloads and imports directly to your Premiere Pro timeline — right track, right timecode, right scale. Or preview first in Source Monitor, on your phone, or side-by-side in Dual Mode.

---

## Supported Categories

| Category | Example Use Cases |
|---|---|
| **Text to Image** | Generate stills from prompts — titles, backgrounds, concept art |
| **Image to Image** | Style transfer, upscaling, background removal, image editing |
| **Text to Video** | Generate video clips from text descriptions |
| **Image to Video** | Animate a still frame — product shots, hero images, b-roll |
| **Video to Video** | Style transfer on existing footage, video enhancement |
| **Text to Audio** | Sound effects, ambient audio, music from text descriptions |
| **Text to Speech** | AI voiceovers — multiple voices, languages, emotions |
| **Audio to Audio** | Voice conversion, audio enhancement, noise removal |
| **Audio to Video** | Lip sync, music visualization, audio-driven animation |
| **Video to Audio** | Extract or generate audio tracks from video content |
| **Speech to Speech** | Real-time voice transformation preserving timing and emotion |

---

## For Agencies & Freelancers

**Cost tracking per client and project.** Every generation tracked with exact cost per model per call — in USD, EUR, or SEK. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. One dashboard for total AI spend across all tools.

---

## Cost Transparency

### What you see before generating

modelBridge shows a cost estimate for every generation, based on fal.ai's official published rates. The estimate is labeled clearly so you always know how confident we are:

- **Est. $X.XX** — from our curated rate database, verified against fal.ai's documentation. Updates live as you change parameters (duration, resolution, audio, quality tier).
- **~$X.XX (base rate)** — from fal.ai's live pricing API. May not reflect all parameter surcharges.
- **Cost unavailable** — fal.ai doesn't publish pricing for this model. Click the link to check their site directly.

### What you see after generating

When fal.ai confirms billing units, modelBridge shows **Actual $X.XX** — a green badge in your Costs tab alongside the original estimate.

### Why we can't always show exact costs

fal.ai publishes pricing as unit rates (per second, per megapixel, per image). No tool receives the actual invoiced amount before generation completes. We calculate estimates from official rates and are transparent about the confidence level. When pricing is undocumented, we say "Cost unavailable" rather than show a wrong number.

Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee.

---

## Security & Privacy

### Your data stays on your machine

All user data — saved models, settings, generation history, cost logs — is stored locally on your machine using localStorage and local JSON files. modelBridge does not operate any cloud server, database, or analytics backend. There is no "modelBridge server" that your data is sent to.

Generated media (images, videos, audio) is downloaded directly from fal.ai to your local project folder.

### API key handling

Your fal.ai API key is entered once and stored locally on your machine. It is never transmitted to modelBridge or any third party — used exclusively for direct communication between the plugin and fal.ai. You can view, change, or delete your key at any time from plugin settings.

### Network communication — only two destinations

- **fal.ai** — for AI model generation, schema fetching, and pricing data. All requests authenticated with your own API key.
- **LemonSqueezy** — for license validation at startup. No user data is included — only the license key and a machine identifier.

No third-party analytics, tracking pixels, telemetry, or data collection of any kind.

### License validation

License validation checks a single endpoint (LemonSqueezy License API) at plugin startup. The only data sent is the license key and a local instance identifier — no usage data, no generation history, no personal information. Offline grace period: the plugin continues to work for up to 72 hours since the last successful validation.

### What we do NOT collect

- No prompts, inputs, or generated content
- No usage statistics or analytics
- No personal information beyond what LemonSqueezy provides at purchase
- No browsing behavior, no cookies beyond localStorage, no fingerprinting

### Data deletion

All locally stored data can be cleared from within the plugin (Settings → Reset). Uninstalling removes all extension files. Cost history includes a manual "Reset" function requiring the user to type "DELETE" as confirmation — no accidental data loss.

---

## Legal & Compliance

Comprehensive legal framework published at [docs.modelbridge.app/legal/](https://docs.modelbridge.app/legal/):

- **Terms & Conditions** — covers AI-generated content ownership, liability boundaries, and commercial use rights. EU/GDPR compliant, AI Act positioned.
- **Privacy Policy** — GDPR, CCPA, LGPD, and UK data protection coverage. Documents exactly what minimal data is collected (license validation only) and what isn't (everything else).

Built for professional environments where legal review is a prerequisite for tool adoption.

---

## Reliability

**9-gate input validation.** Before you click Generate, the plugin checks your media against every requirement — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong: "This image is 640×480 px. This model requires at least 1024×768 px." No wasted credits. No waiting for a generation to fail.

**Self-improving constraint cache.** The first time a model rejects your media, the plugin remembers that limit permanently. Next time, it's caught before any API call. The system gets smarter with every generation.

**Plain-language errors.** Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."* 44 error types from fal.ai mapped to clear messages with recovery steps. Color-coded: red (fix your input), amber (action required), blue (temporary, auto-retrying).

**Background generation tracking.** Errors from background generations are caught and waiting for you — color-coded by type so you can prioritize. Failed generations never silently disappear.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that survives panel close/reopen. Dual persistence ensures settings, saved models, and cost history survive Premiere Pro updates and cache clears.

---

## Quality & Testing

### Schema pipeline — full catalog validation

The schema-driven engine that powers modelBridge has been validated against every model in the fal.ai catalog:

| Metric | Result |
|---|---|
| Models in fal.ai catalog | 1,229 |
| Models audited (allowed categories) | 1,082 |
| Models skipped (blocked categories) | 147 |
| **Pipeline errors** | **0** |
| Clean (zero warnings) | 1,025 (94.7%) |
| Warnings (non-blocking) | 48 |
| Schema fetch failures (fal.ai-side) | 5 |

Every audited model was processed through the complete pipeline: schema fetch → $ref dereferencing → 5-tier field classification → media requirement detection → output type mapping → UI generation. Zero models produced a pipeline error.

The 48 warnings are non-blocking — primarily cases where fal.ai marks required media fields as optional in their OpenAPI schemas. The plugin handles these correctly but flags the inconsistency.

Automated tooling (`__mb_bulk_audit()`) enables this validation to be re-run at any time, ensuring continuous compatibility as new models are added to the catalog.

### Pre-launch audit results

- 163 systematic checks across 6 specialized audit agents
- 140 PASS, 0 Critical issues, 0 High-severity issues
- All 11 model categories verified end-to-end

### Adversarial stress test

- 57 attack vectors tested (race conditions, data corruption, network failures, input abuse, unusual models)
- All CRASH and DATA_LOSS findings resolved
- Data integrity audit: custom models and cost history verified safe under all error conditions

### Category gating audit

- All 5 entry points verified — unsupported models cannot be added
- Unknown/new categories blocked by default (fail-safe design)
- Full pipeline verified per category: search → add → render → validate → cost → generate → poll → preview → import → cost log

### Automated & manual testing

| Metric | Result |
|---|---|
| Full catalog audit (schema pipeline) | 1,082 of 1,082 passed — 0 errors |
| Automated tests (CDP) | 148 of 148 passed |
| Manual stress tests | 52 passed |
| Models audited (UI verification) | 155+ across 5 rounds |
| Pricing accuracy | 0 incorrect across 24 models, 7 categories |
| Root cause fixes from audits | 14+ |
| Critical issues remaining | 0 |

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 850+ (validated against full catalog) | 5–20 hardcoded | 1 per platform |
| **Categories** | 11 | 1–2 | 1 per platform |
| **New models** | Automatic — refreshes every 30 min | Plugin update required | New account required |
| **Search** | Typo-tolerant, synonyms, abbreviations, paste-by-ID | Scroll a fixed list | N/A |
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import |
| **Smart import** | Context-aware replace/insert with live preview | Manual positioning | Manual positioning |
| **Audio/TTS** | Select clip → Generate → on timeline | None or separate tool | Export → upload → download → import |
| **Cost estimate** | 4-tier confidence, live parameter updates | Hidden or none | Hidden behind credits |
| **Validation** | Self-improving — learns from errors | Basic or none | Server-side only |
| **Error messages** | Plain language + color-coded by type | Raw API errors | Varies |
| **Vendor lock-in** | Your own API key | Locked to vendor | Locked to platform |

---

## Technical Architecture

<table>
<tr>
<td width="33%">

**Zero manual maintenance**

Models, pricing, and constraints update automatically — no plugin release needed.

</td>
<td width="33%">

**Non-blocking workflow**

All AI jobs run in background — the editor is always responsive.

</td>
<td width="34%">

**Native Premiere integration**

Results land on the timeline automatically — right track, right timecode.

</td>
</tr>
</table>

**Schema-driven, not hardcoded.** The entire UI — every slider, dropdown, media input, and validation rule — is generated at runtime from the model's OpenAPI specification. No model-specific code. No field name lookup tables. No special cases. The same engine handles 850+ models across 11 categories with zero per-model maintenance. When a model's API changes, the UI adapts on the next load.

**Three-layer error architecture.** Layer 1 prevents errors before they happen (schema-driven preflight). Layer 2 learns from errors that get through (constraint extraction and permanent caching). Layer 3 translates every remaining error into plain language with a clear next step. 44 error types mapped. Five semantic categories drive consistent color-coded treatment across every surface — error banners, media cards, and background generation rows all use the same visual language.

**Four-layer cost resolution.** Curated pricing supplements (verified rates) → fal.ai official pricing API (100% coverage) → model family heuristics → honest "unavailable." Each layer is clearly labeled in the UI so users always know the confidence level. No fabricated numbers — ever. Post-generation actuals from fal.ai billing headers confirm or correct estimates.

**Dual persistence everywhere.** Every piece of user data — saved models, learned constraints, cost history, settings — is written to both localStorage (fast reads) and disk files (survives cache clears, Premiere updates, and extension reinstalls). Automatic backup before any migration. Recovery from backup if both primary stores are empty.

**Stack:** 40 JavaScript IIFE modules (ES3-compatible, no bundler) · Node.js backend on localhost (Express) · ExtendScript for Premiere Pro timeline operations · localStorage + disk persistence with dual backup · CSS custom properties (`--mb-*`) design token system.

**Pipeline:** Panel layer (Chromium via CEP) → Local Express server (media extraction, file transfer, async job queue) → fal.ai API (generation, schemas, pricing) → ExtendScript (timeline import, fit-to-frame scaling, format detection).

---

## Pricing

- **$7/month** subscription (planned)
- No markup on AI costs — you use your own fal.ai API key and pay fal.ai directly at their published rates
- Real-time cost visibility before every generation

---

## Who It's For

- **Video editors** who want AI-generated assets without leaving Premiere Pro
- **Post-production studios** integrating AI into existing workflows
- **Content creators** who need quick AI generations with direct timeline integration
- **Agencies** tracking AI costs per client with exportable reports

---

Beta release expected April 2026.

Interested in early access? [Reach out on LinkedIn →](https://www.linkedin.com/in/niklazhallberg/)

---

Built by [Niklaz Hallberg](https://niklaz.works) — digital designer and creative technologist at the intersection of design, code, and generative AI.

2025–2026.

<!--
## Screenshots needed (capture manually)

1. Main Generate tab with a model selected and parameters visible
2. Model search/browse view with filter chips
3. Cost estimate badge with breakdown drawer open
4. Dual Mode with two result cards side-by-side
5. Active Generations Panel with a running job (progress steps visible)
6. Costs tab with generation history rows
7. Audio preview player (inline player visible)
8. Smart timeline import preview bar showing placement message
9. Built-in mask editor
10. Mobile Preview QR code

Current state: No screenshots directory exists in the repo. All screenshots need to be captured fresh.
-->
