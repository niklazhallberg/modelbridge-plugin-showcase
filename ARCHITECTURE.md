# Architecture

How modelBridge is built — design principles, current state, and development practices.

---

## System Design

modelBridge is a three-layer system: a Premiere Pro panel, a local media processing backend, and a cloud operations layer. The panel handles UI and user interaction. The backend handles media extraction, uploads, and downloads. The cloud layer monitors the AI model catalog, manages licensing, and delivers remote updates.

The layers are built to fail separately. An outage in the cloud layer does not stop an editor's work: the panel runs on its last catalogue and verdicts, and a bounded offline allowance covers the licence check. The local backend restarts itself after a crash. What generation genuinely needs is the local backend and fal.ai itself, and when either is missing the panel says which.

The cloud layer runs autonomously — detecting new models, verifying their schemas and deciding which ones the panel may offer, without manual intervention.

---

## Core Design Principles

**Adaptive.** Almost every model gets its interface generated at runtime from its own OpenAPI schema — no per-model code. A model that is live on fal.ai but whose schema stays unpublished is still offered, with a prompt-only interface, and upgrades itself to the full form once the schema appears. A small number of models carry a hand-tuned interface that ships with the plugin (one model family today). All three paths end in the same place: a generation form the editor can use. This is how about 1,200 models (1,190 in the live catalogue on 2026-11-21) across 11 supported image, video, and audio generation or transformation categories are supported without plugin updates — and how a model that launched this morning is usually something an editor can run this afternoon, rather than something that waits for our next release. That is the difference between a live catalogue and a curated list.

**Usage-calibrated.** The plugin learns from usage. When a model rejects media, the constraint is remembered and enforced automatically on future attempts. Cost estimates improve as your metered usage accumulates. Generation time estimates appear after a few uses and converge toward your actual experience the more you generate.

**Resilient.** User data survives cache clears, application updates, and plugin reinstalls. Automatic backup before every migration of installed-model data. Silent recovery when primary storage is unavailable. If primary storage comes back empty, installed models are restored from the latest backup.

**Remotely updatable.** Error handling, endpoint changes and feature flags are delivered over-the-air. When something changes in the AI ecosystem, the response ships without a plugin release and without user action; updates are checked at panel start, error explanations are re-checked about hourly while the panel is open and visible, and feature flags and configuration apply from the next start. Model intelligence arrives the same way from the plugin's own cloud service rather than the update channel, and curated pricing corrections travel neither today: they ship bundled in a plugin release, so a cost estimate cannot currently be changed remotely.

**Defensive.** All external data is parsed defensively — invalid values are rejected before they reach business logic. Validation runs before every generation to prevent wasted API credits.

---

## Model Discovery & Availability

modelBridge continuously monitors the AI model ecosystem. When a provider launches a new model, the system detects it automatically — no one adds it by hand, and no plugin release is involved.

**The cadence, stated rather than promised.** The cloud layer works through the catalogue in recurring passes — discover, validate, publish — several times a day. A scheduled check in CI re-verifies the catalogue twice a day on top of that, re-reading any schema that is new or has changed. A new model therefore has to be seen, then verified, then published, and what an editor sees adds a CDN hop and the panel's own catalogue cache. For a model whose schema verifies, that is same-day rather than same-hour, because the honest bound is the sum of those steps, not the interval of any one of them. A model whose schema is not published takes longer — see below.

**Independent verification, one verdict.** Every model in the 11 supported categories is verified more than once, by independent checks, before an editor is offered it. Verification requires a real input schema with concrete types, and refuses a model whose output can never carry a file — a live stream, an id, a paragraph of text — because a supported category is not evidence about the output. The checks are arranged so that an inconclusive result never withdraws a model that has already been verified; only proof that it cannot run does. The verdict is one of four:

| Verdict | When | What the editor sees |
|---|---|---|
| **Verified** | the schema resolves with real inputs, and the output can carry media | listed in Browse with **Add**, announced in the news banner |
| **Held back** | the model is listed on fal.ai but its schema cannot be read yet | not offered yet; re-checked automatically |
| **Prompt interface** | still held back after repeated checks, and still live on fal.ai | listed with **Add**; installs as a prompt plus the media input its category implies (an image for image-to-video, none for text-to-image), and upgrades to the full form once the schema appears |
| **Blocked** | proven incompatible: no inputs, an output that can never carry a file, or excluded by hand | never offered |

A typed search can also reach a model no scheduled check has seen yet. Its schema is then checked at the moment the editor presses Add, and the same refusals apply there: the panel itself re-reads the schema, so no verdict from the cloud is the last word.

**What happens at Add.** If the model has a hand-tuned adapter, the adapter is used and no schema is fetched. Otherwise the schema is fetched live, with fallbacks so that a temporary API issue does not block the add, and every input is classified and rendered (see *The schema is the interface* below). A prompt-interface install happens only after the panel has itself confirmed that the schema is unavailable; a transient failure fails the add loudly rather than installing a degraded form.

**What "no plugin update needed" covers.** Everything on the automatic path — new models, their parameters, the verdicts, the prompt interface and its upgrade — reaches an installed panel without a release. Hand-tuned adapters are panel code: a new one ships in a release, and an existing one can be switched off remotely.

```mermaid
%%{init: {"theme": "base", "flowchart": {"curve": "basis", "padding": 20, "nodeSpacing": 36, "rankSpacing": 44, "htmlLabels": true, "wrappingWidth": 280}, "themeVariables": {"fontFamily": "Arial, Helvetica, sans-serif", "fontSize": "14px", "primaryColor": "#f6f8fa", "primaryTextColor": "#1f2328", "primaryBorderColor": "#d0d7de", "lineColor": "#8c959f", "clusterBkg": "transparent", "clusterBorder": "#8c959f", "titleColor": "#8c959f", "edgeLabelBackground": "transparent"}}}%%
flowchart TD
    subgraph cloud["&nbsp;Cloud layer · runs on its own&nbsp;"]
        direction TB
        A["fal.ai publishes a model"] --> B["Catalogue sync picks it up<br/>several times a day"]
        B --> C{{"In a supported category?"}}
        C --> X["Outside scope<br/><i>not listed</i>"]
        C --> D["Schema read and verified<br/>independently"]
        D --> F["Verified<br/><i>inputs resolve, output can carry media</i>"]
        D --> G["Held back<br/><i>schema not readable yet, re-checked</i>"]
        D --> Y["Blocked<br/><i>proven unusable, never offered</i>"]
        G -.-> F
        G --> P["Prompt interface<br/><i>live but unpublished, upgrades itself later</i>"]
    end
    H["In the Premiere Pro panel<br/><i>listed in Browse with Add, announced in the news banner</i>"] --> I["Editor presses Add"]
    I --> J{{"Hand-tuned adapter?"}}
    J --> K["A few models<br/><i>tuned form ships with the plugin</i>"]
    J --> L["Every other model<br/><i>form generated from the live schema</i>"]
    K --> M["Preflight against declared<br/>and learned limits"]
    L --> M
    M --> N["Generate, preview,<br/>import to the timeline"]
    N --> O["Each run teaches<br/><i>limits, cost and timing</i>"]
    O -.-> M
    F --> H
    P --> H

    classDef step fill:#f6f8fa,stroke:#d0d7de,stroke-width:1px,color:#1f2328
    classDef ask fill:#ffffff,stroke:#8c959f,stroke-width:1px,color:#1f2328
    classDef ok fill:#dafbe1,stroke:#4ac26b,stroke-width:1px,color:#116329
    classDef wait fill:#fff8c5,stroke:#d4a72c,stroke-width:1px,color:#7d4e00
    classDef alt fill:#ddf4ff,stroke:#54aeff,stroke-width:1px,color:#0550ae
    classDef stop fill:#ffebe9,stroke:#ff8182,stroke-width:1px,color:#a40e26
    classDef quiet fill:#f6f8fa,stroke:#d0d7de,stroke-width:1px,stroke-dasharray:4 3,color:#59636e
    class A,B,D,H,I,M,N,O,K,L step
    class C,J ask
    class F ok
    class G wait
    class P alt
    class Y stop
    class X quiet
```

---

## Scale

| | |
|---|---|
| Supported AI models | About 1,200 models (1,190 in the live catalogue on 2026-11-21) across 11 supported image, video, and audio generation or transformation categories — see the Coverage note in [README.md](README.md) |
| Catalogue verification | Twice a day in CI, on top of the cloud layer's own passes. On 2026-11-21: 1,172 verified, 16 offered through a prompt interface, 12 blocked. Method and figures in [RELIABILITY.md](RELIABILITY.md) |
| Agent Mode tools | 135 (counted 2026-11-24), each with its own schema |
| Panel codebase | About 229,000 lines of JavaScript and CSS (counted 2026-10-23), plus the ExtendScript host layer and the local backend |
| Design system | Token-driven — visual consistency across every surface |
| Documentation site | 91 pages across guides, reference, Academy, and legal (counted 2026-11-24), plus a parameter index generated from the live catalogue |
| Automated tests | A harness of offline suites and live-panel (CDP) suites, run by one command that writes the run as an artefact; a pre-commit guard refuses any published test count that does not come from that artefact, so no figure is copied by hand — which is also why none is printed here. Plus catalogue audits and end-to-end import tests against a live Premiere |
| Built by | One developer — structured for team onboarding and handover (documented conventions, migration plan, and test suites) |

---

## Development Practices

**Structured documentation.** The project includes extensive internal documentation — architecture overviews, system deep-dives, convention guides, and behavioral rules. This documentation follows a structured format that is consumable by both human developers and AI coding agents, enabling a new developer to orient within the codebase using standard tooling.

**Test coverage.** Automated test suites validate the critical paths: error normalization and translation across all fal.ai error formats, cost estimation accuracy across 11 pricing formula types, dual-mode input synchronization and field aliasing, parameter override behavior, visual rendering consistency, and pricing supplement parsing. End-to-end scripts cover a live generation through polling to preview, and timeline import across four scenarios (insert, video replace, image replace, audio replace). A catalog-wide classification audit runs every model through the schema parser; a separate field-mapping audit has verified widget classification across 10,000+ input fields.

**Conventions and rules.** Coding conventions, commit standards, and architectural rules are documented and enforced consistently. Every error must go through the translation layer — no raw API output reaches users. Every data migration must create a backup first. Every bug fix must check for the same class of problem elsewhere in the codebase.

**Release process.** Cloud updates follow a review workflow with integrity verification (SHA-256 checksums) before deployment. Plugin releases ship as a signed, notarised macOS `.pkg` (Developer ID Installer certificate, notarisation ticket stapled). The first, 1.0.0, is attached with its SHA-256 to this repository's [v1.0.0 release](https://github.com/niklazhallberg/modelbridge-plugin-showcase/releases/tag/v1.0.0). The OTA manifest that carries the payload hashes is not itself signed; whoever can publish to this repository controls both.

---

## Platform Integration

### fal.ai

modelBridge integrates with fal.ai at multiple API levels — not just the generation endpoint.

**Model catalog.** The plugin consumes fal.ai's model listing and search APIs (authenticated with the editor's own key when one is set), its category classification, and its per-model schema endpoints. The Trending order in Browse is not a fal.ai signal: it comes from a public model leaderboard, matched to the catalogue by modelBridge's cloud layer. The catalog is treated as a live data source, not a static list — new models, schema changes, and retirements are detected and handled automatically. Why the architecture is built on this catalogue rather than a hand-picked subset is set out in [Why fal.ai](https://docs.modelbridge.app/why-fal-ai/).

**Schema parsing.** Every model's OpenAPI specification is fetched, parsed, and used to generate the complete UI — input fields, validation rules, media requirements, and parameter constraints. The plugin supports both fal.ai's queue API and platform API endpoints, with automatic fallback between them.

**Pricing.** Cost estimates draw on three sources only: fal.ai's official pricing API, a curated pricing table that ships with the plugin, and the editor's own metered history. Nothing is scraped, and no endpoint outside fal.ai's official API is asked about prices.

**Storage and language models.** Media is uploaded to fal.ai's storage before a run is submitted, so the submission itself carries only URLs. When no Anthropic key is set, the prompt rewrite (Enhance) runs on fal.ai's language-model endpoint, on the editor's own fal.ai key.

**Error specification.** The plugin parses both of fal.ai's error response formats — structured validation errors and infrastructure errors — including `ctx` structured constraint data, error documentation URLs and the retry headers (`X-Fal-Needs-Retry`, and the older `X-Fal-Retryable`). The documented error types map to specific user-facing copy; an unrecognised type falls back to a generic message rather than raw output. A small set of semantic categories — input quality, credits and billing, network, content policy, and integration faults — drives consistent visual treatment across all error surfaces. When a billing error and an input error arrive together, both reach the banner — the second as a line under the first — so one does not hide the other.

**Resilience to API changes.** The schema-driven architecture absorbs changes in fal.ai's catalogue without code changes: a new model, and every parameter it declares, needs no release. Schema fetching has layered fallbacks, so a temporary API issue does not stop an installed model from generating. A renamed endpoint is migrated to its new id, and a retired one is confirmed absent from the catalogue before anything is removed.

### Consuming the fal.ai API in production

The section above lists what modelBridge integrates with. This one is the engineering account of consuming it — where the API's own shape sets the terms of the integration, and what was built to meet them. Numbers carry the date they were produced; **measured** means observed in a live run or against a captured corpus, as opposed to read from documentation.

**The schema is the interface.** Every generation form is rendered from the model's OpenAPI document — the automatic path has no per-model UI code, so the document is not an input to the UI, it *is* the UI. The working corpus behind the numbers here is 1,497 schema responses captured through the plugin's own fetch path — 14,025 input properties — of which 11,523 fields across 1,143 models were reachable in the shipping catalog when the render snapshot was taken (2026-08-06). Those fields resolve to a closed set of widget kinds in 35 widget-by-placement combinations, and the catalog's media-input space collapses to 26 distinct shapes — combinations of required and optional image, video and audio inputs (swept 2026-08-13). None of these sets is static: a new shape arrives with the first model that carries it, announced by nothing except the schema itself, which is why the shape sweep is a rerunnable script rather than a table in a document.

Most of a form derives cleanly — types, enums, numeric ranges, defaults, required flags, media roles. Two properties of the corpus have to be met deliberately:

- **Nullability is an idiom, not a type.** 1,963 fields across roughly 70 % of models express "optional" as OpenAPI 3.0's `anyOf: [{type:"string"}, {type:"null"}]` rather than a scalar type (measured 2026-08-06). A consumer that matches only scalar `type` values loses all of them in a single day if the catalog ever serializes as OpenAPI 3.1, where the same fields become `type: ["string","null"]` — an array. The classifier is therefore written to fail loud rather than open: an unrecognized construct renders as an explicitly labelled fallback field, never as a silent bare text box, so its failure mode is a visible field rather than a paid-for malformed request.

- **Schemas change with no revision marker.** A schema can change underneath an installed model, and nothing in the document announces it — change detection is the consumer's job. Installed endpoints are re-checked against the catalogue daily, and a renamed endpoint is migrated with its form rebuilt from the new schema. A schema that changes under an *unchanged* endpoint is caught by comparing the schema itself, and the form is rebuilt when it has changed. Between 2026-08-27 and 2026-11-14 that comparison did not run; it does again. A normalized shape baseline captured 2026-08-06 exists so a later capture has something to diff against.

**How a schema becomes a form.** What the classifier guarantees, rather than how it decides:

- **The form follows the schema.** A field is classified from what the schema declares about it, not from what its name suggests: `video_output_type` is a dropdown, never an upload. When fal.ai's category and the schema disagree — a category promising a video input the schema does not have — the form follows the schema and the disagreement is recorded for review instead of being resolved silently.
- **Composite inputs render as what they are.** Start and end frames, masks and reference sets are recognised and laid out as such; an `ImageSize | preset` union becomes a preset-or-custom size picker; a field is required only when its declared condition holds; and a media field nested inside a sub-form never counts as the model's main input.
- **Nothing unusable is installed, and declared limits are honoured.** A model whose output schema can never carry a file URL is refused before the editor can install it. Media limits come from what the schema declares and from what a rejection has taught, and a learned limit never overrides a machine-readable one.

Some things do not derive at all. 18 of the 1,497 schemas declare no inputs. Some constraints exist only as prose in field descriptions; the preflight enforces what it can recognise there, and what it cannot is learned from the first rejection (see media constraints below). The hand-tuned adapters and the streamlined prompt-only interface described earlier exist for exactly the models where the automatic path cannot deliver the whole form.

**A status word is not the whole status.** The queue API reports IN_QUEUE, IN_PROGRESS, COMPLETED, FAILED. The edge, measured live on 2026-08-15 from two real requests: a terminal failure can be reported on a status other than FAILED. One request was still reported as IN_PROGRESS two days after submission, with `inference_time: 0.0` and a runner-acquisition failure sitting in its `error` field the entire time; the other reported COMPLETED with `error_type: "runner_disconnected"` and no result URL. A consumer that reads "not terminal" as "still running" renders "Generating…" forever on the first and retries a result fetch forever on the second — which is what this plugin did before the measurement, and is the incident the following machinery comes from.

- **Failure is concluded only from provider evidence.** The first rule derived from those two payloads ended a run on any error field. It was withdrawn on 2026-09-14: an error field on an in-flight status can describe a runner problem fal.ai recovers from, and ending a run that is still live is the worse mistake. Today a run fails on an explicit FAILED, on a COMPLETED whose result URL refuses, or on a status endpoint that keeps refusing the request; a sustained loss of contact ends the watch and points to the fal.ai dashboard. A request stuck like the first payload is watched until the editor cancels it.
- **An unknown status renders as unknown, never as progress.** Status words map to progress stations through one fixed vocabulary, and a value outside it is shown as unknown rather than painted as motion (shipped 2026-08-16).
- **"Generating" carries a freshness requirement.** A running generation that has gone too long without an understood response flips to an explicit checking state showing when contact was last confirmed. Progress is a claim backed by a recent, understood answer, not by the absence of a terminal one.
- **No clock ends the wait.** A run is watched for as long as it is running on fal.ai — there is no fixed deadline, because a long video run can legitimately outlast any deadline we would pick. A watch ends when the run finishes, when the editor cancels, or after a sustained, unbroken loss of contact; the last two point at the fal.ai dashboard, because the charge may be real even when delivery is not, so the terminal state names where the authoritative record lives. A run interrupted by a Premiere restart resumes watching on the next panel open, as long as the run is still recent. *(Corrected 2026-10-21: this bullet described a 30-minute wall. No such deadline exists in the shipping code; 30 minutes is only the scale of the progress display.)*
- **"Not sent" and "unconfirmed" are different answers.** A run that ended before anything reached fal.ai — a refused upload, a failed extraction, a declined warning — is shown as "Not sent" and never counts as spend. A submission that fal.ai never confirmed with a request id is booked as *unconfirmed*; Billing shows the outcome (Failed, Cancelled or No result) and says on hover that fal.ai may still have charged, because the request may have been accepted. Storage uploads are bounded by progress rather than by a clock, so a large file on a slow line is not cut off mid-transfer — and an upload the panel loses track of is booked as unconfirmed, never as "Not sent".
- **Cost settles after the fact.** A cancelled run, a failed run without a usage count, or a success that arrived without one is re-read from fal.ai at start-up and when Billing opens, for several days, and is priced from the count fal.ai then reports.
- **The provider's retry verdict decides.** When fal.ai sends `X-Fal-Needs-Retry` (or the older `X-Fal-Retryable`), that answer, true or false, overrides the error type's own classification of whether a retry should work. Nothing is resubmitted automatically: the verdict decides what the editor is told, and the editor decides whether to run again.

**The dollar is a derivation, and every label says whose.** What the API emits about money is precise but partial. What a result carries is a usage quantity — never a dollar. What the pricing API publishes is a per-unit rate. The identity `cost = units × unit price` reproduced fal.ai's own arithmetic in all four metered runs, across three model classes, in which it was tested (2026-08-25), fractional quantities included. But the unit is the model author's own convention, with no cross-catalog rule to lean on — measured the same day: one video family normalizes resolution into the quantity (the same second of output bills a different unit count at 720p than at 1080p), another books usage in token blocks, and the same model reached through an endpoint alias is a separate pricing row in a third unit. Quantity follows the nominal request, not the delivered output (a 5-second request bills as 5 seconds even when the delivered clip runs a fraction longer). The function from parameters to units — the thing a pre-run estimate actually needs — is not machine-readable anywhere: the rate is published; the quantity rule is not.

The product's cost labels map one-to-one onto what the provider handed over for that specific number:

| Label | Backed by |
|---|---|
| **Metered $X** | fal.ai reported a usage quantity for this run — the dollar is that quantity × the known rate |
| **Calculated $X** | the run finished without a quantity modelBridge can price — the dollar is modelBridge's own formula |
| **Estimated $X** | pre-run, from curated per-model pricing |
| **Learned ≈$X** | pre-run, from your own metered history with this model |
| **From $X** | pre-run, fal.ai's lowest published price for this model — a floor, not a prediction |
| **No price** | no source qualifies, so no number is shown |
| **Metered / Calculated (failed run)** | post-run — the run failed, but fal.ai reported usage for it or reported it completed, so it is counted as spend |
| **Charged, amount unknown** | post-run — fal.ai reported usage in a unit modelBridge has no rate for, so the count is shown and no amount |

About 61 % of the active catalog (856 of 1,392, measured 2026-07-24) prices in a unit that converts to a per-output figure and can carry a "From $X" floor; the rest fall back to curated pricing or the editor's own metered history where either exists, and otherwise show "No price" rather than an approximation. No label in the product presents a figure as fal.ai's invoice: fal.ai reports a usage quantity, never a per-request dollar, so every dollar shown is that quantity × modelBridge's rate, or modelBridge's own formula. And when the pricing API omits its `unit` field, the absence is treated as unknown and falls to "No price" — an earlier version defaulted the missing field to per-request, which silently repriced per-second models as flat-rate, and that class of confident wrong number is exactly what the labelling discipline exists to make impossible.

**What the panel knows before you spend.** Selected media is validated against the model's declared limits continuously while a clip is selected — dimensions, duration, file size, aspect ratio — and a failing clip is refused with the reason on the thumbnail ("Video too long (21.6 s, max 20 s)") before any request leaves the machine. The ceiling on that is what schemas declare, and the machine-readable constraint vocabulary is small and unevenly used. The extractor reads the dimension, duration, file-size and aspect-ratio keys the `x-fal` vocabulary provides; the corpus also carries a few further keys on a handful of schemas that are not yet consumed. On a 58-model reference install (2026-08-20), 4 of the 41 media-taking models declared any machine-readable limit at all; the rest enforce their limits server-side, in prose, or not at all.

The mitigation is that a rejection teaches. When a generation fails validation, the structured constraint data in the error is read, and the limit is stored per model and enforced at preflight from then on: the same clip against the same model is refused client-side next time, before spend. The learner is deliberately narrow — only validation-class errors can teach it (a billing or infrastructure error never can), and a learned limit never overrides a machine-readable one. `ctx` is the part of the error contract that makes this loop dependable: it is machine-readable where the message is prose, and it is the reason the same mistake does not cost money twice.

This section is about what the API demands. How often we ask of it — poll volume per generation and the backoff behind it, the catalogue synchronisation cadence and what that cadence costs in freshness, and the same accounting for the other two services modelBridge depends on — is in [`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md), together with the panel-side measurements and the findings we got wrong.

### Agent Mode

Agent Mode is a natural-language layer on top of modelBridge's Premiere Pro integration. Editors describe what they want in plain language; the agent reads the timeline, plans the operation, executes edits, and reports back.

Agent Mode runs on the editor's own Anthropic API key, but it isn't a general chatbot bolted onto Premiere. modelBridge adds a layer built to tailor the agent for Adobe's environment:

- **Wired into the Premiere toolkit.** 135 tools (counted 2026-11-24) read timelines, edit clips, run quality checks and deliver, all from plain language.
- **Knows where Premiere's scripting stops.** When an operation is outside what Premiere's scripting can do, the agent says so and gives the manual step, instead of improvising with a tool that only looks equivalent.
- **Checks its own work.** Timeline-shape edits are re-read from the real timeline after they run, and when a change can't be confirmed the agent says so instead of reporting success.
- **Honest by design.** It says plainly when something genuinely can't be done, and never guesses at a cause it can't see.
- **Reports its own coverage.** Tools that sample rather than read everything return how much of the request they covered — counts of what was expected against what was produced, plus named lists of what was never opened and what could not be read. That lets the agent scope its answer to what was actually read, instead of giving a confident verdict over an unread item. A truncated result otherwise looks exactly like a complete one, which is the failure mode this closes.
- **Cannot spend money by itself.** A generation requested in chat is staged, not started: inputs resolved against the model's schema, validated, and returned with a cost estimate. Firing it requires a button the agent can only ask for, and the click re-checks that the model and the media are still the ones that were approved — refusing rather than re-binding if either drifted. The gate is code on the click path, not an instruction in a prompt.

The result: Agent Mode finishes the work a raw model would hand back to the user, and is plain about the part Premiere does not allow.

**What Agent Mode can do today.** Timeline introspection, clip editing (move, trim, split, delete), property adjustment (scale, position, opacity, speed, Lumetri), effect and transition management, track and sequence operations, LUT scans and batch color operations, multi-platform export (Instagram / TikTok / YouTube / Twitter / X / LinkedIn / Facebook), environment-aware silence analysis — measurement, a keeper-range cut list, and on the editor's go-ahead a new sequence assembled from those ranges with per-range readback, the working sequence left untouched — quality-control inspection, and direct handoff into modelBridge generation flows for AI-driven edits.

**Available models.** Claude Haiku 5.5 (default, fast + cheap) and Claude Sonnet 5.5 (deeper reasoning). Editors can switch at any point in a conversation.

**Privacy.** Conversations are sent directly to Anthropic's API using the editor's own key. modelBridge does not store, log, or relay conversation content. No conversation data transits modelBridge infrastructure. Absolute media paths are replaced with opaque, session-scoped references at a single choke point before anything is sent and resolved back locally on return — session-scoped by construction, so the reference does not itself identify the file across sessions. The project file's own path is handled the same way. Filenames still travel, because the agent has to name the clip, and three kinds of path travel as written: a path the editor types into the chat, anything inside raw XMP text, and the candidates of a disk search for an offline file. The boundary is stated in the source rather than implied, and in full in [PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md) §6.

### Adobe Premiere Pro

modelBridge is a deep Premiere Pro integration, not a standalone panel that happens to run inside the application.

**Timeline interaction.** The plugin reads and writes to the active sequence — clip selection, track identification, In/Out points, playhead position, and sequence metadata. Generated media is placed on the correct track, at the correct timecode, with frame-accurate positioning. An extend-video result that confidently matches the timeline clip it was made from is placed as only the new footage, directly after that clip on the same track; otherwise it imports like any other result. When an image model needs a still and a video is selected, a camera button (**Capture frame**) captures the frame at the playhead into the model's image input; its hover text names the timecode it will take.

**Source Monitor.** Results can be opened directly in Premiere Pro's Source Monitor for full-resolution evaluation. Editors can set In/Out points in the Source Monitor and import only the selected range.

**Media awareness.** The plugin reads clip properties from the timeline — dimensions, duration, file path, track index — and uses them for validation, media extraction, and context-aware import decisions (replace in-place vs. insert at playhead vs. route to audio track).

**ExtendScript bridge.** A host layer of a few hundred global ExtendScript functions handles communication between the panel and Premiere Pro's scripting engine — covering clip selection, sequence queries, project bin management, timeline manipulation, and fit-to-frame scaling. Host communication is being consolidated behind an adapter layer: 82 % of the host calls in the panel's scripts routed through it (2026-10-21; 75 % on 2026-08-30 by the same search; about three-quarters once the calls in the panel's HTML page are counted), with the agent layer fully converted and the generation pipeline deliberately left until after the 1.0 release. See [UXP_MIGRATION.md](UXP_MIGRATION.md) for the full measurements, including what the adapter layer does *not* cover.

---

## Operational Infrastructure

The cloud operations layer is deployed on an edge runtime and works on a schedule, several passes a day. It is stateless by design; all persistent state lives in a plain key-value store.

**Failure recovery.** If the cloud layer is unavailable, the panel continues operating with cached data — the catalog, pricing, and model intelligence all use stale-while-revalidate strategies. When the cloud layer recovers, data refreshes silently in the background.

**Monitoring.** The operator receives instant alerts for urgent licensing and catalogue events, and one daily report covering customers, usage, health and catalogue movement. The scheduled CI verification keeps its own catalogue digest (new, verified, held-back and removed models) in its run log.

**Local backend recovery.** The Node.js backend on localhost includes health monitoring, automatic restart on crash, keep-alive pings, and port conflict detection. If the backend is unreachable after all recovery attempts, the panel surfaces a clear status message with a manual restart option.

### Self-running systems inventory

The following systems operate autonomously — reducing manual maintenance and keeping the plugin current between releases.

**Catalog pipeline.** The cloud layer re-reads the full fal.ai catalog several times a day. New models are verified before they reach the panel — a model with a broken or unpublished spec is held back and re-checked automatically, and promoted at the next check after it becomes usable. Verification runs independently from more than one place, and an inconclusive result never withdraws a model that has been verified — only proof that it cannot run does. Models that disappear from fal.ai are confirmed over several complete checks before being marked gone, a pass in which an implausibly large part of the catalogue vanishes is treated as an API fault rather than a mass removal, and a model that returns is listed again automatically.

**Plugin-side health checks.** Installed models are re-checked quietly in the background, paced so the check never competes with the editor and never blocks. Renamed endpoints are migrated silently and their form rebuilt from the new schema. A model is treated as removed only when it is absent from a *complete* catalogue on consecutive checks; it is then surfaced with a one-click cleanup, and removed automatically after a grace period if it stays gone. A partial catalogue never convicts anything.

**News feed.** New models in the supported categories are announced automatically — once they can actually be added, not when they are first seen. The plugin displays these as compact banners with a "Today" badge and one-click install. The feed also carries manual entries (feature updates, maintenance notices, tips) published by the operator.

**Operator notifications.** The operator gets one daily report of customer activity, catalogue movement and pipeline health, with instant alerts for anything urgent. Quiet days collapse to a single line — length itself is the signal.

**OTA updates.** Error documentation, error message templates and endpoint migrations are delivered over-the-air from a remote manifest. Every file the channel delivers, remote configuration included, is verified against a pinned hash before it is applied, and the channel fails closed: on a mismatch or an unreachable file, the last verified copy — or, on a fresh install, the one bundled in the extension — serves instead.

**Self-learning validation.** When a model rejects media for a requirement its spec never declared — dimensions, file size, duration, aspect ratio — modelBridge remembers the limit and enforces it before the next attempt, on the media card and, for duration, in the form. The lesson is kept on disk as well as in the panel, so it survives a cache clear, and you're told once, the first time, that it was learned.

**Cost learning.** Estimates sharpen from your own usage — after a few generations with a model, your real metered costs refine the estimate for exactly the settings you use. A learned estimate that goes unused long enough retires rather than going stale.

**Generation time learning.** After a few generations with a model, its card shows a time estimate based on your own runs — and it keeps converging toward your actual experience.

**Background generation recovery.** If Premiere Pro restarts during an active generation, recovery data persists locally. On next panel open, watching resumes automatically with the original request ID; a recovery bar with a status check appears only for a run whose watch had already stopped.

**Model insights enrichment.** Editor-focused highlights for each model are generated in the cloud, cached locally, and refreshed quietly in the background — every model card tells you what the model is actually good at, in an editor's terms.

**Capability badges.** Model cards show what a model can do — HD, 4K, audio, LoRA support, extendable duration. Resolution is derived from the model's own spec, and extendable duration reads the spec first and a curated table second, so new models mostly arrive labelled without a manual list. Two badges are not yet spec-derived everywhere: on one surface the audio badge reads curated pricing data, and LoRA support falls back to the model's name.

**License revalidation.** Licences are verified server-side and re-checked regularly. A bounded offline allowance keeps an editor working through an outage on our side. Trial countdowns, a failed renewal while the payment provider retries, and other status transitions are handled without user action. Each licence state that needs the customer's attention — from an expired trial to a refunded order — reads the same wording on Generate, Agent and Settings, from one shared copy table.

**Exchange rates.** Cost displays support multiple currencies with live rates from a public API. Fallback defaults are used when the API is unreachable. Historical rates are stored per generation for accurate retrospective reporting.

**Thumbnail backfill.** Models without preview images are backfilled lazily in the background — concurrency-capped, non-blocking, with smooth transitions in the UI.

**Visibility-aware polling.** When the panel is hidden, non-critical background work pauses automatically. Generation polling, the backend keep-alive and a few bounded housekeeping tasks continue; everything else waits.

**Anonymous error telemetry.** Unrecognized errors produce anonymous reports (error type and source from a fixed list, HTTP status, whether it was retryable, plugin and Premiere version, platform — no message text, model, prompt, path, URL, key, timestamp or personal data). This is how new error types are discovered for documentation. Shown switched on in the setup guide since version 1.0.0; nothing is sent before Continue is pressed, and it can be switched off there or at any time in Settings.

**Support infrastructure.** Over 700 curated parameter explanations (hand-written, not auto-generated) provide contextual help via ⓘ icons. A field that has no curated explanation yet still gets a working ⓘ, linked to its entry in a parameter index on the docs site that is rebuilt from the live catalogue — so a new model's settings are explained from the day it arrives, and the curated text follows. About fifty documented error types (53 in the published error documentation, 2026-11-14) link to structured troubleshooting pages. Context-aware validation templates interpolate exact constraint values into error messages. Academy articles appear as contextual links on model cards — only when relevant to the selected model.

---

## Data Architecture

All user data — saved models, settings, generation history, cost logs, and learned constraints — is stored locally on the user's machine. None of it is stored on modelBridge servers. Generated media is downloaded directly from fal.ai to a local project folder.

The cloud operations layer stores catalog state (model availability, schema verification status) and licensing state (subscription status, device identifiers). It does not store user-generated content, prompts, API keys, or personal information beyond what is provided during license activation — or in a bug report or rating you explicitly choose to send.

API keys are stored locally and transmitted only to their own provider directly — the fal.ai key to fal.ai, the Anthropic key to Anthropic — never to modelBridge infrastructure. Anonymous error telemetry (error type, HTTP status, plugin and Premiere version) is shown switched on in the setup guide, sends nothing before the user presses Continue, and can be switched off there or at any time in Settings.

Full data architecture, retention policies, and third-party data flows are documented in the [Privacy Policy](https://docs.modelbridge.app/legal/privacy-policy/).

---

## Security & Privacy

User API keys are stored locally and used exclusively for direct communication with their own provider (fal.ai, and Anthropic for Agent Mode) — they never transit modelBridge infrastructure. The update channel is read-only and carries no user data.

A licence check carries the information needed to validate product access and support device management, including a device name made of the platform, the processor model and a random four-character tag (for example "macOS · Apple M2 Pro · 3f9a"). Since 2026-09-27 the device name no longer contains the computer's network name; a device activated by an earlier build keeps its old name, which did, until it is activated again. The service returns the subscription status and access information needed by the product. Licence checks are not used to transfer creative project content.

The local backend binds the loopback interface only and is not exposed to the network. Optional error reporting and usage measurement are shown switched on in the setup guide and can be switched off before anything is sent, or later in Settings. Error reports carry technical error context, filtered and truncated before they are sent.

For full data inventory, GDPR compliance measures, subprocessor list, and retention policies, see [PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md).

Comprehensive privacy coverage — including GDPR, CCPA, LGPD, UK GDPR, and AI Act positioning — is published at [docs.modelbridge.app/legal/privacy-policy/](https://docs.modelbridge.app/legal/privacy-policy/).

---

## Scalability

modelBridge is a client-side application — each installation runs its own panel and local backend. There is no shared server infrastructure that becomes a bottleneck as the user base grows.

**Panel and backend.** Run locally per user. Scaling is linear — each new user is an independent instance with no shared state.

**Cloud operations layer.** Runs on an edge runtime with automatic geographic distribution. Catalog monitoring and schema verification are read-heavy workloads against fal.ai's public APIs, bounded by the size of the catalog (about 1,200 models in the live catalogue in November 2026), not by the number of modelBridge users.

**OTA delivery.** Served from a global CDN. Static files, with no modelBridge compute per request.

**Known limits.** Background generations queue at the fal.ai API level, not locally. Generation runs on each editor's own fal.ai account, so the limits that apply are that account's, not a shared modelBridge quota. Current scale and functional constraints are documented in [Known Limitations](https://docs.modelbridge.app/reference/limitations/).

---

## Dependencies & Licensing

### Proprietary code

The modelBridge codebase — panel JavaScript, CSS design system, cloud operations worker, schema parsing engine, cost estimation system, error handling pipeline, and all documentation — is proprietary. 74 of Agent Mode's 135 tools (counted 2026-11-24) are Premiere Pro control tools vendored from the open-source `leancoderkavy/premiere-pro-mcp` project (MIT); see [NOTICE.md](NOTICE.md) for attribution.

### External service dependencies

| Dependency | Role | License / Terms |
|---|---|---|
| fal.ai API | AI model generation, schema, pricing, catalog | Commercial API — user authenticates with their own key |
| Lemon Squeezy | Merchant of Record: subscription billing, license validation | Commercial SaaS — webhook integration |
| GitHub raw content | OTA delivery — error docs, error copy, endpoint migrations and remote configuration, each verified against a pinned hash | Public CDN — read-only, no user data sent |
| Anthropic API | Agent Mode, and Enhance when an Anthropic key is present | Commercial API — user authenticates with their own key |
| Cloudflare Workers | modelBridge's own service: licence checks, catalog monitoring, news feed, support reports | Operated by modelBridge |

The full list of services that receive data, with what each receives, is the subprocessor list in [PRIVACY_AND_COMPLIANCE.md](PRIVACY_AND_COMPLIANCE.md) §4.

### Local runtime dependencies

| Dependency | Role | License |
|---|---|---|
| Node.js + Express | Local backend server | MIT |
| FFmpeg / FFprobe | Media extraction (video frames, audio, metadata) | LGPL — bundled as LGPL-only builds, invoked as external processes |
| Sharp | Image processing (thumbnails, format conversion) | Apache-2.0 |
| libvips | Image processing library used by Sharp | LGPL-3.0-or-later (dynamically linked, user-replaceable) |

FFmpeg and FFprobe ship with the plugin as **LGPL-only builds** — compiled without the GPL and non-free components, verified from the build configuration of each binary — and are invoked as separate processes, never linked. libvips is dynamically linked and user-replaceable. Complete attributions, licence texts and build provenance ship with the plugin, including the full inventory of every other component and its licence.

The macOS binaries are built from source rather than downloaded, and the build is a deliberately small one: `--disable-everything` with an explicit allowlist of demuxers, decoders, encoders, muxers and filters, `--disable-autodetect`, and **`--disable-network`** — leaving `file` and `pipe` as the only two protocols compiled in. That bundled macOS binary has no network code in it at all.

**The guarantee is about that binary, not about every ffmpeg the product may end up running,** and the distinction is worth stating precisely because it is the kind that gets rounded off. Two cases fall outside it. No Windows build ships today — the product is macOS-only — and when one does, its binaries are planned as a downloaded LGPL release build rather than one we compile, a general-purpose build with network protocols present. And if the bundled binaries are missing, the backend falls back to a copy already installed on the machine — the user's own ffmpeg, built by someone else, about which no build claim can be made. Each binary's origin, full configure string and SHA-256 are recorded in `bin/ffmpeg-provenance.json`, which ships inside the extension, so which case you are in is checkable without trusting this document.

In every case ffmpeg is invoked on local file paths only, as a separate process, and nothing in the product asks it to open a URL. The narrower claim — that the macOS build *cannot* reach the network even if asked — holds for the bundled macOS build alone. See [NOTICE.md](NOTICE.md) for the linked libraries these builds carry.

### Proprietary components

- UI rendering and schema-driven interface generation
- Field classification and input parsing
- Cost estimation engine
- Self-learning validation system
- Error translation and handling pipeline
- OTA update infrastructure
- Cloud operations worker (catalog monitoring, insights, licensing)
- All documentation pages

---

## Platform Roadmap

Adobe is transitioning Premiere Pro extensions from CEP to UXP. modelBridge is designed with this migration in mind — not as a future project, but as an active constraint on all current development.

**Migration plan.** A detailed migration plan is in place, covering interface contracts, an API parity mapping between ExtendScript and UXP equivalents, and a phased timeline. Adapter layers isolate platform-specific code where that is possible — three surfaces (path construction, external URLs, credential storage) are at zero remaining direct calls; host calls in the panel's scripts are at 82 %; file I/O at 56 % by acquisition site, all measured 2026-10-21. One surface has no adapter at all: 400 `localStorage` calls across 55 files (2026-10-21; 384 across 50 on 2026-09-01). UXP provides a synchronous `localStorage`, but not access to the data our CEP panel has stored, so that surface is a data move rather than a rewrite of every call. This sentence said until 2026-11-16 that UXP does not provide it; that was wrong.

**It is a reconstruction, not a port, and two parts of it cannot be adapted at all.** UXP can launch a process but cannot pass it arguments or read its output, so the local backend — 13 of whose routes invoke FFmpeg or FFprobe — has to become a separately installed companion application. The panel's 146 script tags (counted 2026-10-21; 114 on 2026-08-30) do not have to become a bundle — bundling is optional under UXP — but the globals, load order and inline handlers they rely on have to be reviewed. At least 22 user-facing timeline operations depend on Premiere's unsupported QE DOM, with no supported equivalent today (counted 2026-08-19). Our own parity table maps 23 of about 380 host functions, about 6 % (2026-10-21). The full measurements, the open questions to Adobe, and the places our own early decisions were wrong are in [UXP_MIGRATION.md](UXP_MIGRATION.md).

**The support window, as Adobe states it.** Adobe's September 2026 announcement places CEP retirement at the end of 2029, with new CEP submissions ending in December 2027 and CEP disabled by default in December 2028. This paragraph previously quoted Adobe's PProPanel sample documentation ("support both for a calendar year") and planned against a window ending around November 2026; the announcement supersedes that reading. See [UXP_MIGRATION.md](UXP_MIGRATION.md) §7.

**CEP works in Premiere Pro 26.3.2, measured 2026-09-01.** A widely-linked bug report against a different extension claims CEP extensions no longer load in Premiere 2026. We ran the full chain against 26.3.2 — panel loads, backend spawns, a generation completes, the result imports to the timeline through the ExtendScript bridge — and all four steps work, which makes that report an installation-path problem rather than a platform removal. This is one version on one platform: support can be withdrawn in a point release, and a version that still loads CEP is not a commitment that the next one will. It removes a false alarm; it does not extend the window. On 2026-10-21 the development panel was running in Premiere Pro 26.5.1.

**Migration-first development policy.** New code follows migration-aware rules: file system access through a storage abstraction, Premiere Pro communication through the host adapter, no new direct platform calls. The policy also requires new storage and host APIs to be async-first, matching UXP's async model even though CEP allows synchronous calls — and the storage adapter itself was built synchronous, in violation of that rule, which turns its eventual replacement into a signature change at every call site.

**How much of that policy is actually enforced, measured 2026-08-30.** This paragraph previously said the rules were "enforced on every contribution". They are not, and the measurement is unambiguous: seventeen new direct file-system calls entered the panel in the eleven days after the last audit. About thirty commit guards run on every commit today (seventeen on 2026-08-30), and none of them is a general guard on direct platform calls. What exists is one *subsystem-scoped* guard — the newest layer in the tree is mechanically prevented from touching the file system or the host outside a single named adapter file, which is why that layer did not drift. So the honest statement is: the policy is written down, one subsystem enforces it mechanically and stays clean, and everywhere else it depends on the author remembering. Both our own errors here — the synchronous storage adapter, and a 384-call-site `localStorage` dependency we were not counting at all — are reported in [UXP_MIGRATION.md](UXP_MIGRATION.md) alongside what the policy did buy.

**Adobe's local MCP integrations.** On 2026-11-10 Adobe previewed local MCP integrations that let a third-party agent work directly in Premiere and other Creative Cloud apps, with a private beta announced for early 2027. They may give some of the operations that depend on the QE DOM today a supported route. The plan to connect Agent Mode to them is in [ROADMAP.md](ROADMAP.md#adobes-local-mcp-integrations-for-premiere).

**Planned modernization.** Introducing a module bundler (our choice, not a UXP requirement), running the panel's test suites in CI (today CI runs the catalogue verification, the ExtendScript ES3 guard, the dual-mode offline suites and the parameter-coverage and docs-link checks, not the whole harness), and incremental type annotations.

For the product roadmap (Agent Mode expansion and Adobe's local MCP integrations, Team Cost Intelligence, Enterprise features), see [ROADMAP.md](ROADMAP.md).

---

## Further Reading

- [What is modelBridge](https://docs.modelbridge.app/what-is-modelbridge/) — product overview and comparison
- [Schema-Driven UI](https://docs.modelbridge.app/features/schema-driven-ui/) — how the adaptive interface works
- [Cost Estimation](https://docs.modelbridge.app/models/costs/) — confidence tiers and pricing sources
- [Self-Learning Validation](https://docs.modelbridge.app/reference/self-learning/) — how constraints are learned and enforced
- [Error Handling](https://docs.modelbridge.app/troubleshooting/how-errors-work/) — translation pipeline and user-facing messages
- [Privacy Policy](https://docs.modelbridge.app/legal/privacy-policy/) — full data architecture, GDPR/CCPA/LGPD compliance
- [Terms & Conditions](https://docs.modelbridge.app/legal/terms-and-conditions/) — IP, liability, AI Act positioning
- [Compatibility](https://docs.modelbridge.app/reference/compatibility/) — supported platforms and requirements
- [Known Limitations](https://docs.modelbridge.app/reference/limitations/) — honest list of current constraints
- [Built for reliability](RELIABILITY.md) — catalogue verification, the interpretation sweep, guards and deploy provenance, with measured figures
- [CEP → UXP migration](UXP_MIGRATION.md) — what is measured, what cannot be adapted, and the open questions to Adobe
- [Privacy & Compliance](PRIVACY_AND_COMPLIANCE.md) — data inventory, GDPR measures, subprocessor list
- [Roadmap](ROADMAP.md) — Team Cost Intelligence, Agent Mode expansion, Enterprise features
