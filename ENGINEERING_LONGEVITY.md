# Engineering longevity: what holds when the install grows

modelBridge is a Premiere Pro panel. It renders generation forms from fal.ai's
OpenAPI documents, runs generations through a local backend, and keeps a
per-project record of what each one cost. A reviewer evaluating it for
production asks a question the feature list does not answer: does it hold up
over years, on one machine, as the editor's installed models grow toward 50–100
and the catalogue they browse grows past 2,000 entries?

This document answers with what we measured and what we read out of the shipping
source. It covers what accumulates — memory across a session, disk and browser
storage across months, timers across a hidden panel — and the discipline that
keeps those bounded. Speed and network traffic are the subject of
[`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md); the two documents do not
repeat each other's figures.

**Evidence classes.** *Measured* means read from a live panel over the Chrome
DevTools Protocol, or from the process table and the file system, on the date
given. *Read from source* means a constant or a code path in the shipping build,
not a measurement. *Derived* means arithmetic on measured inputs, and is marked
as such wherever it appears. Anything we did not measure is named as unmeasured.

**The reference install**, unless a row says otherwise: 75 installed models, a
1,295-entry catalogue, macOS, Premiere Pro 26.3.2, CEP 12. Every figure is from
2026-09-06 except the browser-storage quota, which was established by a fill
probe on 2026-09-05. Nothing was instrumented and nothing was written under the
data directory; the readings are of the install as it was. This is one
developer's machine after six months of heavy use, which makes it an upper
reference point, not a typical customer.

---

## 1. Three phases, and what each one leaves behind

### 1.1 Startup

Every panel script is a deferred script tag, executed in document order, and a
pre-commit guard fails any module that reads a global whose provider loads
later (§4). Remote fetches on the boot path — the update manifest, the catalogue
snapshot, the licence — each have a cached or bundled fallback, so the boot does
not depend on the network being up. The local backend is spawned after an
identity check on whoever already holds its port (§4).

What a fresh panel holds in memory, **measured** 30 seconds after the panel was
opened from Premiere's Window → Extensions menu, via `Performance.getMetrics`:

| | Fresh panel |
|---|---|
| Documents | 2 — the panel and the host's own empty frame |
| DOM nodes | 2,705 |
| JS event listeners | 345 |
| JS heap used | 12.7 MB |

The steady-state live DOM of the panel document, read the same day on the same
install with the Generate tab open, was 1,724 elements.

**A measurement caveat that matters more than the numbers.** On the host
version we measured, reloading the panel document does not release the previous
one: each reload leaves another document resident, with its nodes and
listeners. A figure read from a developer's panel after a day of reloads is
therefore an N-document figure. The same install read *before* the close-and-
reopen above showed 24 documents, 2,339,648 nodes and 248.8 MB of heap — the
residue of a development session, not the state a customer's panel is in. No
code path a customer can reach reloads the document: switching Premiere
workspaces, switching projects and switching panel tabs all keep the same
document, and closing and reopening the panel starts a new renderer process,
which is the reset the table above measures. Any absolute memory figure for
this panel should be read next to its document count, and we do.

Time to interactive and the number of requests a boot makes are measured in
[`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md) §1 and §3.2 and are not
restated here.

### 1.2 A generation

A generation is submitted through the local backend, then polled. The poll
cadence and its per-generation request count are in
[`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md) §3.1. Two properties are
the longevity-relevant ones, both **read from source**: the pollers keep running
when the panel is hidden, because a paid run has to be collected whichever tab
the editor is looking at; and every poll has a 30-minute soft stop, after which
the run is written as stopped rather than polled forever.

What one generation leaves on disk, **measured** across the reference install's
ledgers:

| Written per generation | Bound |
|---|---|
| One row in the project's ledger file | about 1.7 KB per row (3.5 MB across 2,296 rows); the file rotates, §2 |
| One row in the project's browser-storage mirror | capped at 200 rows per project, and mirrors for projects no longer on disk are pruned |
| One 120-pixel thumbnail | swept after 90 days |
| A recovery token | deleted when the run succeeds |
| A completed-result marker | 24-hour TTL |
| Learned pricing and generation statistics | keyed by endpoint and settings, so bounded by variety, not by volume |

Media staged for upload lives in a directory with a one-hour TTL, swept every
30 minutes. Nothing a generation writes is unbounded.

### 1.3 Catalogue rendering

The catalogue snapshot is held on disk — 569 KB for 1,295 entries, **measured**,
which is 439 bytes per entry — and served stale-while-revalidate on a 30-minute
TTL. Browser storage carries only the snapshot's timestamp and a completeness
marker; a snapshot found in browser storage from an older build is moved to
disk on first read, so the largest evictable key does not sit in the quota for a
whole TTL. The backend keeps its own short-lived copy of the catalogue walk.

Rendering a model's form reads the model's schema from a local cache, not from
the network — [`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md) §2 measures
that path. The cache is keyed by endpoint, holds each entry for seven days, and
carries no entry count cap; on the reference install it held about 100 entries
at about 16 KB each. Browse render timing is measured in the same document, §1.3.

Installed models are re-verified in the background once per 24 hours against an
unauthenticated schema endpoint. That check touches installed models only, never
the catalogue, so its cost grows with the install, not with fal.ai.

---

## 2. Persistent storage: every surface, and what bounds it

Every surface the product writes, with what bounds it and what happens when it
is full or unreadable. Sizes are **measured** on the reference install; bounds
are **read from source**.

| Surface | Written | Size today | Bounded by | Trimmed by | When full or corrupt |
|---|---|---|---|---|---|
| Installed-model registry (disk, mirrored to browser storage) | on every model change or migration, whole file | 726 KB for 75 models | grows linearly with installed models; the browser-storage mirror has a declared budget under the protected-family ledger (below) | nothing — it is the product's primary data | an unreadable file is renamed aside and the newest migration backup is restored |
| Migration backups of that registry | before each migration path's first change in a load pass, whole file | 13.1 MB across 21 files | no cap — see §5 | deleted only on a full reset | never read except to recover |
| Catalogue snapshot (disk) | per catalogue refresh, whole file | 569 KB for 1,295 entries | grows with the catalogue at 439 bytes per entry | replaced whole | unreadable → refetched |
| Backend catalogue copy (disk) | per catalogue walk | 931 KB | 20-minute fresh window, served stale up to 6 hours | TTL | unreadable → walk again |
| Schema cache (disk, mirrored to browser storage) | per schema fetch | 1.6 MB on disk, 3.1 MB in browser storage, about 100 entries | seven-day TTL per entry; no entry cap; evictable | TTL, and LRU eviction in browser storage | browser copy evicted first; disk copy unreadable → refetched |
| Settings | per change | 2.2 KB | fixed set of keys | — | unreadable → defaults |
| Learned pricing, learned constraints, generation statistics, unknown-error counters | per event | under 40 KB together | keyed by endpoint (and settings), so by variety | — | ignored and regenerated |
| Generation ledger, per project (disk) | per generation | 3.5 MB, 9 files, 2,296 rows | the live file rotates at 1,000 rows and is trimmed to 500; two rotated slots stay beside it | rotation | a corrupt file is renamed aside and the project reads as empty until the next write; rotated slots and the archive are untouched |
| Ledger archive | when a rotated slot rolls off | empty today | no cap — see §5; about 0.8 MB per 500 rows, derived | nothing | — |
| Ledger browser-storage mirror | per generation | — | 200 rows per project; mirrors for projects no longer on disk are pruned; a protected family with a declared budget | prune on load | falls back to disk |
| Exported reports | per export | 8.4 MB, 46 files | user-owned; a name collision gets a numbered suffix rather than an overwrite | nothing | — |
| Thumbnails | per generation | 512 KB, 107 files | 90-day sweep, run shortly after the backend starts | sweep | — |
| Upload staging | per upload or extraction | 0 | one-hour TTL, swept every 30 minutes | sweep | — |
| Usage events | per event | 12 KB | 2,000 active entries; archive capped at 5 files or 5 MB | prune | — |
| Agent scan logs | per agent scan | — | seven-day sweep, every 12 hours | sweep | — |
| Backend in-memory schema cache | per fetched endpoint | — | the backend process's lifetime; the backend is stopped when the panel unloads | process exit | — |

Data directory total on the reference install: 32.7 MB, of which 13.1 MB is
migration backups and 8.4 MB is reports the user exported.

**Outside the panel's control.** The browser engine keeps an HTTP cache, a
compiled-code cache and a storage database for the panel's origin, in a
per-Premiere-version profile the panel neither sizes nor clears. Measured on the
reference machine: 330 MB of HTTP cache (171 entries, dominated by full-
resolution result images the preview renders from fal.ai's CDN), 19 MB of code
cache and 1.7 MB of storage in the live profile, and a 296 MB profile left by
the previous Premiere version. The engine manages the live one on its own
least-recently-used policy. The dead one is what an application upgrade leaves
behind, and it is not ours to delete.

### 2.1 Browser storage, and what happens at the quota

The origin's `localStorage` quota is 5 MiB of UTF-16 code units — 10 MiB
counted in bytes, which is the unit the panel measures in. **Measured**
2026-09-05 by a fill probe: 9.97 MB accepted before a 32 KB write was refused.
On the reference install on 2026-09-06: 92 keys, 5,552 KB, 54.2 % of quota.

Three things keep that number from becoming a failure:

- **Managed writes evict before they fail.** Writes that go through the storage
  manager are tracked with a last-used time. Above 75 % of quota a write first
  evicts 1 MB of the least-recently-used tracked keys and retries; if the retry
  also fails, the editor is told once per session and the write returns false
  rather than throwing.
- **Protected families are budgeted, not hoped about.** Keys the product must
  never evict — installed models, credentials, settings, the ledger mirrors and
  a handful of others; 24 keys and 905 KB on the reference install — are exempt
  from eviction, so each protected prefix declares a worst-case byte budget and
  the reason it is a ceiling, and a pre-commit guard fails the commit if a
  protected prefix has no budget or the declared sum crosses the eviction
  threshold (§4). The installed-model mirror's budget is 1,400 KB against a
  measured 898 KB today.
- **A failed write is recorded, not lost.** When a browser-storage write fails
  for a key that also has a disk copy, the key is marked stale on disk, so the
  disk copy wins the next read instead of an older browser copy being served
  as current.

### 2.2 Migration when a persisted format changes

Persisted formats carry a schema version. A migration that touches the
installed-model registry runs behind one wrapper, **read from source**: it
writes a timestamped backup of the whole registry first and aborts if that
write fails; it dry-runs the migration on a clone and aborts if the dry run
throws; and it hands each model to the migration function individually, so the
function cannot reach the array it lives in. A model's parsed input fields carry
the version of the parser that produced them, and a parser change re-parses
every installed model from its stored schema on the next load, without a
network call. An unreadable registry file is renamed aside and the newest backup
restored.

The wrapper's guarantees are read from source; the state of its test coverage
is recorded in [`UXP_MIGRATION.md`](UXP_MIGRATION.md) §3 and is not overstated
here.

---

## 3. Scaling profile

**What was not run, stated first.** A projection to 100 installed models and
2,500 catalogue entries was designed and reviewed — synthetic fixtures built by
the panel's own schema parser, a two-by-two matrix over both axes, a restore
protocol for the live data directory — and then deliberately deferred. The
numbers that decide where the curve bends are a customer install's numbers,
and a real installation will produce them without a live data directory being
mutated to find out. Until then, what can be stated is the growth per unit read
off today's install, and which surfaces are constructed not to grow with the
axis at all.

| Axis | What grows with it | Rate | Class |
|---|---|---|---|
| Installed models | the registry on disk | about 9.7 KB per model | derived from 726 KB / 75 |
| | its browser-storage mirror | about 9–12 KB per model, inside a 1,400 KB budget | derived |
| | each migration backup | one whole registry per migration event: about 0.7 MB at 75 models, about 0.2 MB at 20 | derived |
| | the 24-hour background re-verification | one unauthenticated request per installed model per day | read from source |
| Catalogue entries | the disk snapshot | 439 bytes per entry — about 1.1 MB at 2,500 | derived from 569 KB / 1,295 |
| | the backend's copy | the same order | measured at 931 KB |
| Generations | the live ledger | bounded: rotates at 1,000 rows, trimmed to 500 | read from source |
| | the archive | about 0.8 MB per 500 rows, never trimmed | derived |
| | what the panel loads into memory | grows with the number of projects, not with rows — rotated slots and the archive are never read on load | read from source |

**Constructed not to grow with the catalogue.** Browser storage: the snapshot
lives on disk and only its timestamp and marker are in the quota. The schema
cache: keyed by models the editor has opened in the last seven days, not by
entries in the catalogue. The recurring timers: a fixed set in the source
(§4) — 17 through the guarded wrapper and 21 with a stated reason — whose count
does not change with either axis. And the catalogue synchronisation itself runs
in our cloud layer once per catalogue, not once per customer (§4).

**Unmeasured, and named.** Two render paths in Browse scale with the product of
catalogue entries and installed models rather than with either alone; they are
the reason the deferred matrix has two axes. How much the panel asks of
Premiere's scripting engine on a feature-length timeline is the largest open
measurement in the sibling document and is not repeated here. And nothing in
this document was measured on Windows.

---

## 4. What keeps it that way

**Pre-commit guards, run on every commit.** A guard that cannot be shown to say
no is decoration, so each one below is also run against a planted violation by
a self-test in the same hook, and the commit fails if a guard passes the
violation.

- `check-load-order` — parses the panel's script order and every global
  provider, and fails a module-scope read whose provider loads later (a
  parse-time error), or a guarded read whose fallback would silently ship for
  the whole session.
- `check-poll-visibility` — every recurring timer in the panel either goes
  through the one visibility-aware wrapper or carries a stated reason on its
  line; an exemption without a reason fails. The same guard refuses a
  self-rescheduling poller that re-arms from more than one site, because such
  a chain cannot be stopped reliably.
- `check-docs-links` — every documentation anchor the panel can emit must
  exist in a committed snapshot of the docs site, refreshed by a daily job;
  the live half of the check runs in CI against the served pages.
- `check-storage-budget` — the protected-family ledger from §2.1: every prefix
  the storage manager protects must declare a worst-case budget, and the sum
  must stay under the eviction ceiling.

**Regression suites.** The test count, its pass state and the date it was
measured are in [`ARCHITECTURE.md`](ARCHITECTURE.md), where a guard checks the
published figure against the run that produced it. It is not repeated here,
because a number quoted from another document is how a test count goes stale.

**One interval wrapper, and a stated run-hidden set.** The visibility guard is
applied in one place: a wrapper that starts a recurring timer and skips its
callback while the panel is hidden. A timer that must keep running says so in
the call. The set that runs hidden today, **read from source**: generation
polling; the backend keep-alive; a once-a-minute liveness sweep of background
rows; the telemetry flush, which returns immediately on an empty queue; and the
project-template sync pair, which holds one host call in flight at a time and
pauses while the agent or a generation is busy. Every other recurring timer
skips its work while the panel is hidden, apart from short-lived UI countdowns
that clear themselves. Of the timers that reach fal.ai at all, none reaches an
endpoint that charges: the recurring ones fetch public schema documents, and a
running generation's status poll reads a request that was already paid for at
submit. Money leaves only at submit, which is user-initiated.

**Log rotation that archives.** The per-project ledger rotates when the live
file reaches twice its trim target, so a rotation happens once per 500
generations rather than once per append. Two rotated slots stay beside the live
file; older slots move to an archive directory rather than being unlinked.

**Port-conflict resolution that identifies before it acts.** When the backend's
port is already held, the panel identifies the holder and stops only a process
it can prove is its own backend — by the working directory it was spawned in,
or the path of the bundled binary inside the extension. When identity cannot be
established, nothing is killed; a foreign holder is named to the editor, with
the port number as a trailing technical aside.

**Catalogue synchronisation gated on content.** The cloud layer's catalogue
phase runs roughly every six hours. The published snapshot is rewritten only
when a hash over its content-bearing fields differs from the one stored for the
previous run, and the documentation site is rebuilt only in that case — so a
quiet catalogue produces no writes and no deploys.

---

## 5. What is deliberately not solved, and the trade behind each

**Migration backups are not reaped.** Every migration path writes a full copy
of the registry before its first change, and nothing deletes those copies short
of a full reset. The trade: a backup that outlives its usefulness costs about
0.7 MB of disk at 75 models; a backup deleted a day too early costs the only
copy of the editor's models. Backups are written on migration events, not per
boot — measured: a panel open in steady state wrote none — so the pile grows
with releases, not with use. We chose the disk.

**The ledger archive is never deleted.** Cost history is the receipt an editor
hands to a client, and rotation already bounds what the panel loads. Deleting
history to save disk in the order of a megabyte per 500 generations is a
decision we would rather leave with the editor, who can reset it from the
Billing tab.

**Generation polling runs while the panel is hidden.** A run the editor has
paid for is collected whichever tab is in front. The cost is local requests to
the backend, not money, and the 30-minute soft stop bounds it.

**The projection is deferred, not dropped.** The numbers that decide where
memory or render time bends — heap per installed model, milliseconds per
catalogue row, the backup pile's real rate — belong to real installs, and a
synthetic fixture answers a question about customers who do not exist yet at
the cost of mutating a live data directory. The design is kept; it runs on the
first installations that reach the scale it asks about.

**The browser engine's cache directory is left to the browser engine.** It is
managed on the engine's own policy, and a profile left behind by a previous
Premiere version is the application's, not the extension's, to remove.

**The backend's schema cache is process-bound.** It lives as long as the backend
process, which is stopped when the panel unloads. No stale schema survives a
restart; the cost is one refetch per endpoint per session, and the panel's own
seven-day cache answers first.

---

## Reproducing this

| Figure | How |
|---|---|
| Memory after a fresh open | Close the panel, reopen it from Window → Extensions, read `Performance.getMetrics` over the DevTools protocol 30 s later. Report `Documents` beside every absolute figure |
| Storage sizes | List the data directory and the panel origin's browser storage; classify each key as protected, tracked or untracked by the storage manager's own prefixes |
| Backup rate | Count the registry's backup files before and after a panel open; a steady-state open adds none |
| Timer inventory | Run `check-poll-visibility`; it prints the wrapped count, the exempted count and any violation |
| Quota | A fill probe: write until refused, then read the panel's own percentage against the byte total the probe reached |

Everything above is reproducible against any install with the DevTools port
open, and reads the install rather than instrumenting it.

---

## Related

- [`PERFORMANCE_AND_LOAD.md`](PERFORMANCE_AND_LOAD.md) — how fast the panel is
  and how often it asks each service; the cadence and traffic figures this
  document refers to rather than restates.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how the layers fit, and the test
  figure with its guard.
- [`UXP_MIGRATION.md`](UXP_MIGRATION.md) — the same reporting form applied to
  the platform transition, including the migration wrapper's test state.
- [`PRIVACY_AND_COMPLIANCE.md`](PRIVACY_AND_COMPLIANCE.md) — what each stored
  category contains and how the editor clears it.
