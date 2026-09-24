# Privacy & Compliance

Technical compliance reference for modelBridge.app — data architecture, retention policies, GDPR measures, and subprocessor inventory.

**Revised 2026-09-24** against two internal audits — a privacy and security pass (2026-08-29) and a media-exfiltration pass (2026-09-07) — plus a re-read of the shipping code. Twenty statements in the previous version were wrong, and the ones that were wrong in an absolute form have been replaced rather than qualified: no cookies, no fingerprinting, no hardware identifier, "everything we hold", the device name, the erasure scope, the telemetry field list, and the claim that no source directory ever reaches Anthropic. Google is named as a recipient for the first time. Each correction says what the document used to claim, because a compliance reference that quietly changes its answer is worth less than one that shows the change.

---

## 1. Architecture Overview — Privacy by Design

modelBridge is a local-first application. The plugin runs entirely inside Adobe Premiere Pro as a CEP panel extension. There is no modelBridge server sitting between the editor and fal.ai. User prompts, media files, and generated content flow directly from the user's device to fal.ai's API — authenticated with the user's own API key — and back. modelBridge infrastructure never sees, stores, or proxies this content.

All user preferences, generation history, API keys, installed models, cost logs, and learned constraints are stored locally on the user's machine. No modelBridge-operated database holds user-generated content or creative assets.

modelBridge operates two Cloudflare Workers and nothing else. The first handles license validation (via LemonSqueezy webhooks), catalog monitoring, the in-plugin news feed, model insights, and opt-in error telemetry and analytics. The second backs Mobile Preview. Two corrections to what this document said before 2026-09-24, both material: that Worker receives a record on **every preview render**, not only when you deliberately push a result to your phone — the record is a link to the fal.ai-hosted media, the model's name and the Install ID described in §2, never the media itself — and the phone reads it back from a URL keyed by that Install ID with **no authentication**, which also sets a cookie carrying the id on the phone for a year. Neither Worker has access to user prompts, media, generated content, or fal.ai API keys.

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
│  │  │  (localhost:3000 — see §2)      │  │              │
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
not the whole of what fal.ai carries. The backend also proxies every licence call to
our Worker, posts the Mobile Preview record, fetches currency rates from a public
exchange-rate API, and — for Enhance — calls `fal-ai/any-llm`, whose model is
Google's (§4). Each of those is itemised in the sections below rather than in the
picture.

---

## 2. Data Inventory

| Data Category | What It Contains | Storage Location | Retention | Legal Basis (GDPR Art. 6) | User Control |
|---|---|---|---|---|---|
| **fal.ai API key** | User-entered API key | Local `localStorage` + disk file | Until user deletes | Contract (Art. 6(1)(b)) | View, change, or delete in Settings |
| **Generation history** | Prompts, file paths, model used, cost, timestamp, seed, thumbnail path, and the display name entered at onboarding | Local disk (per-project log files, named after your projects) | Until user resets | Contract (Art. 6(1)(b)) | Manual reset in the Billing tab, behind a confirmation step |
| **Installed models** | Model IDs, schemas, learned constraints, pricing | Local `localStorage` + disk file | Until user removes | Contract (Art. 6(1)(b)) | Remove individual models or reset all |
| **User settings** | Preferences, UI state, feature toggles | Local `localStorage` + disk file | Until user resets | Contract (Art. 6(1)(b)) | Settings → Reset |
| **Cost history** | Per-generation costs, currency rates, project tags | Local disk (cost log files) | Until user resets | Contract (Art. 6(1)(b)) | Manual reset with confirmation |
| **Learned constraints** | Per-model dimension/duration/size limits from errors | Local `localStorage` + disk file | 30-day soft TTL, refreshed on re-learn | Contract (Art. 6(1)(b)) | Cleared on model removal |
| **Error telemetry** | Eleven fields: error type, error source, HTTP status, model id, a scrubbed 300-character message, a retryable flag, plugin version, host app and Premiere version, OS platform string, timestamp | Cloudflare KV (aggregated per composite key; the first occurrence's scrubbed message is retained with it) | Indefinite | Legitimate Interest (Art. 6(1)(f)) | Opt-in — off by default; enable in Settings → Privacy |
| **Behavioral analytics** | Anonymous event counts (gen_start, gen_done, model_sel, etc.) | Cloudflare KV (per-installation daily aggregate) | 90-day TTL per installation; 365-day global aggregate | Consent (Art. 6(1)(a)) | Opt-in only; disable in Settings → Privacy |
| **Analytics ID** | SHA-256 hash (16-char hex) of four signals: the CEP/Chromium user-agent string, screen dimensions, timezone offset and language. Called a device fingerprint by any ordinary reading of the term — see the note in §2 below | Local `localStorage` | Derived, not random — clearing local data recreates the same value, unless Web Crypto is unavailable, in which case a random value is used and is not reproducible | Consent (Art. 6(1)(a)) — only transmitted when behavioral analytics enabled | Not transmitted unless user opts in; switching analytics off is what stops it being sent |
| **Install ID** | A one-way salted SHA-256 hash of a stable machine identifier (on macOS, the platform UUID), formatted in the shape of a UUID. The raw identifier never leaves your machine. It carries **no account signal** and nothing about you personally, but it *is* derived from the computer — that is what binds a licence to one installation | Local disk file + `localStorage`. Our Worker stores only a truncated one-way hash of it, never the value itself | 400 days from the last licence check, then expires automatically | Contract (Art. 6(1)(b)) — it is how a licence is bound to one installation | **Not** governed by the analytics toggle, and not covered by DELETE /api/user-data today — see the two notes below |
| **Satisfaction rating** | A score of 1–5, an optional comment, plugin/Premiere/OS versions, how many generations had run, and a random rating ID that is neither of the two IDs above | Cloudflare KV | 1 year, then deleted automatically | Legitimate Interest (Art. 6(1)(f)) — an answer the user chose to send | Asked once, after real use; dismissing sends nothing. Not reachable by DELETE /api/user-data — see the note below |
| **License key** | The key itself is **not** persisted by the plugin after activation. What is kept locally is a SHA-256 of it mapped to the LemonSqueezy instance ID, plus the signed entitlement statement. Cloudflare KV holds the key id, not the key | Local disk; Cloudflare KV | Active: 3 years; ended: 90 days | Contract (Art. 6(1)(b)) | Sign out in Settings; DELETE /api/user-data (scope in §3) |
| **Customer email** | Email from LemonSqueezy webhook at purchase | Cloudflare KV (subscription record) | Active: 3 years; ended: 90 days; auto-cleaned daily | Contract (Art. 6(1)(b)) | DELETE /api/user-data |
| **IP address** | Request IP, used as a rate-limit key | Cloudflare KV, with the IP in the key name | **60 seconds** on the error endpoint; **1 hour** on licence activation and on bug reports | Legitimate Interest (Art. 6(1)(f)) | Not controllable; expires on its own timer |
| **Bug report** | Your message; your name and email if you type them; the three most recent error messages; a technical model packet; attached screenshots **with their original filenames** | Cloudflare KV | 180 days | Consent (Art. 6(1)(a)) — you compose and send it | Don't send one; ask us to delete one by quoting it |
| **Mobile Preview record** | A link to the fal.ai-hosted result, the model's name, and the Install ID — written on every preview render | Cloudflare KV (second Worker) | 7 days; the cookie it sets on the phone lasts a year | Contract (Art. 6(1)(b)) | Don't scan the QR; the record expires by itself |
| **Agent scan logs** | When you ask the agent to watch a clip: the sampled frames, the absolute media path, the prompt and the model's reply | Local disk (`uploads/scan-logs/`) | 7 days, swept at backend start | Contract (Art. 6(1)(b)) | Delete the folder; it clears itself on the timer |
| **Licence operational records** | Entitlement state, device instance map (including the device name described below), refresh lineage, pause, dunning and order-index records, and the verbatim webhook bodies LemonSqueezy sends (which carry your name and email) | Cloudflare KV | `ent:`/`instances:`/order index 3 years · refresh lineage and pause 400 days · webhook ledger 90 days · dunning 21 days | Contract (Art. 6(1)(b)) | **Not reached by DELETE /api/user-data today — see §3** |
| **Anthropic API key** (Agent Mode) | User-entered Anthropic API key for Claude | Local `localStorage` + disk file | Until user deletes | Contract (Art. 6(1)(b)) | Delete in Settings |

### Two identifiers, and only one of them is a consent question

They are separate values with separate lifecycles, and until 2026-08-28 this table
described only the first while calling it "Installation ID" — which read as a promise
about both.

**The Analytics ID** groups anonymous event counts. It is derived by hashing four
display and locale settings, is never linked to your licence or fal.ai account, and is
sent **only** while behavioural analytics is switched on. Switching it off is what stops
it being sent. This is the consent-bound one.

**The Install ID** is derived from the computer, not randomly generated: a stable
machine identifier is salted and hashed one-way (the derivation is `_deriveId` in
the plugin's `node/installId.js`, and the machine probe is `node/machineIdentity.js`
— named here so that a change to either is visibly a change to this paragraph), and the digest — laid out in the shape
of a UUID — is written to a file beside the plugin's own data. The raw machine
identifier never leaves your machine, and the digest cannot be reversed back to it.
Deriving it rather than randomising it is what makes it survive a reinstall, which is
what an entitlement bound to one installation needs. It accompanies **every** licence call — activation,
validation, renewal and device release — and it does so **regardless of the analytics
setting**, because it is not analytics: it is what binds an entitlement to one
installation, so a licence file copied to a second machine is refused there, and it is
what lets a specific installation be blocked without touching the customer's other
machines. Mobile Preview sends the same value when you push a result to your phone.

It is legally a contract necessity, not a consent item. Because it is derived rather
than randomised, clearing the plugin's data does **not** mint a new one: the same
machine re-derives the same id, which is what lets an entitlement survive a reinstall
without asking you to activate again. The value transmitted is a digest; the machine
identifier it is computed from never leaves your machine, and the digest cannot be
reversed back to it.

What our Worker keeps of it is a **truncated one-way hash**, not the value: enough to
notice that a licence started renewing from a different installation, not enough to
recover the id. That record expires 400 days after the last licence check.

**The erasure gap is wider than this document said until 2026-09-24.** It described one
record left behind. The endpoint in §3 removes three keys — the subscription record, the
licence-to-subscription mapping and the trial record — and scrubs your email from the
operational event buffer. Everything else in the "Licence operational records" row above
expires on its own timer instead: entitlement state and the device instance map (3 years),
refresh lineage and pause records (400 days), the verbatim webhook bodies that carry your
name and email (90 days), dunning records (21 days), plus bug reports (180 days) and
satisfaction ratings (1 year, which cannot be looked up by design — see below). Closing
this is an open defect with launch priority, not a design choice, and it is stated here at
its real size because a one-record version of it was the wrong size.

### What a licence check actually carries

Stated in full, because "only the licence key and a device identifier" was shorter than
the truth. **Sent** with a licence call: your licence key, the LemonSqueezy instance ID
for this activation, a name for the device, and the Install ID above. A renewal sends the
signed entitlement statement it already holds instead of the key.

That device name was described here as "modelBridge, not your computer's name" until
2026-09-24, and that was backwards. It is your computer's hostname, the platform, and a
short tag — `Niklazs-MacBook-Pro.local · macOS · 6206` in shape. On macOS a hostname is
commonly derived from the account holder's full name. "modelBridge" appears only as the
fallback when the hostname cannot be read. The name is shown in your LemonSqueezy licence
portal and is held in our own device instance map for three years.

**Returned** in that statement, and cached locally: the licence key id, the instance id,
the key status, the activation count and limit, the check timestamp, the product and
variant ids, trial and renewal dates, subscription status, payment-failure and pause
flags — and **your name and email address as your payment provider holds them**. They
come from LemonSqueezy, not from anything the plugin observes, and they are what let the
panel greet you and let a support request be matched to a purchase.

No prompt, no media, no file path and no project data is sent or returned on any of
these calls.

### What modelBridge's own servers never receive

The scope is the heading, and it is deliberate. Several of these travel to the two services you bring your own key for — your prompt goes to fal.ai on every generation, filenames go to Anthropic on every agent turn — and that is the product working as described in §4 and §6. What follows is the list of things that never reach infrastructure operated by modelBridge, which is the only infrastructure we control and the only thing this document can promise about.

- Prompts, negative prompts, or any creative text input — except in a bug report you write and send
- Generated media, thumbnails, or preview content — the Mobile Preview record carries a *link* to a result, never the bytes
- File paths. **Filenames are a narrower promise:** a screenshot you attach to a bug report keeps its original filename, and the Install-ID-keyed preview record carries none
- fal.ai or Anthropic API keys
- Search queries within the plugin
- Browsing behavior
- Third-party analytics SDK data (no Google Analytics, Segment, Mixpanel, etc.)
- Tracking pixels

**Three claims that used to be on this list and are not true, removed rather than softened:**

- *"No cookies beyond localStorage."* The Mobile Preview Worker sets a cookie on the phone that opens the preview, carrying the Install ID, with a one-year lifetime, and reads it back on later visits. It is first-party to that Worker and exists so an installed PWA keeps working, but it is a cookie we set and receive.
- *"No fingerprinting."* The Analytics ID is a SHA-256 of the user-agent string, screen dimensions, timezone offset and language, built to survive a reinstall. That is a device fingerprint by the ordinary meaning of the word. It is opt-in, it is never joined to your licence, and inside a CEP panel its input space is small enough that the hash is not a strong anonymiser — all three of those are reasons to describe it accurately rather than to deny the category.
- *"No hardware identifier."* The Install ID is a salted one-way hash of a platform machine identifier — on macOS the hardware UUID, on Windows the MachineGuid, on Linux `/etc/machine-id`. The raw value never leaves the machine and the digest cannot be reversed, but it is derived from hardware, which is exactly what makes it survive a reinstall.

One thing does reach us because you send it: a bug report (see §1). It carries your message, any contact details you type, the last three error messages, a model packet and any screenshots — and, since 2026-09-20, it has no preview step and no prompt tick-box, so the prompt is never included and nothing else can be struck.

---

## 3. GDPR Compliance Measures

### Legitimate Interest Assessment — Error Telemetry

Error telemetry (Stream A) operates under Legitimate Interest (Art. 6(1)(f)). The assessment:

- **Purpose:** Detect unknown error types to improve error handling and user experience. Without telemetry, errors appear as generic "Something went wrong" messages.
- **Necessity:** Eleven fields are transmitted, listed in the §2 row — error type and source, HTTP status, model id, a scrubbed 300-character message, a retryable flag, plugin version, host app and Premiere version, the OS platform string, and a timestamp. This assessment said "only error type, HTTP status, model endpoint, and plugin version" until 2026-09-24, which was an undercount of the payload it exists to justify. No field carries creative content, and no alternative exists that preserves anonymity while enabling error documentation.
- **Balancing:** Data is anonymous (no user identifier), aggregated at the Worker (raw events not stored), and contains no creative content. The `rawMessage` field undergoes PII scrubbing before transmission. Telemetry is off by default; users opt in — and can turn it off again — in Settings → Privacy.

### Retention Policy

| Data | Active Subscription | After Cancellation/Expiry |
|---|---|---|
| Subscription record | 3 years (94,608,000s) | 90 days (7,776,000s) |
| Trial record | 3 years | 90 days |
| License mapping | 3 years | 90 days |
| Entitlement state | 3 years | 3 years from the last write |
| Device instance map (includes the device name) | 3 years | 3 years from the last write |
| Order-index records | 3 years | 3 years |
| Refresh lineage record | 400 days from the last licence check | same |
| Subscription-paused record | 400 days | same |
| Webhook bodies as received (carry your name and email) | 90 days | 90 days |
| Dunning record | 21 days | 21 days |
| Revocation flag | Retained (fraud prevention) | Retained (fraud prevention) |
| Behavioral analytics (per-installation daily aggregate) | 90 days | 90 days |
| Global daily aggregate | 365 days | 365 days |
| Satisfaction rating | 1 year | 1 year |
| Bug report (message, contact details, screenshots) | 180 days | 180 days |
| Mobile Preview record | 7 days | 7 days |
| Error telemetry (aggregated, with the first occurrence's scrubbed message) | Indefinite | Indefinite |
| Pushover event buffer | 48 hours | 48 hours |

Enforcement: every row above expires on a Cloudflare KV TTL written at the time of the
write, and a daily cleanup function in the Worker cron additionally deletes expired
subscription records. A TTL is not an erasure routine, which is why the scope of the
erasure endpoint is stated plainly below rather than implied by this table.

### A rating cannot be erased on request, and that is the same fact as its anonymity

A satisfaction rating carries no licence, no email and no installation identifier — its
random rating ID is minted for that answer alone. So there is nothing to look one up by,
and `DELETE /api/user-data` cannot reach it. Every rating expires by itself one year
after it is sent; a specific comment can be removed by quoting its wording to
info@modelbridge.app.

This is a consequence of the design rather than a shortfall in it: the property that
keeps an answer untraceable is the property that makes it unfindable.

### GDPR Article 15 — Right of Access

`GET /api/user-data?license_key={key}`

Returns the subscription record, the trial record and the revocation flag for the licence
key, with the email omitted from the response. **It is not an export of everything held.**
This section claimed it was until 2026-09-24. The rows in the retention table above that
it does not reach — entitlement state, the device instance map, refresh lineage, pause,
dunning and order-index records, webhook bodies, bug reports, ratings, analytics
aggregates and error telemetry — are not in the response. Until the endpoint is widened,
an access request that has to be complete should be sent to info@modelbridge.app, which is
answered by hand against this table.

### GDPR Article 17 — Right to Erasure

`DELETE /api/user-data` with `{ license_key, reason? }`

Deletes three keys, and scrubs one field:
- Subscription record
- Licence-to-subscription mapping
- Trial record
- Scrubs your email from the operational event buffer

Does **not** delete, and this is the open defect rather than the design:
- Entitlement state and the device instance map (3 years)
- Refresh lineage and subscription-paused records (400 days)
- Webhook bodies as received, which carry your name and email (90 days)
- Dunning and order-index records
- Bug reports (180 days), satisfaction ratings (1 year — unfindable by design, see above), behavioural aggregates, error telemetry

Retains deliberately, with legal basis:
- Revocation timestamp and reason — fraud prevention, Legitimate Interest (Art. 6(1)(f))

The response confirms the count of keys removed and lists what was retained. Because that
count is three and the list above is longer, an erasure request that must be complete
should also be sent to info@modelbridge.app until the endpoint covers the table. Widening
it is tracked with launch priority.

### PII Scrubbing

All `rawMessage` fields in error telemetry undergo regex-based scrubbing before transmission from the plugin:

| Pattern | Replacement |
|---|---|
| Email addresses | `[email]` |
| URLs (http/https) | `[url]` |
| POSIX paths — `~`, `/Users`, `/home`, `/tmp`, `/var`, `/opt`, `/mnt`, `/Volumes`, `/Library`, `/Applications`, `/private`, including segments containing spaces | `[path]` |
| Windows drive paths and UNC shares | `[path]` |
| Long alphanumeric tokens (≥20 chars) | `[token]` |

The same scrubbing runs again at the Worker, because the endpoint is unauthenticated and
an older plugin may pre-date a fix to the plugin-side version.

Messages are truncated to 300 characters after scrubbing.

### Two-Stream Telemetry Architecture

**Stream A — Reliability telemetry (opt-in, off by default — Legitimate Interest)**
- Route: `POST /api/error`
- Trigger: Unknown or unhandled error types only
- Data: the eleven fields listed in §2 and in the assessment above
- Storage: aggregated count per composite key; the first occurrence's scrubbed message is kept with the counter, and later raw events are discarded
- No user identifier transmitted; the sender's IP is held for 60 seconds as a rate-limit key

**Stream B — Behavioral telemetry (opt-in, Consent)**
- Route: `POST /api/events`
- Trigger: User explicitly enables in Settings → Privacy
- Data: Anonymous event type + metadata (model ID, cost, category)
- Identifier: Analytics ID (SHA-256 hash, non-reversible, 16-char hex)
- Storage: Per-installation daily aggregate (90-day TTL); raw events discarded after aggregation
- NEVER_TRANSMIT enforcement at two levels, with different widths: the plugin blocks twelve field names (`prompt`, `negative_prompt`, `filePath`, `fileName`, `apiKey`, `license_key`, `query`, `message`, `content` and credential-named fields), and the Worker independently rejects a batch containing any of six (`prompt`, `filePath`, `fileName`, `apiKey`, `query`, `content`). The second list is the defence that survives a modified plugin, so it is the one to read as a guarantee — it is narrower than the first, and both are exact-key checks rather than deep inspection

### No Third-Party Behavioral Data

- No analytics SDKs (Google Analytics, Segment, Mixpanel, Amplitude)
- No tracking pixels or web beacons
- No cross-site tracking
- No session replay or heatmap tools
- No advertising identifiers and no data sold, shared or brokered

Two lines that were in this list and have been removed as untrue: "no cross-site tracking
**or fingerprinting**" — the Analytics ID is a device fingerprint, described in §2 — and
"no cookies beyond browser localStorage" — the Mobile Preview Worker sets and reads one on
the phone. Both are explained where the data is inventoried rather than denied here.

---

## 4. Subprocessor List

| Processor | Role | Data Received | DPA Status |
|---|---|---|---|
| **Cloudflare** (Workers + KV) | Worker hosting, key-value storage | Everything in the §2 and retention tables that is not local: licence and entitlement state, the device instance map including your device name, the verbatim webhook bodies LemonSqueezy sends (carrying your name and email), bug reports with contact details and screenshots, satisfaction ratings, Mobile Preview records, behavioural aggregates, error telemetry, and IP addresses as rate-limit keys | Cloudflare DPA (standard) |
| **LemonSqueezy** (Lemon Squeezy Inc.) | Merchant of Record — payment processing, subscription management, license validation | License key, customer email, instance ID including your device name, payment details | **Independent controller** (Art. 4(7)), not a processor for modelBridge: LemonSqueezy is Merchant of Record and determines its own purposes for payment data. We never receive your payment details |
| **fal.ai** (fal Inc.) | AI model generation, schema/pricing APIs, and the LLM behind Enhance | User prompts, media files, generated content (direct from user device, authenticated with user's own API key). Also the Enhance payload described below | Direct controller-to-controller relationship — user contracts directly with fal.ai |
| **Google** (via fal.ai) | The model that runs Enhance — `google/gemini-2.5-flash-lite`, reached through `fal-ai/any-llm` | Your prompt text, the model's name and category, the configured duration/aspect ratio/resolution, and — when media is attached — up to four sampled frames. Only when you press Enhance. See the flow below | Reached as part of fal.ai's `any-llm` endpoint on the user's own fal.ai key; the user's relationship is with fal.ai, which selects Google as the upstream model provider |
| **Anthropic** (Agent Mode) | Conversational AI for timeline editing | Chat messages; project metadata — clip and sequence names, filenames, timecodes, effect settings, marker names and comments, dailies XMP, camera make/model/date, the client name in Client-project mode, your alias and any custom instructions; frames of a selected clip; media in the Generate tab when you ask about it; and **some absolute paths**: media paths are masked at a single choke point, but the project's own path, whole-disk search results, template folders and anything inside raw XMP are not (see §6). Direct from the user's device, authenticated with the user's own API key | Direct controller-to-controller relationship — user contracts directly with Anthropic |
| **Anthropic** (model insights) | Model insights enrichment (Worker background task) | Public model metadata only — no user content | No user PII processed |
| **Pushover** (Superblock LLC) | Developer operational alerts | Operational counts (catalog, errors, health) and subscription events identified by licence key id and subscription id — never an email address, a name or any other identifying data. **One exception, added 2026-08-28:** the free-text comment from a satisfaction rating, which carries no identifier of any kind and cannot be traced to an account | Pseudonymous identifiers only; the rating comment is unlinked user-written text |
| **GitHub** (Microsoft) | Remote config CDN (read-only) | None — GET requests only, no user data sent | No user data processed |

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

The panel's Enhance tooltip names fal.ai as the recipient when media is attached and no
Anthropic key is present. It does not name Google, and there is no tooltip at all for the
text-only case. Both gaps are open items; this table is the accurate statement until the
in-product copy catches up.

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

### Aggregation Pipeline

1. Plugin queues events in memory (max 20 per batch, flush every 60 seconds)
2. Batch sent to Worker with the Analytics ID (fire-and-forget, 5-second timeout)
3. Worker validates NEVER_TRANSMIT fields, rate-limits per installation (10 requests/hour)
4. Worker aggregates into a per-installation daily summary (90-day TTL)
5. Raw events discarded immediately after aggregation
6. Daily cron compiles a global aggregate (365-day TTL)
7. Global aggregate available via `GET /api/analytics/daily` (Bearer token, admin only)

### Aggregate analytics endpoint

`GET /api/analytics/daily` — returns last 30 days of global usage aggregates. Requires Bearer token authentication. Contains no per-user data — only aggregated counts (active installations, total generations, acceptance rate, top models by category).

---

## 6. Agent Mode Data Handling

Agent Mode allows users to edit the Premiere Pro timeline via natural language chat, powered by Anthropic's Claude API.

**User's own API key.** The user enters their own Anthropic API key in Settings. It is stored locally — in the local backend's environment file, with only a short display fragment in `localStorage` — and is never transmitted to modelBridge infrastructure. All conversation traffic flows directly between the plugin (running locally) and Anthropic's API.

**What reaches Anthropic, as a rule rather than a list.** Two sentences govern every path, present and future:

1. **The agent never sends images on its own initiative unless the user has allowed it.** One setting governs that — Settings → Privacy → "Timeline frames to the agent". It covers the frames that accompany messages while a clip is selected (on by default, 3–12 depending on clip length) and the agent's ability to read the Generate tab's media card by itself. With it off, the agent is told what is in the card — slot, role, filename, media type — and is not shown it, through the same coverage contract that stops it describing anything it did not see. Two properties of that switch worth knowing: the frames are sampled across the **whole source file**, not the part you trimmed into the timeline, so a three-second selection inside a long interview sends frames from across the whole interview; and unlike every other privacy switch it lives only in browser storage, so clearing the panel's cache returns it to on.
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

**Programmatic Data Erasure:**
```
DELETE https://modelbridge-telemetry.niklaz-a-hallberg.workers.dev/api/user-data
Content-Type: application/json

{ "license_key": "your-license-key" }
```

Response confirms all deletable records removed. Revocation flags retained for fraud prevention with justification provided in the response.

**Local Data Deletion:**
All locally stored data (generation history, cost logs, installed models, API keys, settings, learned constraints) can be cleared from within the plugin via Settings → Reset, or by uninstalling the extension.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — where each data flow is implemented · [NOTICE](NOTICE.md) — third-party components
