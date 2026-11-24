# Performance, load and long-running behaviour

modelBridge is a Premiere Pro panel that renders generation forms from fal.ai's
OpenAPI documents, runs the generations through a local backend, and keeps a
per-project record of what each one cost. It talks to three outside parties:
fal.ai, a Cloudflare Worker we operate, and — when the editor supplies their own
key — the Anthropic API. Its update payloads are static files served from GitHub.

This document covers three things: what the panel asks of each of those
services and how often; how fast the panel starts and responds; and what
accumulates over long sessions and months of use — memory, storage and timers.
It does not describe how fal.ai works internally. We have no view of that.

**Where the figures come from.** Every measurement was taken on one development
machine (macOS, CEP 12), not on a customer install. That machine has seen months
of heavy use, so its storage figures are an upper reference point, not a typical
install. The dates:

| Date | What was taken |
|---|---|
| 2026-08-30 | a few earlier readings from a dated internal review, carried forward and marked where they appear |
| 2026-09-01 | timings and traffic, over the Chrome DevTools Protocol against a live panel |
| 2026-09-05 / 06 | browser-storage quota (fill probe), memory and storage, on Premiere Pro 26.3.2 |
| 2026-10-21 | storage re-read on Premiere Pro 26.5.1; cadences re-checked against the source. That pass was not complete |
| 2026-11-14 / 24 | later changes to the schema check and catalogue counts, dated where they appear |

**Evidence classes.** *Measured* means observed on a live panel, the process
table or the file system on the date given. *Read from source* means a constant
or code path in the shipping build, not a measurement. *Derived* means arithmetic
on a measured input and is marked as such. Anything not measured is called
unmeasured. Timings were not re-taken after 2026-09-01; where the code has moved
since, the row says so.

---

## 1. What we ask of each service

Each cadence below is a choice that trades freshness for not making somebody
answer more often than the product needs.

### 1.1 fal.ai

| Path | Volume | Cadence | Backoff |
|---|---|---|---|
| **Polling a running generation** | **mean 37.2 requests per generation** (median 20, p90 92, longest 377) — derived, see below | stepped: fast for the first half-minute, then slower in two further steps | yes, in the shipping source |
| Polling a handed-off generation | — | stepped down over the first five minutes, then a steady slow cadence | yes |
| Catalogue synchronisation (our worker, once for all customers) | a few dozen paginated requests per cycle | a few times a day | the pointer advances only on success, so it can run slower, never faster |
| Catalogue read by each install's local backend | a few dozen paginated requests per read | only when the panel asks and the install's copy is older than 20 minutes; a fresher copy is served from disk | one read at a time per install; coinciding panel opens share it |
| Installed-model schema check on selection | at most 1 schema read per installed model per 24 h | on selection, when that model's last check is older than 24 h | none — read from source before 2026-11-14, see below |
| Installed-model background re-check | listing: no requests (read from the catalogue already held); schema: 1 read per listed installed model per day, through the local backend | daily, since 2026-11-14 | paced so it does not compete with the editor |
| Platform health probe | 1 full OpenAPI document | every 5 min while the panel is visible | none — see the known item below |
| API key validity probe | 1 | once per panel start | n/a |
| Pricing | 1 per model per 24 h | on selection, when the stored rate is older than 24 h | pacing only |
| Media upload | 1 per media input per generation | on demand; since 2026-10-21 ended by stalled progress, not by a clock, so a slow but moving upload is not cut off | n/a |
| Blog tab feeds (fal.ai's blog and fal.ai/learn) | 1 per source | hourly, paused while the panel is hidden; also on opening the tab if the list is over 30 minutes old | n/a |

**How the poll figure was derived.** We replayed the cadence constant from the
shipping source over 235 real generation durations the product recorded. The
durations are real; the conversion to requests is our arithmetic, not a count
taken off the wire. The fast first phase exists because a five-second generation
that takes six seconds to appear feels broken. It ends after the first
half-minute, when a second of latency is invisible against the wait. The median
run on that install took 20 seconds and 20 requests.

A watch on a run ends on a result, an explicit failure, a cancel, or several
unbroken minutes in which fal.ai's status could not be reached. There is no limit
on how long a run may take. In the last case the editor is told the status could
not be confirmed and the run stays recoverable. After a restart, a run is resumed
only if it was submitted, and last heard from, within the last few days.

**Catalogue cadence.** The worker runs discovery, validation and publication as
separate phases in rotation, so each comes round a few times a day, and the
published snapshot is rewritten only when its content changed. It could run
hourly. It does not, because the catalogue changes a handful of times a day and
the cost of a few hours' delay is a "new models" badge that is briefly behind.
A cycle is a few dozen requests for the whole customer base; the live catalog
held 1,191 models on 2026-11-24. The per-install rows are different: each
install's backend reads fal.ai's model list itself when its copy is stale, and
that load grows with the number of installs.

**Two schema-read rows, and what is not settled between them.** The on-selection
check was read from source on 2026-10-21. The background schema comparison did
not run between 2026-08-27 and 2026-11-14 and has run daily since. Whether the two
now share one 24-hour allowance per model was not re-checked. Until it is, read
them as separate, which is the higher figure. On the reference install's
2026-10-21 count of 120 installed models, the background read alone is up to 120
schema reads a day (derived). It grows with the install, not with fal.ai's
catalogue.

**Known item, recorded 2026-10-21.** The platform health probe downloads a full
OpenAPI document every five minutes while the panel is visible and reads only
the HTTP status code — up to twelve schema downloads per hour of visible panel
time. A lighter request depends on confirming that the endpoint answers `HEAD`.
It had not been changed on 2026-10-21, and nothing in this repository records a
change since.

None of the recurring requests reaches an endpoint that charges. They fetch
public documents, and a status poll reads a request that was paid for at submit.
Money leaves only at submit, which the editor starts.

### 1.2 Our Cloudflare Worker

The worker serves the catalogue snapshot, a schema blocklist, model insights, a
news feed, licensing and telemetry. Cadences are read from source; the news
interval is from the product documentation.

| Path | Interval | Pauses when hidden |
|---|---|---|
| News / status | every 15 min, every 5 min during a fal.ai incident | yes |
| Telemetry flush | periodic; returns at once when the queue is empty | no — it must run hidden |
| Licence revalidation | 12 h plus jitter, so installs do not synchronise | yes |
| Catalogue index | periodic, stale-while-revalidate | yes |

**Boot traffic, measured over four boots on 2026-09-01:** one model-insights
request, one blocklist, one news, and three to four catalogue requests. Only one
catalogue request reaches the network. The 524 KB snapshot carries
`cache-control: public, max-age=3600`, so the browser's HTTP cache answers the
rest: with the cache bypassed, the first request took 294 ms and the next two
1.8 ms and 2.1 ms. The remaining cost is two extra `JSON.parse` calls, 2.8 ms per
boot. At most one request per hour reaches the worker.

**Conditional requests are half built.** Until 2026-09-01 the product made none.
One revalidation layer now serves the recurring fetches. It stores validators
only, never bodies.

| | |
|---|---|
| Saves the response body | yes for static payloads — verified live: `304` with a zero-byte body |
| Saves the request | no — a conditional GET is still a request |
| Saves work on our worker | unmeasured. Our endpoints sent no validators on 2026-10-21, so every request there is still a `200`. The client half is wired, so adding validators is a server-side deploy only |

The measured gain is small: the update manifest went from three fetches per boot
to two, because concurrent requests for one document now share one call.

### 1.3 Static update files on GitHub

The update manifest, the renamed-model list and the configuration are read at
startup, each with a timeout and a cached or bundled fallback. Configuration is
read at startup only. Error explanations are also re-checked about once an hour
while the panel is open and visible.

### 1.4 Anthropic

Agent Mode runs on the editor's own Anthropic key. **Historical, not current:**
between 2026-05-12 and 2026-08-30, on Haiku 4.5 (the default until 2026-10-08), a
median agent turn re-read about 47,500 cached prompt tokens, which then carried
every tool schema, to deliver 370 new ones. Since 2026-09-14 tool schemas are
loaded only when a turn needs them, the default model is now Claude Haiku 5.5, and
neither token use nor cost has been measured on the current build.

---

## 2. Startup and interaction timings

### 2.1 Cold start, measured 2026-09-01

**Method.** `location.reload()` on the live panel, then Navigation Timing and the
full Resource Timing list read 45 seconds later. The resource buffer defaults to
250 entries and fills during boot, so `performance.setResourceTimingBufferSize(5000)`
must be set first, or the tail of the timeline is silently missing.

| Phase | At | Blocks the UI? |
|---|---|---|
| DOM interactive | 111 ms | — |
| First local backend contact | 451 ms | no |
| **DOMContentLoaded** — 108 deferred scripts parsed and run | **625 ms** | yes |
| Update payloads (manifest, pricing supplements, renamed models, config) | 454–1,527 ms | no |
| Load event end | 1,509 ms | — |
| Catalogue index, licence and agent status | ~1,980 ms | no |
| fal.ai key probe | starts 1,979 ms, **lasts 1,025 ms** | no |
| **Panel ready** — catalogue complete (1,295 models), 67 installed models resolved, licence settled | **≈2.2 s** | — |

Nothing after DOMContentLoaded blocks the interface, and every remote fetch on
the boot path has a fallback, so 2.2 s describes the build rather than that
morning's network.

**What this is not.** It is a panel restart with a warm backend, warm HTTP cache
and warm local storage. A backend process start, a first run with empty caches
and a Premiere launch are unmeasured. On 2026-10-21 the panel loaded 139 deferred
modules (146 script tags in all), not 108; the timings were not re-taken on that
build.

**Before and after a deletion pass.** On 2026-09-01 we removed unreachable code
and six script tags. DOMContentLoaded read 1,629 ms before (one boot, 2026-08-30)
and 621 ms and 625 ms after (two boots). We do not attribute the difference to the
deletions: the before-figure is one boot on another day, and a cold versus warm
HTTP cache alone can explain a gap that size. The current figure is established;
the cause is not.

### 2.2 Interactions

| Interaction | Measured | Date |
|---|---|---|
| Model switch, text-to-image model, 19 controls | 55.7 ms | 2026-09-01 |
| Model switch, 19-input video model, 90 controls | 50.7 ms | 2026-09-01 |
| Model switch, reference-to-video model | 25.7 ms | 2026-09-01 |
| Full Browse render, 1,233 model rows | 147.7 ms median, 167.3 ms max, ~440 ms to painted; no forced-layout reads | 2026-08-30 |
| Heaviest generation form, 19 inputs | 7.2 ms median, near-flat from 2 to 19 inputs | 2026-08-30 |

The model-switch figures come from performance markers in the shipping build and
span teardown, model resolution, schema read, field generation and DOM
insertion. They are computation, not network. The two 2026-08-30 figures were not
re-run; the files on their render path were last changed 2026-08-27 and
2026-08-29, so the code is unchanged. That establishes the code, not the timing on
another processor.

### 2.3 A returning model

Selecting a model used before is the most repeated action in the product.
**Measured 2026-09-01** with resource timings cleared before each switch: the
schema and its parsed fields came from local storage on every switch, and no
schema request fired. The only call that went out was a pricing refresh, for a
model whose rate was 25.2 hours old (1 request, 608 ms, non-blocking). Models
priced 1.5 hours earlier, or with curated pricing, made no request.

Since 2026-09-05 curated-pricing models are refreshed on the same terms, so
metering uses a current unit and rate; this was not re-measured. The refresh is
necessary: a rate can change on the provider's side with nothing announcing it,
and the cost display is `quantity × rate`, so a stale rate gives a confident
wrong number. A failed or rate-limited response does not count as a refresh, so
one throttled answer cannot suppress the next attempt for a day.

---

## 3. Long-running behaviour

### 3.1 Memory

**Measured 2026-09-06**, 30 seconds after opening the panel from Window →
Extensions, via `Performance.getMetrics`:

| Fresh panel | |
|---|---|
| Documents | 2 — the panel and the host's empty frame |
| DOM nodes | 2,705 |
| JS event listeners | 345 |
| JS heap used | 12.7 MB |

**Read memory figures next to the document count.** On the host version
measured, reloading the panel document does not release the previous one. The
same install before that reopen held 24 documents, 2,339,648 nodes and 248.8 MB
of heap: the residue of a day of developer reloads. No path a customer can reach
reloads the document. Switching workspaces, projects and panel tabs keeps it;
closing and reopening the panel starts a new renderer process, which is the
state the table measures.

### 3.2 Persistent storage

Sizes **measured** 2026-09-06; bounds **read from source**.

| Surface | Size | Bounded by | Unreadable or full |
|---|---|---|---|
| Installed-model registry (disk, mirrored to browser storage) | 726 KB, 75 models | grows with installed models; mirror has a declared budget (§3.3) | renamed aside; newest migration backup restored |
| Migration backups of the registry | 13.1 MB, 21 files | **no cap** (§3.6) | read only to recover |
| Catalogue snapshot (disk) | 569 KB, 1,295 entries — 439 bytes each | grows with the catalogue; replaced whole | refetched |
| Backend catalogue copy (disk) | 931 KB | short fresh window, served stale while refreshing | walked again |
| Schema cache (disk, mirrored to browser storage) | 1.6 MB disk, 3.1 MB browser, ~100 entries | each entry expires after about a day, staggered; **count uncapped**; LRU-evictable in browser storage | refetched |
| Backend in-memory schema cache | — | 24 h freshness and the backend process lifetime | — |
| Generation ledger, per project | 3.5 MB, 9 files, 2,296 rows (~1.7 KB per row) | rotates in fixed-size slots; a few rotated slots kept | renamed aside; project reads empty until next write; archive untouched |
| Ledger archive | empty | **no cap** (§3.6) | — |
| Ledger browser-storage mirror | — | fixed row cap; only the active project keeps one once the others' disk logs read back | disk copy is the record |
| Learned pricing, constraints, statistics, error counters | under 40 KB together | keyed by endpoint and settings: grows with variety, not volume | ignored and regenerated |
| Settings | 2.2 KB | fixed key set | defaults |
| Exported reports | 8.4 MB, 46 files | user-owned; a name collision gets a suffix, never an overwrite | — |
| Thumbnails | 512 KB, 107 files | age-based sweep after backend start | — |
| Upload staging | 0 | one-hour TTL sweep; since 2026-10-21 an extend model's submitted source is kept for a longer, bounded period | — |
| Usage events; agent scan logs | 12 KB; — | capped active set and archive; age-based sweep | — |

A generation also leaves a recovery token (deleted on success) and a result
marker (expires on its own). Data directory total: 32.7 MB, of which 13.1 MB was
migration backups and 8.4 MB exported reports.

**Outside the panel's control.** The browser engine keeps an HTTP cache, a code
cache and a storage database in a per-Premiere-version profile the panel neither
sizes nor clears. Measured: 330 MB of HTTP cache (171 entries, mostly
full-resolution result images from fal.ai's CDN), 19 MB of code cache, 1.7 MB of
storage, and a 296 MB profile left by the previous Premiere version. The engine
manages the live profile with its own LRU policy. The old one belongs to the
application upgrade, and the extension does not delete it.

### 3.3 Browser storage and the quota

The origin's `localStorage` quota is 5 MiB of UTF-16 code units, which is 10 MiB
in bytes, the unit the panel uses. **Measured** 2026-09-05 by a fill probe: 9.97 MB
accepted before a 32 KB write was refused.

- **Managed writes evict before they fail.** Above a threshold well below the
  quota, a write evicts a slice of least-recently-used tracked keys and retries.
  If the retry fails, the editor is told once per session and the write returns
  false instead of throwing.
- **Protected families declare budgets.** Keys that must never be evicted
  (installed models, credentials, settings, ledger mirrors and a few others; 24
  keys, 905 KB on 2026-09-06) each declare a worst-case byte budget. A pre-commit
  guard fails if one lacks a budget or the declared sum crosses the eviction
  threshold.
- **A failed write is recorded.** If a browser-storage write fails for a key with
  a disk copy, the key is marked stale on disk, so the disk copy wins the next
  read.

**Known gap: a declared budget was exceeded.** The installed-model mirror measured
898 KB at 75 models on 2026-09-06, inside its declared 1,400 KB budget, and
1,487 KB at 120 models on 2026-10-21, over it. The guard compares declarations
with each other, not with live sizes, so it did not fire. The origin as a whole
was at 55.9 % of quota that day, under the eviction threshold.

**Migrations.** A migration of the installed-model registry runs behind one
wrapper (read from source): it writes a timestamped backup of the whole registry
and aborts if that fails; it rehearses the change and aborts if the rehearsal
fails; and it is shaped so it cannot empty the registry. A parser change
rebuilds a model's fields from its stored schema without a network call. Our
policy is that persisted formats carry a schema version; on 2026-10-21 four
durable stores did and three did not. The wrapper's test coverage is recorded in
[`UXP_MIGRATION.md`](UXP_MIGRATION.md) §3 and not restated here.

### 3.4 Growth between two readings

Same development machine, read only, nothing instrumented.

| | 2026-09-06 | 2026-10-21 |
|---|---|---|
| Installed models | 75 | 120 |
| Registry on disk | 726 KB, ~9.7 KB per model | 1.6 MB, ~13.5 KB per model |
| Its browser-storage mirror | 898 KB | 1,487 KB |
| Browser storage, whole origin | 92 keys, 5,552 KB, 54.2 % of quota | 91 keys, 5,721 KB, 55.9 % |
| Catalogue snapshot on disk | 569 KB, 1,295 entries | 574 KB, 1,299 entries |
| Migration backups | 21 files, 13.1 MB | 34 files, 26 MB |
| Ledger archive | empty | 8 rotated slots, 12 MB |
| Data directory | 32.7 MB | about 90 MB, counting only what a customer install also has |

Installed models rose 60 %; the share of browser storage barely moved. Disk grew
faster than the model count, mostly in the two uncapped surfaces (§3.6). Derived
from these readings: each migration backup is one whole registry (about 0.7 MB at
75 models), and the archive grows by about 3.6 KB per generation because archived
slots overlap by half.

**Built not to grow with the catalogue:** browser storage (only the snapshot's
timestamp and completeness marker live in the quota), the schema cache (keyed by
models opened recently), the set of recurring timers (fixed in source), and the
worker's catalogue sync (once per catalogue, not per customer). What the panel
loads into memory grows with the number of projects, not ledger rows; a Billing
query for a period reads the rotated and archived slots that can hold rows in it.

### 3.5 Timers when the panel is hidden

The visibility guard is applied in one place, not rewritten per timer, and a
timer that must run hidden says so where it starts. A pre-commit guard checks
that every recurring timer is either guarded or exempt with a stated reason. The run-hidden set, read from
source on 2026-10-21:

- generation polling, because a paid run must be collected whichever tab is in
  front;
- the backend keep-alive and a liveness sweep of background rows;
- the telemetry flush, which returns at once on an empty queue;
- the project-template sync, one host call in flight at a time, paused while the
  agent or a generation is busy;
- the progress watch on an upload in flight, which asks only the local backend
  and ends with the upload.

Every other recurring timer skips its work while hidden, apart from short UI
countdowns that clear themselves.

### 3.6 Deliberately uncapped

- **Migration backups are not reaped.** A stale backup costs about 0.7 MB at 75
  models; a backup deleted too early costs the only copy of the editor's models.
  Backups are written on migration events, not per boot — a steady-state panel
  open wrote none — so the pile grows with releases, not use.
- **The ledger archive is never deleted.** Cost history is what an editor hands
  to a client, and rotation already bounds what the panel loads. Clearing history
  is left to the editor, in Settings.
- **Generation polling runs hidden.** The cost is local requests to the backend,
  not money, and it ends with the run or after several minutes without contact.
- **The schema cache is uncapped in count.** Entries expire by age instead.
- **The browser engine's cache** is managed by the engine (§3.2).

**What keeps these bounds in place.** Four pre-commit guards run on every
commit: script load order (no module reads a global whose provider loads later),
timer visibility, documentation anchors the panel can emit, and the storage
budgets in §3.3. Each guard is also run against a planted violation in the same
hook, so a guard that has stopped refusing fails the commit too. As §3.3 shows,
the budget guard checks declarations, not live sizes.

---

## 4. Findings that did not hold

Three findings in the first draft of the 2026-08-30 review were wrong, and all
three were rankings built on a number that was not a time cost:

1. The catalogue's four fetches per boot were ranked as the largest traffic item
   at 2.1 MB. Measured: at most one request an hour reaches the network, and the
   rest cost 2.8 ms of parsing (§1.2). A proposed memo layer was withdrawn.
2. Conditional requests were ranked as the largest available reduction in load
   on our worker, on a saving that was never measured and needs a server half
   that does not exist (§1.2).
3. A per-row storage read was ranked on 627 MB of string churn per Browse render.
   Reading that 365 KB key costs 0.3 µs, the same as reading a missing key; 4,935
   reads come to about 1.5 ms inside a 148 ms render.

A further item from that review was closed for a different reason: a guard
already in the code caps its data structure at ten entries, so its bad case
cannot be reached.

A fourth correction from the same pass pointed the same way: an agent cache-write
pricing error (priced at the 5-minute rate while every cache marker requests the
1-hour TTL; corrected 2026-09-01, older records marked rather than recomputed) was
first reported as reaching three customer-facing surfaces. It reached one
internal report.

**Every error made the product look worse than it is.** An audit written to find
faults accepts fault-shaped answers, and a byte count is fault-shaped in a way a
microsecond measurement is not. Since then a byte count is not accepted as a
performance finding without a matching time measurement, and the review keeps a
tally of its own corrections and their direction.

---

## 5. What is not measured

**How much work the panel asks of Premiere Pro on a real timeline.** This is the
largest open question in this document. While a form for a media-taking model is
open, the panel polls the host for the current selection. **Measured 2026-09-01**
by instrumenting the host-call bridge:

| Panel state | Host calls per second |
|---|---|
| Idle, no model selected | **0.00** (none in 2.14 minutes) |
| A media-taking model's form open | **5.72** (69 calls in 12.1 s), from three selection walkers |
| A different media model | **3.67** — the walker set varies by model |

46 of the 67 installed models on the reference install took media, so this is
the common state. Every reading was taken on a nearly empty project. Each call
walks the timeline's tracks and clips, so its cost scales with the timeline. We
do not know what it costs on a feature-length edit with hundreds of clips. The
scripting engine is single-threaded and a call slower than the polling interval
would compound, so the polling keeps one call in flight with an escalating retry
window. That is a mitigation, not a measurement. Closing this needs a real
editor's project.

Also unmeasured:

- per-customer, per-day request volume to any service;
- whether validators would save work on our worker (§1.2);
- a first run with empty caches, a backend process start, and a Premiere launch;
- heap and render time at scale. A projection to 100 installed models and 2,500
  catalogue entries was designed and deferred, because it would mutate a live
  data directory. The development install reached 120 installed models by
  2026-10-21 without heap or render time being measured at that size. Two Browse
  render paths scale with catalogue entries times installed models;
- any figure on Windows;
- agent token use and cost on Claude Haiku 5.5 and the current prompt (§1.4).

---

## 6. Reproducing this

| Figure | How |
|---|---|
| Cold start | Reload, then read Navigation and Resource Timing. Raise the resource buffer first |
| Model switch | Read the model-switch performance measure the build already emits |
| Host call rate | Wrap the host bridge and count by function name over a fixed window. Check that the wrapper intercepts before trusting a zero |
| Storage read cost | Time a read of a large key and of a missing key. The comparison is the finding |
| Polls per generation | Replay the cadence constant from source over the durations in the product's generation log |
| Memory | Close and reopen the panel, read `Performance.getMetrics` 30 s later, and report `Documents` beside every absolute figure |
| Storage sizes | List the data directory and the origin's browser storage; classify keys by the storage manager's own prefixes |
| Backup rate | Count registry backups before and after a panel open; a steady-state open adds none |
| Timer inventory | Run the poll-visibility guard; it prints the inventory and any violation |
| Quota | Write until refused, then compare the panel's own percentage with the bytes written |

All of these need the DevTools port, which a development install opens and a
customer install does not. The poll figure also needs that install's own
generation history.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — what the API's shape
demands · [API optimisation decisions](API_OPTIMIZATION_DECISIONS.md) — what we
chose not to build · [UXP migration](UXP_MIGRATION.md) · [Privacy and
compliance](PRIVACY_AND_COMPLIANCE.md) — what each stored category holds and how
it is cleared
