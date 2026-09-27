# Privacy & Compliance

Privacy posture for modelBridge.app — data categories, recipients, and user controls.

*This is a public technical overview and our own self-assessment, not a legal opinion, a certification, or a statement of verified compliance. The customer-facing privacy policy is the governing source for current retention information, request procedures, and user-rights information.*

**Revised 2026-09-24** against two internal audits — a privacy and security pass (2026-08-29) and a media-exfiltration pass (2026-09-07) — plus a re-read of the shipping code. Twenty statements in the previous version were wrong, and the ones that were wrong in an absolute form have been replaced rather than qualified: no cookies, no fingerprinting, no hardware identifier, "everything we hold", the device name, the erasure scope, the telemetry field list, and the claim that no source directory ever reaches Anthropic. Google is named as a recipient for the first time. Each correction says what the document used to claim, because a compliance reference that quietly changes its answer is worth less than one that shows the change.

---

## 1. Architecture Overview — Privacy by Design

modelBridge is a local-first application. The plugin runs entirely inside Adobe Premiere Pro as a CEP panel extension. There is no modelBridge server sitting between the editor and fal.ai. User prompts, media files, and generated content flow directly from the user's device to fal.ai's API — authenticated with the user's own API key — and back. modelBridge infrastructure never sees, stores, or proxies this content.

All user preferences, generation history, API keys, installed models, cost logs, and learned constraints are stored locally on the user's machine. No modelBridge-operated database holds user-generated content or creative assets.

modelBridge uses cloud services to support licence validation, catalog monitoring, the in-plugin news feed, model insights, and optional error reporting and analytics.

Mobile Preview is a built capability that is currently disabled pending further review and validation. It is designed to support previewing provider-generated results without transferring source media through ModelBridge.

One thing reaches us because you send it, and it carries more than this document previously claimed: a bug report. It carries your message, your name and email if you type them, the three most recent error messages from your session, a technical model packet, and any screenshots you attach — **with their original filenames**. Until 2026-09-20 the report showed a field-by-field preview and offered a tick-box for including your prompt; both were removed. The prompt is therefore never included, and nothing else in the report can be struck before sending. Reports are retained 180 days.

**One model outside this architecture sees your prompt.** The ✨ Enhance button next to a prompt field sends that prompt — and, when media is attached, up to four sampled frames of it — to `fal-ai/any-llm`, which runs it on **Google's `gemini-2.5-flash-lite`**. It runs on your own fal.ai key and your own fal.ai credit, and only when you press the button. The full flow, including when Anthropic is used instead, is in §4.

```
┌─────────────────────────────────────────────────────────┐
│  User's Machine                                         │
│                                                         │
│  ┌───────────────────────────────────────┐              │
│  │  Adobe Premiere Pro                   │              │
│  │  ┌─────────────────────────────────┐  │              │
│  │  │  modelBridge CEP Panel          │  │              │
│  │  │  (all user data stored here)    │  │              │
│  │  └──────────┬──────────────────────┘  │              │
│  │             │                         │              │
│  │  ┌──────────┴──────────────────────┐  │              │
│  │  │  Local Node.js Backend          │  │              │
│  │  │  (local loopback only — see §2) │  │              │
│  │  └─────────────────────────────────┘  │              │
│  └───────────────────────────────────────┘              │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
             ▼              ▼              ▼
     ┌───────────┐  ┌──────────────┐  ┌───────────────┐
     │  fal.ai   │  │  Cloudflare  │  │  LemonSqueezy │
     │           │  │  Worker      │  │               │
     │ Prompts,  │  │ Error telem. │  │ License key   │
     │ media,    │  │ License val. │  │ + instance ID │
     │ generated │  │ Catalog mon. │  │               │
     │ content   │  │              │  │               │
     │           │  │ (no prompts, │  │ (no prompts,  │
     │ (user's   │  │  no media,   │  │  no media,    │
     │  own key) │  │  no API keys)│  │  no API keys) │
     └───────────┘  └──────────────┘  └───────────────┘
             │              │
             ▼              ▼
     User's API key   GitHub CDN (read-only)
     never leaves      Remote config, error docs,
     this path         pricing supplements
```

The local backend is not a media-only component, and the diagram's fal.ai column is
not the whole of what fal.ai carries. The backend also relays licence checks to
ModelBridge services, fetches currency rates from a public exchange-rate source, and
— for Enhance — can use a provider-hosted language model operated by Google (§4).
Each is described at the appropriate level in the sections below rather than in the
diagram.

---

## 2. Data categories

This section summarises the kinds of data the product handles, where they are held,
and the controls available to you. The customer-facing privacy policy is the
governing source for current retention information, request procedures, and
user-rights information.

| Data category | Where it lives | Your control |
|---|---|---|
| **Provider API keys** | Your device | Manage locally in the product settings |
| **Generation history, cost history, installed models, and product settings** | Your device | Manage, reset, or remove locally in the product |
| **Optional local analysis data** | Your device | Manage or remove locally |
| **Optional error reports** | ModelBridge services, when enabled | Disabled by default; manage in Privacy settings |
| **Optional usage measurements** | ModelBridge services, when enabled | Disabled by default; manage in Privacy settings |
| **Device and installation information** | Your device and ModelBridge services where needed for licensing and device management | Contact us through the customer privacy process |
| **Licence and subscription information** | ModelBridge services and the payment provider | Manage product access locally; contact us through the customer privacy process |
| **Feedback and satisfaction ratings** | ModelBridge services, when you choose to submit them | Do not submit feedback; contact us through the customer privacy process |
| **Bug reports and attachments** | ModelBridge services and service providers used to deliver support communications | Choose what to submit; contact us through the customer privacy process |
| **Mobile Preview** | Currently disabled pending further review and validation | — |
| **Network and service-security information** | ModelBridge services | Used to protect the service and investigate abuse |

### Device and analytics identifiers

The product uses separate identifiers for separate purposes.

**An installation identifier is used to support licensing and device management.**
The raw machine identifier does not leave the device. Associated licence and
activation data can be addressed through the customer privacy process.

**Optional usage measurement uses a separate identifier.** It is used only while
optional usage measurement is enabled and is not used to associate usage
measurements with a licence or provider account.

The customer-facing privacy policy contains the governing information about these
data categories and the available privacy controls.

### Licence checks

A licence check carries the information needed to validate product access and support
device management. A device name can be included; because device names often reflect
the computer hostname, they can contain personal information.

The service returns the subscription status and access information needed by the
product. Licence checks are not used to transfer creative project content.

### What modelBridge's own servers never receive

The scope is the heading, and it is deliberate. Several of these travel to the two services you bring your own key for — your prompt goes to fal.ai on every generation, filenames go to Anthropic on every agent turn — and that is the product working as described in §4 and §6. What follows is the list of things that never reach infrastructure operated by modelBridge, which is the only infrastructure we control and the only thing this document can promise about.

- Prompts, negative prompts, or any creative text input — except in a bug report you write and send
- Generated media, thumbnails, or preview content
- File paths. **Filenames are a narrower promise:** a screenshot you attach to a bug report keeps its original filename
- fal.ai or Anthropic API keys
- Search queries within the plugin
- Browsing behavior
- Third-party analytics SDK data (no Google Analytics, Segment, Mixpanel, etc.)
- Tracking pixels

**Three claims that used to be on this list and are not true, removed rather than softened:**

- *"No cookies beyond localStorage."* Removed because Mobile Preview's phone page has set a first-party cookie. It is named here because the earlier absolute claim was wrong, not because the mechanism belongs in this document.
- *"No fingerprinting."* Removed because the identifier used for optional usage measurement does not support that absolute claim. The customer-facing privacy policy describes the identifier and the controls over it.
- *"No hardware identifier."* Removed because the installation identifier is derived from the device. The raw machine identifier does not leave the device.

One thing does reach us because you send it: a bug report (see §1). It carries your message, any contact details you type, the last three error messages, a model packet and any screenshots — and, since 2026-09-20, it has no preview step and no prompt tick-box, so the prompt is never included and nothing else can be struck.

---

## 3. Privacy practices

*A public technical overview and our own self-assessment. The customer-facing privacy
policy is the governing source for current retention information, request procedures,
and user-rights information.*

### Optional error reporting

Disabled by default. When you enable it, it carries technical error context so that a
failure the product does not yet explain properly can be recognised and given a proper
message. It is not designed to carry creative content, file paths, or a user
identifier, and message text is filtered and truncated before it is sent.

### Retention

Data held on your own device stays until you clear it. Data held by ModelBridge
services falls into categories with different retention periods — licensing and
subscription information, support communications, feedback, and diagnostic and
security information. A retention period elapsing is not the same thing as a privacy
request being fulfilled, which is why the two are described separately. The
customer-facing privacy policy holds the current periods.

### A rating cannot be looked up, and that is the same fact as its unlinkability

A satisfaction rating is not submitted with information that identifies you or your
licence, so there is nothing to look one up by, and a licence-based request cannot
reach it. A specific comment can be removed by quoting its wording to
info@modelbridge.app.

This is a consequence of the design rather than a shortfall in it: the property that
keeps an answer unlinkable is the property that makes it unfindable.

### Data requests and erasure

Verified privacy requests are handled through the customer privacy process. Where a
request is verified, we remove the applicable licence- and account-linked operational
data and provide a record of the outcome.

Some support, diagnostic, billing-provider, aggregate, and security-related records
may follow separate retention, legal, or fraud-prevention requirements. Where an
automated process cannot safely complete a request, it is handled through a manual
review path.

The customer-facing privacy policy is the governing source for current retention,
request procedures, and user-rights information.

### Two separate optional streams

Optional error reporting and optional usage measurement are independent, and each stays
disabled until you enable it. Neither is designed to carry creative content, and
content-bearing fields are excluded before anything is sent and again on receipt.

### No Third-Party Behavioral Data

- No analytics SDKs (Google Analytics, Segment, Mixpanel, Amplitude)
- No tracking pixels or web beacons
- No cross-site tracking
- No session replay or heatmap tools
- No advertising identifiers and no data sold, shared or brokered

Two lines that were in this list and have been removed as untrue: "no cross-site tracking
**or fingerprinting**" and "no cookies beyond browser localStorage". Both were absolute
claims the product does not support, so both were removed rather than qualified; the
customer-facing privacy policy is the governing description.

---

## 4. Subprocessor List

| Processor | Role | Data Received | DPA Status |
|---|---|---|---|
| **Cloudflare** (Workers + KV) | Service hosting and storage | Everything in the §2 categories that is not held on your device: licence and subscription information including a device name, the payment provider's subscription messages (which carry your name and email), bug reports with contact details and attachments, feedback, optional usage measurements, optional error reports, and network information | Cloudflare DPA (standard) |
| **LemonSqueezy** (Lemon Squeezy Inc.) | Merchant of Record — payment processing, subscription management, license validation | License key, customer email, instance ID including your device name, payment details | **Independent controller** (Art. 4(7)), not a processor for modelBridge: LemonSqueezy is Merchant of Record and determines its own purposes for payment data. We never receive your payment details |
| **fal.ai** (fal Inc.) | AI model generation, schema/pricing APIs, and the LLM behind Enhance | User prompts, media files, generated content (direct from user device, authenticated with user's own API key). Also the Enhance payload described below | Direct controller-to-controller relationship — user contracts directly with fal.ai |
| **Google** (via fal.ai) | The model that runs Enhance — `google/gemini-2.5-flash-lite`, reached through `fal-ai/any-llm` | Your prompt text, the model's name and category, the configured duration/aspect ratio/resolution, and — when media is attached — up to four sampled frames. Only when you press Enhance. See the flow below | Reached as part of fal.ai's `any-llm` endpoint on the user's own fal.ai key; the user's relationship is with fal.ai, which selects Google as the upstream model provider |
| **Anthropic** (Agent Mode) | Conversational AI for timeline editing | Chat messages; project metadata — clip and sequence names, filenames, timecodes, effect settings, marker names and comments, dailies XMP, camera make/model/date, the client name in Client-project mode, your alias and any custom instructions; frames of a selected clip; media in the Generate tab when you ask about it; and **some absolute paths**: media paths are masked at a single choke point, but the project's own path, whole-disk search results, template folders and anything inside raw XMP are not (see §6). Direct from the user's device, authenticated with the user's own API key | Direct controller-to-controller relationship — user contracts directly with Anthropic |
| **Anthropic** (model insights) | Model insights enrichment (Worker background task) | Public model metadata only — no user content | No user PII processed |
| **Pushover** (Superblock LLC) | Developer operational alerts | Operational counts (catalog, errors, health) and subscription events identified by licence key id and subscription id — never an email address, a name or any other identifying data. **One exception, added 2026-08-28:** the free-text comment from a satisfaction rating, which carries no identifier of any kind and cannot be traced to an account | Pseudonymous identifiers only; the rating comment is unlinked user-written text |
| **GitHub** (Microsoft) | Remote config CDN (read-only) | None — GET requests only, no user data sent | No user data processed |
| **Resend** (Resend, Inc.) | Email delivery of the reports you send us | For the bug-report email flow documented here, Resend receives the report text, any supplied reply email address, and attached screenshots with their original filenames. This flow is not designed to send prompts, generated media, project data, or licence keys to Resend | Processor — characterisation and DPA status pending legal review |

### fal.ai Data Flow Note

modelBridge does not act as a data processor for fal.ai generation traffic. The user's device communicates directly with fal.ai's API using the user's own API key. modelBridge infrastructure has no access to this communication channel. The user's relationship with fal.ai is governed by fal.ai's own Terms of Service and Privacy Policy.

### Enhance — the one path where a model we did not name until now reads your prompt

Pressing ✨ Enhance rewrites the prompt in the field. Which model does the rewriting
depends on one thing, your Anthropic key, and the branch matters because the recipients
differ:

| When you press Enhance | Who reads the prompt and any frames |
|---|---|
| Media attached **and** an Anthropic key is present | Anthropic, on your own Anthropic key. Google is not involved — unless Anthropic returns nothing or errors, in which case the request falls through to the row below rather than failing |
| Media attached, **no** Anthropic key (the ordinary case — that key is only needed for Agent Mode) | `fal-ai/any-llm/vision` on your own fal.ai key, running **Google's `gemini-2.5-flash-lite`** |
| **No media attached** — a text-only rewrite | `fal-ai/any-llm` on your own fal.ai key, running the same Google model |

What travels: the prompt text as typed; the model's display name and category; the
configured duration, aspect ratio, resolution or image size; and, when media is attached,
at most four images from at most three media slots — up to two sampled frames per video,
long edge 1568 px, sent inline in the request body rather than as links. Each image is
labelled by its slot role and field name, for example `[start (image_url)]`. **No
filenames, no file paths and no project data are included.** The request needs an active
subscription and a fal.ai key, spends your own fal.ai credit, and happens only on the
press.

Some provider-specific processing disclosures are not yet surfaced at every in-product
decision point. Improving that transparency is tracked product work.

---

## 5. Analytics Architecture

### Event Taxonomy (editorial events)

| Event | Trigger | Metadata |
|---|---|---|
| `gen_start` | User clicks Generate | Model ID |
| `gen_done` | Generation completes | Model ID, cost (USD), duration |
| `gen_accept` | Result imported from preview | Model ID, count |
| `gen_fail` | Generation fails | Model ID, failure source |
| `gen_abandon` | User dismisses a result | Model ID, source |
| `model_sel` | User selects a model | Model ID |
| `dual_use` | User activates Dual Mode | Primary + secondary model IDs |
| `dual_gen` | Dual Mode generation starts | Primary + secondary model IDs |
| `search` | Category search performed | Category filter (no search text) |
| `cat_browse` | Catalog browsed | Category |
| `cost_view` | Costs tab opened | — |
| `settings_change` | Settings changed | Setting key **and its new value** — so a privacy toggle reports its own position, including the one that enables this stream |

Corrected 2026-09-24 in both directions: `gen_start` carries no category and `model_sel`
no source, which this table claimed; `gen_done` also carries a duration, `gen_abandon` a
source, `cat_browse` a category, and `settings_change` a value, which it did not. Four of
the twelve — `dual_gen`, `cat_browse`, `cost_view` and `settings_change` — are emitted by
the plugin and **dropped by the Worker's own switch**, so they are sent and not stored.

### How measurements are aggregated

Events are batched on the machine, sent with the identifier described in §2, aggregated
per installation, and the raw events discarded. A daily job compiles a global aggregate
that contains no per-user data. An operator-only view of that aggregate exists and is
authenticated.

---

## 6. Agent Mode Data Handling

Agent Mode allows users to edit the Premiere Pro timeline via natural language chat, powered by Anthropic's Claude API.

**User's own API key.** The user enters their own Anthropic API key in Settings. It is stored locally — in the local backend's environment file, with only a short display fragment in `localStorage` — and is never transmitted to modelBridge infrastructure. All conversation traffic flows directly between the plugin (running locally) and Anthropic's API.

**What reaches Anthropic, as a rule rather than a list.** Two sentences govern every path, present and future:

1. **The agent never sends images on its own initiative unless the user has allowed it.** One setting governs that — Settings → Privacy → "Timeline frames to the agent". It covers the frames that accompany messages while a clip is selected (3–12 depending on clip length, and **asked before the first send** — nothing is sent until you answer) and the agent's ability to read the Generate tab's media card by itself. NDA mode blocks it whatever you answered. With it off, the agent is told what is in the card — slot, role, filename, media type — and is not shown it, through the same coverage contract that stops it describing anything it did not see. One property worth knowing: the frames are sampled across the **whole source file**, not the part you trimmed into the timeline, so a three-second selection inside a long interview sends frames from across the whole interview.
2. **Anything the user activates that is about a piece of media sends that media.** Asking the agent to watch a clip sends sampled frames of it — up to about a hundred for a long clip, with a cost dialog only above $0.20; pressing Enhance on a prompt sends the media attached to that prompt, to Anthropic or to Google depending on the branch in §4.

*This is written as a rule because the previous version was an enumeration, and an enumeration of exceptions goes false the moment another tool learns to read the media card — which is exactly how it broke.*

**Project metadata travels on every turn**, and more of it than this document used to list: clip and sequence names, filenames, timecodes, effect settings, marker names and comments verbatim, dailies XMP fields, camera make, model and creation time, the client name if you are in Client-project mode, your alias, and any custom instructions you saved.

**Paths: what is masked and what is not.** Until 2026-09-24 this section said source directories do not travel. That is true of the media path keys — `sourceFile`, `mediaPath` and `proxyPath` are swapped for an opaque session-scoped reference at a single choke point and resolved back locally. It is **not** true as a general statement, because the masking is keyed on those names: the project's own path travels absolute in a project overview, a disk search for offline media returns up to twenty absolute candidate paths including external volume names, template lookups return paths under your data directory (which contains your OS username), and anything embedded in raw XMP text travels as written. The narrow claim holds; the absolute one did not, so it has been replaced rather than qualified.

**No conversation data collected — with one local exception.** modelBridge does not intercept, store, proxy, or log Agent Mode conversation content on any server of ours: no prompts, no Claude responses, no tool calls, no timeline edit commands. On your own disk there is one exception: when you ask the agent to watch a clip, the sampled frames, the absolute media path, the prompt and the model's reply are written to `uploads/scan-logs/` and swept after seven days. A generation triggered from Agent Mode emits the same anonymous generation events (`gen_start`, `gen_done`, `gen_fail`) as one started from the Generate button — subject to the same opt-in and NEVER_TRANSMIT rules. Agent Mode emits no events of its own to our servers; it does write to the local usage store, which is never transmitted.

**Customizable system instructions.** Users can configure custom system instructions for the Agent. These are stored locally only and included in requests sent directly to Anthropic's API. modelBridge infrastructure never sees them.

**Anthropic's privacy policy applies.** The user's interaction with Claude is governed by Anthropic's Usage Policy and Privacy Policy. modelBridge is not a party to this data flow.

---

## 7. Rights and Contact

**Privacy Policy:** [docs.modelbridge.app/legal/privacy-policy](https://docs.modelbridge.app/legal/privacy-policy/)
**Terms & Conditions:** [docs.modelbridge.app/legal/terms-and-conditions](https://docs.modelbridge.app/legal/terms-and-conditions/)

**Data Controller:**
Niklaz Hallberg
Stockholm, Sweden
info@modelbridge.app

**Supervisory Authority:**
Integritetsskyddsmyndigheten (IMY) — Swedish Authority for Privacy Protection
imy.se

**Data access and erasure requests:** email info@modelbridge.app from the address associated with your purchase, or include your order reference. Requests are handled through the customer privacy process described in the privacy policy.

**Local Data Deletion:**
All locally stored data (generation history, cost logs, installed models, API keys, settings, learned constraints) can be cleared from within the plugin via Settings → Reset, or by uninstalling the extension.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — where each data flow is implemented · [NOTICE](NOTICE.md) — third-party components
