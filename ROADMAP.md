# Roadmap

What's coming next for modelBridge — the problems we're solving and who they're for.

---

## Team Cost Intelligence

Agencies and post-production houses running AI generation across multiple editors face a common problem: every generation across every editor lands on a single fal.ai bill as an undifferentiated lump sum. There's no way to attribute costs to specific clients, projects, or deliverables. When an editor generates 40 AI clips across three client projects in a week, the finance team has no way to allocate those costs — and the editor has no way to prove what was billable.

modelBridge already tracks per-generation costs with model, timestamp, and confidence tier. Team Cost Intelligence extends this into a proper cost attribution system. Editors will be able to tag each generation to a project or client at the point of creation. Cost reports will break down spending by client, by project, by model, and by editor — with both estimated and validated (post-generation actual) costs clearly distinguished.

The system will also track billable failures separately from caught failures. When modelBridge's validation engine blocks a generation before it reaches the API, that's a prevented cost. When fal.ai charges for a generation that fails partway through processing, that's a billable failure. Both matter for accurate client invoicing — one is a cost saving, the other is a line item.

Privacy controls are built into the design. Prompt text and filenames are opt-in per project, allowing agencies with NDAs or confidential creative briefs to track costs without exposing creative direction. For Phase 1, shared cost visibility across editors on the same project will work without requiring a custom backend — enabling small teams to get started immediately.

Detailed technical architecture and implementation plan exists and is available to qualified partners under NDA.

---

## Agent Mode — Expanding Capabilities

Agent Mode allows editors to control the Premiere Pro timeline through natural language conversation. The agent reads the active project, understands sequence structure, and executes edits directly — from single clip adjustments to multi-step workflows spanning dozens of clips.

**Current capabilities (shipped):**
- 100+ tools spanning timeline editing, QC analysis, color/LUT management, AI model operations, media probing, silence removal, and export
- A prioritized quality-control scan covering technical compliance (fps, resolution, codec, sample rate, channels), color consistency, and editorial polish — ranked Critical / Warning / Info
- One-command multi-format export with platform-optimized presets (Instagram, TikTok, YouTube, Twitter/X, LinkedIn, Facebook) — the agent presents exact export specifications, explains why each setting is optimal for the target platform, and exports directly without AME dialogs
- Environment-aware silence removal — the agent measures actual noise levels at a point the editor identifies as "quiet", calibrates the detection threshold to that specific recording environment, finds all silent segments, and removes them with ripple delete. Works equally well on clean studio recordings (-50dB noise floor) and noisy street interviews (-20dB). Preview mode places markers for review before cutting.
- Media intelligence via ffprobe integration — the agent reads codec, bitrate, sample rate, and channel information that Premiere Pro's own scripting API doesn't expose
- Proxy workflow visibility — instant audit of which project clips have proxies, which need them, and which are offline
- Persistent editor preferences that shape the agent's behavior across sessions

**Planned enhancements:**

### Conversation Intelligence

As adoption scales, modelBridge will develop an understanding of how professional editors actually work — not through surveillance, but through structured, privacy-safe pattern recognition.

The system will identify recurring workflow patterns across the user base: which editorial tasks consume the most time, which quality issues appear most frequently across different project types, which AI model categories are growing fastest in real production use, and where editors consistently hit friction points that could be automated.

This is fundamentally different from usage analytics. Usage analytics tells you that a button was clicked 1,000 times. Conversation intelligence tells you that 40% of editors working on commercial content ask for the same three-step workflow every Monday morning — and that workflow could be a single command.

At scale, this creates a feedback loop: editors shape the product through their natural workflows, the product adapts to serve those workflows better, and the result is an editing assistant that understands post-production culture — not just API endpoints.

Privacy architecture is central to the design. The system classifies intent locally on the editor's machine and transmits only structured labels — never prompt text, creative direction, client names, or project content. Editors working under NDA or on confidential brand campaigns can contribute to product improvement without exposing anything about their work. Detailed privacy architecture is documented separately and available under NDA.

### Predictive QC

The agent currently runs quality checks on demand. The next step is proactive detection — monitoring the timeline in real-time and surfacing issues as they appear, before the editor asks.

When an editor imports a 44.1 kHz audio file into a 48 kHz sequence, the agent will flag it immediately. When a clip is added that doesn't match the sequence codec profile, the agent will note the inconsistency. When the edit rhythm on V1 changes dramatically (a section of rapid cuts followed by a 45-second static shot), the agent will observe it without interrupting — and mention it during the next QC scan.

This turns the agent from a reactive tool into a continuous quality layer that runs alongside the editor's creative process.

### AI-Driven Interview Editing (Beyond Silence)

Silence removal is shipped. The next step is content-aware editing — understanding not just when it's quiet, but what's being said. Combining speech-to-text with the agent's timeline tools would enable:

### Essential Graphics Text Editing

Premiere Pro's Motion Graphics Templates (MOGRTs) store text parameters that are readable and writable via the scripting API. The agent will be able to batch-update text content across all title clips in a sequence — font, size, color, and content — enabling one-command brand guide updates and multi-language versioning.

Users bring their own Anthropic API key. Measured across real usage profiles (2026-06): about $8/month for light use, ~$26 for steady daily editing, ~$84 for heavy scan-driven work — on the default Haiku model. modelBridge does not markup or proxy the API calls.

---

## UXP Migration Path

modelBridge currently runs on CEP (Chromium Extensibility Platform), Adobe's established extension framework for Premiere Pro. Adobe is transitioning to UXP (Unified Extensibility Platform) as the modern replacement.

The modelBridge architecture is already designed for this migration. Platform-specific code is being isolated behind adapter layers — storage, host communication, shell access, and credential management each have defined interfaces that can be swapped without rewriting business logic, and all new code routes through them. The `getDataDir()` storage abstraction and async-first API design mean the transition is incremental, not a rewrite.

This migration does not affect current functionality or users. The CEP version will continue to work on all supported Premiere Pro versions.

---

## Enterprise & Team Features

As modelBridge adoption grows in agency and enterprise environments, several capabilities are planned to support team-scale deployment:

- **Shared team analytics** — aggregated usage and cost visibility across all editors in a workspace, without exposing individual creative decisions
- **Per-editor usage dashboards** — individual editors see their own generation patterns, model preferences, and cost trends
- **Enterprise license tiers** — volume licensing with centralized seat management and billing
- **Custom model allowlists** — workspace administrators can define which models are available to their team, ensuring only approved models are used in production workflows
