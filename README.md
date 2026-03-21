# modelBridge.ai

**Every AI model. Inside Premiere Pro. Automatically.**

Other plugins hardcode 5–20 models, break when APIs change, and charge you through proprietary credit systems. modelBridge takes a different approach — a schema-driven engine that reads any model's API specification and generates the interface automatically. When fal.ai releases a new model tomorrow, your plugin supports it today. No update required.

900+ models · 11 categories · Real-time cost estimates · Your own API key — no markup on AI costs.

**modelBridge grows with the AI industry.** New models appear automatically as fal.ai expands its catalog — no plugin update, no manual refresh. The toolkit you buy today is more powerful next month, and the month after that, without you lifting a finger.

<!-- Screenshots will go here — see bottom of README for capture list -->

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

**Prompt optimization.** One click rewrites your description into a model-optimized prompt — without requiring prompt engineering expertise.

**Drag-and-drop from Finder.** Drag a file onto the media card — skip the Premiere Pro import step. Mix sources: one slot from your timeline, one from Finder.

---

## An Intelligent System That Improves the More You Use It

Most plugins are static — the tool you install is the tool you get. modelBridge is different. Three systems learn and adapt automatically, making the plugin more capable over time without any updates.

**Growing model catalog.** When fal.ai releases a new AI model, modelBridge discovers it automatically. No plugin update. No manual refresh. The toolkit you buy today is more powerful next month — and the month after that — without you lifting a finger. 900+ models today, more every week.

**Self-improving validation.** The first time a model rejects your image for being too small, modelBridge remembers that exact requirement — permanently. Next time, it catches the problem before any API call. Every failed generation teaches the system something new. After a few weeks of use, the plugin knows more about each model's real-world limits than the models' own documentation.

**Learned time estimation.** After three successful generations with any model, modelBridge starts showing estimated generation time: "~45 sec" or "~2–3 min." The estimates are built entirely from your own usage history — median-based, rounded up slightly so the actual time usually comes in under the estimate. During generation, the estimate tracks progress: "Almost done..." when you're close, "Still working..." if it takes longer than usual. No hardcoded data. No guessing. The system simply watches, learns, and gets more accurate over time.

The result: a tool that feels like it knows what it's doing — because it does.

---

## How It Works

1. **Search and add** — Browse 900+ AI models from the fal.ai catalog. Filter by category, search by name or keyword. Add any model with one click.

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

## Reliability

**9-gate input validation.** Before you click Generate, the plugin checks your media against every requirement — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong: "This image is 640×480 px. This model requires at least 1024×768 px." No wasted credits. No waiting for a generation to fail.

**Self-improving constraint cache.** The first time a model rejects your media, the plugin remembers that limit permanently. Next time, it's caught before any API call. The system gets smarter with every generation.

**Plain-language errors.** Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."* 44 error types from fal.ai mapped to clear messages with recovery steps. Color-coded: red (fix your input), amber (action required), blue (temporary, auto-retrying).

**Background generation tracking.** Errors from background generations are caught and waiting for you — color-coded by type so you can prioritize. Failed generations never silently disappear.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that survives panel close/reopen. Dual persistence ensures settings, saved models, and cost history survive Premiere Pro updates and cache clears.

---

## Quality & Testing

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
| Automated tests (CDP) | 94 of 94 passed |
| Manual stress tests | 52 passed |
| Models audited (UI verification) | 155+ across 5 rounds |
| Pricing accuracy | 0 incorrect across 24 models, 7 categories |
| Root cause fixes from audits | 14+ |
| Critical issues remaining | 0 |

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 900+ (auto-discovered) | 5–20 hardcoded | 1 per platform |
| **Categories** | 11 | 1–2 | 1 per platform |
| **New models** | Automatic — no update needed | Plugin update required | New account required |
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
