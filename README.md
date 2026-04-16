# modelBridge.app

AI generation for Adobe Premiere Pro — 1,000+ models, one panel, zero browser tabs.

---

Professional video editors juggle 3–5 AI tools in separate browser tabs. Every generation means leaving Premiere Pro — uploading, waiting, downloading, importing, conforming. You're paying four separate subscriptions, dealing with four different credit systems, and none of these tools know anything about your timeline. modelBridge puts every major AI model directly inside your NLE. Results land on your timeline, positioned and ready to cut. When fal.ai adds a new model, modelBridge supports it automatically — no plugin update needed.

## Why editors switch to modelBridge

**Stay in Premiere.** Generate AI video, images, and audio without opening a browser. Results import to the right track, at the right timecode, with the right scale. Your creative flow never breaks.

**1,000+ models, one panel.** Kling, FLUX, Veo, Seedance, ElevenLabs, and hundreds more through a single interface across 11 categories. Stop paying four separate subscriptions for four separate tools.

**See estimated costs before you generate.** Real-time estimates update as you change duration, resolution, and audio — concrete totals for your exact settings, not abstract per-unit rates. Six confidence tiers tell you how reliable each number is, and the plugin learns from your billing history to improve estimates over time. You pay fal.ai directly at their published rates — no credit systems, no surprises.

**Generate in the background. Edit in the foreground.** Long generations move to the background automatically. Stack parallel jobs across different models. A sound and notification tell you when each result is ready. If Premiere restarts, your background jobs resume.

**Track costs per client.** Tag generations to projects. See spending breakdowns, model usage, and commercial compliance status. Export reports with KPIs and licensing badges. Bill AI costs to clients with confidence.

**Self-improving validation.** The same mistake never costs money twice. The plugin learns from errors and catches them before any API call on future attempts.

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

AI generation costs paid directly to fal.ai at their published rates — modelBridge adds no markup. No credit systems, no lock-in, cancel anytime.

**What happens when your subscription expires:** Read-only mode. Your data stays — generation is disabled until you reactivate. No data is ever deleted because of a billing change.

## Links

- [Documentation](https://docs.modelbridge.app/what-is-modelbridge/) — full feature docs, guides, and reference
- [Store](https://modelbridge.app) — download and subscribe
- [Support](mailto:support@modelbridge.app) — reach out anytime

<!-- Screenshots will go here — see bottom of README for capture list -->

---

## Key Features

**Schema-driven adaptive UI.** Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs, nested sections — all generated dynamically from the model's API specification. Not hardcoded. Not simplified. The full model, as its creators intended. 1,000+ models, thousands of unique input fields, no model-specific UI code. When you select a model, the interface adapts instantly — showing exactly the controls that model needs, in the right format, with the right constraints. New models work immediately, no plugin update needed.

**Smart timeline import.** One button. The plugin knows what to do. Select a clip, generate with an image-to-video model, and the result replaces your source clip in-place — exact position, exact duration, exact scale. Generate from a text prompt, and the result inserts at the playhead on the first empty track. Generate audio, and it lands on the right audio track. A live preview bar tells you exactly what will happen before you click — updated as you move the playhead. Your original source clip stays in the project bin — nothing is ever destroyed.

**Dual Mode.** Run the same prompt against two models simultaneously. Results appear as selectable cards — click one, import it, then the other auto-selects for your next decision. Both results get full timeline import, even when sharing the same source clip.

**Real-time cost & time estimates.** Before you generate, you see what it will cost and how long it will take — pre-generation estimates similar to fal.ai's Sandbox, but inside Premiere Pro. Change the duration — the cost updates. Toggle audio — the cost updates. Both estimates learn from your history — time estimates after a few runs, cost estimates from your actual billing. Six confidence tiers. No fabricated numbers.

**Follow Your Generation.** Long-running AI generations automatically move to the background so you never wait. Keep editing, switch models, browse the catalog — your generations run in parallel across any number of models. A persistent panel tracks every active job with real-time progress through five stages: Sent → Queued → Generating → Downloading → Importing. modelBridge keeps you informed every step of the way — a 5-stage communication system delivers contextual guidance, estimated completion time, and clear next steps as each generation progresses. When it's done, a sound notification and visual badge bring you back. If something fails, the error stays visible with a color-coded explanation and fix steps — never silently dismissed. Even restarting the plugin doesn't lose your generation — active jobs are recovered automatically and polling resumes where it left off.

**3-click voice changer & full audio pipeline.** Select a voice clip on the timeline, click Generate. The AI-converted voice imports directly to the first empty audio track. No export. No browser. No re-import. 10+ audio models: ElevenLabs Voice Changer, Dubbing, TTS, multi-voice dialogue, AI music, sound effects, and transcription. Preview audio inline before importing.

**Built-in mask editor.** Paint inpainting masks directly in the panel — adjustable brush, zoom, pan, eraser, undo. No Photoshop roundtrip.

**Dual-frame interpolation.** Select a start frame and end frame on your timeline. The AI generates the motion between them. Adjacent clips get replaced as a single clip spanning their combined duration.

**Source Monitor preview.** Evaluate results at full resolution in Premiere Pro's Source Monitor. Set In/Out points to import just the best segment.

**Mobile Preview.** Send results to your phone with one tap. Review on the screen your audience uses. Scan a QR code once, then your latest generation is always in the app.

**Your models, organized.** Your 3 most recently used models always appear at the top of the dropdown — no scrolling, no searching for what you just used. Pin your favorites for one-click access. Filter by category (Img-to-Vid, Txt-to-Vid, TTS, and more) to find the right tool fast. Every dropdown in the plugin is searchable and scrollable — type to filter, scroll to browse.

**Prompt optimization.** One click rewrites your description into a model-optimized prompt — without requiring prompt engineering expertise.

**Drag-and-drop from Finder.** Drag a file onto the media card — skip the Premiere Pro import step. Mix sources: one slot from your timeline, one from Finder.

**Model Preview System.** Preview expected output for any model directly in the plugin — images, video, and audio. Example media is extracted from fal.ai OpenAPI schemas with 89% coverage across 1,000+ models. Expand any model card to see what it produces before generating.

**AI-Written Key Strengths.** Every model includes 2–3 key strength bullets written specifically for video editors — not generic API descriptions. Generated via an automated Claude API enrichment pipeline and refreshed as new models appear on fal.ai.

**New Model Detection.** Automatic detection of new fal.ai models via scheduled monitoring. Manual refresh with instant notification of newly available models. A "Today's models" filter shows newly detected models with full rich cards. Today's discoveries are always pinned at the top of the Latest filter, marked with a "TODAY" badge — always know what's new.

**modelBridge Academy — Built-in Learning.** Generative AI is powerful but unfamiliar territory for most video editors. modelBridge Academy bridges that gap with contextual "Learn about X" links that appear directly on model cards — only when 100% relevant to the specific model you're looking at. Ten educational articles written specifically for video editors cover key parameters, LoRA, prompting techniques, upscaling, aspect ratios, inpainting, the Flux model family, and cost control. Users who feel confident can turn off all pedagogical UI elements with a single "Show learning tips" toggle — set during onboarding and adjustable anytime in Settings.

---

## 8 Intelligent Systems

Most plugins are frozen in time — the tool you install is the tool you get. modelBridge is a living system that grows with the AI ecosystem and with your usage. At least 15 adaptive behaviors work automatically — learning, preventing mistakes, and staying current without plugin updates or action from you.

**1. Self-expanding library.** 1,000+ AI models today. More tomorrow. No plugin updates needed. The catalog refreshes automatically as fal.ai publishes new models — multiple discovery mechanisms ensure nothing is missed. The toolkit you buy today is more powerful next month without anyone touching it.
[Learn more →](https://docs.modelbridge.app/features/news-feed/)

**2. Adaptive model interface.** Every model gets a custom-built interface — sliders, dropdowns, media inputs, nested sections, validation rules — generated automatically from the model's API specification. No hardcoded models. No simplified wrappers. The full model, as its creators intended. 1,000+ models, thousands of unique input fields, no model-specific UI code.
[Learn more →](https://docs.modelbridge.app/features/schema-driven-ui/)

**3. Self-learning validation.** A constraint error costs money once — never twice. When a model rejects your media — wrong dimensions, file too large, unsupported format — modelBridge remembers. Future attempts on that model are checked automatically before any API call, before any charge. The system gets smarter with every generation.
[Learn more →](https://docs.modelbridge.app/reference/self-learning/)

**4. modelBridge Cost Intelligence.** Six confidence tiers — from confirmed billing amounts to honest "pricing unavailable." The system checks multiple pricing sources in priority order and learns from your actual fal.ai charges over time. Every model can reach the Learned tier after a few generations — estimates improve automatically, personalized to your workflow. Live recalculation as you change parameters, daily exchange rates in 9 currencies, and post-generation actuals from fal.ai billing confirmations. You always know what you're spending.
[Learn more →](https://docs.modelbridge.app/models/costs/)

**5. Generation time learning.** Estimated time on every model card — "~45 sec" or "~2–3 min." Built entirely from your own usage history. After a few generations with any model, the estimate appears. After regular use, it's remarkably accurate. No hardcoded data. The system watches, learns, and improves.
[Learn more →](https://docs.modelbridge.app/features/background-generations/)

**6. Smart timeline import.** One button. The plugin reads your editing context and decides how to import. Source clip selected? Replace in-place. Text prompt? Insert at playhead. Audio? Land on the audio track. Two adjacent clips? Replace both with a single interpolation span. A live preview bar shows exactly what will happen — track, timecode, action — updated as you move the playhead.
[Learn more →](https://docs.modelbridge.app/features/timeline-import/)

**7. AI prompt optimization.** One click to enhance your prompt — tailored to your specific model type. The optimizer adjusts its strategy for video, images, and audio. Better prompts, better results, no prompt engineering expertise required.
[Learn more →](https://docs.modelbridge.app/guides/prompt-tips/)

**8. Self-healing error intelligence.** When something goes wrong, the plugin shows a clear, actionable message — not raw API output. New error types are identified and addressed with targeted fixes delivered remotely, often within hours and without a plugin update. The error handling improves continuously in the field.
[Learn more →](https://docs.modelbridge.app/reference/error-handling/)

These systems compound. A model that didn't exist last week appears automatically. You generate with it a few times and the time estimate dials in. After regular use, the cost badge levels up from "From" (minimum published price) to "Learned" (derived from your actual billing history). The system converges toward accuracy on every axis, for every model, the more you use it.

---

## Intelligent Model Catalog

Every model in the catalog is individually validated before it appears. modelBridge does not simply mirror a provider's model list — it confirms that each model's interface can be built, its inputs can be read, and the full generation pipeline works end-to-end. Models that fail verification are filtered out entirely. The catalog only shows what actually works.

The catalog updates itself continuously as fal.ai adds new models. You see only models that are confirmed to work — no stale entries, no broken models in your panel. When a provider changes or breaks a model's API, the catalog reflects that change automatically. The catalog you see today is accurate today, not a snapshot from last week.

Not every model is ready the moment it appears. When a model exists on fal.ai but isn't fully available yet, modelBridge shows it with a "Coming soon" label and a clear explanation — never as a broken button or a cryptic error. The catalog distinguishes between models that do not exist, models that are not ready yet, and models that are ready to use. Each state has its own visual treatment so the user always knows where they stand. When a model becomes ready, it appears automatically — no manual action needed.

The entire system is autonomous. No one curates the catalog. No one reviews new models. No one pushes an update when a provider launches something new. A model published by fal.ai at 3am on a Sunday is verified and available to users by morning. modelBridge treats catalog quality as infrastructure that runs continuously, not a task that someone remembers to do.

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

**Cost tracking per client and project.** Every generation tracked with estimated cost per model per call — in USD, EUR, GBP, SEK, NOK, DKK, JPY, CAD, or AUD. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.
[Learn more →](https://docs.modelbridge.app/guides/cost-tracking/)

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.
[Learn more →](https://docs.modelbridge.app/models/available-models/)

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. One dashboard for total AI spend across all tools.

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 1,000+ (validated against full catalog) | 5–20 hardcoded | 1 per platform |
| **Categories** | 11 | 1–2 | 1 per platform |
| **New models** | Automatic — detected in the background | Plugin update required | New account required |
| **Search** | Typo-tolerant, synonyms, abbreviations, paste-by-ID | Scroll a fixed list | N/A |
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import |
| **Smart import** | Context-aware replace/insert with live preview | Manual positioning | Manual positioning |
| **Audio/TTS** | Select clip → Generate → on timeline | None or separate tool | Export → upload → download → import |
| **Cost estimate** | 6-tier confidence, learns from your billing | Hidden or none | Hidden behind credits |
| **Learns from your usage** | Estimates get closer to your real bill every time you generate | No | No |
| **Adapts to pricing changes** | Yes — pricing updates automatically | No | No |
| **Personal to your workflow** | Your billing history, your configs, your estimates | No | No |
| **Validation** | Self-improving — learns from errors | Basic or none | Server-side only |
| **Error messages** | Plain language + color-coded by type | Raw API errors | Varies |
| **Vendor lock-in** | Your own API key | Locked to vendor | Locked to platform |

---

## Cost Transparency — modelBridge Cost Intelligence

modelBridge calculates a concrete cost for your exact settings before you generate — live estimates that update as you change duration, resolution, and audio. The system checks multiple pricing sources in priority order, and when data is unavailable, it says so honestly rather than guessing.

Six confidence tiers tell you how reliable each number is:

- **Billed** / **Computed** — confirmed charges from fal.ai after generation
- **Learned** — derived from your actual fal.ai billing, improving with usage
- **Estimated** — calculated from verified pricing data, updates live with parameters
- **From** — minimum starting price; actual cost may be higher
- **No price** — no data available; you can still generate, and the badge levels up to Learned over time

All pre-generation tiers resolve to Billed or Computed once fal.ai confirms the charge. You pay fal.ai directly at their published rates — modelBridge adds no markup.

Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee.

[Learn more →](https://docs.modelbridge.app/models/costs/)

---

## Reliability

**9-gate input validation.** Before you click Generate, the plugin checks your media against every requirement — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong: "This image is 640×480 px. This model requires at least 1024×768 px." No wasted credits. No waiting for a generation to fail.

**Self-improving validation.** When a generation fails due to a media constraint — wrong dimensions, file too large, unsupported format — modelBridge remembers. The same error never costs money twice. Future attempts on that model are checked automatically before any API call.

**Plain-language errors.** Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."* 44 error types from fal.ai mapped to clear messages with recovery steps. Color-coded: red (fix your input), amber (action required), blue (temporary, auto-retrying).

**Platform health monitoring.** Detects fal.ai outages and degraded performance before you generate, so you're not troubleshooting what is actually a platform issue.

**Background generation tracking.** Errors from background generations are caught and waiting for you — color-coded by type so you can prioritize. Failed generations never silently disappear.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that survives panel close/reopen. Redundant persistence ensures settings, saved models, and cost history survive Premiere Pro updates and cache clears.

---

## Always Up to Date

Every error message in modelBridge is written for humans. You'll never see raw API responses, HTTP status codes, or cryptic field names. When something goes wrong, the plugin tells you what happened, why, and exactly what to do — in plain language, color-coded by severity.

Error documentation updates are delivered remotely — no reinstallation, no plugin update. When a new error is identified and documented, the updated copy arrives automatically the next time the plugin starts. "Read more" links in error banners only appear when a verified documentation page exists for that specific error — never broken links.

---

## Live News Feed

modelBridge includes an in-plugin news feed that keeps you current without leaving Premiere Pro. New AI models are detected automatically from fal.ai's catalog and announced in a compact banner below the tab bar. Feature updates, workflow tips, and maintenance notices are delivered the same way.

When a new model appears, clicking "Try it" opens the model search with the endpoint pre-filled — add it to your library in one click. Service notices warn you about scheduled downtime before it affects your work.

The feed checks for updates once per startup, respects your preferences (disable non-critical news in Settings), and sends only your plugin version and platform to our server — no personal data.

---

## Security & Privacy

### Your data stays on your machine

All user data — saved models, settings, generation history, cost logs — is stored locally on your machine. modelBridge does not operate any cloud server, database, or analytics backend. There is no "modelBridge server" that your data is sent to.

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

## Engineering Quality

modelBridge is a solo-developer project: 70 JavaScript modules, 85 runtime script tags, and 1,000+ supported AI models — built without a bundler, transpiler, or module system. Source files are the runtime — what you read is what runs.

**Schema-driven at every level.** No model has a hardcoded interface. Every form, validation rule, and media input is generated at runtime from the model's API specification. Over 700 curated parameter explanations ensure every non-obvious input has a plain-language tooltip. When fal.ai publishes a new model, its complete interface works immediately — no code change, no plugin update.

**277 tests across 6 automated suites.** Automated Chrome DevTools Protocol tests validate error handling, dual mode, cost display, preview actions, timeline replacement, and background generation tracking. Full end-to-end certification across all 11 supported categories — 101 checks covering search → add → render → validate → cost → generate → poll → result → preview → import.

**OTA error intelligence.** Error messages and pricing data update remotely — a new error type can be identified and addressed with targeted copy within hours, without a plugin release. The plugin handles the unexpected gracefully on day one and gets smarter over time.

**Resilient by design.** Redundant persistence ensures all user data survives cache clears, Premiere Pro updates, and plugin reinstalls. Automatic server recovery with crash budgets. Exponential backoff on network requests. Background polling that resumes after restart. Memory-optimized for long editing sessions with LRU caching and lifecycle cleanup.

**Provider-agnostic architecture.** The schema-driven engine works with any machine-readable API specification — designed for multi-provider expansion beyond fal.ai.

---

## Technical Architecture

<table>
<tr>
<td width="33%">

**No manual maintenance**

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

**Schema-driven adaptive UI.** The entire UI — every slider, dropdown, media input, and validation rule — is generated at runtime from the model's API specification. No model-specific code. No special cases. The same engine handles 1,000+ models across 11 categories with no per-model maintenance. When a model's API changes, the UI adapts on the next load.

- **Automatic input classification** — each parameter is analyzed and rendered as the appropriate control type: sliders for ranges, dropdowns for choices, toggles for booleans, media inputs for files, nested sections for complex structures
- **Constraint enforcement** — min/max ranges, allowed values, required fields, and format validation are all derived from the specification and enforced before generation
- **Over 700 curated parameter explanations** — every non-obvious input field has a ⓘ icon with a plain-language explanation and link to documentation
- **Immediate model support** — when fal.ai publishes a new model, modelBridge renders its complete interface immediately — no plugin update required
- **Unified design system** — hundreds of different models feel like one cohesive product through a shared visual language
- **Provider-agnostic architecture** — works with any machine-readable API specification, not just fal.ai — designed for multi-provider expansion

**Intelligent error handling.** Errors are caught before they cost money where possible, learned from when they slip through, and always shown in plain language with a clear next step. No raw API errors reach the editor. 44 error types mapped. Five semantic categories drive consistent color-coded treatment across every surface.

**Adaptive cost resolution.** Multiple pricing sources checked in priority order — the most accurate source available always wins. Six confidence tiers are clearly labeled so users always know the basis for each number. The system learns from your actual billing to fill gaps where providers don't expose detailed rates — estimates improve with usage and stay current over time. No fabricated numbers — ever. Post-generation actuals from fal.ai confirm or correct estimates.

**Resilient data persistence.** Every piece of user data — saved models, learned constraints, cost history, settings — is stored with redundant persistence that survives cache clears, Premiere Pro updates, and plugin reinstalls. Automatic backup before any migration. Recovery from backup if primary storage is empty.

---

## How modelBridge handles new and unknown models

fal.ai adds new models continuously. modelBridge is designed to handle them without requiring a plugin update.

### Automatic interface generation

Every model in modelBridge gets its own interface generated automatically — not from a hardcoded template, but from the model's own specification. When a new model appears in the catalog, modelBridge reads what it needs and builds the correct controls:

- Numeric parameters → sliders with correct ranges
- Multiple-choice options → searchable dropdowns
- Media inputs → drop zones with Premiere timeline integration
- Toggle options → checkboxes
- Complex inputs → structured fields with format guidance

No manual UI work is required per model.

### Contextual help for every field

Every input field always has guidance — even for parameters that were added to fal.ai after modelBridge was installed:

- Common parameters get hand-written explanations with recommended values and editor context
- Less common parameters get descriptions sourced automatically from the model's own documentation
- Any remaining fields get a clear generic explanation and a link to the parameter reference

No field is ever left unexplained.

### Always a path forward

Every field links to further documentation — either a specific Academy article or the parameter reference. There is always somewhere to go when a user wants to understand more.

### Graceful handling of new field types

When modelBridge encounters something it has not seen before, it never crashes, never silently drops the field, and never leaves it unlabeled. The user always sees:

- What the field is
- What format is expected
- Where to learn more

### Fixed values stay fixed

Parameters that a model requires to be a specific value are shown as read-only — clearly labeled, never editable, always sent correctly to the API.

### What this means in practice

- New fal.ai models added next month work without a plugin update
- New parameters get contextual help automatically
- No field is ever unexplained or silently missing
- The plugin stays intelligent as the catalog grows

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
6. Billing tab with generation history rows
7. Audio preview player (inline player visible)
8. Smart timeline import preview bar showing placement message
9. Built-in mask editor
10. Mobile Preview QR code

Current state: No screenshots directory exists in the repo. All screenshots need to be captured fresh.
-->
