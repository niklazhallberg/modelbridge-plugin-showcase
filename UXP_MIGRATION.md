# CEP → UXP: where this migration actually stands

Adobe is moving Premiere Pro extensions from CEP to UXP. modelBridge runs on CEP
today. This document reports what we have measured about that transition — what
is already isolated, what cannot be adapted and has to be rebuilt, where our own
early decisions were wrong, and what we need from the platform to finish.

It is written for engineers who know this ground better than we do. So it leads
with numbers rather than adjectives, and every figure is dated: these are
measurements of a moving codebase, not properties of it. Anything we have not
measured is marked as unmeasured rather than estimated.

**Figures measured 2026-08-19, re-measured 2026-08-30, with a live host check on
2026-09-01.** Where two readings differ, both are shown. Anything carried forward
without re-measuring says so.

---

## 1. What is isolated today

The strategy has been to put platform-specific calls behind adapters inside the
CEP codebase, so the migration becomes a swap of implementations rather than a
rewrite of everything that touches them. Progress, as quotas with denominators:

Re-measured 2026-08-30, eleven days after the first reading, and both readings are
shown because the movement is the more useful number:

| Platform surface | Routed | Direct left | Adoption | 19 Aug |
|---|---|---|---|---|
| Path construction | 72 | **0** | **100 %** | 57 / 0 — 100 % |
| Opening external URLs | 20 | **0** | **100 %** | 20 / 0 — 100 % |
| Provider API key storage | 16 | **0** | **100 %** | 13 / 0 — 100 % |
| Premiere host calls | 141 | 43 | **77 %** | 133 / 47 — 74 % |
| File system, by acquisition site | 44 | 46 | **49 %** | 34 / 45 — 43 % |
| File system, by API invocation | 44 | 82 | **35 %** | 34 / 107 — 24 % |
| **Browser storage (`localStorage`)** | 0 | **384** | **0 %** | *not measured* |

**The last row is new, and it is the reason to re-read the other six.** Until
2026-09-01 this table had six rows, and the panel's largest platform dependency
was not one of them. `localStorage` is 384 call sites across 50 files — more than
the file-system invocations, the host calls and our hardcoded backend URLs
combined — and UXP does not provide it. Its replacement is asynchronous, so it is
the same signature change as the file-system row at roughly three times the size.

We are not building the adapter, deliberately, and section 4 says why. What we
are doing is refusing to publish an adoption percentage over a denominator that
silently excluded its biggest term. Every figure we published before this date
was computed that way.

Three surfaces are finished: not "mostly", but zero remaining direct calls,
verified by search across the panel source. (The first version of this table said
"two", while listing three — an editing error rather than a measurement one, but
it is exactly the kind of slip that makes a reader stop trusting the table, so we
would rather correct it than quietly fix it.) Host calls are three-quarters
converted. File I/O is the laggard, and the two file-system rows are given
separately on purpose — counting acquisition sites flatters the number, because
most files acquire the module once and then call it many times.

### A surface holds where something holds it

Every quota above held or improved over eleven days. What the totals hide is
where the new work went. Counting only lines **added** to the panel in that
window:

| Direct platform call added, 19–30 Aug | Count |
|---|---|
| File system (`fs`) | **17** |
| Everything else — path, shell, credentials, host calls | **0** |

We first wrote this up as drift, and it is mostly the opposite. Thirteen of the
seventeen are in one file, `js/usage/cepHostAdapter.js`, and a pre-commit guard
puts them there on purpose: every other file in that subsystem is mechanically
forbidden from touching the file system, `CSInterface`, or the ExtendScript
bridge, so the layer has **one file to rewrite for UXP instead of five**, and a
test suite that still runs without a host. It is the newest code in the tree and
the best-prepared part of it.

The genuine unguarded drift is **four calls**, in two older files that no guard
covers.

We are reporting the correction rather than the tidy version because the tidy
version was more flattering to our thesis and less true. The real lesson is
narrower and more useful than "unfinished surfaces drift": a surface holds where
something holds it. Three surfaces are at 100 % because they are finished. One
subsystem is clean because a guard keeps it clean. Everywhere else, the file
system absorbs new work at whatever rate new work is written.

### The distribution matters more than the average

Adoption is not a uniform 77 %. It is split by subsystem, and that is a
deliberate ordering rather than an accident:

- **The agent layer is essentially fully bridged** — 129 of its host calls go
  through the adapter.
- **The generation pipeline is essentially unbridged** — 40 direct calls across
  four modules that carry media extraction, validation, preview and dual-model
  runs.

The generation pipeline is the launch-critical path, and the adapter wraps calls
in promises with deadline semantics. Converting it changes timeout and error
behaviour in the code where a failure costs a customer money. We are converting
it after launch, deliberately, rather than reporting a rounder number now.

---

## 2. What cannot be adapted

Three things do not change shape. They change substance, and no adapter layer
helps with any of them.

### 2.1 UXP cannot run FFmpeg — so the backend becomes a companion app

modelBridge's local backend runs as an Express server that shells out to FFmpeg
and FFprobe for every media operation that touches real footage, and uses one
native image-processing addon. UXP has no Node runtime in-panel, and while it
*can* launch a process, the documented `launchProcess` permission "is not
possible to pass any parameters, nor to capture the output of the command" —
which is precisely and only what we need it for. That is not a gap we can adapt
around; it means the backend has to become a separately installed sidecar that
the panel talks to over HTTP.

(This heading read "UXP cannot spawn processes" until 30 August. That was too
strong, and being too strong in our own favour is worse than being wrong in the
abstract: it made the companion application sound forced on us by an absolute
limit, when the real reason is a specific and narrower one. The conclusion is
unchanged; the argument for it is now the correct argument, and section 7 records
what the platform can do instead.)

Measured against the current backend:

- **61 routes** in total (58 on 19 Aug). **25 are network-only** and could move to
  direct `fetch()` from the panel or to our existing edge worker.
- **16 routes spawn a child process. 13 of those invoke FFmpeg or FFprobe.**
- **1 native addon** (image processing), used by 3 routes, which must load from
  real disk rather than from a packed snapshot.

Only the route total was re-measured on 30 Aug; the three breakdowns below it are
the 19 Aug reading, carried forward unverified. We are saying so rather than
letting a re-dated header imply all four moved together.

An earlier internal plan put the FFmpeg dependency at 5 endpoints and described
it as "the extraction pipeline". Re-measuring found 13, and the eight it had
missed are what make this a product-wide dependency rather than a feature-level
one: result delivery, thumbnail generation, preflight validation, and the
agent's own media inspection all sit on it.

**The part that is easy to underestimate is not the process spawning — it is the
layout.** The backend resolves its own root at runtime to find its
configuration, its staging directory, its native addon and its prompt files;
those resolutions have **29 call sites across four modules**. (We published 56
across two. Re-measured 30 Aug it is 29 across four — our own figure was roughly
double the real one, in the direction that overstates our difficulty, which is
the direction a reader should be most suspicious of.) A sidecar that does
not preserve the same relative layout does not fail loudly. It starts, serves
most routes, and breaks three unrelated things quietly, one feature at a time.
That is the class of failure we are designing the sidecar packaging around, and
it is why "just ship the server separately" is a larger piece of work than it
sounds.

**What the panel side actually costs, measured 2026-08-30.** The scary-sounding
half turns out to be the cheap one. `ServerManager` — the module that spawns and
supervises the backend, and whose whole reason for existing disappears — is
called **39 times from 13 files**, and the distribution decides the work:

| Method | Calls | Under a companion application |
|---|---|---|
| `ensureRunning` | 30 | Same contract ("the backend is up when this resolves"), different body: launch-and-health-check instead of spawn-and-health-check |
| `restart` | 9 | Becomes a URL-scheme call |
| `getBackendOrigin` | 5 | Unchanged |
| `nodeAvailable` | 4 | Disappears — no system Node to find |
| `isServerDown` | 2 | Unchanged |

Seven call sites survive untouched, thirty change meaning but not shape, four
disappear. That is a body change on the panel side, not a signature change —
**provided** the 79 hardcoded `http://localhost:3000` strings across 35 files
route through `getBackendOrigin()` first. Today they do not, and each one is a
place where the sidecar's port and scheme are written down again. Consolidating
them is on our own list as a pre-launch item, because it is a string constant
with no behaviour attached and it converts the largest remaining unknown in this
section into a one-function edit.

**The launcher is reserved, because it cannot be added later.** A URL scheme is
registered by the installer, and an installer that has already run does not
re-register itself. So the scheme ships in the first `.pkg` even though nothing
calls it yet — a scheme chosen after customers are installed is a forced
reinstall, not an update. This is the one packaging decision we could not defer,
and the reason we went looking for `launchProcess` in the first place.

We are not asking Adobe to solve this. We are stating it so that the scope is
visible: for us, UXP migration and building, signing, distributing and
auto-launching a companion desktop application are the same project.

### 2.2 The panel loads as 114 script tags, which UXP does not support

The panel is 114 script tags — 107 of them panel modules, all deferred, sharing
state through 802 distinct globals. (106 / 99 / 753 on 19 Aug; the surface grew
by eight modules and forty-nine globals in eleven days, which is worth knowing
when reading any of the numbers in this document as a fixed property.) UXP requires a
bundled entry point. This is a known, mechanical rebuild, and we treat it as
such; the interesting part is section 4, where we describe the one thing we did
that made it tractable.

### 2.3 Twenty-two user-facing operations depend on the QE DOM

This is the finding we most want a platform answer on.

Premiere's QE DOM is undocumented and unsupported, and a set of timeline
operations have no equivalent in the supported ExtendScript DOM. In modelBridge,
**22 user-facing operations have QE as their only implementation** — all of them
in the agent layer, all of them timeline editing: precision trim variants,
razor/split, effect and transition application, track manipulation, clip speed,
and the related family. When QE is unavailable, these fail hard. There is no
degraded path, because there is nothing to degrade to.

Two things sharpen the picture:

- **The direct reference count understates the exposure by roughly five times.**
  Counting the entry points gives 48 references; counting what those entry
  points then manipulate gives 234. Sizing this migration from the entry points
  alone would underestimate it by a factor of five, and we suspect we are not
  the only extension that has made that arithmetic error.
- **Our core generation path does not depend on QE.** Media import uses the
  supported DOM and reaches for QE only as a recoverable fallback when track
  creation fails, then reports an honest error if both routes fail. So the
  product survives QE loss; the agent layer, which is our differentiator, does
  not.

We are not claiming this is Adobe's problem to fix on our schedule. We are
saying that our most differentiated functionality currently rests on an
unsupported API, we know exactly how much of it does, and we would rather ask
now than discover the answer during a beta.

### 2.4 The ExtendScript surface is larger than our own mapping

Our host layer defines **276 global ExtendScript functions** (261 on 19 Aug —
the surface we have to port is growing while we measure it). Our own
CEP→UXP parity table covers **23 of them with a live mapping — 8.3 %**. The
unmapped 91 % is not evenly distributed: it is concentrated in the agent tool
layer and the QE-dependent operations above.

We are reporting this number because the alternative — quoting the parity table
as though it described the whole surface — is how a migration plan becomes
comforting instead of useful. The table's own summary reads "0 confirmed
impossible", and that holds only over the 9 % it examined.

### 2.5 Machine identity, and what an account-bound identity would do to a seat

Our licence binding rests on an install identity derived from the machine: a
salted digest of the strongest platform identifier the host will answer with,
recomputed on every call and never read back off disk. It is what makes the
device binding survive someone copying a folder, and it is the local half of a
"two registered computers, one generating at a time" seat model.

UXP offers `userInfo.userId()` — a GUID that is **bound to the Adobe account,
not the machine**, and that Adobe's own developer forum reports is a *different*
identifier from the one CEP exposes, with no published mapping between them.

Swapping one for the other is not a like-for-like substitution, and the
consequence is specific rather than theoretical. Under an account-bound
identity, one person on two machines presents the **same** identifier, so a seat
model sees one device where the customer has two and the second activation is
indistinguishable from the first. Two people sharing one machine present two
identifiers where the licence should see one. Neither is detectable locally, and
both are the kind of error that shows up as a support conversation about
something the customer did not do.

The position we have landed on, measured 2026-08-30: our identity provider is a
single named function with one caller, and it lives in the local backend — the
process that becomes the companion application and keeps a full runtime. So the
machine-derived identity does not have to enter the UXP sandbox at all, and the
account-bound GUID is not a dependency we need to take. We are reporting this
because our own earlier planning assumed the opposite, and treated the licence
chain as something the migration would have to rewrite.

**Measuring that turned up a live defect, and it is worth reporting at its real
size rather than the size it first sounded.** The panel had a *second* producer
of the same id: it read its own cached copy first, and when that disagreed with
the backend's file it wrote its own value back over it. On installs whose cache
predated the switch to a machine-derived id, the file oscillated — every
licence-gated request restored the derived value, every use of the mobile-preview
feature replaced it with a random one.

What that did **not** affect is the licence binding, which is where we first
expected the damage: the binding compares against the derived value and never
reads the file as authority, and the panel sends no identifier to any licence
call. What it did affect is the file's two actual jobs — telling us which install
we are looking at when a customer writes in, and letting the panel converge on
the backend's value. Fixed 2026-09-01: one producer, the panel reads and never
writes, and it now returns nothing rather than inventing an id when the backend
has not written one yet. Pinned by a test that fails on five assertions against
the previous build.

The general shape is one we keep finding in our own code and have a written rule
for: the same truth produced independently in two places, agreeing until it
doesn't. It is also the reason the UXP answer here is a provider swap — one
producer is portable, two are a merge.

What we would still like to know is in question 6 below.

---

## 3. What we got right

These were decisions made for other reasons — mostly to stop recurring bug
classes — that turned out to be migration groundwork.

**One machine-checked dependency graph.** A pre-commit guard parses the panel's
script order and every global provider, and fails the commit when a module reads
a global whose provider loads later. It maps 802 providers across 107 scripts and
currently reports zero violations. It was built because that failure mode had
shipped twice, in two different disguises. Its side effect is that the
inter-file half of the import graph a bundler needs already exists as a
machine-checked artifact rather than as folklore — which is exactly the thing
that is normally lost when a codebase of this shape is bundled.

**One resolver per question.** Fifteen questions that used to be answered
independently in several places — is this model installed, does this endpoint
resolve, does this generation count as spend, is this licence state indeterminate
— now have exactly one implementation each. A port re-verifies each once instead
of finding the fourth copy in production.

**One error pipeline.** Every user-facing error in the product, from 128
producer sites, passes through one translator and one renderer. UXP will change
how surfaces behave; concentrating that in one renderer means the migration
touches one component rather than 128.

**Versioned persistent formats, behind a migration wrapper — safeguarded in code,
not covered by a test.** Persisted data carries a schema version, and migrations
run behind a wrapper that takes a backup first, dry-runs against a clone second,
and aborts rather than proceeding when either step fails. That wrapper exists
because a migration once destroyed user data, and it is the reason we are not
writing one under time pressure during the port.

We described it here as "tested" and it is not. Re-measured 2026-08-30: the
wrapper's guarantees are read from the source, not proven by a regression — it
has no automated test, and neither do the six other migration paths beside it.
Nothing structurally forces a migration through it either, so a UXP data
migration could be written that bypasses it entirely. We have raised it to P1
internally rather than restate the stronger claim. The distinction we want to
hold onto: a safeguard whose incident is real and whose proof is absent is still
worth more than no safeguard, and is worth less than the sentence we first wrote.

---

## 4. What we got wrong

Two substantive errors, both still live as of this writing, and one smaller one
we have closed. Neither of the first two is fixed by this update — reporting them
is not the same as having dealt with them, and we would rather the distinction be
visible than flattering.

### 4.1 Our storage adapter is synchronous, and that was our own rule violation

Our development policy says new storage and host APIs must return promises, so
that CEP's synchronous behaviour does not leak into call sites that will have to
be asynchronous under UXP. The host-call adapter and the credential adapter
follow it. The storage adapter does not: all ten of its methods return values
directly.

The consequence is precise. UXP's file system API is asynchronous, so replacing
the adapter's implementation is not a body swap — it is a signature change at
every one of its 44 call sites, plus the 82 file-system invocations not yet
converted, plus **19 module-load-time reads** that will have to be restructured
because they run before anything can await. (34 and 9 on 19 Aug. Both halves of
this mistake grew.) We built the largest of our adapters in the shape that makes
its own replacement hardest, in the one place our policy explicitly warned
against it.

### 4.2 The largest platform dependency in the panel had no quota row until today

The panel makes **384 `localStorage` calls across 50 files**, and UXP provides no
`localStorage`. That is the same asynchronous signature change as the file-system
one, at roughly three times the size.

It had no adapter, no row in the table in section 1, and no mention in our
migration plan except as a data-migration footnote. So the error is not that the
work is undone — it is that **we were publishing an adoption percentage over a
denominator that excluded its largest term, and describing the result as
readiness.** Six surfaces were measured and reported; the seventh was bigger than
several of them combined. A reader could have checked the six we listed and found
every one of them accurate, which is what makes this the more serious of the two:
the numbers were right and the frame was wrong.

The row is in section 1 as of 2026-09-01. The adapter is deliberately not built —
384 sites is the largest mechanical change in the codebase, and building it
against a storage API we have not yet used is how you commit to the wrong shape
at the worst possible scale. We would rather carry a visible 0 % than an
invisible one.

### 4.3 Closed: two adapters we planned and did not need

An earlier internal plan specified adapters for platform event handling and file
dialogs. Measuring the surfaces they were meant to cover found two event
listeners and zero dialog calls. We did not build them. Speculative abstraction
ahead of a measurement is how a migration plan grows work that protects nothing —
and this is the one item in this section that measurement resolved in our favour,
which is why it is here rather than in section 3.

---

We report this section rather than the three 100 % rows alone because a migration
readiness claim that contains no mistakes is not a measurement of a migration. It
is a measurement of how hard someone looked.

---

## 5. Open questions to the platform owner

Asked as engineers who have already measured the answer's cost to us.

1. **Frame and clip export.** Is there, or will there be, a UXP API for
   extracting a frame or a media range from a timeline clip? This single
   question determines whether our companion application is a permanent part of
   the architecture or a transitional one. It is the highest-leverage unknown we
   have, and we re-check it monthly.

2. **Supported equivalents for the QE-dependent operations.** For the 22
   operations in section 2.3 — the timeline editing family with no supported DOM
   equivalent — what is the intended UXP path? We are not asking for QE to be
   preserved. We are asking which of these operations are expected to have
   supported equivalents, so we can tell the difference between "not yet" and
   "not planned" before we commit a beta to it.

3. **Source Monitor.** Is the Source Monitor scriptable from UXP, and to what
   depth? Opening a result for full-resolution evaluation and reading its In/Out
   points is a workflow our users rely on daily.

4. **Hybrid plugins and the sandbox boundary.** Hybrid plugins (announced April
   2026, Premiere 26.2) load dynamically linked C++ libraries at runtime, and the
   announced use cases include performance-intensive audio/video processing. That
   raises a question we cannot answer from the documentation: **could a hybrid
   plugin link a media library directly — `libavcodec` and friends — instead of
   shelling out to a binary?** If it could, the companion application in section
   2.1 is transitional rather than permanent, and this is the only development we
   have seen that would change that conclusion.

   What we cannot find, and what we would need before designing against it:
   Adobe's own statement of the sandbox boundary for native modules. Whether a
   hybrid plugin may read and write arbitrary user file paths rather than
   plugin-scoped storage; what it may and may not do with processes and sockets;
   and whether any of that is contractual or incidental. Third-party write-ups
   describe the restrictions as "relaxed"; the hybrid-plugin pages we can find on
   developer.adobe.com say nothing about it either way.

   We are also aware this is not purely a technical question for us: linking a
   GPL/LGPL media library is a materially different licensing obligation from
   invoking a separate binary, and we have not yet asked our own version of that
   question. We mention it so the ask is honest — we are not requesting a
   capability we have already cleared for our own use.

5. **Secure storage, when the data is a seat rather than a session.** We asked
   this before as a durability question. The documentation has since answered
   that part plainly — secure storage "should be regarded as a cache rather than
   a persistent storage", and stored data "should be able to be regenerated from
   plugins after the time of loss" — so the open question is not how durable it
   is, but what the supported pattern is when regeneration is not free.

   The concrete case, which we have now built and can therefore cost: a licence
   activation consumes one of a small number of device slots. If local state is
   lost, the plugin cannot regenerate it locally — it has to re-activate, and a
   re-activation against a server that still holds the previous activation
   either consumes a second slot or has to be reconciled by a release call that
   depends on the very identifier that was lost. The failure is not a customer
   signing in again; it is a customer with two devices discovering they have
   one, after a loss that Adobe documents as expected and that the plugin has no
   event for.

   So: what is the recommended pattern for a value that must survive, when the
   platform states it may not? Specifically — is there a supported signal that
   secure storage was cleared (as distinct from never written), so a plugin can
   tell a first run from a loss? That single distinction is the difference
   between a silent double-consumption and a recoverable one.

6. **Machine-scoped identity.** Following section 2.5: is there a supported way
   for a UXP plugin to obtain an identifier scoped to the **machine** rather
   than to the Adobe account? We are not asking for hardware serials — a stable,
   opaque, per-installation value that survives a plugin reinstall is enough. If
   the answer is no, we would like to know that it is deliberate, because it
   decides whether a device-based licence model is something Adobe intends
   plugins to be able to implement at all.

7. **Companion applications and marketplace policy.** If frame export does not
   arrive, our architecture requires a separately installed helper application.
   What is the current guidance for extensions that depend on one — for
   distribution, for review, and for the permissions the panel needs to talk to
   it?

---

## 6. No-Go criteria for our UXP beta

We will not ship a UXP beta while any of these is true. They are written as
refusals rather than goals so that a slipping date cannot quietly become a
lowered bar.

1. The core path — select a clip, generate, import, place on the timeline — does
   not work end to end on both macOS and Windows.
2. The companion application fails to launch or loses its connection without a
   recovery path a non-technical user can follow.
3. Data migration loses any irreplaceable customer data: installed models,
   credentials, licence state, or cost history.
4. Licence migration consumes an additional device slot without explicit
   consent.
5. More than three of the host operations we have marked "needs prototype" have
   no working UXP equivalent.
6. Any operation exceeds its performance budget by more than 50 %.
7. The Windows path is unverified on real hardware — including installation,
   media extraction, import, and behaviour after an application restart.

---

## 7. What we re-verify, and why this document has a date on it

Every figure here describes a codebase that changes weekly. We re-measure rather
than re-quote, because we have watched our own numbers rot: an internal plan
from April 2026 carried figures that were wrong in both directions by the time we
checked them in August — one dependency understated by more than half, another
subsystem it treated as migration work turned out to be dead code we then
deleted. Four of our own documents at one point stated four different values for
the same count.

Re-checked monthly: Adobe's CEP timeline; whether frame export has arrived in
UXP; **whether hybrid plugins can do what our companion application does** (see
below); the Source Monitor and secure storage answers above; marketplace guidance
for companion applications; and our own adoption quotas, which are produced by
search over the source rather than by hand.

**The two checks that could retire an architecture, and what would have to be
true.** Both are written as falsifiable conditions rather than as things to keep
an eye on, because "keep an eye on it" is how a monthly check becomes an annual
one.

| Check | What would have to be true to change the decision | What we do if it is |
|---|---|---|
| **Frame export** | A UXP API that returns a frame or a media range from a timeline clip, at full resolution, without a round trip through the file system we are not allowed to write to | The companion application loses its main reason to exist. Most of the 13 FFmpeg routes become unnecessary rather than relocated |
| **Hybrid plugins** | All four, and the fourth is the one that decides it: (1) a hybrid plugin may link a media library such as `libavcodec` rather than shell to a binary — plausible, since Adobe names "performance-intensive audio/video processing" as a use case; (2) it may read and write arbitrary user file paths, not only plugin-scoped storage; (3) the licensing of what we would link is compatible with a commercial plugin; (4) **Adobe documents the sandbox boundary**, rather than us inferring it from third-party write-ups and shipping a customer-facing dependency on an inference | The sidecar becomes transitional. We would still ship it first — a hybrid rewrite of the media layer is not a launch-window project — but we would stop designing its installer as a permanent part of the product |

As of this writing, hybrid plugins clear (1) as far as Adobe's stated use cases
go, and we cannot evaluate (2) or (4) at all: Adobe's own hybrid-plugin pages say
nothing about the sandbox, file system, process control or networking. That
silence is the finding. We are not going to design around a capability whose
boundary is only described by people who are not Adobe.

### What the 30 August / 1 September re-check found

Four things moved, three on the platform side and one under our own hands, and we
would rather record them here than have this document read as though nothing had.

**The support window is stated, and it is short.** Adobe's own PProPanel sample
ReadMe (updated November 2025) says CEP extensions "have been superseded by UXP
Extensibility" as of Premiere 25.6, and that "the plan is to support both CEP and
UXP for a calendar year, after which we will remove support for CEP
extensibilty." A calendar year from 25.6 lands around November 2026. We have seen
"several years" quoted second-hand elsewhere, and Adobe has published no date, so
we are treating this as a range rather than a deadline — but the short end of the
range is months, not years, and we had been planning against the long end.

**CEP still works in Premiere Pro 26.3.2. We measured it rather than inferred
it.** There is a widely-linked bug report against another extension titled "CEP
extension not loading due to UXP migration", asserting that the platform no
longer recognises CEP extensions in Premiere 2026. If that were true it would
change our timeline from months to zero, so we ran the full chain on 2026-09-01
against **Premiere Pro 26.3.2**:

| Step | Result |
|---|---|
| Panel loads and renders | works |
| Local backend spawns and answers its health check | works |
| A generation runs end to end | works |
| Result imports to the timeline through the ExtendScript bridge | works |

So the report describes an installation-path problem, not a platform removal —
consistent with its own detail, which is about where an installer placed files
rather than about the extension being refused. We are stating this because the
claim is circulating and is load-bearing for anyone else's planning, and because
an unverified "CEP is dead in 2026" is exactly the sort of thing that makes a
team abandon a working shipping path.

**What that measurement does not establish**, since it would be easy to read it
as more reassuring than it is:

- It is one version on one platform on one machine. Support can be withdrawn in
  a point release, and nothing about 26.3.2 working says 26.4 will.
- It says nothing about Adobe's intent. The "calendar year" sentence stands
  unrebutted; we found no statement extending it, and a version that still loads
  CEP is not a commitment that the next one will.
- We plan against the short end of the range regardless. The measurement removes
  a false alarm; it does not buy time.

**UXP can launch a process, but not the one we need.** There is a documented
`launchProcess` manifest permission and a `shell` module with `openPath()` and
`openExternal()`. The documented limitation settles our case: "it's not possible
to pass any parameters, nor to capture the output of the command." Every
extraction we run is arguments plus captured output, so section 2.1 stands — the
companion application is still mandatory. What changes is that the panel can
*launch* that application through a registered URL scheme, which is a better
mechanism than the login items we had budgeted for, and a supported one.

**Hybrid plugins now exist, and they are the first real threat to our own
conclusion.** Adobe announced UXP Hybrid Plugins for Premiere in April 2026:
a plugin can "load dynamically linked C++ libraries at runtime, letting you call
native functions directly from JavaScript", on macOS and Windows, requiring
Premiere 26.2. Adobe's own hybrid-plugin pages say nothing about the sandbox,
file system, or process control, so we cannot yet tell whether a hybrid plugin
could link the media libraries directly instead of shelling out to a binary. If
it can, our companion application is transitional rather than permanent. This is
now the second question on our monthly re-check, behind frame export, and it did
not exist as a question when this document was first written.

Also worth stating plainly: **secure storage question 4 was partly already
answered in public and we had not read it.** The documentation says secure
storage "should be regarded as a cache rather than a persistent storage". We have
rewritten the question to ask what is actually still open.

If you are reading this to evaluate whether we understand what we are taking on:
the honest summary is that the adapter work is further along than our own plan
believed, the storage adapter is a real self-inflicted setback and `localStorage`
is a larger one we were not counting, and the things that decide our timeline —
frame export, the QE-dependent operations, and now whether hybrid plugins relax
the sandbox — are not ours to decide.

*Measured and written 2026-08-19. Re-measured, corrected and extended 2026-08-30.
Host chain verified live against Premiere Pro 26.3.2 and the `localStorage` row
added 2026-09-01. Every figure carries the reading it came from.*

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — the CEP system these figures measure · [Roadmap](ROADMAP.md) — where the migration sits among the other work
