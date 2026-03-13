# modelBridge.ai

**Every AI model. Inside Premiere Pro. Automatically.**

Other plugins hardcode 5–20 models, break when APIs change, and charge you through proprietary credit systems. modelBridge takes a different approach — a schema-driven engine that reads any model's API specification and generates the interface automatically. When fal.ai releases a new model tomorrow, your plugin supports it today. No update required.

860+ models across 7 categories — text-to-image, image-to-image, text-to-video, image-to-video, video-to-video, text-to-speech, and text-to-audio. One panel. Your own API key. Transparent per-call pricing.

---

## What You Get

**860+ models, one panel.** Browse, search, filter, add. Every model gets a purpose-built interface — sliders, dropdowns, checkboxes, media inputs — all generated from the model's own specification. Not hardcoded. Not simplified. The full model, as its creators intended.

**Smart timeline import.** One button. The plugin knows what to do. Select a clip, generate with an image-to-video model, and the result replaces your source clip in-place — exact same position, exact same scale. Generate a video from a text prompt, and the result inserts at the playhead on the first available track. Generate a voiceover, and it lands on the audio track. Each preview card tells you exactly what will happen before you click: *"Replaces the source image on the timeline with the generated video"* or *"Inserts the audio at the playhead on the first available audio track."* Your original source clip stays in the project bin — nothing is ever destroyed.

**Dual Mode.** Run the same prompt against two models simultaneously. Results appear as selectable cards — click one, import it, then the other auto-selects for your next decision. Both results get full timeline import, even when they share the same source clip. The first result replaces it; the second automatically inserts at the playhead instead. No manual workaround needed.

**Audio preview & TTS.** Generate professional voiceover and sound effects without leaving Premiere Pro. ElevenLabs, Kokoro, Qwen-TTS, and dozens more — all through the same interface as video and image models. Preview audio directly in the plugin with an inline player before importing. Only one player plays at a time, so you can audition results cleanly. Compare two voices on the same script with Dual Mode.

**Real-time cost estimates.** Before you generate, you see what it will cost. Change the duration from 5 to 10 seconds — the estimate updates. Toggle audio on — the estimate updates. Switch resolution — the estimate updates. 11 pricing model types covered. Three clear states: exact price, base rate with disclaimer, or "Pricing unavailable." Never a wrong number.

**Mobile Preview.** Send results to your phone with one tap. Review on the screen your audience actually uses — Instagram, TikTok, YouTube Shorts. Scan a QR code once, then your latest generation is always in the app.

**Source Monitor preview.** Evaluate results at full resolution in Premiere Pro's native Source Monitor before committing. Set In and Out points to use only the best segment — import just the marked subregion to your timeline.

**Built-in mask editor.** Paint inpainting masks directly in the panel — adjustable brush, zoom, pan, eraser, undo. No Photoshop roundtrip.

**Dual-frame interpolation.** Select a start frame and an end frame on your timeline. The AI generates the motion between them. When both clips are adjacent, the result replaces them as a single clip spanning their combined duration.

**Drag-and-drop from Finder.** Drag a file onto the media card — skip the Premiere Pro import step entirely. Mix sources: one slot from your timeline, one from Finder.

**Prompt optimization.** One click rewrites your brief description into a model-optimized prompt. The optimizer understands model-specific conventions and adds the technical detail that improves output quality — without requiring prompt engineering expertise.

---

## For Agencies & Freelancers

**Cost tracking per client and project.** Every generation tracked with exact cost per model per call — in USD, EUR, or SEK. Tag costs to clients and deliverables. Export CSV for invoicing. Generate self-contained HTML reports with KPIs, cost-by-model charts, cost-by-deliverable breakdowns, and commercial compliance badges.

**Four-layer pricing intelligence.** The cost estimate you see before generating comes from a four-layer pipeline: curated per-model pricing that responds to every parameter change (resolution, duration, audio, quality tier), the official platform pricing API for base rates (100% model coverage), family heuristics for related models, and an honest "Pricing unavailable" when no data exists. Verified across 24 models and 7 generation categories with zero incorrect prices.

**No hidden credits.** You use your own fal.ai API key. You see exactly what each generation costs before you commit. No proprietary token systems, no bundled subscriptions, no markup.

**Commercial licensing visibility.** Filter models by commercial license before you generate. License status is tracked per model and per generation — feeds directly into compliance badges in client reports.

**External AI costs.** Import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. Everything shows up in one dashboard alongside your fal.ai generations — total AI spend across all tools.

---

## Reliability

Built for professional use — not a prototype.

**Smart validation across all 7 categories.** Inputs are validated against each model's requirements before you generate — image dimensions, file size, aspect ratio, video duration, required fields. The plugin learns from edge cases over time, caching constraints from API errors to prevent repeat failures. Works identically across text-to-image, image-to-video, video-to-video, text-to-video, TTS, text-to-audio, and image-to-image.

**Plain-language errors.** When something goes wrong, you get a clear explanation and specific recovery steps — what happened, why, and what to do. No HTTP status codes. No raw API text. No technical jargon. 20+ error patterns covered.

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
| **Smart import** | Context-aware replace or insert | Manual positioning | Manual positioning |
| **Audio/TTS** | Built-in preview + audio track import | None or separate tool | Platform-specific |
| **Pre-gen cost estimate** | Exact or base rate for 860+ models | Hidden or none | Hidden behind credits |
| **Mobile preview** | Built-in | No | No |
| **Dual comparison** | Side-by-side with independent import | No | Manual across tabs |
| **Multi-image inputs** | Auto-detected from schema | Hardcoded per model | Platform-specific |
| **Validation** | Self-improving, 3-layer | Basic or none | Server-side only |
| **Error messages** | Plain language + recovery steps | Raw API errors | Varies |
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
