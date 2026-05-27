# modelBridge.app

AI generation for Adobe Premiere Pro — 1,100+ models, one panel, zero browser tabs.

---

Professional video editors juggle 3–5 AI tools in separate browser tabs. Every generation means leaving Premiere Pro — uploading, waiting, downloading, importing, conforming. You're paying four separate subscriptions, dealing with four different credit systems, and none of these tools know anything about your timeline. modelBridge puts every major AI model directly inside your NLE. Results land on your timeline, positioned and ready to cut. When fal.ai adds a new model, modelBridge supports it automatically — no plugin update needed.

And this is where it gets interesting: **Agent Mode** connects an AI assistant to both your Premiere Pro timeline and the entire modelBridge model catalog at the same time. It reads your clips, checks your project for issues, recommends the right AI model for what you're trying to do, and executes edits — all through a single conversation. It's not just an AI generation tool or just an editing assistant. It's both, working together: 1,100+ AI models aware of your timeline, and a post-production QC engine that catches problems before they reach your client.

## 1,100+ models — verified, searchable, and ready to use

modelBridge connects to over **1,100 generative AI models** on fal.ai across 11 categories. Every model in the catalog is continuously verified, classified, and made available automatically — often within hours of launch on fal.ai.

- **Live catalog** — browsable, searchable, and filterable at [docs.modelbridge.app/models/available-models/](https://docs.modelbridge.app/models/available-models/), updated every 30 minutes
- **In-plugin search** — typo-tolerant with synonym matching, paste-by-endpoint-ID, and category filters
- **New model detection** — "TODAY" badge and news feed announcement when new models appear
- **Instant startup** — cached data loads immediately while a background refresh runs

---

## Why editors switch to modelBridge

1. **Stay in Premiere.** Generate AI video, images, and audio without opening a browser. Results import to the right track, at the right timecode, with the right scale.

2. **1,100+ models, one panel.** Kling, FLUX, Veo, Seedance, Happy Horse, ElevenLabs, and hundreds more through a single interface across 11 categories.

3. **See costs before you generate.** Real-time estimates update as you change duration, resolution, and audio. Five confidence levels tell you how reliable each number is. The plugin learns from your billing history to improve estimates over time.

4. **Background generation.** Long generations move to the background automatically. Stack parallel jobs. Sound notification when ready. Survives Premiere restart.

5. **Track costs per client.** Tag generations to projects. See spending breakdowns and model usage. Export reports with KPIs and licensing badges.

6. **Self-improving validation.** When a model rejects your media, modelBridge remembers the requirement and catches it automatically next time.

7. **Smart timeline import.** One button — replace source clip in-place, insert at playhead, or route audio to the right track. A live preview bar shows exactly what will happen.

8. **Bring your own API key.** No credits, no markup — you pay fal.ai directly at their published rates.

9. **Built-in tools.** Paint inpainting masks, optimize prompts, preview on your phone via QR code, run two models side-by-side in Dual Mode.

10. **Agent Mode.** A post-production assistant that lives inside your timeline. Describe what you want — *"close the gaps on V1"*, *"check if all clips use the same LUT"*, *"reframe for 9:16"* — and it reads your project, executes the edits, and verifies the result. 21-point QC scan, LUT consistency across sequences, batch clip operations, track management, environment-aware silence removal, multi-format export, and AI model recommendations. Bring your own Anthropic API key.

11. **Ask your agent about any model.** Open a model card, click *"Explain this model"*, and the agent picks it up — already knowing what the model is best for, its real input parameters, and what to watch out for. Say *"yes"* when it offers to install, and the model is ready to use. No tab-hopping, no copy-pasting endpoints, no reading the fal.ai page first.

12. **Find the best model.** LM Arena leaderboard rankings updated nightly — sort by community-validated quality, not just alphabetical. Trending filter surfaces what's popular right now.

13. **Any image into any model — your timeline or someone else's.** Scrub to any frame in any timeline video and click **Extract frame** — the button shows the exact timecode of your playhead and updates as you move it, so you pick the frame you want, not "roughly". Or paste a public image URL straight from Midjourney, DALL-E, or any web gallery into the same card. Both routes feed the AI model instantly — no export, no download, no Premiere import.

---

## Getting started

1. **Subscribe** at [modelbridge.app](https://modelbridge.app) — 14-day free trial, then $7/month or $59/year
2. **Install** the plugin via ZXP installer — see [docs.modelbridge.app/getting-started/installation/](https://docs.modelbridge.app/getting-started/installation/)
3. **Open modelBridge** in Premiere Pro → Extensions → modelBridge
4. **Paste your license key** from the LemonSqueezy receipt email
5. **Paste your fal.ai API key** from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
6. **Start generating**

---

## Pricing

**$7/month** or **$59/year** (save ~30%). 14-day free trial with full access — no restrictions, no generation limits. A payment method (card, PayPal, Apple Pay, or Google Pay) is required to start the trial, but you won't be charged until the trial ends.

- AI generation costs paid directly to fal.ai at their published rates — no markup
- No credit systems, no lock-in, cancel anytime
- **When your subscription expires:** Read-only mode — your data stays, generation is disabled until you reactivate. No data is ever deleted because of a billing change.

---

## Links

- [Documentation](https://docs.modelbridge.app/what-is-modelbridge/) — 75+ pages: getting started, feature guides, workflow recipes, Academy, troubleshooting, and full legal framework
- [Available Models](https://docs.modelbridge.app/models/available-models/) — live catalog of 1,100+ models, updated every 30 minutes
- [Store](https://modelbridge.app) — download and subscribe
- [Support](mailto:support@modelbridge.app) — reach out anytime

---

## Key Features

### 1. Adaptive model intelligence

- Every model gets a purpose-built interface — whether or not the provider has published a full specification
- Models with complete specifications get every parameter exposed
- Models without one still work — modelBridge uses multiple strategies and upgrades the interface automatically as more data becomes available
- New models detected and made available automatically, often within hours of launch — no plugin update needed

### 2. Smart timeline import

- **One button** — replace source clip in-place, insert at playhead, or route audio to the right track
- A live preview bar shows exactly what will happen before you click

### 3. Dual Mode

- Run the same prompt against two models simultaneously
- Compare results side-by-side with an honest input overview — see exactly when a setting is adjusted for the secondary model and why
- Both models always start reliably

### 4. Cost and time estimates

- Live estimates update as you change duration, resolution, and audio
- Five confidence levels tell you how reliable each number is
- Both cost and time estimates learn from your billing history and improve with usage
- No fabricated numbers

### 5. Follow Your Generation

- Generations move to the background automatically
- Track every job through five stages
- Sound notification when done
- Survives plugin restart

### 6. Audio pipeline

- Select a voice clip, click Generate — 10+ audio models including ElevenLabs Voice Changer, TTS, dubbing, AI music, and sound effects
- Preview inline before importing

### 7. Mask editor

- Paint inpainting masks directly in the panel — adjustable brush, zoom, pan, eraser, undo
- No Photoshop roundtrip

### 8. Dual-frame interpolation

- Select a start frame and end frame — the AI generates the motion between them
- Adjacent clips get replaced as a single span on the timeline

### 9. Source Monitor preview

- Evaluate results at full resolution in Premiere Pro's Source Monitor
- Set In/Out points to import just the best segment

### 10. Mobile Preview

- Send results to your phone with one tap
- Scan a QR code once — your latest generation is always available in the app

### 11. Your models, organized

- Recent models at the top, pinned favorites for one-click access
- Filter by category or by what you want to do — "Extend shot," "Interpolate frames," "Voice-over"
- Type to filter, scroll to browse

### 12. Prompt optimization

- One click rewrites your description into a model-optimized prompt
- No prompt engineering expertise required

### 13. Drag-and-drop or paste a URL

- Drag a file onto the media card, or paste a public image URL from Midjourney, fal.ai, or any CDN
- Thumbnail preview appears instantly — no download, no import step

### 14. Model Preview System

- Preview expected output for any model — images, video, and audio
- 89% coverage across 1,100+ models — see what it produces before generating

### 15. AI-written key strengths

- Every model includes 2–3 concise USPs written specifically for video editors
- Refreshed as new models appear

### 16. Smart model badges

- HD, 4K, AUDIO, LoRA, and duration badges appear automatically
- Derived from each model's specification, not a manually maintained list

### 17. New model detection

- Automatic detection via scheduled monitoring
- "Today's models" filter with rich cards and a "TODAY" badge

### 18. Agent Mode

Every editor works differently. Agent Mode adapts to you — your standards, your shortcuts, your way of checking work. A post-production assistant that reads your timeline, executes edits, and catches issues before they reach your client.

**Real workflows:**

#### Dailies prep

You come home after a shoot with 80 raw clips. Normally 45 minutes of sorting footage into folders, renaming clips, setting color labels and status tags — mechanical work that has to happen before the creative can start.

**User:** *"Prep today's footage"*

**Agent:** Reads every clip, identifies cameras from file metadata, groups clips by source, flags short takes and generated files for review, and proposes a complete organization plan in one message. You confirm or correct in one reply. Five minutes. Nothing to do tomorrow morning.

The metadata travels with the footage. Your colorist in Resolve sees the same camera labels — you didn't have to tell them anything.

#### Timeline scan before delivery

You're done with a cut and delivering tomorrow. Are there offline clips? Frame rate mismatches? Gaps that will export as black? Normally you scrub through manually and hope you catch everything.

**User:** *"Scan my timeline"*

**Agent:** Runs a 21-point inspection covering technical compliance, media analysis, and editorial polish. Findings grouped by severity: critical issues first, then warnings, then observations. Every finding includes the clip name and exact timecode.

#### Silence removal

You have a 20-minute interview with long pauses and filler words. Normally you listen through and cut by hand.

**User:** *"Remove silence from the interview track"*

**Agent:** Measures the actual noise floor of your recording, shows you exactly how many segments it found and how much time will be removed, and waits for your confirmation before cutting anything.

#### Rough cut from markers

You watch the rushes once, marking every take that catches your eye. Now you have 30 markers across an hour of footage and the slow job of slicing out the keepers and stacking them in order.

**User:** *"Build a rough cut from my markers"*

**Agent:** Splits the timeline at each marker boundary, keeps the marked sections, and removes the rest in one pass. The cut you described while watching is the cut you get back.

#### J-cut every edit on V1

You're cutting a dialogue scene. Every cut feels mechanical because video and audio change at the same frame — the polish move is to let the next clip's audio creep in half a second before the picture cuts, but applying that to 40 edits by hand takes most of an afternoon.

**User:** *"J-cut all the edits on V1"*

**Agent:** Finds every cut point on the track, trims each audio in-point back by half a second, and reports what changed. The whole scene gets the same polish in one operation.

#### Close all the gaps

You spent the morning trimming and deleting and now V1 looks like Swiss cheese. Ripple-deleting one gap at a time means watching the timeline shift after every move and double-checking nothing landed wrong.

**User:** *"Close all the gaps on V1"*

**Agent:** Finds every gap and ripples them closed, working from the end of the timeline backwards so earlier clip positions don't shift while it works.

#### Color consistency across deliverables

You have a master cut and three social versions. You're not sure the color grade matches across all of them.

**User:** *"Do all my cutdowns match the master's color grade?"*

**Agent:** Scans every sequence and reports which clips have a different LUT or no LUT at all, with clip names and sequence locations.

#### LUT propagation

You applied a new LUT to one clip and want the same look across everything on V1. Normally copy-paste in Lumetri, clip by clip.

**User:** *"Copy the LUT from the hero shot to everything on V1"*

**Agent:** Reads the reference clip's settings, applies them to every clip on V1, and reports exactly what changed.

#### Export to social platforms

You need to deliver to Instagram, TikTok, and YouTube. Three different specs, three export dialogs, manual settings for each.

**User:** *"Export for Instagram, TikTok, and YouTube"*

**Agent:** Shows the optimal settings for each platform and why, waits for your OK, and exports all three.

#### Reframe for vertical

You have a 16:9 master that needs to become a 9:16 reel. Clip by clip manually.

**User:** *"Reframe this sequence for Instagram"*

**Agent:** Calculates and applies the correct scale and position to every clip in the sequence.

#### Codec audit

You suspect you're mixing H.264, ProRes, and DNxHR in the same timeline. Premiere doesn't surface this without manual investigation.

**User:** *"What codecs are in my timeline?"*

**Agent:** Reads directly from the media files via ffprobe and gives you a complete breakdown.

#### Proxy status

You don't know which clips are missing proxies before an editing session on a slow laptop.

**User:** *"Which clips don't have proxies?"*

**Agent:** Scans the entire project bin and lists what's missing, prioritized by what's on your active timeline.

#### Normalize audio

Interview material from three microphones at different levels. Normally adjust each clip by ear.

**User:** *"Normalize all audio to -12 dB"*

**Agent:** Reads current levels, calculates the adjustment per clip, and applies.

#### Understand a model

You see a model in Browse but don't understand what the parameters do.

**User:** Clicks *"Explain this model"* on a model card.

**Agent:** Gives you a short, honest walkthrough of what the model is best for in a Premiere workflow and which parameters actually matter. Say *yes* and it installs the model directly.

#### Cover the missing angle

You're cutting a two-person dialogue scene and you only have one camera. The cut works for a while — then you need to break up a long beat and realise there's no reverse shot to cut to.

**User:** *"Build me a reverse shot of the second speaker that matches this frame"* — with a frame from the timeline attached.

**Agent:** Reads the reference frame, identifies what needs to stay locked (face, wardrobe, set, lighting), and writes a prompt structured for coverage — correct lens feel, eye-level framing, identity preservation, scene-matched lighting and grade. Asks if you want it bound to a fal.ai model in the Generate tab. Say yes — the prompt lands ready to run with the reference frame pre-attached, one click to generate.

**Capabilities at a glance:**

| Domain | What you can ask | What it saves you |
|---|---|---|
| Read project | *"What's in this project?"* | One snapshot of every bin, sequence, media type, offline item — instead of clicking through tabs |
| Read project | *"What's in the Footage bin?"* | Detailed item-by-item drill-down with media paths, frame rates, offline status |
| Read timeline | *"What clips are on the timeline?"* / *"What's selected?"* | Every clip with name, dimensions, source frame rate, position, duration |
| Read effects | *"What effects are on this clip?"* | Full effect stack, Motion, opacity, blend mode, speed, reverse, disabled state |
| Edit clips | *"Move/trim/split/delete this clip"* | Single or batch edits — "split every 5 seconds" runs across the whole track |
| Edit properties | *"Half-speed and reverse"* / *"Set opacity to 50%"* | Scale, position, rotation, opacity, audio level, speed (with reverse) |
| Effects | *"Add Lumetri Color"* / *"Cross dissolve between these"* | Effects and transitions by name |
| Lumetri color | *"Set exposure to -0.3"* | Exposure, contrast, highlights, shadows, whites, blacks, temperature, tint, saturation, vibrance, sharpening |
| Precision trim | *"Ripple delete this clip"* | Clip removed and gap closed — every later clip slides into place |
| Precision trim | *"Roll the cut between these two clips by 1 second"* | Edit point moves, neighbors compensate, sequence duration unchanged |
| Precision trim | *"Slide this clip half a second later"* | Clip moves on the timeline without changing its duration |
| Precision trim | *"Slip this clip back by a second"* | Source in/out shift — clip stays put but shows a different part of the take |
| Precision trim | *"Reverse this clip"* / *"Enable frame blending"* | Playback direction flipped; slow-motion smoothed |
| Precision trim | *"Detect scene cuts in this clip"* | Auto cuts at detected scene boundaries — chops raw long takes into shots |
| Precision trim | *"Strip every effect off this clip"* | All effects removed in one call |
| Animation | *"Fade out the last 2 seconds"* | Opacity keyframes placed at the right times with natural easing |
| Animation | *"Animate scale from 100 to 110 over the clip"* | Keyframes on any effect property with linear, hold, or bezier curves |
| Animation | *"What keyframes are on opacity?"* / *"Remove keyframes between 5s and 8s"* | Read, modify, or clean up animation ranges |
| Captions | *"Turn this .srt into a caption track"* | Caption track created from an imported caption item — subtitle or 608/708 broadcast format |
| Sequence creation | *"Create a new sequence called Cut 02"* | Empty sequence — optionally from a preset |
| Sequence creation | *"Make a sequence from these 4 takes"* | Rough cut assembled with the listed bin items in order |
| Bin organization | *"Create a bin called B-roll"* / *"Move all .mov files into B-roll"* | Bins created and items organized in one operation |
| Bin organization | *"Import these files into B-roll"* / *"Relink this offline clip"* | Media imported or reconnected |
| Bin organization | *"Merge duplicate bin entries"* | Premiere's consolidate-duplicates run from the chat |
| Markers (write) | *"Add a red marker here saying 'check audio'"* | Marker with name, comments, color, optional duration — on sequence or specific clip |
| Markers (write) | *"Update the marker at 00:00:45"* / *"Delete the marker at 00:01:23"* | Edit or remove by time position |
| Tracks | *"Mute V2"* / *"Lock A1"* | Track state toggled |
| Tracks | *"Add a new video track above V3"* / *"Delete the empty track A4"* | Track structure modified — empty-track cleanup preserves V1 and A1 |
| Project lifecycle | *"Save"* / *"Save a copy at this path"* / *"Open this project"* | Save, save-as, or switch projects — destructive ops always confirm first |
| Project lifecycle | *"Import the comps from this After Effects project"* | Selected or all .aep comps imported into a chosen bin |
| Style copy | *"Copy the Lumetri grade from this clip to those four"* | All non-intrinsic effects propagated from source to multiple targets |
| Style copy | *"Both clips have Lumetri — sync the exposure"* | Property values copied between two clips that share an effect |
| Color & LUT | *"What LUT is on the hero shot?"* / *"Do all my cutdowns match?"* | Per-clip LUT readout, sequence-wide consistency check |
| Color & LUT | *"Copy the LUT from this to everything on V1"* | Batch LUT propagation with per-clip success report |
| QC | *"Scan my timeline"* | 21-point inspection: FPS, resolution, audio coverage, codec, sample rate, channels, LUT, flash frames, pacing, missing fills, orphaned audio |
| QC | *"What codecs are on the timeline?"* / *"Which clips are offline?"* | Real codec/bitrate/sample-rate readout via ffprobe; offline-media audit |
| Silence removal | *"Remove silence from this track"* | Noise-floor calibrated detection, preview, ripple delete |
| Export presets | *"Export for Instagram, TikTok, and YouTube"* | Three files, platform-correct specs, one pass |
| Export queue | *"Queue this sequence to Media Encoder"* | AME launched, job queued with preset matching |
| Format handoff | *"Save the current frame as PNG"* / *"Export an AAF for Pro Tools"* / *"Export FCP XML for Resolve"* | Single frame, audio-post handoff, NLE handoff |
| Model expertise | *"Explain this model"* / *"Find me a model that does X"* | Honest model walk-through + optional install, 1,100+ model search |
| Prompt authoring | *"Build me a reverse shot from this frame"* | Coverage prompt with identity lock and scene-matched lighting — written for editing, not stock |
| Custom chains | *"Run QC, then export for YouTube"* | Multi-step workflows in one conversation |

**Timeline editing:**
- Move, trim, split, delete clips. Adjust scale, position, rotation, opacity, audio levels, speed (with reverse)
- Add effects and transitions, adjust Lumetri Color parameters
- Insert clips from the project bin, add/delete/lock tracks, manage markers (read/write/update)
- Precision trim moves — ripple delete, roll edit, slide edit, slip edit. Frame blending, scene-cut detection, strip-all-effects
- Animate over time — place, modify, and clean up keyframes on any effect property; linear / hold / bezier curves
- Captions — turn an imported .srt or .vtt into a real caption track in one ask
- Batch operations — *"split every 5 seconds"*, *"label all clips under 2 seconds as yellow"*

**Sequence, bin, and project structure:**
- Create new sequences or assemble rough cuts from listed bin items
- Create bins, move items, import media, relink offline clips, consolidate duplicates
- Save / save-as / open project (destructive ops confirm first), import After Effects compositions

**Export and handoff:**
- Platform export presets (Instagram, TikTok, YouTube, Reels, Shorts, X/Twitter, LinkedIn, Facebook)
- Single-frame PNG export from current playhead or a specified time
- Queue a sequence to Adobe Media Encoder with preset matching
- Industry handoff — AAF for Pro Tools, FCP XML for DaVinci / Final Cut

**21-point QC scan:**
- FPS and resolution mismatches, audio coverage, codec consistency
- LUT inconsistency — detects when clips use different Input LUTs and offers to align them
- Ungraded clips, flash frames, disabled clips, pacing analysis, orphaned audio
- Audio sample rate mismatch (44.1 kHz vs 48 kHz), audio bitrate outliers, channel mismatch (mono/stereo)
- Video codec inconsistency (H.264 / ProRes / DNxHR), audio codec inconsistency (AAC / PCM / MP3) — via ffprobe integration
- Grouped by severity with specific clip names, timecodes, and suggested fixes

**Color and LUT management:**
- Scan a sequence or the entire project for LUT consistency
- Copy one clip's LUT to any number of other clips in a single operation
- Cross-sequence brand consistency — *"do all my cutdowns match the master's grade?"*

**Multi-step workflows:**
- Reframe for social (9:16, 1:1, 4:5), normalize audio, close all gaps, add transitions to every cut
- Build rough cuts from markers or bin items, J-cuts, copy effects between clips
- Pre-client LUT QC, cross-sequence brand alignment, cleanup empty tracks

**Media probing & proxy intelligence:**
- ffprobe integration — reads codec, bitrate, sample rate, and channel info that Premiere Pro's own scripting API doesn't expose
- Proxy workflow audit — instant view of which clips have proxies, which need them, and which are offline

**Environment-aware silence removal:**
- Calibrates detection threshold to your actual recording environment — measures noise at a clip you identify as "quiet" so it works equally well on clean studio audio (-50dB noise floor) and noisy street interviews (-20dB)
- Preview mode places markers for review before cutting; ripple delete removes silent segments cleanly

**Multi-format export:**
- One-command batch export with platform-optimized presets (Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook)
- The agent presents exact export specifications, explains why each setting is optimal for the target platform, and exports directly without AME dialogs

**Prompt authoring for generations:**
- New angles from one frame — reverse shots, OTS, wides, inserts, B-roll. Attach a timeline frame, describe the angle, and the agent writes a prompt that locks face, wardrobe, set, and lighting to the reference so the new shot can cut into the scene
- Scene matching across multiple generations — establishes a visual lock from your reference (palette, lighting direction, grain, film texture) and reuses it across every prompt in the same chat so two new shots in the same scene feel like the same production
- Coverage you didn't shoot — story beats, dialogue coverage A/B, mood cutaways, transition frames, establishing shots, all written in editing terms (what cut needs filling, what shot type covers it)
- Motion-ready first frames — when the generated image is going to become a clip via an image-to-video model, the prompt is shaped for that downstream use: correct aspect ratio, subtle motion cues, identity lock strong enough to survive the animation pass
- Quality, not polish — explicitly avoids artifacts that make AI footage uncuttable: plastic skin, HDR contrast, oversaturated colors, over-sharpened edges, stock-photography composition
- Handoff to Generate — when the prompt is ready, the agent binds it directly to a fal.ai model in the Generate tab; chat-attached frames become start frame (or start + end for first/last-frame morph models), one click to run
- Scoped to editing work — if you ask for a thumbnail, logo, poster, or non-narrative graphic, the agent switches off film-still vocabulary and asks about the job first, because that language produces worse results on non-film imagery

**AI model operations:**
- Search and install from 1,100+ models, get detailed parameter info, recommend models for specific tasks
- Error troubleshooting with plain-language explanations

**Personalization:**
- Custom instructions per user — define your role, standards, workflow shortcuts, and communication preferences
- Two Claude models: Haiku 4.5 (default, ~$10/month) for everyday tasks, Sonnet 4.6 (~$25-30/month) for complex reasoning
- Session cost tracking in real time
- Bring your own Anthropic API key — no conversation data transmitted to modelBridge

### 19. LM Arena Rankings & Trending

- Models ranked by LM Arena leaderboard data, updated nightly via automated cron
- Sort by community-validated quality ranking in the Browse panel
- Trending filter surfaces popular models based on real usage patterns
- Helps editors discover the best model for their task, not just the newest

**One creative chain.** Generate an image, preview it at full resolution in Source Monitor, mark In/Out points, import just the best frame — then feed it directly into a video model. One panel, one unbroken creative pipeline from idea to timeline.

**modelBridge Academy.** Contextual "Learn about X" links appear on model cards — only when relevant. 19 articles cover prompting, LoRA, cost control, upscaling, inpainting, dubbing, voice-over, negative prompts, dual mode, workflow recipes, and more. Toggle learning tips on or off in Settings.

---

## What Runs Without You

Most plugins are frozen in time — the tool you install is the tool you get. modelBridge updates itself. These nine systems run automatically — keeping the catalog current, learning from your usage, and delivering fixes without plugin updates.

### 1. Automatic catalog sync

1,100+ models today. More tomorrow. No plugin updates needed. The catalog refreshes automatically as fal.ai publishes new models.
[Learn more →](https://docs.modelbridge.app/features/news-feed/)

### 2. Adaptive interface generation

Every model gets a custom-built interface generated from its API specification when available. Models without a published specification still work — the plugin uses multiple strategies to make them available, and upgrades the interface automatically as more data becomes available. No hardcoded models. 1,100+ models, no model-specific UI code.
[Learn more →](https://docs.modelbridge.app/features/schema-driven-ui/)

### 3. Self-learning validation

When a model rejects your media, modelBridge remembers the requirement. Future attempts are checked automatically — dimensions, file size, duration, aspect ratio.
[Learn more →](https://docs.modelbridge.app/reference/self-learning/)

### 4. Cost estimation

Five confidence levels. Multiple pricing sources checked in priority order. Learns from your actual fal.ai charges. Live recalculation in 9 currencies.
[Learn more →](https://docs.modelbridge.app/models/costs/)

### 5. Generation time estimates

Estimated time on every model card. Built from your own usage history — after a few generations, the estimate appears and improves with use.
[Learn more →](https://docs.modelbridge.app/features/background-generations/)

### 6. Smart timeline import

One button. Replace in-place, insert at playhead, or route to audio track. A live preview bar shows exactly what will happen before you click.
[Learn more →](https://docs.modelbridge.app/features/timeline-import/)

### 7. AI prompt optimization

One click to enhance your prompt — tailored to your model type. Better prompts, better results, no expertise required.
[Learn more →](https://docs.modelbridge.app/guides/prompt-tips/)

### 8. Remote error updates

Clear, actionable messages — not raw API output. New error types addressed with targeted fixes delivered remotely, often within hours.
[Learn more →](https://docs.modelbridge.app/reference/error-handling/)

### 9. Remote operations layer

A dedicated backend monitors the fal.ai catalog continuously and delivers updates over-the-air — new error handling, pricing data, and model intelligence reach users without a plugin release. Amber alerts for platform issues.

These systems compound. A model that didn't exist last week appears automatically. You generate with it a few times and the time estimate dials in. After regular use, the cost badge levels up from "From" (minimum published price) to "Learned" (derived from your actual billing history). Estimates get more accurate the more you use it.

---

## Model Verification

modelBridge doesn't just list AI models — it continuously validates, classifies, and curates them. A dedicated background system monitors the entire fal.ai catalog around the clock.

### Continuous catalog sync

- New models detected automatically — no plugin restart needed
- Cached data displayed instantly on startup while a background refresh runs
- If the network is slow, a retry button appears after 12 seconds instead of hanging

### Multi-path model support

- **Full specification available** — complete interface with all parameters: resolution, duration, aspect ratio, and more
- **Specification not yet available** — model still accessible, with continuous background checks for updates
- **Verification passed** — added to verified allowlist
- **Verification failed** — enters pending state, retried automatically until specification becomes available

### Category classification

Not every fal.ai model belongs in a video production workflow. modelBridge uses a three-tier category system:

- **Supported** — media production models: image generation, video generation, audio, voice, upscaling, style transfer, and more
- **Reserved** — categories prepared for future support
- **Blocked** — models outside the scope of video production: LLMs, transcription, 3D generation, and similar

Any category not explicitly on the supported list defaults to blocked. Unknown never means visible.

### State-aware UI

Every model card reflects its actual current state:

- Ready to install
- Newly available after being fixed upstream
- Temporarily unavailable while specification is being resolved
- Permanently retired

Users always know what they're looking at and why a model may not be available yet.

### Designed for a moving target

- fal.ai's catalog is live — models are added, updated, broken, and retired continuously
- modelBridge treats the catalog as a live data source with explicit states, not a fixed list
- Fully autonomous — a model published at 3am on a Sunday is verified and available by morning

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

## For Agencies and Freelancers

- **Cost tracking per client** — every generation tracked in 9 currencies. Tag costs to clients and deliverables. Export CSV or generate HTML reports with KPIs and compliance badges.
  [Learn more →](https://docs.modelbridge.app/guides/cost-tracking/)

- **Commercial licensing** — filter models by commercial license before you generate. License status tracked per model and per generation — feeds into compliance badges in client reports.
  [Learn more →](https://docs.modelbridge.app/models/available-models/)

- **External AI costs** — import costs from Midjourney, RunwayML, ElevenLabs, and other platforms via CSV. One dashboard for total AI spend across all tools.

- **International ready** — cost estimates in 9 currencies. GDPR, CCPA, and LGPD compliant.

---

## How It Compares

|  | **modelBridge** | **Hardcoded AI Plugins** | **Browser-Based AI** |
|---|---|---|---|
| **Models** | 1,100+ (continuously verified) | 5–20 hardcoded | 1 per platform |
| **Categories** | 11 | 1–2 | 1 per platform |
| **New models** | Automatic — detected in the background | Plugin update required | New account required |
| **Search** | Typo-tolerant, synonyms, abbreviations, paste-by-ID | Scroll a fixed list | N/A |
| **Workflow** | Select → Generate → Timeline | Select → Generate → Import → Position | Upload → Wait → Download → Import |
| **Smart import** | Context-aware replace/insert with live preview | Manual positioning | Manual positioning |
| **Audio/TTS** | Select clip → Generate → on timeline | None or separate tool | Export → upload → download → import |
| **Cost estimate** | 5-level confidence, learns from your billing | Hidden or none | Hidden behind credits |
| **Learns from your usage** | Estimates get closer to your real bill every time you generate | No | No |
| **Adapts to pricing changes** | Yes — pricing updates automatically | No | No |
| **Personal to your workflow** | Your billing history, your configs, your estimates | No | No |
| **Validation** | Self-improving — learns from errors | Basic or none | Server-side only |
| **Error messages** | Plain language + color-coded by category, multi-error stacking | Raw API errors | Varies |
| **Vendor lock-in** | Your own API key | Locked to vendor | Locked to platform |

---

## Cost Transparency

modelBridge calculates a concrete cost for your exact settings before you generate — live estimates that update as you change duration, resolution, and audio.

### Five confidence levels

| Tier | Source | What it means |
|---|---|---|
| **Billed** | Confirmed cost from real fal.ai billing units — covers both simple per-unit and formula-based pricing | Post-generation — the confirmed charge |
| **Estimated** | Verified pricing data | Updates live with parameter changes (duration, resolution, audio) |
| **Learned** | Your actual fal.ai billing history | Improves with usage — personalized to your configurations |
| **From** | Minimum starting price | Actual cost may be higher (surcharges not reflected) |
| **No price** | No data available | Honest fallback — generates anyway, badge levels up to Learned over time |

- All pre-generation tiers resolve to Billed once fal.ai confirms the charge
- You pay fal.ai directly at their published rates — modelBridge adds no markup
- Note: fal.ai may charge for requests where processing began before an error was detected — this is fal.ai's billing policy, not a modelBridge fee

[Learn more →](https://docs.modelbridge.app/models/costs/)

---

## Reliability

- **Central validation engine** — one system checks everything (required fields, value ranges, media constraints, parameter dependencies) before you can click Generate. No wasted credits, no waiting for a fail. Works identically in single and dual mode.

- **Self-improving validation** — when a generation fails due to a constraint, modelBridge remembers and enforces it automatically on future attempts. "Minimum 3 seconds — learned from a previous generation."

- **Plain-language errors** — not "422 Unprocessable Entity" but *"Maximum duration is 10 seconds."* 53+ error types mapped to clear messages. Color-coded: red for input issues, amber for billing, blue for temporary problems. Up to two errors shown simultaneously.

- **Errors always visible** — input errors near your prompt, generation errors above the Generate button, background errors caught and waiting. A guaranteed fallback ensures every message reaches you.

- **Access-restricted model detection** — some models require creator approval. modelBridge detects this at install time — not after you've waited for a generation to fail.

- **Resilient infrastructure** — automatic server recovery, exponential backoff, background polling that survives panel close/reopen. Storage quota protection prevents data loss.

---

## Always Up to Date

- **Human-readable errors** — raw API responses, HTTP status codes, and cryptic field names are translated into plain language before they reach you
- **WHAT / WHY / WHAT TO DO** — every error tells you what happened, why, and exactly what to do — color-coded by category
- **Multi-error stacking** — a billing warning never hides an input error
- **Contextual placement** — input issues near your prompt, generation failures above the Generate button
- **Remote updates** — error documentation delivered automatically, no reinstallation needed
- **Verified links only** — "Read more" links in error banners only appear when a documentation page exists for that specific error

---

## Live News Feed

- New AI models detected automatically from fal.ai's catalog and announced in-plugin
- Click "Try it" to open model search with the endpoint pre-filled — add in one click
- Service notices warn you about scheduled downtime before it affects your work
- Checks for updates once per startup, respects your preferences (disable in Settings)
- Only your plugin version and platform sent to our server — no personal data

---

## Blog — fal.ai News, Right Next to Your Timeline

fal.ai's official blog directly inside the panel — new model announcements, deep-dives, and platform updates right where you work.

- **Read → Install → Generate** — modelBridge scans each article for model references and surfaces them as actionable buttons. Click **Install**, then **Try model** — you're generating on your current project.
- **Article cards** — featured image, publication date, reading time, title, and excerpt. **NEW** badges mark posts since your last visit.
- **Full articles in-panel** — click any card to read the full article without leaving Premiere Pro
- **Unread badge** — the Blog tab shows how many posts are waiting. Most recent post can appear in the scrolling news banner.
- **Works offline** — cached articles stay available when your connection drops

[Learn more →](https://docs.modelbridge.app/features/blog/)

---

## Security and Privacy

### Your data stays on your machine

- All user data — saved models, settings, generation history, cost logs — stored locally
- modelBridge does not operate any user-facing cloud database
- Generated media downloaded directly from fal.ai to your local project folder

### API key handling

- Your fal.ai API key is entered once and stored locally
- Never transmitted to modelBridge or any third party
- Used exclusively for direct communication between the plugin and fal.ai
- View, change, or delete your key at any time from Settings

### Network communication

- **fal.ai** — AI model generation, schema fetching, and pricing data. Authenticated with your own API key.
- **LemonSqueezy** — license validation at startup. Only the license key and a machine identifier — no user data.
- **GitHub raw content** — remote pricing updates, error documentation, and feature flags. Read-only, no user data sent.
- **modelBridge telemetry** — anonymous error type reports when an unexpected error occurs. Enabled by default, can be disabled in Settings > Privacy.

No third-party analytics or tracking pixels.

### License validation

- Checks a single endpoint at plugin startup — only the license key and a device identifier
- No usage data, no generation history, no personal information
- Offline grace period: up to 7 days since last successful validation
- Works on up to 2 devices — release a device in Settings when you need to move

### Anonymous error telemetry

When an unexpected error occurs, modelBridge sends an anonymous report containing only:

- Error type and HTTP status code
- Model endpoint (a public fal.ai identifier like `fal-ai/kling-video/v3`)
- Plugin version and platform

Enabled by default. Disable at any time in **Settings > Privacy**. No prompts, file paths, media, API keys, or personal information are ever included.

A separate opt-in behavioral analytics stream (disabled by default) collects anonymous usage patterns — see [PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md) for the complete data inventory.

### What we do NOT collect

- No prompts, inputs, or generated content
- No personal information beyond what LemonSqueezy provides at purchase
- No browsing behavior, no cookies beyond localStorage, no fingerprinting
- No usage statistics — telemetry covers only unexpected error types, not normal usage

### Data deletion

- All locally stored data can be cleared from within the plugin (Settings → Reset)
- Uninstalling removes all extension files
- Cost history includes a manual "Reset" requiring the user to type "DELETE" as confirmation

---

## Legal and Compliance

Comprehensive legal framework published at [docs.modelbridge.app/legal/terms-and-conditions/](https://docs.modelbridge.app/legal/terms-and-conditions/):

- **Terms & Conditions** — covers AI-generated content ownership, liability boundaries, and commercial use rights. EU/GDPR compliant, AI Act positioned.
- **Privacy Policy** — GDPR, CCPA, LGPD, and UK data protection coverage. Documents exactly what minimal data is collected (license validation only) and what isn't (everything else).
- Production-grade subscription infrastructure — seat management, offline grace period, and automated billing lifecycle
- Built for professional environments where legal review is a prerequisite for tool adoption

---

## Technical Architecture

### Adaptive interface generation

The entire UI — every slider, dropdown, media input, and validation rule — is generated at runtime from the model's specification. No model-specific code. The same engine handles 1,100+ models across 11 categories.

- **Automatic input classification** — each parameter rendered as the appropriate control type: sliders for ranges, dropdowns for choices, toggles for booleans, media inputs for files
- **Constraint enforcement** — min/max ranges, allowed values, required fields, and format validation derived from the specification and enforced before generation
- **700+ curated parameter explanations** — every non-obvious input field has a plain-language explanation and documentation link
- **Immediate model support** — new fal.ai models render their complete interface immediately, no plugin update required
- **Unified design system** — hundreds of different models feel like one cohesive product
- **Provider-agnostic architecture** — works with any machine-readable API specification, designed for multi-provider expansion

### Error handling

- Errors caught before they cost money, learned from when they slip through, shown in plain language with a clear next step
- 53+ error types mapped across two format schemas to human-readable messages
- Five semantic categories drive consistent color-coded treatment across every surface

### Cost resolution

- Multiple pricing sources checked in priority order — the most accurate source always wins
- Five confidence levels clearly labeled so users always know the basis for each number
- Learns from actual billing to fill gaps — estimates improve with usage
- No fabricated numbers — post-generation actuals from fal.ai confirm or correct estimates

### Resilient data persistence

- Models, learned constraints, cost history, and settings survive cache clears, Premiere updates, and plugin reinstalls
- Automatic backup before every data migration
- If primary storage is empty, recovery is silent and automatic

---

## For the developer: self-running by design

modelBridge is designed to reduce daily manual maintenance. The systems below keep the catalog current, learn from usage, surface issues proactively, and deliver fixes without plugin releases.

### The catalog updates itself

| What | How |
|---|---|
| New models | Detected, verified, and classified — or blocked — before reaching the UI |
| Missing specifications | Pending state, retried automatically until available |
| Incompatible models | Quarantined — unknown categories default to blocked |
| Installed models | Health-checked in the background |
| Renamed endpoints | Silently migrated |
| Retired models | Confirmed across multiple checks before marking unavailable |
| Specification changes | Silent UI rebuild on next open |
| Announcements | News feed with "Today" badge |

### Operators get proactive alerts

| Type | Content | Timing |
|---|---|---|
| **Daily digest** | Catalog movement, customer events, pipeline health | Once per day |
| **Instant alerts** | Payment failures, refunds, catalog anomalies, resurrections | Immediately |

Sections with no activity are omitted from the daily digest.

### Remote configuration

Updatable without a plugin release:

| Capability | Use case |
|---|---|
| **Error copy** | New error types get targeted messages without a reinstall |
| **Feature flags** | Enable gradually, roll back instantly |
| **Featured models** | Update search suggestions when noteworthy models launch |
| **Incident banners** | Push platform warnings with severity and custom copy |
| **Kill switches** | Disable specific features for emergency rollback |

All remote files are integrity-verified. Tampered files rejected silently — falls back to built-in defaults.

### Self-learning systems

| System | What it learns | How it helps |
|---|---|---|
| **Validation** | Constraint values from API rejections | Future attempts caught before the API call — no cost |
| **Cost estimates** | Median cost from your billing history | Fills gaps where curated pricing isn't available |
| **Time estimates** | Duration from your generations | Personalized time estimate on every model card |

### What still requires a release

- New UI components or layout changes
- New generation pipeline logic (upload, poll, download, import)
- Changes to the local backend server or preflight validation engine
- Bug fixes in client-side JavaScript or ExtendScript
- New error translator patterns (the built-in pattern matcher, not the remote copy)

---

## How modelBridge handles new and unknown models

fal.ai adds new models continuously. modelBridge handles them without requiring a plugin update.

| Capability | How it works |
|---|---|
| **Interface generation** | Every model gets its own UI from its specification — sliders, dropdowns, media drop zones, toggles. Not hardcoded. |
| **Missing specifications** | Model still accessible — plugin continuously checks and upgrades the interface automatically |
| **Contextual help** | Common parameters: hand-written explanations. Less common: from the model's docs. Remaining: generic + link. No field unexplained. |
| **Field classification** | `image_url` on one model might be `start_frame` on another — modelBridge identifies the correct type across 1,100+ models without per-model configuration |
| **Fixed values** | Parameters that must be a specific value are shown as read-only — clearly labeled, never editable |

### What this means in practice

- New fal.ai models added next month work without a plugin update
- New parameters get contextual help automatically
- No field is ever unexplained or silently missing
- The plugin stays current as the catalog grows

---

## Who It's For

- **Freelance editors** who want to stop context-switching between browser tabs and their NLE
- **Agency teams** who need cost accountability and per-client reporting
- **Motion designers** who want access to every model without juggling four subscriptions
- **Anyone editing in Premiere Pro** who uses AI generation as part of their workflow

---

Built by [Niklaz Hallberg](https://niklaz.works) — digital designer and creative technologist at the intersection of design, code, and generative AI.

2025–2026.

> For full technical architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).
> For privacy, compliance, and data architecture, see [PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md).
> For what's coming next, see [ROADMAP.md](ROADMAP.md).
