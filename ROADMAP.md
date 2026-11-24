# Roadmap

What's coming next for modelBridge — the problems we're solving and who they're for.

---

## Agent Mode — Expanding Capabilities

Agent Mode allows editors to control the Premiere Pro timeline through natural language conversation. The agent reads the active project, understands sequence structure, and executes edits directly — from single clip adjustments to multi-step workflows spanning dozens of clips.

**Current capabilities (shipped):**
- Over 130 tools spanning timeline editing, QC analysis, color/LUT management, audio levelling and ducking, AI model operations, media probing, silence analysis, and export
- A prioritized quality-control scan covering technical compliance (fps, resolution, codec, sample rate, channels, proxies and offline media, flash frames), color consistency (Lumetri and source LUTs), and editorial structure flagged as candidates for review rather than defects — ranked Critical / Warning / Info
- One-command multi-format export with platform-optimized presets (Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook) — the agent presents exact export specifications and the destination, explains why each setting suits the target platform, and the export cannot start until the editor has said go after seeing them. It runs in Adobe Media Encoder in the background, so Premiere stays usable; if Media Encoder cannot take the job, the export runs inside Premiere, which is locked until it finishes, and the agent says so
- Silence removal into a **new** sequence — the agent measures the pauses in one selected clip, marks the proposed removals on the timeline and summarises them. When the editor approves the card, it builds a new sequence from the kept ranges and reads each one back to confirm it landed. The working sequence is never cut in place. Room tone can be calibrated first for a noisy recording. Limits: one clip at normal speed, up to 200 pauses
- Audio levelling — loudness is measured locally, clip levels are planned and set, and ducking keyframes are written under speech, with an undo link
- Delivery check — exported files are measured locally against a spec the editor states, with a pass or fail per file
- Sequence Health — a continuous local check of the open sequence, described under *Predictive QC* below
- Offline media — after consent the agent searches local disks for offline files by filename and relinks them
- A templates library — a bin of the editor's own intros, outros, overlays and music is mirrored into every project, and the agent can search it and insert items
- An editor-set permission mode — **Ask first** (the default) shows a card before larger changes; **Auto** runs what Premiere can undo
- Media intelligence via ffprobe integration — the agent reads codec, bitrate, sample rate, and channel information that Premiere Pro's own scripting API doesn't expose
- Proxy workflow visibility — instant audit of which project clips have proxies, which need them, and which are offline
- Persistent editor preferences that shape the agent's behavior across sessions

Users bring their own Anthropic API key; the calls go from the editor's machine to Anthropic, not through modelBridge's servers, and modelBridge adds no markup. Claude Haiku 5.5 runs every turn unless the editor picks Sonnet 5.5; there is no automatic switch to a larger model. A scripted 15-turn editing session, run through the shipping agent on 2026-10-10, works out to roughly 2–4 cents at Haiku 5.5's measured per-turn cost. That is a calculation from measured turns, not a measurement of real customer usage over a month.

**Planned enhancements:**

### Adobe's local MCP integrations for Premiere

Planned, and dependent on access. At Adobe MAX on 2026-11-10, Adobe previewed local MCP integrations for Creative Cloud tools. They will let an editor's own third-party agent work locally in Premiere, Photoshop, Illustrator and After Effects, making changes directly in native project files while bins and sequences stay editable. Adobe says they will be available in private beta in early 2027 ([press release ↗](https://news.adobe.com/news/2026/11/adobe-transforms-creative-cloud-tools), [Adobe blog ↗](https://blog.adobe.com/en/publish/2026/11/10/explore-new-ways-create-across-creative-cloud-adobe-firefly-while-advancing-craft-precision-choice-control)).

Agent Mode is that kind of agent: it already runs on the editor's machine, beside Premiere. The plan is to connect it to Adobe's Premiere integration as soon as we can get access, so that Agent Mode can call the tools Adobe provides alongside its own.

- **Officially supported timeline access.** Today 74 of Agent Mode's 135 tools come from an open-source Premiere Pro MCP project, and a set of timeline operations depends on Premiere's unsupported QE DOM ([UXP_MIGRATION.md](UXP_MIGRATION.md)). Tools that Adobe maintains would give those operations a supported path wherever Adobe's integration covers them.
- **More of Premiere within reach.** We expect Adobe's integration to cover operations Agent Mode cannot perform today. Which ones, and how many, depends on what Adobe ships.
- **The same safeguards.** Tools reached through Adobe's integration would sit behind the same gates as Agent Mode's own: what Premiere cannot undo waits for the editor's confirmation, and nothing that costs money runs without a click.
- **Generation is unaffected.** fal.ai generation, cost estimates and timeline import do not depend on this and keep working as they do today.

Not known yet: which Premiere operations Adobe will expose, how private-beta access is granted, and the terms for third-party products. This section will be updated when that is public. Nothing here is a release date.

### Conversation Intelligence

Under consideration: learning which editing tasks editors ask the agent for most often, so that a workflow many editors repeat can become a single command.

The learning itself is not built. What exists is the constraint, in code: a local usage-event layer that accepts only listed event types, is gated by consent and is overridden by NDA mode. The design constraint is fixed before the design is: by default no prompt text, client name, project name or file path leaves the editor's machine — only coarse categories would — and anything more detailed would be opt-in, with its own consent screen.

### Predictive QC

Partly shipped as **Sequence Health**. While the Agent tab is open the panel checks the open sequence locally, easing off on heavy timelines, for frame-rate mismatches, low-resolution, offline and disabled clips, flash frames and reinterpreted sources. It lists them in a bar above the message box with a fix where there is one, marks them on the timeline, and has a switch per check. No model calls, so it costs nothing per check.

What remains is the half that needs judgement rather than a heuristic: a clip that doesn't match the sequence's codec profile, a sudden change in edit rhythm, and the decision about which findings deserve an interruption as they happen versus a quiet note at the next QC scan.

This turns the agent from a reactive tool into a continuous quality layer that runs alongside the editor's creative process.

### AI-Driven Interview Editing (Beyond Silence)

Silence removal into a new sequence is shipped, and so is building a caption track from an imported .srt file. What is ahead is content-aware editing — understanding not just when it's quiet, but what's being said. Combining speech-to-text with the agent's timeline tools would enable:

- **Cutting by what was said**, not by where the gaps are — "drop the part where she repeats the question", "keep the answer about pricing"
- **Removing filler and false starts** — the ums, the restarts, the takes that trail off — as one pass rather than one trim at a time
- **Finding a line across hours of rushes** and cutting straight to it, without scrubbing
- **A rough assembly from a transcript**, ordered the way the story needs rather than the way it was recorded

### Essential Graphics Text Editing

Partly shipped: the agent can already set the text of a Motion Graphics Template (MOGRT) clip on the timeline and reads it back to confirm the change. Planned is the batch version — updating text across all title clips in a sequence, including font, size and color — enabling one-command brand guide updates and multi-language versioning.

---

## Which models make the final cut

*Under consideration. Only the first of the two signals below is measured today.*

A model page can say what a model is capable of. What nobody can say yet is which models produce results that professional editors keep. modelBridge sits where that question gets answered. A result is previewed and then either imported onto the timeline or discarded, and the sequence it lands in is either exported or not.

Two signals, in order of strength:

1. **Imported.** The editor placed the result on the timeline after preview. This is measured today. With usage analytics switched on, the panel reports an import event carrying the model ID and a count ([PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md) §5).
2. **Exported.** The imported clip is still in the sequence when that sequence is exported. It survived the edit and reached delivery, the strongest evidence a generation was useful. This is not measured today. The local parts exist: imports, timeline placement and agent-started exports are recorded on the editor's machine and sent nowhere, and the check that a generated clip is still in the sequence at export is written but not switched on.

Across all editors who share usage analytics, that could answer:

- Which models' results are imported most often, relative to how often they are run
- Which of those are still in the cut at export, and which are imported and later removed
- How this differs by category and task, for example image-to-video against text-to-video, or extending a shot against generating a new one

For editors, this would be a ranking based on what professionals ship, a complement to the LM Arena rankings the panel already shows, which measure preference in blind comparisons rather than use in production. For the platforms and model makers behind these models, it would be an aggregate signal of which models hold up in real editing work.

What would have to hold:

- **Aggregate, and only with usage analytics on.** Counts per model, never media, prompts, file names, sequence names or project data. NDA mode would exclude it.
- **The export check runs locally.** The panel would report only that clips from a model were in an exported sequence, never what that sequence contained.
- **A reliable denominator first.** The count of generation starts is incomplete today, as the privacy policy says, so an import rate is not yet a trustworthy ratio. That has to be fixed before any figure is published.

---

## UXP Migration Path

modelBridge currently runs on CEP (Chromium Extensibility Platform), Adobe's established extension framework for Premiere Pro. Adobe is transitioning to UXP (Unified Extensibility Platform) as the modern replacement.

Platform-specific code is being isolated behind adapter layers, and some surfaces are already at zero remaining direct calls — [UXP_MIGRATION.md](UXP_MIGRATION.md) §1 has the counts. The rest is not incremental: UXP can launch a process but cannot pass it arguments or read its output, so the local backend becomes a separately installed companion application; the panel's script loading — its globals, load order and inline handlers — has to be reviewed; and a set of timeline operations in the agent layer depend on Premiere's unsupported QE DOM, for which no supported equivalent exists today. Adobe's local MCP integrations, previewed in November 2026, may offer a supported route for some of them; see *Adobe's local MCP integrations for Premiere* above.

[UXP_MIGRATION.md](UXP_MIGRATION.md) carries the measurements, the open platform questions, the No-Go criteria for our beta, and the places our own early decisions turned out to be wrong.

This migration does not change how the current build behaves for users today. The CEP build keeps working on the Premiere versions that support CEP — and that window is Adobe's to set, not ours. See [UXP_MIGRATION.md](UXP_MIGRATION.md) §7 for Adobe's stated plan and how we are planning against it.

---

## Team Cost Intelligence

Agencies and post-production houses running AI generation across multiple editors face a common problem: every generation across every editor lands on a single fal.ai bill as an undifferentiated lump sum. There's no way to attribute costs to specific clients or projects. When an editor generates 40 AI clips across three client projects in a week, the finance team has no way to allocate those costs — and the editor has no way to prove what was billable.

modelBridge already tracks per-generation costs with model, timestamp and confidence tier, and editors already tag each generation to a client and a project at the point of creation. For one editor, much of this is shipped: reports by client, project and model with Estimated and Metered costs distinguished, a client-facing report without prompts or model names, and failed or cancelled runs that fal.ai charged for counted as spend. Team Cost Intelligence extends that across a team, adding the breakdown by editor.

What is not counted yet is the prevented cost. When modelBridge's validation blocks a generation before it reaches the API, that is a cost saved; when fal.ai charges for a generation that fails partway through, that is a line item, and it is already counted. Reporting both side by side is planned.

Privacy controls are built into the design. Prompt text and filenames are opt-in per project, allowing agencies with NDAs or confidential creative briefs to track costs without exposing creative direction. Small teams will be able to share cost visibility on a project without any server setup.

---

## Enterprise & Team Features

As modelBridge adoption grows in agency and enterprise environments, several capabilities are planned to support team-scale deployment:

- **Shared team analytics** — aggregated usage and cost visibility across all editors in a workspace, without exposing individual creative decisions
- **Per-editor usage dashboards** — individual editors see their own generation patterns, model preferences, and cost trends. The Billing tab does part of this for a single editor today
- **Enterprise license tiers** — volume licensing with centralized seat management and billing
- **Custom model allowlists** — workspace administrators can define which models are available to their team, ensuring only approved models are used in production workflows

---

## Vision: modelBridge as a community platform

*A vision, not a plan. Nothing in this section is decided, designed or scheduled.*

Today modelBridge is a tool: one editor, one panel, one timeline. One direction we are considering is to grow it into a platform as well, a place inside the panel where people who use AI in Adobe Premiere Pro and other Creative Cloud apps can learn from each other. It would be a forum for AI experts and enthusiasts, next to the work itself.

What it could include:

- **Discussion channels** by topic, such as a model family, a workflow or a kind of production, next to the tools the conversation is about
- **Shared setups**: a model, its settings and the prompt behind a result, which another editor can open and try in one click
- **Live chat** for questions while editing, answered by people who have run the same model

What would have to be true first:

- **Accounts.** modelBridge has no user accounts of its own today. A community needs them, and they would change what the privacy material has to say.
- **Moderation.** A shared space inside a professional tool needs clear rules and someone to apply them.
- **Nothing shared without asking.** Sharing a setup would never include media, prompts or project data unless the editor chooses to, and NDA mode would block it entirely.
- **Independence.** It would be a modelBridge community, not an Adobe one.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — how the shipped product is built · [CEP → UXP](UXP_MIGRATION.md) — the measured migration state
