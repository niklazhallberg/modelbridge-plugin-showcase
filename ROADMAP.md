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

Agent Mode already allows editors to control the Premiere Pro timeline through natural language chat. The Agent is aware of the current project, active sequence, and selected clips — it can make real-time editorial decisions and execute them directly.

Planned enhancements include multi-step editorial plans (propose a sequence of edits, review, then execute), deeper sequence-aware context (understanding the narrative structure of what's on the timeline), anomaly detection (flagging potential issues in the edit), and automated QC passes.

Users bring their own Anthropic API key. Typical usage for a 2-hour editing session costs approximately 50–60 SEK/month. modelBridge does not markup or proxy the API calls — the editor's key is used directly.

---

## UXP Migration Path

modelBridge currently runs on CEP (Chromium Extensibility Platform), Adobe's established extension framework for Premiere Pro. Adobe is transitioning to UXP (Unified Extensibility Platform) as the modern replacement.

The modelBridge architecture is already designed for this migration. All platform-specific code is isolated behind adapter layers — storage, host communication, shell access, and credential management each have defined interfaces that can be swapped without rewriting business logic. The `getDataDir()` storage abstraction and async-first API design mean the transition is incremental, not a rewrite.

This migration does not affect current functionality or users. The CEP version will continue to work on all supported Premiere Pro versions.

---

## Enterprise & Team Features

As modelBridge adoption grows in agency and enterprise environments, several capabilities are planned to support team-scale deployment:

- **Shared team analytics** — aggregated usage and cost visibility across all editors in a workspace, without exposing individual creative decisions
- **Per-editor usage dashboards** — individual editors see their own generation patterns, model preferences, and cost trends
- **Enterprise license tiers** — volume licensing with centralized seat management and billing
- **Custom model allowlists** — workspace administrators can define which models are available to their team, ensuring only approved models are used in production workflows
