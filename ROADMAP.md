# Roadmap

What's coming next for modelBridge — the problems we're solving and who they're for.

---

## Team Cost Intelligence

Agencies and post-production houses running AI generation across multiple editors face a common problem: every generation across every editor lands on a single fal.ai bill as an undifferentiated lump sum. There's no way to attribute costs to specific clients, projects, or deliverables. When an editor generates 40 AI clips across three client projects in a week, the finance team has no way to allocate those costs — and the editor has no way to prove what was billable.

modelBridge already tracks per-generation costs with model, timestamp and confidence tier, and editors already tag each generation to a client, project and deliverable at the point of creation. Team Cost Intelligence extends that across a team: cost reports broken down by client, by project, by model, and by editor — with estimated and measured costs clearly distinguished.

The system will also track billable failures separately from caught failures. When modelBridge's validation engine blocks a generation before it reaches the API, that's a prevented cost. When fal.ai charges for a generation that fails partway through processing, that's a billable failure. Both matter for accurate client invoicing — one is a cost saving, the other is a line item.

Privacy controls are built into the design. Prompt text and filenames are opt-in per project, allowing agencies with NDAs or confidential creative briefs to track costs without exposing creative direction. For Phase 1, shared cost visibility across editors on the same project will work without requiring a custom backend — enabling small teams to get started immediately.

Detailed technical architecture and implementation plan exists and is available to qualified partners under NDA.

---

## Agent Mode — Expanding Capabilities

Agent Mode allows editors to control the Premiere Pro timeline through natural language conversation. The agent reads the active project, understands sequence structure, and executes edits directly — from single clip adjustments to multi-step workflows spanning dozens of clips.

**Current capabilities (shipped):**
- 100+ tools spanning timeline editing, QC analysis, color/LUT management, AI model operations, media probing, silence analysis, and export
- A prioritized quality-control scan covering technical compliance (fps, resolution, codec, sample rate, channels, proxies and offline media, flash frames), color consistency (Lumetri and source LUTs), and editorial structure flagged as candidates for review rather than defects — ranked Critical / Warning / Info
- One-command multi-format export with platform-optimized presets (Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook) — the agent presents exact export specifications and the destination, explains why each setting suits the target platform, and the export cannot start until the editor has said go after seeing them. It runs in Adobe Media Encoder in the background, so Premiere stays usable; if Media Encoder cannot take the job, the export runs inside Premiere, which is locked until it finishes, and the agent says so
- Environment-aware silence **analysis** — the agent calibrates to the recording environment the editor points it at, measures the silent segments, and inverts them into a keeper-range cut list it shows for review. Works on clean studio recordings and noisy street interviews alike. On the editor's go-ahead the agent assembles the keeper ranges into a **new** sequence, reading each range back to confirm it landed; the working sequence is never cut in place, so an editor who wants the pauses removed from the existing timeline still uses the ranges as a cut list
- Media intelligence via ffprobe integration — the agent reads codec, bitrate, sample rate, and channel information that Premiere Pro's own scripting API doesn't expose
- Proxy workflow visibility — instant audit of which project clips have proxies, which need them, and which are offline
- Persistent editor preferences that shape the agent's behavior across sessions

Users bring their own Anthropic API key; the calls go from the editor's machine to Anthropic, not through modelBridge's servers, and modelBridge adds no markup. A 15-turn editing session measured on 2026-10-10 cost $0.146, 91% of it from two turns the agent had switched to the larger Sonnet model for. That automatic switch was removed the same day — Claude Haiku 5.5 now runs every turn unless the editor picks Sonnet 5.5 — and at Haiku 5.5's measured per-turn cost the same session works out to roughly 2–4 cents. That last figure is a calculation from measured turns, not a second measurement, and neither is a measurement of real customer usage over a month.

**Planned enhancements:**

### Conversation Intelligence

As adoption scales, modelBridge will develop an understanding of how professional editors actually work — not through surveillance, but through structured, privacy-safe pattern recognition.

The system will identify recurring workflow patterns across the user base: which editorial tasks consume the most time, which quality issues appear most frequently across different project types, which AI model categories are growing fastest in real production use, and where editors consistently hit friction points that could be automated.

This is fundamentally different from usage analytics. Usage analytics tells you that a button was clicked 1,000 times. Conversation intelligence tells you that 40% of editors working on commercial content ask for the same three-step workflow every Monday morning — and that workflow could be a single command.

At scale, this creates a feedback loop: editors shape the product through their natural workflows, the product adapts to serve those workflows better, and the result is an editing assistant that understands post-production culture — not just API endpoints.

Privacy architecture is central to the design: nothing about prompt text, creative direction, client names or project content leaves the editor's machine. Editors working under NDA or on confidential brand campaigns can contribute to product improvement without exposing anything about their work. Detailed privacy architecture is documented separately and available under NDA.

### Predictive QC

Partly shipped, and this section overstated how much of it was still ahead. A proactive layer already runs: while the Agent tab is open the panel diffs the project state every few seconds — backing off on heavy timelines — evaluates local heuristics, and surfaces coaching notices the editor can dismiss or snooze — no model calls, so it costs nothing per check.

What remains is the half that needs judgement rather than a heuristic: a clip that doesn't match the sequence's codec profile, a sudden change in edit rhythm, and the decision about which findings deserve an interruption as they happen versus a quiet note at the next QC scan.

This turns the agent from a reactive tool into a continuous quality layer that runs alongside the editor's creative process.

### AI-Driven Interview Editing (Beyond Silence)

Silence analysis is shipped, and on the editor's go-ahead the agent assembles the keeper ranges into a new sequence (see the capabilities list above). What is ahead is content-aware editing — understanding not just when it's quiet, but what's being said. Combining speech-to-text with the agent's timeline tools would enable:

- **Cutting by what was said**, not by where the gaps are — "drop the part where she repeats the question", "keep the answer about pricing"
- **Removing filler and false starts** — the ums, the restarts, the takes that trail off — as one pass rather than one trim at a time
- **Finding a line across hours of rushes** and cutting straight to it, without scrubbing
- **A rough assembly from a transcript**, ordered the way the story needs rather than the way it was recorded

### Essential Graphics Text Editing

Partly shipped: the agent can already set the text of a Motion Graphics Template (MOGRT) clip on the timeline and reads it back to confirm the change. Planned is the batch version — updating text across all title clips in a sequence, including font, size and color — enabling one-command brand guide updates and multi-language versioning.

---

## UXP Migration Path

modelBridge currently runs on CEP (Chromium Extensibility Platform), Adobe's established extension framework for Premiere Pro. Adobe is transitioning to UXP (Unified Extensibility Platform) as the modern replacement.

Platform-specific code is being isolated behind adapter layers, and some surfaces are already at zero remaining direct calls — [UXP_MIGRATION.md](UXP_MIGRATION.md) §1 has the counts. The rest is not incremental: UXP cannot spawn child processes, so the local backend becomes a separately installed companion application; the panel's script-tag loading model has to become a bundle; and a set of timeline operations in the agent layer depend on Premiere's unsupported QE DOM, for which no supported equivalent exists today.

[UXP_MIGRATION.md](UXP_MIGRATION.md) carries the measurements, the open questions to Adobe, the No-Go criteria for our beta, and the places our own early decisions turned out to be wrong.

This migration does not change how the current build behaves for users today. The CEP build keeps working on the Premiere versions that support CEP — and that window is Adobe's to set, not ours. See [UXP_MIGRATION.md](UXP_MIGRATION.md) §7 for Adobe's stated plan and how we are planning against it.

---

## Enterprise & Team Features

As modelBridge adoption grows in agency and enterprise environments, several capabilities are planned to support team-scale deployment:

- **Shared team analytics** — aggregated usage and cost visibility across all editors in a workspace, without exposing individual creative decisions
- **Per-editor usage dashboards** — individual editors see their own generation patterns, model preferences, and cost trends
- **Enterprise license tiers** — volume licensing with centralized seat management and billing
- **Custom model allowlists** — workspace administrators can define which models are available to their team, ensuring only approved models are used in production workflows

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — how the shipped half is built · [CEP → UXP](UXP_MIGRATION.md) — the measured migration state
