# modelBridge.app

AI generation for Adobe Premiere Pro — 900+ models, one panel, zero browser tabs.

---

Professional video editors juggle 3–5 AI tools in separate browser tabs. Every generation means leaving Premiere Pro — uploading, waiting, downloading, importing, conforming. You're paying four separate subscriptions, dealing with four different credit systems, and none of these tools know anything about your timeline. modelBridge puts every major AI model directly inside your NLE. Results land on your timeline, positioned and ready to cut. When fal.ai adds a new model, modelBridge supports it automatically — no plugin update needed.

## Why editors switch to modelBridge

**Stay in Premiere.** Generate AI video, images, and audio without opening a browser. Results import to the right track, at the right timecode, with the right scale. Your creative flow never breaks.

**900+ models, one panel.** Kling, FLUX, Veo, Seedance, ElevenLabs, and hundreds more through a single interface across 11 categories. Stop paying four separate subscriptions for four separate tools.

**See estimated costs before you generate.** Real-time estimates update as you change duration, resolution, and aspect ratio. Four confidence tiers tell you how reliable the number is. You pay fal.ai directly at their published rates — no credit systems, no surprises.

**Generate in the background. Edit in the foreground.** Long generations move to the background automatically. Stack parallel jobs across different models. A sound and notification tell you when each result is ready. If Premiere restarts, your background jobs resume.

**Track costs per client.** Tag generations to projects. See spending breakdowns, model usage, and commercial compliance status. Export reports with KPIs and licensing badges. Bill AI costs to clients with confidence.

**Self-improving validation.** The same mistake never costs money twice. When a model rejects your media, the plugin extracts the exact requirement and enforces it on all future attempts — before any API call, before any charge.

**Smart timeline import.** One button. The plugin reads your editing context and acts: replace source clip in-place, insert at playhead, route audio to the right track. A live preview bar shows exactly what will happen before you click.

**Built-in tools.** Paint inpainting masks directly in the panel. Optimize prompts with one click. Preview on your phone via QR code. Run two models side-by-side in Dual Mode.

## Getting started

1. **Subscribe** at [modelbridge.app](https://modelbridge.app) — 14-day free trial, then $7/month or $59/year
2. **Install** the plugin via ZXP installer — see [docs.modelbridge.app/getting-started/installation/](https://docs.modelbridge.app/getting-started/installation/)
3. **Open modelBridge** in Premiere Pro → Extensions → modelBridge
4. **Paste your license key** from the LemonSqueezy receipt email
5. **Paste your fal.ai API key** from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
6. **Start generating**

## Pricing

**$7/month** or **$59/year** (save ~30%). 14-day free trial with full access — no restrictions, no generation limits. A payment method (card, PayPal, Apple Pay, or Google Pay) is required to start the trial, but you won't be charged until the trial ends.

AI generation costs paid directly to fal.ai at their published rates — modelBridge adds zero markup. No credit systems, no lock-in, cancel anytime.

**What happens when your subscription expires:** Read-only mode. Your data stays — generation is disabled until you reactivate. No data is ever deleted because of a billing change.

## Links

- [Documentation](https://docs.modelbridge.app/what-is-modelbridge/) — full feature docs, guides, and reference
- [Store](https://modelbridge.app) — download and subscribe
- [Support](mailto:support@modelbridge.app) — reach out anytime

<!-- Screenshots will go here — see bottom of README for capture list -->

---

## Key Features

**Schema-driven dynamic UI.** Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs — all generated from the model's OpenAPI specification. Not hardcoded. Not simplified. The full model, as its creators intended.

**Smart timeline import.** One button. The plugin knows what to do. Select a clip, generate with an image-to-video model, and the result replaces your source clip in-place — exact position, exact duration, exact scale. Generate from a text prompt, and the result inserts at the playhead on the first empty track. Generate audio, and it lands on the right audio track. A live preview bar tells you exactly what will happen before you click — updated as you move the playhead. Your original source clip stays in the project bin — nothing is ever destroyed.

**Dual Mode.** Run the same prompt against two models simultaneously. Results appear as selectable cards — click one, import it, then the other auto-selects for your next decision. Both results get full timeline import, even when sharing the same source clip.

**Real-time cost & time estimates.** Before you generate, you see what it will cost and how long it will take. Change the duration — the cost updates. Toggle audio — the cost updates. The time estimate learns from your previous generations — after three runs, the plugin shows "~45 sec" or "~2–3 min" based on actual history. Four cost confidence tiers. No fabricated numbers.

**Follow Your Generation.** Long-running AI generations automatically move to the background so you never wait. Keep editing, switch models, browse the catalog — your generations run in parallel across any number of models. A persistent panel tracks every active job with real-time progress through five stages: Sent → Queued → Generating → Downloading → Importing. modelBridge keeps you informed every step of the way — a 5-stage communication system delivers contextual guidance, estimated completion time, and clear next steps as each generation progresses. When it's done, a sound notification and visual badge bring you back. If something fails, the error stays visible with a color-coded explanation and fix steps — never silently dismissed. Even restarting the plugin doesn't lose your generation — active jobs are recovered automatically and polling resumes where it left off.

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

**Always up-to-date error handling.** When something goes wrong, modelBridge shows a clear, helpful message — not raw API errors. If a new type of error appears that the plugin hasn't seen before, it's automatically reported to the development team (anonymously, with no personal data). Specific error messages and fix steps are published remotely and arrive the next time you open the plugin. What was a generic message yesterday becomes a targeted explanation today — without any plugin update. Cost estimates stay accurate the same way: pricing data updates automatically when fal.ai changes rates.

The result: a plugin that evolves alongside the AI industry. It absorbs new models, learns from every interaction, improves its error handling in the field, and gets measurably better the more you use it. Install it today and it's more capable next month — not because of an update, but because the system itself grew.

---

## 7 Intelligent Systems

Under the surface, 70 behaviors work automatically — adapting, learning, and preventing mistakes. Here are the seven most significant.

**1. Self-expanding library.** 1,200+ AI models today. More tomorrow. Zero plugin updates needed. The catalog refreshes automatically as fal.ai publishes new models — three discovery layers ensure nothing is missed. The toolkit you buy today is more powerful next month without anyone touching it.

**2. Schema-driven interface.** Every model gets a custom-built interface — sliders, dropdowns, media inputs, validation rules — generated automatically from the model's API specification. No hardcoded models. No simplified wrappers. The full model, as its creators intended. 1,200+ models, zero model-specific UI code.

**3. Self-learning validation.** A constraint error costs money once — never twice. When a model rejects your media, the plugin extracts the exact requirement and remembers it permanently. Next time, it catches the problem before any API call. Six constraint types across dimensions, file size, duration, and aspect ratio. The system gets smarter with every generation.

**4. Cost intelligence.** Four confidence levels — from recorded billing amounts to honest "pricing unavailable." The plugin never fabricates a number. 11 pricing formula types, live recalculation as you change parameters, daily exchange rates in 6 currencies, and post-generation actuals from fal.ai billing headers. You always know what you're spending.

**5. Generation time learning.** Estimated time on every model card — "~45 sec" or "~2–3 min." Built from your own usage history using a rolling 30-sample median. After three generations with any model, the estimate appears. After thirty, it's remarkably accurate. No hardcoded data. The system watches, learns, and improves.

**6. Smart timeline import.** One button. The plugin reads your editing context and decides how to import. Source clip selected? Replace in-place. Text prompt? Insert at playhead. Audio? Land on the audio track. Two adjacent clips? Replace both with a single interpolation span. A live preview bar shows exactly what will happen — track, timecode, action — updated as you move the playhead.

**7. AI prompt optimization.** One click to enhance your prompt — tailored to your specific model type. The optimizer knows whether you're generating video, images, or audio, and adjusts its enhancement strategy accordingly. Better prompts, better results, no prompt engineering expertise required.

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

**Cost tracking per client and project.** Every generation tracked with estimated cost per model per call — in USD, EUR, SEK, DKK, NOK, or GBP. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. One dashboard for total AI spend across all tools.

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

## Cost Transparency

### What you see before generating

modelBridge shows a cost estimate for every generation, based on fal.ai's official published rates. Four confidence tiers, clearly labeled:

- **$X.XX Estimated** (blue) — calculated from fal.ai's official price list. Updates live as you change parameters (duration, resolution, audio, quality tier). Close to the final cost.
- **From $X.XX** (orange) — minimum cost from fal.ai's pricing API. Actual charge may be higher depending on resolution, duration, or audio.
- **No price** (grey) — fal.ai doesn't publish pricing for this model. Click the link to check their site directly.

### What you see after generating

When fal.ai confirms billing units, modelBridge shows **Actual $X.XX** — a green badge in your Costs tab alongside the original estimate.

### Why we can't always show exact costs

fal.ai publishes pricing as unit rates (per second, per megapixel, per image). No tool receives the actual invoiced amount before generation completes. We calculate estimates from official rates and are transparent about the confidence level. When pricing is undocumented, we show "No price" rather than fabricate a number.

Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee.

---

## Reliability

**9-gate input validation.** Before you click Generate, the plugin checks your media against every requirement — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong: "This image is 640×480 px. This model requires at least 1024×768 px." No wasted credits. No waiting for a generation to fail.

**Self-improving constraint cache.** The first time a model rejects your media, the plugin remembers that limit permanently. Next time, it's caught before any API call. The system gets smarter with every generation.

**Plain-language errors.** Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."* 44 error types from fal.ai mapped to clear messages with recovery steps. Color-coded: red (fix your input), amber (action required), blue (temporary, auto-retrying).

**Background generation tracking.** Errors from background generations are caught and waiting for you — color-coded by type so you can prioritize. Failed generations never silently disappear.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that survives panel close/reopen. Dual persistence ensures settings, saved models, and cost history survive Premiere Pro updates and cache clears.

---

## Always Up to Date

Every error message in modelBridge is written for humans. You'll never see raw API responses, HTTP status codes, or cryptic field names. When something goes wrong, the plugin tells you what happened, why, and exactly what to do — in plain language, color-coded by severity.

When fal.ai introduces a new error type that modelBridge hasn't seen before, the plugin shows a safe, generic message immediately — no broken UI, no confusing technical output. The error is logged internally so it can be addressed.

Error documentation updates are delivered remotely — no reinstallation, no plugin update. When a new error is identified and documented, the updated copy arrives automatically the next time the plugin starts. "Read more" links in error banners only appear when a verified documentation page exists for that specific error — never broken links.

The result: a plugin that handles the unexpected gracefully and gets smarter over time, without requiring any action from you.

---

## Live News Feed

modelBridge includes an in-plugin news feed that keeps you current without leaving Premiere Pro. New AI models are detected automatically from fal.ai's catalog and announced in a compact banner below the tab bar. Feature updates, workflow tips, and maintenance notices are delivered the same way.

When a new model appears, clicking "Try it" opens the model search with the endpoint pre-filled — add it to your library in one click. Service notices warn you about scheduled downtime before it affects your work.

The feed checks for updates once per startup, respects your preferences (disable non-critical news in Settings), and sends only your plugin version and platform to our server — no personal data.

---

## Security & Privacy

### Your data stays on your machine

All user data — saved models, settings, generation history, cost logs — is stored locally on your machine using localStorage and local JSON files. modelBridge does not operate any cloud server, database, or analytics backend. There is no "modelBridge server" that your data is sent to.

Generated media (images, videos, audio) is downloaded directly from fal.ai to your local project folder.

### API key handling

Your fal.ai API key is entered once and stored locally on your machine. It is never transmitted to modelBridge or any third party — used exclusively for direct communication between the plugin and fal.ai. You can view, change, or delete your key at any time from plugin settings.

### Network communication

- **fal.ai** — for AI model generation, schema fetching, and pricing data. All requests authenticated with your own API key.
- **LemonSqueezy** — for license validation at startup. No user data is included — only the license key and a machine identifier.
- **GitHub raw content** — for remote pricing updates, error documentation, and feature flags. Read-only, no user data sent.
- **modelBridge telemetry** — anonymous error type reports when an unexpected error occurs (see below). Enabled by default, can be disabled in Settings > Privacy at any time.

No third-party analytics or tracking pixels.

### License validation

License validation checks a single endpoint (LemonSqueezy License API) at plugin startup. The only data sent is the license key and a device identifier — no usage data, no generation history, no personal information. Offline grace period: the plugin continues to work for up to 7 days since the last successful validation. Your license works on up to 2 devices — release a device in Settings when you need to move to a new machine.

### Anonymous error telemetry

When an unexpected error occurs, modelBridge sends an anonymous report containing only: error type, HTTP status code, model endpoint (a public fal.ai identifier like `fal-ai/kling-video/v3`), plugin version, and platform. This helps the development team identify and fix new errors quickly — often within hours.

- Enabled by default. Disable at any time in **Settings > Privacy**.
- No prompts, file paths, media, API keys, or personal information are ever included.

### What we do NOT collect

- No prompts, inputs, or generated content
- No personal information beyond what LemonSqueezy provides at purchase
- No browsing behavior, no cookies beyond localStorage, no fingerprinting
- No usage statistics — telemetry covers only unexpected error types, not normal usage

### Data deletion

All locally stored data can be cleared from within the plugin (Settings → Reset). Uninstalling removes all extension files. Cost history includes a manual "Reset" function requiring the user to type "DELETE" as confirmation — no accidental data loss.

---

## Legal & Compliance

Comprehensive legal framework published at [docs.modelbridge.app/legal/terms-and-conditions/](https://docs.modelbridge.app/legal/terms-and-conditions/):

- **Terms & Conditions** — covers AI-generated content ownership, liability boundaries, and commercial use rights. EU/GDPR compliant, AI Act positioned.
- **Privacy Policy** — GDPR, CCPA, LGPD, and UK data protection coverage. Documents exactly what minimal data is collected (license validation only) and what isn't (everything else).

Built for professional environments where legal review is a prerequisite for tool adoption.

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

## Who It's For

Freelance editors who want to stop context-switching between browser tabs and their NLE. Agency teams who need cost accountability and per-client reporting. Motion designers who want access to every model without juggling four subscriptions. Anyone editing in Premiere Pro who uses AI generation as part of their workflow.

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
