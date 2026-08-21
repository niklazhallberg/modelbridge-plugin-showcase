# modelBridge.app

**Every fal.ai model. Generated and imported inside Adobe Premiere Pro.**

**An automated, intelligent plugin that grows on its own — like nothing else on the market.** Over 1,200 models today, more by the end of the week. modelBridge watches fal.ai for you and every new model appears in your panel with its interface already built — ready to try in your Premiere project the moment it lands. You don't update. You don't hunt.

No browser tabs. No downloads. No manual imports. See the result in Premiere's Source Monitor, hit Import, and it lands on your timeline in the right place — automatically.

- **Image-to-video** replaces the source clip at the same track and timecode
- **Text-to-video** inserts at the playhead on the first available track
- **First-frame + end-frame** replaces both source clips as a single clip spanning their combined duration

Non-destructive. The original clip stays in your Project Bin. Fit-to-frame scaling is applied automatically. Nothing to conform, nothing to re-import.

**Safe on confidential work** — cleanup, timeline analysis, and QC scans run locally on your machine, never in the cloud. [More →](#security-and-privacy)

[Learn more about timeline import →](https://docs.modelbridge.app/features/timeline-import/)

---

## 1. A plugin that grows on its own

**Two automatic systems compound.** New models arrive on their own — modelBridge watches fal.ai several times a day and notifies you the moment a new model goes live. And every one of those new models arrives with its input fields already built, generated from its schema at runtime, so it's ready to try inside your Premiere project the second you see it in the panel. You don't update, you don't configure, you don't wait.

That's how one plugin keeps up with 1,200 models and counting.

- **Automatic growth.** A cloud service syncs the fal.ai catalog several times a day. New models are detected, verified, and published to your panel with no plugin release, no action from you
- **Automatic input rendering.** Every model's parameters — sliders, dropdowns, media pickers, toggles — are built from the model's own spec at runtime. No per-model UI code. New models render correctly on first open
- **Live in-panel notification.** New models appear in an in-panel news banner with a one-click Add. From "just went live on fal.ai" to "running in your project" in a couple of clicks
- **Adaptive fallbacks.** When a model is live but its spec isn't published yet, modelBridge builds a streamlined interface immediately and upgrades it the moment the full spec appears

> "When the next breakthrough model launches on fal.ai, you won't be waiting for a plugin update. You'll be generating with it."

[Schema-driven UI →](https://docs.modelbridge.app/features/schema-driven-ui/) · [News feed →](https://docs.modelbridge.app/features/news-feed/)

---

## 2. Agent Mode — with the Adept intelligence layer

Ask in plain language. The agent reads your timeline, executes edits, verifies its own work, and reports back.

- *"Scan my timeline"* — a prioritized QC scan: offline media, flash frames, sync drift, fps and sample-rate mismatches, orphaned audio, LUT consistency and more — ranked Critical / Warning / Info
- *"Prep today's footage"* — identifies cameras, groups clips, sets color labels
- *"Close all the gaps on V1"* — every gap detected and rippled closed
- *"Reframe for Reels"* — new vertical sequence via Adobe's Auto Reframe (Sensei)
- *"Explain this model"* — honest walkthrough of a fal.ai model with one-click install
- *"Build me a reverse shot from this frame"* — coverage prompt handed straight to the Generate tab

The **Adept** layer tailors Claude specifically for Premiere Pro — wired into 100+ tools, it checks its work against the real timeline and says so when a change can't be confirmed, honest by design about what it can't do. The result: it solves problems a raw model would hand back to you.

Bring your own Anthropic API key. Two Claude models — Haiku 4.5 by default, one click to switch to Sonnet 4.6 for deeper reasoning. No markup. Session cost tracked in real time.

### Prompt authoring for editors

The agent is trained specifically for editorial work — not generic "AI cinematic" output. Attach a frame from your timeline and ask for coverage: reverse shots, over-the-shoulder, wides, inserts, B-roll. The prompt it writes locks face, wardrobe, set, and lighting to your reference so the new shot cuts directly into the scene. Scene matching across multiple generations reuses the same visual lock across every prompt in a chat. Motion-ready first frames are shaped so the identity survives the image-to-video pass. When the prompt is ready, one click sends it to the Generate tab with your reference frame pre-attached.

[Agent Mode →](https://docs.modelbridge.app/features/agent-mode/) · [Agent Export →](https://docs.modelbridge.app/features/agent-export/)

---

## 3. Mobile Preview

Your timeline plays on a 27-inch monitor. Your audience watches on a phone. Mobile Preview lets you review every generation on your actual delivery screen without leaving Premiere.

- Scan the QR once — every future generation appears on your phone in seconds while the app is open
- Installs as a PWA — fullscreen, no browser chrome, autoplays muted, loops
- Dual Mode results appear as labeled slides — swipe to compare on the screen your client will actually use

Requires an active license. Runs on the fal.ai CDN, so it works over cellular. Latest generation only (each new one replaces the previous).

[Mobile Preview →](https://docs.modelbridge.app/features/mobile-preview/)

---

## 4. Dual Mode

Run the same prompt against two models in one click. Compare results side by side with an honest input overview showing which settings were adjusted for the secondary model and why. Play either result, import either — or both.

[Dual Mode →](https://docs.modelbridge.app/features/dual-mode/)

---

## 5. ElevenLabs and Midjourney workflows

**ElevenLabs on the timeline.** Select a voice clip, pick a TTS or voice-changer model, click Generate — the result lands on the correct audio track at the playhead. Voice-over, dubbing, sound effects, voice conversion — 9 ElevenLabs models, and 100+ audio models overall, work the same way as video.

**Midjourney → fal.ai in three keystrokes.** Copy a Midjourney URL, Cmd/Ctrl+V it into any media card's URL field, generate on it. Or scrub any frame of any timeline video and click **Extract frame** — the button shows your live playhead timecode so you pick the frame you want, not "roughly." Every frame you extract feeds any fal.ai model instantly.

[Voice-over with ElevenLabs →](https://docs.modelbridge.app/academy/voice-over-elevenlabs/) · [Midjourney → Premiere →](https://docs.modelbridge.app/academy/midjourney-to-premiere/)

---

## Costs you can hand to your client

Every generation is tagged, priced, and logged. When the delivery goes out, so does the receipt.

- **Per-project attribution.** Tag each generation to a client or deliverable at the point of creation. Export HTML reports or CSV for external audit
- **Commercial-license documentation.** modelBridge tracks fal.ai's `license_type` metadata per generation. Reports carry compliance badges showing the percentage of generations using commercially licensed models — so you can *document and demonstrate* your due diligence to clients. This is a convenience feature, not a legal guarantee — the source of truth remains each model's own license
- **External AI costs.** Import costs from Midjourney, KREA, Weavy — or any vendor — via a simple CSV template. One dashboard for total AI spend across every tool
- **No markup, ever.** You pay fal.ai directly at their published rates using your own API key. modelBridge adds no per-generation fees

[Commercial use →](https://docs.modelbridge.app/legal/commercial-use/) · [Cost tracking →](https://docs.modelbridge.app/guides/cost-tracking/)

### Errors that don't cost you money

When fal.ai returns an error, you don't see raw JSON or HTTP status codes. Every error type is translated into what happened, why, and what to do — with a link to the specific fal.ai docs page when one exists. The exact constraint from fal.ai's structured response drives live copy: *"Image too small (128×128, minimum 300×300)"* rather than *"422 Unprocessable Entity."*

Every learned constraint gets cached per model and enforced before the next attempt — the same rejection is caught before it can cost you again.

[Error handling →](https://docs.modelbridge.app/troubleshooting/how-errors-work/)

---

## Blog — fal.ai news, right next to your timeline

fal.ai's official blog inside the panel. Model launches, deep-dives, platform updates — read them where you work.

- **Read → Install → Generate.** modelBridge scans each article for model references and surfaces them as one-click **Install** buttons. Article to timeline in three clicks
- **NEW badges** on posts since your last visit
- Cached articles stay readable when your connection drops

[Blog →](https://docs.modelbridge.app/features/blog/)

---

## Also included

| Feature | What it does |
|---|---|
| **Discovery & filters** | Paste-tolerant search (smart quotes, dashes and separator variants all match), paste-by-endpoint-ID, category filters, LM Arena leaderboard rankings refreshed several times a day, "Today" filter for new models. [Docs →](https://docs.modelbridge.app/features/trending/) |
| **Source Monitor preview** | Evaluate results at full res in Premiere's own Source Monitor. Set In/Out to import a subclip. [Docs →](https://docs.modelbridge.app/features/preview-before-import/) |
| **Mask editor** | Paint inpainting masks in-panel — brush, zoom, eraser, undo. No Photoshop roundtrip. [Docs →](https://docs.modelbridge.app/guides/inpainting/) |
| **Trial + license lifecycle** | 14-day trial with full access. Keeps working for 7 days between license checks, online or off. Register your license on two machines and move it between them from Settings. [Docs →](https://docs.modelbridge.app/billing/subscription/) |
| **Self-learning validation** | When a model rejects your media, modelBridge remembers the constraint and catches it automatically next time. [Docs →](https://docs.modelbridge.app/reference/self-learning/) |
| **Over-the-air updates** | New error messages, endpoint changes, feature flags — delivered within an hour, no reinstall. Curated pricing corrections ship bundled, in a plugin release. [Docs →](https://docs.modelbridge.app/features/ota-updates/) |
| **Background generations** | Generations don't hold you hostage — switch models and the run keeps going in the background; restart Premiere and a recovery bar picks it up. Sound notification when ready. [Docs →](https://docs.modelbridge.app/features/background-generations/) |
| **700+ parameter explanations** | Every non-obvious input has a plain-language tooltip and an Academy link when the topic deserves one. [Docs →](https://docs.modelbridge.app/features/parameter-help/) |

---

## Cost transparency

modelBridge shows a concrete cost before you generate — updating live as you change duration, resolution, and audio settings. Every number carries a confidence tier, so you always know how sure it is: a forecast before you run, a measured figure after.

| Tier | What it means | When you see it |
|---|---|---|
| **Estimated** | A forecast from curated pricing data for your exact settings | Before you run — updates live as you tweak parameters |
| **From** | A starting price — a floor when it comes from fal.ai's published minimum; for not-yet-verified estimates the final cost can be higher or lower | Before you run, for newer models where surcharges aren't mapped yet |
| **No price** | No pricing source has a rate — modelBridge never invents a number | Before you run, when pricing isn't published |
| **Metered** | Priced from the usage fal.ai reported for the run — modelBridge's own calculation, not a copy of your fal.ai invoice | After the run |
| **Calculated** | The run finished but fal.ai reported no usage, so this is modelBridge's formula for your settings | After the run |
| **Learned** | Sharpened from the median of your last few metered runs for this model and settings | After a few runs with the same config |

Runs that fail after usage was already metered still show in your history, marked as failed — the receipt matches what actually ran.

You pay fal.ai directly at their published rates. modelBridge takes no markup, no revenue share, no per-generation fee. Your fal.ai dashboard is always the final word on exact charges.

[Cost system →](https://docs.modelbridge.app/models/costs/)

---

## Getting started

1. **Subscribe** via the [subscription page](https://docs.modelbridge.app/billing/subscription/) — 14-day free trial
2. **Install** the ZXP and paste your license key from the receipt email
3. **Paste your fal.ai key** from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys), open modelBridge in Premiere Pro, and generate

[Installation guide →](https://docs.modelbridge.app/getting-started/installation/)

---

## Pricing

**$19/month** or **$190/year** — save vs monthly. 14-day free trial with full access, no restrictions. A payment method is required to start the trial; you're not charged until it ends.

- AI generation costs paid directly to fal.ai at their published rates
- No credit systems, no lock-in, cancel anytime
- If your subscription lapses → read-only mode. Your data stays. Reactivate anytime

[Pricing details →](https://docs.modelbridge.app/billing/subscription/)

---

## How it compares

A detailed comparison against hardcoded AI plugins and browser-based tools is being finalized. In short: over 1,200 continuously-verified models vs. a handful hardcoded, results land on your timeline instead of your downloads folder, and you bring your own API key with no markup.

---

## Security and privacy

**The heavy lifting stays on your machine.** Silence removal, timeline scans, cuts, ripple-delete — the media processing for all of these runs locally through ffmpeg and Premiere. Your footage is never uploaded to perform them.

What does leave your machine, and where it goes:

- **Agent Mode** talks to Anthropic through your own API key. To reason about your edit it shares project metadata — clip and sequence names, timecodes, file locations, effect settings. While a timeline clip is selected it also sends 3–12 sampled frames of that clip with **every** message, so the agent can see what you see. That is on by default and switched off permanently in Settings → Privacy → "Timeline frames to the agent". Conversations never touch modelBridge servers
- **Visual scan** sends sampled keyframes to Anthropic when you ask Claude to look at footage
- **Generate tab** sends media to fal.ai when you click Generate

For NDA work, see the [NDA editing guide](https://docs.modelbridge.app/guides/editing-nda-footage/) for what each feature does and doesn't share.

Your API keys, generation history, settings, and cost logs are stored locally. No usage database on modelBridge servers unless you opt in to anonymous analytics. Anonymous error telemetry (error type + fal.ai endpoint + plugin version, no prompts or media) is off by default — you opt in from Settings.

Full data inventory, GDPR / CCPA / LGPD coverage, and subprocessor list in the [Privacy Policy](https://docs.modelbridge.app/legal/privacy-policy/).

---

## Legal & attribution

- **Terms, privacy, refund, subscription, commercial use** — [docs.modelbridge.app/legal](https://docs.modelbridge.app/legal/terms-and-conditions/)
- **Third-party attributions** — [NOTICE.md](NOTICE.md) (in this repo) and [docs.modelbridge.app/legal/attributions](https://docs.modelbridge.app/legal/attributions/)
- Core plugin code is proprietary; third-party open-source components are attributed in the notices linked above

---

## Links

- **[Documentation](https://docs.modelbridge.app/what-is-modelbridge/)** — 75+ pages: guides, features, Academy, troubleshooting, legal
- **[Live catalog](https://docs.modelbridge.app/models/available-models/)** — 1,200+ models, refreshed several times a day
- **[Architecture overview](ARCHITECTURE.md)** — high-level system design
- **[Privacy & Compliance](PRIVACY_AND_COMPLIANCE.md)** — data inventory, GDPR measures
- **[Roadmap](ROADMAP.md)** — Team Cost Intelligence, Agent Mode expansion
- **[Subscribe](https://docs.modelbridge.app/billing/subscription/)** — pricing, trial, and sign-up
- **[Support](mailto:support@modelbridge.app)**

---

## About

modelBridge is built for professional editors — freelancers, agency teams, and motion designers who use AI generation as part of real client-delivery work.

Actively preparing for Adobe's UXP: platform-specific code is moving behind adapters, and the parts that cannot be adapted — process spawning, the script-tag loading model, and timeline operations that depend on Premiere's unsupported QE DOM — are measured and documented rather than assumed away. See [UXP_MIGRATION.md](UXP_MIGRATION.md).

Built by [Niklaz Hallberg](https://niklaz.works) — digital designer and creative technologist at the intersection of design, code, and generative AI. Solo development with structured documentation, migration-aware architecture, and test suites designed for team onboarding.

2025–2026.
