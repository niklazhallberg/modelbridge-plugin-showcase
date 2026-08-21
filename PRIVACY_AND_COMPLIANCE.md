# Privacy & Compliance

Technical compliance reference for modelBridge.app — data architecture, retention policies, GDPR measures, and subprocessor inventory.

---

## 1. Architecture Overview — Privacy by Design

modelBridge is a local-first application. The plugin runs entirely inside Adobe Premiere Pro as a CEP panel extension. There is no modelBridge server sitting between the editor and fal.ai. User prompts, media files, and generated content flow directly from the user's device to fal.ai's API — authenticated with the user's own API key — and back. modelBridge infrastructure never sees, stores, or proxies this content.

All user preferences, generation history, API keys, installed models, cost logs, and learned constraints are stored locally on the user's machine. No modelBridge-operated database holds user-generated content or creative assets.

modelBridge operates two Cloudflare Workers and nothing else. The first handles license validation (via LemonSqueezy webhooks), catalog monitoring, the in-plugin news feed, model insights, and opt-in error telemetry and analytics. The second backs Mobile Preview: when you send a result to your phone it receives a link to the fal.ai-hosted media, the model's name and an anonymous install ID — never the media itself. This Worker has no access to user prompts, media, generated content, or fal.ai API keys. The one exception is user-initiated: a bug report you choose to send carries your message, optionally your name and email, your prompt only if you tick that box (off by default on every report), and any screenshots you attach — all reviewed by you before sending, retained 180 days.

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
│  │  │  (localhost:3000, media only)   │  │              │
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

---

## 2. Data Inventory

| Data Category | What It Contains | Storage Location | Retention | Legal Basis (GDPR Art. 6) | User Control |
|---|---|---|---|---|---|
| **fal.ai API key** | User-entered API key | Local `localStorage` + disk file | Until user deletes | Contract (Art. 6(1)(b)) | View, change, or delete in Settings |
| **Generation history** | Prompts, file paths, model used, cost, timestamp | Local disk (per-project log files) | Until user resets | Contract (Art. 6(1)(b)) | Manual reset in the Billing tab, behind a confirmation step |
| **Installed models** | Model IDs, schemas, learned constraints, pricing | Local `localStorage` + disk file | Until user removes | Contract (Art. 6(1)(b)) | Remove individual models or reset all |
| **User settings** | Preferences, UI state, feature toggles | Local `localStorage` + disk file | Until user resets | Contract (Art. 6(1)(b)) | Settings → Reset |
| **Cost history** | Per-generation costs, currency rates, project tags | Local disk (cost log files) | Until user resets | Contract (Art. 6(1)(b)) | Manual reset with confirmation |
| **Learned constraints** | Per-model dimension/duration/size limits from errors | Local `localStorage` + disk file | 30-day soft TTL, refreshed on re-learn | Contract (Art. 6(1)(b)) | Cleared on model removal |
| **Error telemetry** | Error type, HTTP status, model endpoint, plugin version | Cloudflare KV (aggregated) | Indefinite (aggregated counts only) | Legitimate Interest (Art. 6(1)(f)) | Opt-in — off by default; enable in Settings → Privacy |
| **Behavioral analytics** | Anonymous event counts (gen_start, gen_done, model_sel, etc.) | Cloudflare KV (per-installation daily aggregate) | 90-day TTL per installation; 365-day global aggregate | Consent (Art. 6(1)(a)) | Opt-in only; disable in Settings → Privacy |
| **Installation ID** | SHA-256 hash (16-char hex) of four display and locale signals | Local `localStorage` | Derived, not random — clearing local data recreates the same value | Consent (Art. 6(1)(a)) — only transmitted when behavioral analytics enabled | Not transmitted unless user opts in; switching analytics off is what stops it being sent |
| **License key** | LemonSqueezy license key + machine instance ID | Local `localStorage` + disk; Cloudflare KV | Active: 3 years; ended: 90 days | Contract (Art. 6(1)(b)) | Deactivate in Settings; DELETE /api/user-data |
| **Customer email** | Email from LemonSqueezy webhook at purchase | Cloudflare KV (subscription record) | Active: 3 years; ended: 90 days; auto-cleaned daily | Contract (Art. 6(1)(b)) | DELETE /api/user-data |
| **IP address** | Request IP for rate limiting | In-memory only (Worker) | ~60 seconds (request lifecycle) | Legitimate Interest (Art. 6(1)(f)) | Not stored; transient only |
| **Anthropic API key** (Agent Mode) | User-entered Anthropic API key for Claude | Local `localStorage` only | Until user deletes | Contract (Art. 6(1)(b)) | Delete in Settings |

### What is never collected

- Prompts, negative prompts, or any creative text input
- Generated media, thumbnails, or preview content
- File names or file paths
- fal.ai or Anthropic API keys
- Search queries within the plugin
- Browsing behavior, cookies beyond localStorage, or fingerprinting
- Third-party analytics SDK data (no Google Analytics, Segment, Mixpanel, etc.)
- Tracking pixels

The one exception across this list is a bug report you explicitly send (see §1): it carries your message, any contact details you type, and — only if you opt in on that report — your prompt.

---

## 3. GDPR Compliance Measures

### Legitimate Interest Assessment — Error Telemetry

Error telemetry (Stream A) operates under Legitimate Interest (Art. 6(1)(f)). The assessment:

- **Purpose:** Detect unknown error types to improve error handling and user experience. Without telemetry, errors appear as generic "Something went wrong" messages.
- **Necessity:** Only error type, HTTP status, model endpoint, and plugin version are transmitted. No alternative exists that preserves anonymity while enabling error documentation.
- **Balancing:** Data is anonymous (no user identifier), aggregated at the Worker (raw events not stored), and contains no creative content. The `rawMessage` field undergoes PII scrubbing before transmission. Telemetry is off by default; users opt in — and can turn it off again — in Settings → Privacy.

### Retention Policy

| Data | Active Subscription | After Cancellation/Expiry |
|---|---|---|
| Subscription record | 3 years (94,608,000s) | 90 days (7,776,000s) |
| Trial record | 3 years | 90 days |
| License mapping | 3 years | 90 days |
| Revocation flag | Retained (fraud prevention) | Retained (fraud prevention) |
| Behavioral analytics (per-installation daily aggregate) | 90 days | 90 days |
| Global daily aggregate | 365 days | 365 days |
| Pushover event buffer | 48 hours | 48 hours |

Enforcement: A daily cleanup function (`cleanupExpiredSubscriptions`) runs as part of the Worker cron schedule, deleting expired subscription records automatically.

### GDPR Article 15 — Right of Access

`GET /api/user-data?license_key={key}`

Returns all data held for the subscription associated with the license key: subscription state, trial state, and revocation flag. The user's email is omitted from the response (the user knows their own email; returning it would create an unnecessary exposure surface).

### GDPR Article 17 — Right to Erasure

`DELETE /api/user-data` with `{ license_key, reason? }`

Deletes:
- Subscription record
- License mapping
- Trial data
- Scrubs email from accumulated operational events

Retains (with legal basis):
- Revocation timestamp and reason — fraud prevention, Legitimate Interest (Art. 6(1)(f))

Response confirms deletion with count of keys removed and list of retained keys with justification.

### PII Scrubbing

All `rawMessage` fields in error telemetry undergo regex-based scrubbing before transmission from the plugin:

| Pattern | Replacement |
|---|---|
| Email addresses | `[email]` |
| URLs (http/https) | `[url]` |
| File paths (/Users/..., /home/...) | `[path]` |
| Long alphanumeric tokens (≥20 chars) | `[token]` |

Messages are truncated to 300 characters after scrubbing.

### Two-Stream Telemetry Architecture

**Stream A — Reliability telemetry (opt-in, off by default — Legitimate Interest)**
- Route: `POST /api/error`
- Trigger: Unknown or unhandled error types only
- Data: Error type, HTTP status, model endpoint, plugin version, scrubbed message
- Storage: Aggregated count per composite key — raw events discarded
- No user identifier transmitted

**Stream B — Behavioral telemetry (opt-in, Consent)**
- Route: `POST /api/events`
- Trigger: User explicitly enables in Settings → Privacy
- Data: Anonymous event type + metadata (model ID, cost, category)
- Identifier: Installation ID (SHA-256 hash, non-reversible, 16-char hex)
- Storage: Per-installation daily aggregate (90-day TTL); raw events discarded after aggregation
- NEVER_TRANSMIT enforcement at both plugin and Worker level: `prompt`, `negative_prompt`, `filePath`, `fileName`, `apiKey`, `license_key`, `query`, `message`, `content` and credential-named fields are blocked at the plugin, and the Worker independently hard-rejects the core set

### No Third-Party Behavioral Data

- No analytics SDKs (Google Analytics, Segment, Mixpanel, Amplitude)
- No tracking pixels or web beacons
- No cross-site tracking or fingerprinting
- No cookies beyond browser localStorage
- No session replay or heatmap tools

---

## 4. Subprocessor List

| Processor | Role | Data Received | DPA Status |
|---|---|---|---|
| **Cloudflare** (Workers + KV) | Worker hosting, key-value storage | Aggregated error telemetry, license/subscription state, behavioral analytics aggregates | Cloudflare DPA (standard) |
| **LemonSqueezy** (Lemon Squeezy Inc.) | Payment processing, subscription management, license validation | License key, customer email, instance ID, payment details | LemonSqueezy DPA (standard) |
| **fal.ai** (fal Inc.) | AI model generation, schema/pricing APIs | User prompts, media files, generated content (direct from user device, authenticated with user's own API key) | Direct controller-to-controller relationship — user contracts directly with fal.ai |
| **Anthropic** (Agent Mode) | Conversational AI for timeline editing | Chat messages, project metadata (clip/sequence names, timecodes, file locations, effect settings), preview frames of the selected clip — direct from the user's device, authenticated with the user's own API key | Direct controller-to-controller relationship — user contracts directly with Anthropic |
| **Anthropic** (model insights) | Model insights enrichment (Worker background task) | Public model metadata only — no user content | No user PII processed |
| **Pushover** (Superblock LLC) | Developer operational alerts | Anonymized operational events (catalog counts, error counts) — no user PII | No user PII processed |
| **GitHub** (Microsoft) | Remote config CDN (read-only) | None — GET requests only, no user data sent | No user data processed |

### fal.ai Data Flow Note

modelBridge does not act as a data processor for fal.ai generation traffic. The user's device communicates directly with fal.ai's API using the user's own API key. modelBridge infrastructure has no access to this communication channel. The user's relationship with fal.ai is governed by fal.ai's own Terms of Service and Privacy Policy.

---

## 5. Analytics Architecture

### Event Taxonomy (editorial events)

| Event | Trigger | Metadata |
|---|---|---|
| `gen_start` | User clicks Generate | Model ID, category |
| `gen_done` | Generation completes | Model ID, cost (USD) |
| `gen_accept` | Result imported from preview | Model ID, count |
| `gen_fail` | Generation fails | Model ID, failure source |
| `gen_abandon` | User dismisses a result | Model ID |
| `model_sel` | User selects a model | Model ID, source (recent/search/browse) |
| `dual_use` | User activates Dual Mode | Primary + secondary model IDs |
| `dual_gen` | Dual Mode generation starts | Primary + secondary model IDs |
| `search` | Category search performed | Category filter (no search text) |
| `cat_browse` | Catalog browsed | — |
| `cost_view` | Costs tab opened | — |
| `settings_change` | Settings changed | Setting key (no value) |

### Aggregation Pipeline

1. Plugin queues events in memory (max 20 per batch, flush every 60 seconds)
2. Batch sent to Worker with installation ID (fire-and-forget, 5-second timeout)
3. Worker validates NEVER_TRANSMIT fields, rate-limits per installation (10 requests/hour)
4. Worker aggregates into a per-installation daily summary (90-day TTL)
5. Raw events discarded immediately after aggregation
6. Daily cron compiles a global aggregate (365-day TTL)
7. Global aggregate available via `GET /api/analytics/daily` (Bearer token, admin only)

### Acquisition-Demo Endpoint

`GET /api/analytics/daily` — returns last 30 days of global usage aggregates. Requires Bearer token authentication. Contains no per-user data — only aggregated counts (active installations, total generations, acceptance rate, top models by category).

---

## 6. Agent Mode Data Handling

Agent Mode allows users to edit the Premiere Pro timeline via natural language chat, powered by Anthropic's Claude API.

**User's own API key.** The user enters their own Anthropic API key in Settings. This key is stored locally in `localStorage` and is never transmitted to modelBridge infrastructure. All conversation traffic flows directly between the plugin (running locally) and Anthropic's API.

**No conversation data collected.** modelBridge does not intercept, store, proxy, or log any Agent Mode conversation content — no prompts, no Claude responses, no tool calls, no timeline edit commands. A generation triggered from Agent Mode emits the same anonymous generation events (`gen_start`, `gen_done`, `gen_fail`) as one started from the Generate button — subject to the same opt-in and NEVER_TRANSMIT rules. Agent Mode itself emits no events of its own.

**Customizable system instructions.** Users can configure custom system instructions for the Agent. These are stored locally only and included in requests sent directly to Anthropic's API. modelBridge infrastructure never sees them.

**Anthropic's privacy policy applies.** The user's interaction with Claude is governed by Anthropic's Usage Policy and Privacy Policy. modelBridge is not a party to this data flow.

---

## 7. Rights and Contact

**Privacy Policy:** [docs.modelbridge.app/legal/privacy-policy](https://docs.modelbridge.app/legal/privacy-policy/)
**Terms & Conditions:** [docs.modelbridge.app/legal/terms-and-conditions](https://docs.modelbridge.app/legal/terms-and-conditions/)

**Data Controller:**
Niklaz Hallberg
Stockholm, Sweden
support@modelbridge.app

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
