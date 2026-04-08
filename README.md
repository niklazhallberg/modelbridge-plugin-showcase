# modelBridge.app

AI generation for Adobe Premiere Pro — 1,200+ models, one panel, zero browser tabs.

---

Professional video editors juggle 3–5 AI tools in separate browser tabs. Every generation means leaving Premiere Pro — uploading, waiting, downloading, importing, conforming. You're paying four separate subscriptions, dealing with four different credit systems, and none of these tools know anything about your timeline. modelBridge puts every major AI model directly inside your NLE. Results land on your timeline, positioned and ready to cut. When fal.ai adds a new model, modelBridge supports it automatically — no plugin update needed.

## Why editors switch to modelBridge

**Stay in Premiere.** Generate AI video, images, and audio without opening a browser. Results import to the right track, at the right timecode, with the right scale. Your creative flow never breaks.

**1,200+ models, one panel.** Kling, FLUX, Veo, Seedance, ElevenLabs, and hundreds more through a single interface across 11 categories. Stop paying four separate subscriptions for four separate tools.

**See estimated costs before you generate.** Real-time estimates update as you change duration, resolution, and audio — concrete totals for your exact settings, not abstract per-unit rates. Six confidence tiers tell you how reliable each number is, and the plugin learns from your billing history to make estimates more accurate over time. You pay fal.ai directly at their published rates — no credit systems, no surprises.

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

**Schema-driven adaptive UI.** Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs, nested sections — all generated dynamically from the model's API specification. Not hardcoded. Not simplified. The full model, as its creators intended. 1,200+ models, thousands of unique input fields, zero model-specific UI code. When you select a model, the interface adapts instantly — showing exactly the controls that model needs, in the right format, with the right constraints. New models work immediately, no plugin update needed.

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

**Model Preview System.** Preview expected output for any model directly in the plugin — images, video, and audio. Example media is extracted from fal.ai OpenAPI schemas with 89% coverage across 1,100+ models. Expand any model card to see what it produces before generating.

**AI-Written Key Strengths.** Every model includes 2–3 key strength bullets written specifically for video editors — not generic API descriptions. Generated via an automated Claude API enrichment pipeline and refreshed as new models appear on fal.ai.

**New Model Detection.** Automatic detection of new fal.ai models via scheduled monitoring. Manual refresh with instant notification of newly available models. A "Today's models" filter shows newly detected models with full rich cards. Today's discoveries are always pinned at the top of the Latest filter, marked with a "TODAY" badge — always know what's new.

**modelBridge Academy — Built-in Learning.** Generative AI is powerful but unfamiliar territory for most video editors. modelBridge Academy bridges that gap with contextual "Learn about X" links that appear directly on model cards — only when 100% relevant to the specific model you're looking at. Ten educational articles written specifically for video editors cover key parameters, LoRA, prompting techniques, upscaling, aspect ratios, inpainting, the Flux model family, and cost control. Users who feel confident can turn off all pedagogical UI elements with a single "Show learning tips" toggle — set during onboarding and adjustable anytime in Settings.

---

## A Living System That Grows With the AI Industry

Most plugins are frozen in time — the tool you install is the tool you get. modelBridge is different. It's a living system that grows with the ecosystem and with your usage. The model catalog expands automatically as providers release new models. Generation time estimates get tighter as you work. And cost estimates become more accurate with every generation you run. The plugin you use next month is smarter than the one you use today — without a single update.

**Self-adapting model ecosystem.** modelBridge connects to 1,200+ AI models — and that number grows weekly without plugin updates. New models are automatically detected, validated for compatibility, and presented to users with AI-written Key Strengths, media previews, educational parameter guides, and category tags. A scrolling news banner announces arrivals in real-time, and a dedicated "Today's models" filter lets users browse new discoveries with the same rich card interface as the full catalog — thumbnails, specs, preview media, and one-click install.

The system validates every model before surfacing it. Models without complete API specifications are held back and automatically retried — users never encounter broken "model not found" errors. Endpoint ID formats are normalized across the entire stack, making the plugin resilient to provider-side naming changes.

Need a specific model right now? Paste its fal.ai endpoint ID and it's ready in seconds. If the local catalog doesn't have what you're looking for, the plugin automatically searches fal.ai's live API as a fallback. The toolkit you buy today is more powerful next month — and the month after that.

**Self-improving validation.** The first time a model rejects your image for being too small, modelBridge extracts the exact requirement from the error — minimum dimensions, maximum file size, duration limits, aspect ratio constraints — and remembers it permanently. Next time, it catches the problem *before* any API call, before any money is spent. The same protection applies across six constraint types: image dimensions, file size, aspect ratio, and video duration (both minimum and maximum). Every failed generation teaches the system something new. After a few weeks of use, the plugin knows more about each model's real-world limits than the models' own documentation. These learned requirements survive restarts, cache clears, and plugin updates — they're saved to disk, not just browser memory.

**Learned cost estimation.** On fal.ai's model pages, pricing is shown as a rate — dollars per second, per megapixel. modelBridge goes further: it calculates a concrete cost for your exact settings before you generate, and when providers don't expose full per-parameter pricing, it learns from your real billing instead. After a few generations with any model and configuration, the cost badge levels up from "From" (minimum published price) to "Learned" (median of your actual fal.ai charges for that exact configuration). Each unique parameter combination — resolution, audio state, dimensions — is tracked separately, so estimates are precise for the configurations you actually use. Learned estimates are personal to your workflow: two editors can see different estimates for the same model because they use it differently. Your data stays local — nothing is sent anywhere. Learned estimates expire after a period of inactivity to stay current with provider pricing changes.

**Learned time estimation.** After a few successful generations with any model, modelBridge starts showing estimated generation time: "~45 sec" or "~2–3 min." The estimates are built entirely from your own usage history — rounded up slightly so the actual time usually comes in under the estimate. During generation, the estimate tracks progress: "Almost done..." when you're close, "Still working..." if it takes longer than usual. No hardcoded data. No guessing. The system simply watches, learns, and gets more accurate over time.

**Always up-to-date error handling.** When something goes wrong, modelBridge shows a clear, helpful message — not raw API errors. If a new type of error appears that the plugin hasn't seen before, it's automatically reported to the development team (anonymously, with no personal data). Specific error messages and fix steps are published remotely and arrive the next time you open the plugin. What was a generic message yesterday becomes a targeted explanation today — without any plugin update. Cost estimates stay accurate the same way: pricing data updates automatically when fal.ai changes rates.

### Three dimensions of learning

These adaptive mechanisms compound. A model that didn't exist last week appears automatically (catalog). You generate with it a few times and the time estimate dials in (time learning). After a few runs, the cost badge levels up from "From" (minimum published price) to "Learned" (derived from your actual billing history). The system converges toward accuracy on every axis, for every model, the more you use it.

| What it learns | How | Result |
|---|---|---|
| Cost per model + config | Median of your actual fal.ai billing | "Learned ≈$0.042" badge after a few generations per configuration |
| Generation time | Rolling median of past durations | Estimated completion time before you click Generate |
| Model catalog | Schema-driven discovery of 1,200+ models | New models appear automatically, no plugin update needed |

The result: a plugin that evolves alongside the AI industry. It absorbs new models, learns from every interaction, improves its error handling in the field, and gets measurably better the more you use it. Install it today and it's more capable next month — not because of an update, but because the system itself grew.

---

## 7 Intelligent Systems

Under the surface, 70 behaviors work automatically — adapting, learning, and preventing mistakes. Here are the seven most significant.

**1. Self-expanding library.** 1,200+ AI models today. More tomorrow. Zero plugin updates needed. The catalog refreshes automatically as fal.ai publishes new models — multiple discovery mechanisms ensure nothing is missed. The toolkit you buy today is more powerful next month without anyone touching it.

**2. Adaptive model interface.** Every model gets a custom-built interface — sliders, dropdowns, media inputs, nested sections, validation rules — generated automatically from the model's API specification. No hardcoded models. No simplified wrappers. The full model, as its creators intended. 1,200+ models, thousands of unique input fields, zero model-specific UI code.

**3. Self-learning validation.** A constraint error costs money once — never twice. When a model rejects your media, the plugin extracts the exact requirement and remembers it permanently. Next time, it catches the problem before any API call. Six constraint types across dimensions, file size, duration, and aspect ratio. The system gets smarter with every generation.

**4. modelBridge Cost Intelligence.** Six confidence tiers — from confirmed billing amounts to honest "pricing unavailable." A multi-layer pricing system checks multiple sources in priority order — from hand-verified rates to learned estimates from your billing — and is honest when data is unavailable. Every model can reach the Learned tier after a few generations — estimates improve automatically, personalized to your exact configurations. Multiple pricing formula types covering per-second, per-megapixel, per-image, and compound models, live recalculation as you change parameters, daily exchange rates in 9 currencies, and post-generation actuals from fal.ai billing confirmations. You always know what you're spending.

**5. Generation time learning.** Estimated time on every model card — "~45 sec" or "~2–3 min." Built entirely from your own usage history. After a few generations with any model, the estimate appears. After regular use, it's remarkably accurate. No hardcoded data. The system watches, learns, and improves.

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

**Cost tracking per client and project.** Every generation tracked with estimated cost per model per call — in USD, EUR, GBP, SEK, NOK, DKK, JPY, CAD, or AUD. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. One dashboard for total AI spend across all tools.

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 1,200+ (validated against full catalog) | 5–20 hardcoded | 1 per platform |
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

### Pre-generation estimates — inside Premiere

On fal.ai's model pages, pricing is presented as a rate — dollars per second, per megapixel, or per token. That's technically precise, but it leaves you to do the math yourself. modelBridge does the calculation for you, in real time — similar to the cost preview in fal.ai's Sandbox, but applied to your actual settings across 1,200+ models. Change resolution, duration, or toggle audio, and the estimate updates instantly. More transparent than generic per-unit prices on model pages, because modelBridge calculates a concrete cost for your exact settings.

### Multi-layer pricing cascade

fal.ai's pricing data varies in granularity between models. Some expose detailed per-parameter rates; others provide only a flat base price; some publish nothing at all. modelBridge checks multiple sources in priority order — from hand-verified rates to your own billing history to fal.ai's official API — and the first source with data wins.

When all sources fail, modelBridge shows "No price" and links to the model's fal.ai page. It never invents a number. After a few generations, the badge levels up to "Learned" automatically.

### Six confidence tiers

Every cost badge tells you how reliable the number is. The first two are post-generation (confirmed); the rest are pre-generation (estimates).

**Post-generation (confirmed data):**
- **Actual $X.XX** (green) — the confirmed charge from fal.ai, based on the billing data returned with each completed generation. The most reliable cost data available.
- **$X.XX · Computed** (blue) — calculated by applying a curated pricing formula to the actual billing units fal.ai reported. Very accurate.

**Pre-generation (estimates):**
- **Learned ≈$X.XX** (teal) — median of your actual fal.ai charges for this model and configuration. Improves with usage. Personal to your workflow.
- **$X.XX · Estimated** (blue) — calculated from hand-verified pricing data. Updates live as you change parameters (duration, resolution, audio, quality tier). Typically very close to the final charge.
- **From $X.XX** (orange) — minimum starting price from fal.ai's API or a similar model's rates. Audio, resolution, or quality may increase the actual cost.
- **No price** (grey) — no pricing data available. You can still generate — after a few runs, the badge levels up to Learned.

All pre-generation tiers resolve to Actual or Computed once fal.ai confirms the billing amount.

### How the system learns your costs

On fal.ai's website, finding out what a generation cost means navigating to Settings → Billing after the fact — and remembering that number for next time. modelBridge removes both steps. It records each actual charge alongside your exact configuration, and the next time you use the same model with similar settings, a personalized estimate is already there — before you click Generate.

After a few runs, the cost badge levels up from "From" (minimum published price) to "Learned" (based on the median of what you've actually been charged for that exact configuration). The more you generate, the more precise the estimates become — personalized to your workflow, not a one-size-fits-all rate card.

- Exact configuration match only — switch to an untested resolution and modelBridge falls back honestly instead of interpolating.
- Learned estimates expire after a period of inactivity to stay current with provider pricing changes.
- All data stays local on your machine — nothing is sent to modelBridge servers or any third party.

### Why estimates aren't always exact

fal.ai's billing is always the source of truth for the actual charge. Estimates may differ due to provider-side pricing logic (internal surcharges, volume tiers), pricing changes between cache refreshes, or currency conversion timing. modelBridge's role is to make cost information more accessible and actionable — not to replace fal.ai's billing.

Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee.

---

## Reliability

**9-gate input validation.** Before you click Generate, the plugin checks your media against every requirement — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong: "This image is 640×480 px. This model requires at least 1024×768 px." No wasted credits. No waiting for a generation to fail.

**Self-improving constraint cache.** The first time a model rejects your media, the plugin remembers that limit permanently. Next time, it's caught before any API call. The system gets smarter with every generation.

**Plain-language errors.** Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."* 44 error types from fal.ai mapped to clear messages with recovery steps. Color-coded: red (fix your input), amber (action required), blue (temporary, auto-retrying).

**Background generation tracking.** Errors from background generations are caught and waiting for you — color-coded by type so you can prioritize. Failed generations never silently disappear.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that survives panel close/reopen. Redundant persistence ensures settings, saved models, and cost history survive Premiere Pro updates and cache clears.

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

**Memory-optimized for long editing sessions.** LRU caching, lifecycle cleanup, and leak prevention ensure stable performance across hours of continuous use — no gradual slowdowns, no restarts needed.

**Parallel schema fetching.** Model schemas load concurrently, keeping the catalog fast and responsive even with 1,100+ models.

**AI-enriched model catalog.** Every model includes editor-focused descriptions and key strengths generated via an automated Claude API pipeline — not generic API documentation copy.

**Zero hardcoded model definitions.** 1,100+ models with schema-driven dynamic UI. Every interface is generated at runtime from the model's OpenAPI specification. No per-model maintenance, no manual updates.

**Automatically improving error handling.** Error messages and pricing data update remotely — no plugin reinstall needed. New error types are identified and addressed with targeted fixes, often within hours.

**Comprehensive cost tracking.** Generation costs tracked across multiple pricing formula types, 9-currency support (USD, EUR, GBP, SEK, NOK, DKK, JPY, CAD, AUD), and exportable client reports.

**Contextual in-app education.** Precision-matched Academy links surface relevant learning material directly on model cards. A user-controlled "Show learning tips" toggle lets experienced users turn off pedagogical UI without losing access to the documentation.

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

**Schema-driven adaptive UI.** The entire UI — every slider, dropdown, media input, and validation rule — is generated at runtime from the model's API specification. No model-specific code. No special cases. The same engine handles 1,200+ models across 11 categories with zero per-model maintenance. When a model's API changes, the UI adapts on the next load.

- **Automatic input classification** — each parameter is analyzed and rendered as the appropriate control type: sliders for ranges, dropdowns for choices, toggles for booleans, media inputs for files, nested sections for complex structures
- **Constraint enforcement** — min/max ranges, allowed values, required fields, and format validation are all derived from the specification and enforced before generation
- **718 curated parameter explanations** — every non-obvious input field has a ⓘ icon with a plain-language explanation and link to documentation
- **Zero-configuration model support** — when fal.ai publishes a new model, modelBridge renders its complete interface immediately — no plugin update required
- **Unified design system** — hundreds of different models feel like one cohesive product through a shared visual language
- **Provider-agnostic architecture** — works with any machine-readable API specification, not just fal.ai — designed for multi-provider expansion

**Three-layer error architecture.** Layer 1 prevents errors before they happen (schema-driven preflight). Layer 2 learns from errors that get through (constraint extraction and permanent caching). Layer 3 translates every remaining error into plain language with a clear next step. 44 error types mapped. Five semantic categories drive consistent color-coded treatment across every surface.

**Multi-layer cost resolution.** Multiple pricing sources checked in priority order — from hand-verified rates to learned estimates from your billing to fal.ai's official API. The first source with data wins. Six confidence tiers are clearly labeled so users always know the basis for each number. Learned pricing fills the gap where providers don't expose per-configuration rates — the system gets more accurate the more you use it. No fabricated numbers — ever. Post-generation actuals from fal.ai confirm or correct estimates.

**Resilient data persistence.** Every piece of user data — saved models, learned constraints, cost history, settings — is stored with redundant persistence that survives cache clears, Premiere Pro updates, and plugin reinstalls. Automatic backup before any migration. Recovery from backup if primary storage is empty.

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
