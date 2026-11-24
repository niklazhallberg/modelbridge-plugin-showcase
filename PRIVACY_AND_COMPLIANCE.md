# Privacy & Compliance

*An engineering overview of modelBridge.app's data flows, and our own self-assessment: not a legal opinion, a certification or a statement of verified compliance. The customer-facing [privacy policy](https://docs.modelbridge.app/legal/privacy-policy/) governs. It holds retention periods, lawful bases, request procedures and user rights, which this document does not repeat. Where the two differ, the policy is right.*

Last checked against the shipping product and the privacy policy: 2026-11-24.

---

## 1. Architecture Overview — Privacy by Design

modelBridge is local-first. The plugin runs inside Adobe Premiere Pro as a CEP panel extension, and no modelBridge server sits between the editor and fal.ai. Prompts, media and generated content go directly from the user's device to fal.ai's API on the user's own key, and back. modelBridge infrastructure does not see, store or proxy them. The one exception is opt-in: with *Live preview in mobile* open, the link to each new result on fal.ai's servers reaches modelBridge's preview service (below), but not the media.

Preferences, generation history (including prompts), API keys, installed models, cost logs and learned constraints stay on the user's machine. The fal.ai and Anthropic keys sit unencrypted in an environment file in the plugin's data folder, readable by anyone with access to the user account.

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
│  │  │  (loopback only — SECURITY.md)  │  │              │
│  │  └─────────────────────────────────┘  │              │
│  └───────────────────────────────────────┘              │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
             ▼              ▼              ▼
     ┌───────────┐  ┌──────────────┐  ┌───────────────┐
     │  fal.ai   │  │  Cloudflare  │  │  LemonSqueezy │
     │           │  │  Worker      │  │               │
     │ Prompts,  │  │ Error telem. │  │ License key,  │
     │ media,    │  │ License val. │  │ device name — │
     │ generated │  │ Catalog mon. │  │ relayed by the│
     │ content   │  │              │  │ Worker        │
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

The diagram shows the main paths only. Agent Mode goes directly to Anthropic (§6), and Enhance to Anthropic or to a Google model through fal.ai (§4). The plugin never calls Lemon Squeezy itself; the browser reaches it only for checkout and the customer portal. Exchange rates (frankfurter.dev) and model thumbnails (fal.ai's media hosts, Google Cloud Storage, X) are fetched with no identifier, though each host sees the IP address.

### Live preview in mobile (Mobile Preview)

Opening *Live preview in mobile* under a result shows a QR code; each new result then appears on the phone that scans it.

- **Opt-in.** The local backend sends nothing until the feature is opened, and nothing without an active subscription or trial, or while NDA mode is on.
- **Per result:** the link to the result on fal.ai's servers, the media type, the model's name and category, and the time sent. Never source footage, the project or the prompt; the phone loads the media from fal.ai.
- **The link** is random, not derived from the licence or the machine, and read-only. Anyone holding it sees what is sent to it. Mobile preview off in Settings → Privacy revokes it at once.
- **One cookie, on the preview site only:** `mb_feed` (first-party, HttpOnly, Secure, 7 days) holds the link so a Home Screen shortcut reopens the right page. The Premiere plugin sets no cookies.

### Bug reports

A bug report reaches us because the user sends it. The policy lists its contents. Three engineering details: attached screenshots (up to three) keep their **original filenames**; the licence is identified by key ID and activation ID, never the key, the licence email or a device identifier; and paths, links, prompts and API keys are removed from error text by pattern filters, which remove only what they recognise. There is no preview step or per-field opt-out. A copy is emailed to the support mailbox (§4).

---

## 2. Data categories

Retention for each server-side category is in the policy's [What we receive and keep](https://docs.modelbridge.app/legal/privacy-policy/#what-we-receive-and-keep) section.

| Data category | Where it lives | Control |
|---|---|---|
| **Provider API keys** | Your device | Settings |
| **Generation history, cost history, installed models, settings** | Your device | Settings → Data management (§7) |
| **Optional local analysis data** | Your device | Manage or remove locally |
| **Optional error reports** and **usage measurements** | modelBridge services, when on | Each has its own switch. The setup guide shows both on; nothing is sent before Continue; switch off there or in Settings → Privacy |
| **Device and installation information** | Your device; modelBridge services for licensing | Erasure request (§3) |
| **Licence and subscription information** | modelBridge services and the payment provider | Erasure request (§3) |
| **Free-trial history** | modelBridge services, by computer (a keyed hash of the device ID) | Kept after erasure by design; see the policy |
| **Ratings, bug reports and attachments** | modelBridge services; bug reports also in the support mailbox | You choose what to send; email request (§3) |
| **Live preview in mobile** | modelBridge services, after you open it (§1) | Off until opened; Mobile preview off in Settings → Privacy; NDA mode |
| **IP address** | Seen by Cloudflare on every request; held only as a short-lived abuse-limiting key, not logged | — |

### Device and analytics identifiers

**The installation (device) identifier** supports licensing and device management. It is a one-way hash of the computer's hardware identifier, so it survives a reinstall or cleared plugin data. The raw hardware identifier does not leave the device.

**The analytics identifier** is separate: a short hash of the user agent, screen size, time zone and language reported by the panel's browser engine. It is kept locally and comes back the same after the panel's data is cleared. It is sent only while usage measurement is on, and is not joined to a licence or provider account. Error reporting carries no identifier.

### Licence checks

A licence check carries the licence key, the installation identifier and a device name: platform, processor model and a random four-character tag, for example "macOS · Apple M2 Pro · 3f9a". The device name goes on to the payment provider so a licence's computers can be told apart. Since 2026-09-27 it holds no network name; a device activated earlier keeps its old name until reactivated. No creative content travels with a check.

### What modelBridge's own servers never receive

The scope is the heading. Several items go to the services the user brings a key for, such as the prompt to fal.ai and filenames to Anthropic (§4, §6). This list covers only infrastructure modelBridge operates.

- Prompts, negative prompts or other creative text, except in a bug report the user writes and sends
- Generated media or thumbnails. **Links are narrower:** with *Live preview in mobile* on, result links on fal.ai's servers reach the preview service (§1)
- File paths. **Filenames are narrower:** a screenshot attached to a bug report keeps its filename
- fal.ai or Anthropic API keys
- In-plugin search queries, or browsing behaviour
- Third-party analytics SDK data or tracking pixels

The list does not claim "no cookies", "no fingerprinting" or "no hardware identifier", because none holds: the preview page sets one cookie (§1), the analytics identifier is a hash of browser properties, and the installation identifier derives from the hardware identifier.

---

## 3. Privacy practices

**Two separate optional streams.** Error reporting and usage measurement are independent, each with its own switch (§2). Error reporting carries the error's type and source from a fixed list, the HTTP status, whether it was retryable, plugin and Premiere versions and the platform: no message text, model, creative content, file path or identifier. Usage measurement is in §5.

**Retention.** Device data stays until the user deletes it (§7). Server-side retention is in the policy's [What we receive and keep](https://docs.modelbridge.app/legal/privacy-policy/#what-we-receive-and-keep) table.

**Requests and erasure.** The policy's [Your rights](https://docs.modelbridge.app/legal/privacy-policy/#your-rights) section describes self-service access and erasure keyed on the licence key, and what erasure deletes and keeps. By design it cannot reach records not stored by licence: bug reports, ratings and payment-provider message copies (stored by date), analytics and error reports (no licence ID), and preview links. Those go by email. A rating carries a random rating ID and no name, email, licence or device ID, so it is found by quoting its comment.

**No third-party behavioural data:** no analytics SDKs (Google Analytics, Segment, Mixpanel, Amplitude), tracking pixels, cross-site tracking, session replay or advertising identifiers. No data is sold, shared or brokered.

---

## 4. Subprocessor List

The policy's [Who else handles the data](https://docs.modelbridge.app/legal/privacy-policy/#who-else-handles-the-data) section governs, including each transfer safeguard.

| Processor | Role | Data received | Relationship |
|---|---|---|---|
| **Cloudflare** (Workers + KV) | Hosting and storage, including the preview service | Everything modelBridge holds server-side (§2), and the IP address of every request | Processor |
| **Lemon Squeezy** (Link, LLC, formerly Lemon Squeezy LLC, a Stripe company) | Merchant of Record: payments, subscriptions, licence validation | Licence key, customer email, instance ID including the device name, payment details | **Independent controller** (Art. 4(7)). We never receive payment details |
| **fal.ai** (Features & Labels, Inc.) | Generation, schema and pricing APIs, and the language-model endpoint behind Enhance | Prompts, media and generated content, direct from the device on the user's key, with a header naming the modelBridge version (no identifier). The Enhance payload below | Separate controller; the user contracts directly with fal.ai |
| **Google** (via fal.ai) | Runs Enhance on the fal.ai branch: a Gemini model on fal.ai's language-model endpoint | Prompt text, model name and category, duration, aspect ratio and resolution, and up to four images when media is attached. Only on an Enhance press | Reached on the user's fal.ai key; modelBridge chooses the model; the user's relationship is with fal.ai |
| **Anthropic** (Agent Mode; Enhance with an Anthropic key) | Timeline editing by chat; prompt rewriting | What §6 lists, and the Enhance payload on the Anthropic branch. Direct from the device on the user's key | Separate controller; the user contracts directly with Anthropic |
| **Anthropic** (model insights) | Worker background enrichment | Public model and creator metadata. No user content | No user data |
| **Pushover** (Pushover, LLC) | Developer operational alerts | Operational counts, bug-report notices with only the model and report ID, licence and subscription IDs, erasure notices with a record count only, and a rating's free-text comment (unlinked, §3). Never an email, a name or any part of a licence key | Pseudonymous IDs. No DPA; not certified under the EU–US Data Privacy Framework |
| **Resend** (Resend, Inc.) | Delivers the bug-report email | The report as listed in §1, screenshots with filenames included | Processor; DPF certification and Standard Contractual Clauses |
| **STRATO** (STRATO GmbH) | Hosts the support mailbox, Germany | The emailed bug-report copy and any email sent to us | Processor |
| **Vercel** | Hosts the documentation website | Visitors' IP address and browser details. Nothing from the panel | Processor |
| **GitHub** (Microsoft) | Remote config CDN (read-only) | GET requests with no identifier; GitHub sees the IP address | No user data sent |

### fal.ai Data Flow Note

modelBridge does not act as a data processor for fal.ai generation traffic. The user's device communicates directly with fal.ai's API using the user's own API key. modelBridge infrastructure has no access to this communication channel. The one thing from it that reaches us is the link to a finished result, and only when you turn on *Live preview in mobile* (§1). The user's relationship with fal.ai is governed by fal.ai's own Terms of Service and Privacy Policy.

### Enhance routing

Pressing ✨ Enhance rewrites the prompt in the field. Which model does the rewriting depends on two things, your Anthropic key and NDA mode, and the branch matters because the recipients differ:

| When you press Enhance | Who reads the prompt and any frames |
|---|---|
| An Anthropic key is present and NDA mode is off, with or without media | Anthropic, on your own Anthropic key. Google is not involved — unless Anthropic returns nothing or errors, in which case the request falls through to fal.ai below rather than failing |
| **No** Anthropic key, media attached (the ordinary case — that key is only needed for Agent Mode) | fal.ai's vision language-model endpoint on your own fal.ai key, running **a Google Gemini model** (gemini-2.5-flash-lite, chosen by modelBridge) |
| **No** Anthropic key and no media, **or** NDA mode on — a text-only rewrite | fal.ai's language-model endpoint on your own fal.ai key, running the same Google model |

What travels: the prompt as typed, the model's name and category, the configured duration, aspect ratio, resolution or image size, and at most four images (sampled video frames and stills), each downscaled, sent inline and labelled by its role in the form. **No filenames, file paths or project data.** NDA mode strips the frames and forces the text-only rewrite at fal.ai. Enhance needs an active subscription and a fal.ai key, spends the user's own credit, and runs only on the press.

---

## 5. Analytics Architecture

### Event Taxonomy (editorial events)

Only while usage measurement is on, the panel sends a fixed set of editorial events. What they can carry, in full:

| Events about | Metadata |
|---|---|
| A generation started, completed, failed or dismissed | Model ID; on completion, cost (USD) and duration; on failure or dismissal, where it came from |
| `gen_accept`: results imported from preview | Model ID and the number imported |
| Choosing a model, and Dual Mode | Model ID, or the primary and secondary model IDs |
| Browsing and searching the catalogue | The category filter, never the search text |
| Opening the Billing tab, and changing a privacy setting | For Error reporting, Timeline frames to the agent and Usage analytics: the key **and its new on/off value**, so the toggle that enables this stream reports its own position |

Events are batched locally and sent with the analytics identifier (§2). The service keeps daily totals per installation and an all-user total, and discards raw events; the policy lists what is kept and for how long. Generation-start coverage is incomplete, so the counts are not a complete record.

---

## 6. Agent Mode Data Handling

Agent Mode edits the timeline through chat, using Anthropic's Claude API on the user's own key, which is stored locally (§1). Traffic goes directly between the plugin and Anthropic.

**What reaches Anthropic, as two rules.**

1. **No image goes on the agent's own initiative unless the user allowed it.** Settings → Privacy → "Timeline frames to the agent" governs this, and the panel asks before the first send. It covers the 3–12 frames sent once per clip per conversation while a clip is selected, the agent reading the Generate tab's media card, and visual scans. With it off, no frame goes by any path; the agent is told what is in the media card (slot, role, filename, media type) but not shown it. NDA mode blocks frames regardless. Frames are sampled across the **whole source file**, not only the trimmed part.
2. **An action the user starts about a piece of media sends that media.** Asking the agent to watch a clip sends sampled frames, up to the ceilings on the [Privacy Controls](https://docs.modelbridge.app/features/privacy-controls/) page, with a cost dialog before a larger scan and only with the setting above allowed. Enhance sends the media attached to the prompt (§4).

**Project metadata.** Every turn: the selected client in Client-project mode, the name the user asked the agent to use, custom instructions, and local time and time zone. Whenever the agent reads the project, which is most turns: clip and sequence names, filenames, timecodes, effect settings, marker names and comments verbatim, dailies XMP fields, and camera make, model and creation time.

**Paths.** The media path keys (`sourceFile`, `mediaPath`, `proxyPath`) are replaced with opaque, session-scoped references at a single choke point and resolved back locally. The project file is handled the same way: the agent gets its name and a session handle, never the absolute path. Three kinds of path travel as written: a path typed into the chat, anything inside raw XMP text, and the candidate paths (up to 20) of a disk search for an offline file.

**No conversation data on our servers.** modelBridge does not store, proxy or log prompts, Claude responses, tool calls or edit commands. One local exception: a visual scan writes its frames, the absolute media path, the clip name, the prompt and the reply to a scan-log folder in the data folder. Folders older than seven days are removed when the backend next starts. Agent Mode emits no analytics events of its own; a generation it starts emits the same events as the Generate button. Anthropic's own policies govern the user's interaction with Claude.

---

## 7. Rights and Contact

**Privacy Policy:** [docs.modelbridge.app/legal/privacy-policy](https://docs.modelbridge.app/legal/privacy-policy/)
**Terms & Conditions:** [docs.modelbridge.app/legal/terms-and-conditions](https://docs.modelbridge.app/legal/terms-and-conditions/)

**Data Controller:**
Niklaz Hallberg
Stockholm, Sweden
info@modelbridge.app

**Supervisory Authority:**
Integritetsskyddsmyndigheten (IMY), the Swedish Authority for Privacy Protection
imy.se

**Data access and erasure requests:** see the policy's [Your rights](https://docs.modelbridge.app/legal/privacy-policy/#your-rights) section (summary in §3).

**Local data deletion:** Settings → Data management → "Reset all data" clears history, cost logs, external AI costs and client and project data, and, if ticked, installed models. It keeps API keys and the licence. Local data lives in `~/Library/Application Support/modelBridge` and CEP browser storage, and survives uninstalling by design; [Removing modelBridge](https://docs.modelbridge.app/getting-started/uninstalling/) lists every location.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — where each data flow is implemented · [NOTICE](NOTICE.md) — third-party components
