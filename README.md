# modelBridge.ai

**Every AI model. Inside Premiere Pro. Automatically.**

Other plugins hardcode 5–20 models, break when APIs change, and charge you through proprietary credit systems. modelBridge takes a different approach — a schema-driven engine that reads any model's API specification and generates the interface automatically. When fal.ai releases a new model tomorrow, your plugin supports it today. No update required.

860+ models across 7 categories — text-to-image, image-to-image, text-to-video, image-to-video, video-to-video, text-to-speech, and text-to-audio. One panel. Your own API key. Transparent per-call pricing.

---

## What You Get

**860+ models, one panel.** Browse, search, filter, add. Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs — all generated from the model's own specification. Not hardcoded. Not simplified. The full model, as its creators intended.

**Smart timeline import — you always know what will happen.** One button. The plugin knows what to do. Select a clip, generate with an image-to-video model, and the result replaces your source clip in-place — exact same position, exact same duration, exact same scale. Generate a video from a text prompt, and the result inserts at the playhead on the first empty track — or creates a new one if all are occupied. Generate audio, and it lands on the right audio track without touching your existing audio. The preview bar tells you exactly what will happen before you click, updated live as you move the playhead: *"Replaces the source image on V1 with the generated video. Same position and duration. Other tracks stay untouched. Undo with Cmd+Z."* or *"Adds the audio on A3 at 00:01:24. Existing audio stays untouched. Undo with Cmd+Z."* Every message answers three questions: where does it go, what happens to my existing content, and how do I undo. Your original source clip stays in the project bin — nothing is ever destroyed.

**Dual Mode.** Run the same prompt against two models simultaneously. Results appear as selectable cards — click one, import it, then the other auto-selects for your next decision. Both results get full timeline import, even when they share the same source clip. The first result replaces it; the second automatically inserts at the playhead instead. No manual workaround needed.

**3-click voice changer & full audio pipeline.** Record a voiceover in Premiere, select the clip on the timeline, click Generate. The AI-converted voice imports directly to the first empty audio track at your playhead — existing audio stays untouched. No export. No browser. No re-import. No other tool offers "select clip on timeline → AI voice conversion → back on timeline" in one step. The plugin detects audio clips on audio-only tracks (A1, A2, A3) automatically, including Premiere's Voice-Over recordings. 10+ audio models supported: ElevenLabs Voice Changer (voice swap preserving timing and emotion), ElevenLabs Dubbing (multi-language with sync), Eleven v3/Turbo/Multilingual TTS, text-to-dialogue (multi-voice scenes), AI music generation, sound effects from text, and speech-to-text transcription. Preview audio with an inline player before importing. Compare two voices on the same script with Dual Mode.

**Real-time cost estimates.** Before you generate, you see what it will cost. Change the duration from 5 to 10 seconds — the estimate updates. Toggle audio on — the estimate updates. Switch resolution — the estimate updates. 11 pricing formula types covered. Four confidence tiers: accurate estimate, base rate with disclaimer, post-generation actual cost, or honest "Pricing unavailable." Never a fabricated number.

**Mobile Preview.** Send results to your phone with one tap. Review on the screen your audience actually uses — Instagram, TikTok, YouTube Shorts. Scan a QR code once, then your latest generation is always in the app.

**Source Monitor preview.** Evaluate results at full resolution in Premiere Pro's native Source Monitor before committing. Set In and Out points to use only the best segment — import just the marked subregion to your timeline.

**Built-in mask editor.** Paint inpainting masks directly in the panel — adjustable brush, zoom, pan, eraser, undo. No Photoshop roundtrip.

**Dual-frame interpolation.** Select a start frame and an end frame on your timeline. The AI generates the motion between them. When both clips are adjacent, the result replaces them as a single clip spanning their combined duration.

**Drag-and-drop from Finder.** Drag a file onto the media card — skip the Premiere Pro import step entirely. Mix sources: one slot from your timeline, one from Finder.

**Prompt optimization.** One click rewrites your brief description into a model-optimized prompt. The optimizer understands model-specific conventions and adds the technical detail that improves output quality — without requiring prompt engineering expertise.

---

## For Agencies & Freelancers

**Cost tracking per client and project.** Every generation tracked with exact cost per model per call — in USD, EUR, or SEK. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.

**Four-layer pricing intelligence.** The cost estimate you see before generating comes from a four-layer pipeline: curated per-model pricing that responds to every parameter change (resolution, duration, audio, quality tier), the official platform pricing API for base rates (100% model coverage), family heuristics for related models, and an honest "Pricing unavailable" when no data exists. After generation, actual costs from fal.ai's billing confirmation replace estimates when available. Verified across 24 models and 7 generation categories with zero incorrect prices.

**No hidden credits.** You use your own fal.ai API key. You see exactly what each generation costs before you commit. No proprietary token systems, no bundled subscriptions, no markup.

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. Everything shows up in one dashboard alongside your fal.ai generations — total AI spend across all tools.

---

## Cost Transparency

### What you see before generating

modelBridge shows a cost estimate for every generation, based on fal.ai's official published rates. The estimate is labeled clearly so you always know how confident we are:

- **Est. $X.XX** — from our curated rate database, verified against fal.ai's official documentation. Updates live as you change parameters (duration, resolution, audio toggle, quality tier).
- **~$X.XX (base rate)** — from fal.ai's live pricing API. May not reflect all parameter surcharges (audio, resolution tier).
- **Cost unavailable** — fal.ai doesn't publish pricing for this model. Click the link to check their site directly.

### What you see after generating

When fal.ai confirms the billing units for your generation, modelBridge updates the cost entry to show **Actual $X.XX** — the most accurate cost signal available from the provider. This appears as a green badge in your Costs tab alongside the original estimate, so you can see exactly what you were charged.

### Why we can't always show exact costs

fal.ai publishes pricing as unit rates (per second, per megapixel, per image). These are the same rates any tool uses to estimate costs — no tool receives the actual invoiced amount from fal.ai before generation completes. We calculate estimates from official rates and are transparent about the confidence level of each estimate. When a model's pricing structure is too complex or undocumented for accurate estimation, we say "Cost unavailable" rather than show a wrong number.

### No markups

modelBridge does not add any markup to fal.ai's rates. You use your own API key. You pay fal.ai directly at their published prices. No proprietary token systems, no bundled subscriptions.

Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee.

---

## Reliability

Built for professional use — not a prototype.

**Generate with confidence.** Before you click Generate, the plugin checks your media against every requirement the model has — image dimensions, file size, aspect ratio, video duration, required fields. If something doesn't fit, you see exactly what's wrong before any API call is made: "This image is 640x480 px. This model requires at least 1024x768 px." The Generate button stays disabled until everything passes. No wasted credits. No waiting 30 seconds for a generation to fail.

**It learns what each model needs.** The first time a model rejects your media — say, a 12 MB video on a model that allows 10 MB max — the plugin remembers that limit permanently. Next time you select a file that's too large for the same model, it's caught instantly. The system gets smarter with every generation, building a knowledge base of real-world requirements that go beyond what's published in the model's documentation.

**Every error is a clear sentence, not a wall of code.** When something goes wrong, modelBridge tells you exactly what happened, why, and what to do next:

- Not "error occurred" — *"Your image needs to be at least 512x512 px."*
- Not "request failed" — *"Your fal.ai balance is empty — top up at fal.ai/dashboard."*
- Not "422 Unprocessable Entity" — *"Maximum duration is 10 seconds. Trim your video and try again."*

No HTTP status codes. No raw API text. No technical jargon. 44 error types from fal.ai mapped to plain language with specific recovery steps.

**Different problems look different.** Error messages are color-coded by what you need to do:

- **Red** — something about your input needs fixing (wrong size, wrong format)
- **Amber** — action required on your end (billing, content adjustment)
- **Blue** — temporary issue, automatic retry in progress (network, server load)

This applies everywhere — in the main panel, in the media preview card, and in the background generation tracker. You always know at a glance what kind of issue you're looking at.

**Background generations are fully tracked.** Even when you're working on something else, errors from background generations are caught and waiting for you. When you return, you see exactly what failed, why, and what to do — color-coded by error type so you can prioritize. Failed generations never silently disappear.

**Follow Your Generation.** AI video generation can take 30 seconds to 5 minutes. Blocking the UI during that time is unusable in a professional editing workflow. modelBridge runs every generation in the background — switch models, browse, keep editing. A persistent panel at the bottom of the plugin tracks all active generations regardless of which model card is open. Each row shows a status dot (orange = running, gray = queued, green = done, red = failed), model name, elapsed timer, and current step. Expand a row to see a 5-step progress tracker — Sent → Queued → Generating → Downloading → Importing — each step turning green with a checkmark as it completes, the active step pulsing orange. Step labels update in real time: "Queued #2" with fal.ai queue position, "Generating", "Downloading", "Importing", "Imported." The expanded view also shows input details — prompt, duration, resolution, aspect ratio, endpoint — so you always know which generation is which. When you navigate to a model whose generation just completed, the row auto-removes and the generation log on that model card shows the completed state. No manual cleanup. Failed rows stay visible with a red indicator and "See error" link — never auto-dismissed, always manually dismissable.

**Resilient infrastructure.** Automatic server recovery, network retry with exponential backoff, and background polling that ensures long-running generations are never lost — even if you close and reopen the panel.

**Durable settings.** Your configuration, saved models, and cost history survive Premiere Pro updates, cache clears, and reinstalls. Dual persistence ensures nothing is lost.

**Pricing accuracy.** 24-model audit across 7 generation categories. Zero incorrect prices. Every cost estimate is either exact (from curated data), an honest base rate (from the official API), or clearly marked as unavailable. No fabricated numbers.

---

## Verified at Scale

modelBridge has undergone the most comprehensive testing of any AI plugin for Premiere Pro.

**155 models audited** across 5 rounds of systematic UI input verification — every field checked for correct type, placement, constraints, and user accessibility. 14 root cause fixes implemented. Zero critical issues remaining.

**Full system audit** by a 4-role review team covering schema rendering, cost estimation, generation reliability, and data integrity. 27 checks across the entire pipeline — from API schema parsing to timeline import.

**94 automated tests** via Chrome DevTools Protocol against a live Premiere Pro 2025 environment — covering error handling, crash recovery, preview flows, pricing formulas, dual mode rendering, cost display, and input overrides. Plus 52 manual stress tests covering edge cases and failure recovery.

**Pricing accuracy audit** — 24 models across 7 categories, zero incorrect prices. Preview/import audit — 8 routing paths verified correct, 0 bugs.

**Follow Your Generation audit** — 30 checks across visual QA, behavioral QA (step progression, auto-dismiss, failure state, inputParams plumbing), and edge cases. 29 PASS / 1 FAIL (P3 cosmetic — fixed). Tools: static code analysis, CSS token verification, JS logic review.

| | |
|---|---|
| Models verified | 155+ |
| Audit rounds completed | 5 |
| System audit checks | 27 |
| Automated tests passed | 94 of 94 |
| Manual stress tests | 52 |
| Pricing accuracy | 0 incorrect across 24 models and 7 categories |
| Root cause fixes | 14+ |
| Critical issues remaining | 0 |

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 860+ (auto-discovered) | 5–20 hardcoded | 1 per platform |
| **Categories** | 7 (image, video, audio, TTS) | 1–2 | 1 per platform |
| **New models** | Automatic | Plugin update required | New account required |
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import |
| **Smart import** | Context-aware replace or insert with live track + timecode preview | Manual positioning | Manual positioning |
| **Audio/TTS** | Select clip → Generate → on timeline (3 clicks) | None or separate tool | Export → upload → download → import |
| **Pre-gen cost estimate** | 4-tier confidence for 860+ models | Hidden or none | Hidden behind credits |
| **Mobile preview** | Built-in | No | No |
| **Dual comparison** | Side-by-side with independent import | No | Manual across tabs |
| **Multi-image inputs** | Auto-detected from schema | Hardcoded per model | Platform-specific |
| **Validation** | Self-improving — learns from errors, blocks before API call | Basic or none | Server-side only |
| **Error messages** | Plain language + exact values + color-coded by type | Raw API errors | Varies |
| **Vendor lock-in** | Your own API key | Locked to vendor | Locked to platform |
| **Pre-launch testing** | 155 models audited + 94 automated tests | Unknown | Unknown |

---

## System Architecture

*Built around one principle: the system manages itself so the editor never has to.*

### Three pillars

| Zero manual maintenance | Non-blocking workflow | Native Premiere integration |
|---|---|---|
| Models, pricing, and constraints update automatically — no plugin release needed | All AI jobs run in background — the editor is always responsive | Results land on the timeline automatically — right track, right timecode |

---

### What the editor sees and touches

<table>
<tr>
<td width="25%">

**Discover & configure**

`Model search & browser` · `Auto-generated UI` · `Preflight validation` · `Prompt optimizer`

</td>
<td width="25%">

**Review & deliver**

`Preview & approve` · `Mask editor` · `Dual Mode` · `Mobile preview`

</td>
<td width="25%">

**Cost & reporting**

`Live cost per generation` · `Costs dashboard` · `Client report export` · `Generation audit log`

</td>
<td width="25%">

**Self-managing systems** 🟢

🔄 `Auto-updating model list` · 🔄 `Self-healing server` · 🔄 `Constraint cache` · 🔄 `Onboarding wizard`

</td>
</tr>
</table>

> 860+ models — filter by category. Controls built from model schema, not hardcoded. Errors caught before any cost.

&nbsp;&nbsp;&nbsp;&nbsp;⬇ **Background server** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⬇ **Premiere scripting API**

---

### What runs invisibly

<table>
<tr>
<td width="50%">

**Local server**

`Media extraction` · `File transfer` · `Credential vault` · 🔄 `361 pricing entries — auto-loaded` · 🔄 `Async job queue`

</td>
<td width="50%">

**AI providers**

`Image generation` · `Video generation` · `Voice & audio` · `Multi-provider ready`

> Flux, Kling, Wan, Luma, Stable Diffusion, ElevenLabs, and hundreds more

</td>
</tr>
</table>

*The plugin coordinates both directions — the server and the timeline never communicate directly.*

---

### What lands on the timeline — zero manual steps

`Auto timeline placement` · `Project bin import` · `Fit-to-frame scaling` · `Format detection` · `Audio track placement` · `Source Monitor & AME`

> Right track. Right timecode. Matches existing clip exactly. Reads sequence FPS and resolution.

---

### Key numbers

| 860+ | 0 | 3 | 1 |
|:---:|:---:|:---:|:---:|
| AI models available at launch — schema-discovered, not hardcoded | Manual steps to get a result onto the timeline | Self-managing layers — models, pricing, and error handling update without releases | Interface for image, video, voice, and audio generation — inside Premiere |

---

Beta release expected April 2026.

Interested in early access? [Reach out on LinkedIn →](https://www.linkedin.com/in/niklazhallberg/)

---

Built by [Niklaz Hallberg](https://niklaz.works) — digital designer and creative technologist at the intersection of design, code, and generative AI.

2025–2026.
