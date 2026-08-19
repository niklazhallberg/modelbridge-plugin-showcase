# CEP → UXP: where this migration actually stands

Adobe is moving Premiere Pro extensions from CEP to UXP. modelBridge runs on CEP
today. This document reports what we have measured about that transition — what
is already isolated, what cannot be adapted and has to be rebuilt, where our own
early decisions were wrong, and what we need from the platform to finish.

It is written for engineers who know this ground better than we do. So it leads
with numbers rather than adjectives, and every figure is dated: these are
measurements of a moving codebase, not properties of it. Anything we have not
measured is marked as unmeasured rather than estimated.

**All figures measured 2026-08-19 unless stated otherwise.**

---

## 1. What is isolated today

The strategy has been to put platform-specific calls behind adapters inside the
CEP codebase, so the migration becomes a swap of implementations rather than a
rewrite of everything that touches them. Progress, as quotas with denominators:

| Platform surface | Routed through the adapter | Direct calls left | Adoption |
|---|---|---|---|
| Path construction | 57 | **0** | **100 %** |
| Opening external URLs | 20 | **0** | **100 %** |
| Provider API key storage | 13 | **0** | **100 %** |
| Premiere host calls | 133 | 47 | **74 %** |
| File system, by acquisition site | 34 | 45 | **43 %** |
| File system, by API invocation | 34 | 107 | **24 %** |

Two surfaces are finished: not "mostly", but zero remaining direct calls,
verified by search across the panel source. Host calls are three-quarters
converted. File I/O is the laggard, and the two file-system rows are given
separately on purpose — counting acquisition sites flatters the number, because
most files acquire the module once and then call it many times.

### The distribution matters more than the average

Adoption is not a uniform 74 %. It is split by subsystem, and that is a
deliberate ordering rather than an accident:

- **The agent layer is essentially fully bridged** — 126 of its host calls go
  through the adapter.
- **The generation pipeline is essentially unbridged** — 43 direct calls across
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

### 2.1 UXP cannot spawn processes — so the backend becomes a companion app

modelBridge's local backend runs as an Express server that shells out to FFmpeg
and FFprobe for every media operation that touches real footage, and uses one
native image-processing addon. UXP has no Node runtime in-panel and cannot spawn
child processes. That is not a gap we can adapt around; it means the backend has
to become a separately installed sidecar that the panel talks to over HTTP.

Measured against the current backend:

- **58 routes** in total. **25 are network-only** and could move to direct
  `fetch()` from the panel or to our existing edge worker.
- **16 routes spawn a child process. 13 of those invoke FFmpeg or FFprobe.**
- **1 native addon** (image processing), used by 3 routes, which must load from
  real disk rather than from a packed snapshot.

An earlier internal plan put the FFmpeg dependency at 5 endpoints and described
it as "the extraction pipeline". Re-measuring found 13, and the eight it had
missed are what make this a product-wide dependency rather than a feature-level
one: result delivery, thumbnail generation, preflight validation, and the
agent's own media inspection all sit on it.

**The part that is easy to underestimate is not the process spawning — it is the
layout.** The backend resolves its own root at runtime to find its
configuration, its staging directory, its native addon and its prompt files;
those resolutions have 56 call sites between two modules. A sidecar that does
not preserve the same relative layout does not fail loudly. It starts, serves
most routes, and breaks three unrelated things quietly, one feature at a time.
That is the class of failure we are designing the sidecar packaging around, and
it is why "just ship the server separately" is a larger piece of work than it
sounds.

We are not asking Adobe to solve this. We are stating it so that the scope is
visible: for us, UXP migration and building, signing, distributing and
auto-launching a companion desktop application are the same project.

### 2.2 The panel loads as 106 script tags, which UXP does not support

The panel is 106 script tags — 99 of them panel modules, all deferred, sharing
state through 753 distinct globals across 841 assignment sites. UXP requires a
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

Our host layer defines **261 global ExtendScript functions**. Our own
CEP→UXP parity table covers **23 of them with a live mapping — 8.8 %**. The
unmapped 91 % is not evenly distributed: it is concentrated in the agent tool
layer and the QE-dependent operations above.

We are reporting this number because the alternative — quoting the parity table
as though it described the whole surface — is how a migration plan becomes
comforting instead of useful. The table's own summary reads "0 confirmed
impossible", and that holds only over the 9 % it examined.

---

## 3. What we got right

These were decisions made for other reasons — mostly to stop recurring bug
classes — that turned out to be migration groundwork.

**One machine-checked dependency graph.** A pre-commit guard parses the panel's
script order and every global provider, and fails the commit when a module reads
a global whose provider loads later. It maps 753 providers across 99 scripts and
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

**Versioned persistent formats, with a tested migration wrapper.** Persisted
data carries a schema version, and migrations run behind a backup-first,
dry-run-first wrapper that aborts rather than proceeding when either step fails.
That wrapper exists because a migration once destroyed user data. The UXP data
migration inherits it instead of writing it under time pressure.

---

## 4. What we got wrong

**Our storage adapter is synchronous, and that was our own rule violation.**

Our development policy says new storage and host APIs must return promises, so
that CEP's synchronous behaviour does not leak into call sites that will have to
be asynchronous under UXP. The host-call adapter and the credential adapter
follow it. The storage adapter does not: all ten of its methods return values
directly.

The consequence is precise. UXP's file system API is asynchronous, so replacing
the adapter's implementation is not a body swap — it is a signature change at
every one of its 34 call sites, plus every file-system call site not yet
converted, plus nine module-load-time reads that will have to be restructured
because they run before anything can await. We built the largest of our adapters
in the shape that makes its own replacement hardest, in the one place our policy
explicitly warned against it.

We are reporting this rather than the two 100 % rows alone, because a migration
readiness claim that contains no mistakes is not a measurement.

**A second, smaller one:** an earlier internal plan specified adapters for
platform event handling and file dialogs. Measuring the surfaces they were meant
to cover found two event listeners and zero dialog calls. We are not building
them. Speculative abstraction ahead of a measurement is how a migration plan
grows work that protects nothing.

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

4. **Secure storage durability.** UXP's secure storage documentation notes that
   stored data can be lost. For a licence activation this is the difference
   between a customer signing in again and a customer losing a device slot. What
   are the actual durability guarantees, and what is the recommended pattern for
   data that must survive?

5. **Companion applications and marketplace policy.** If frame export does not
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
UXP; the Source Monitor and secure storage answers above; marketplace guidance
for companion applications; and our own adoption quotas, which are produced by
search over the source rather than by hand.

If you are reading this to evaluate whether we understand what we are taking on:
the honest summary is that the adapter work is further along than our own plan
believed, the storage adapter is a real self-inflicted setback, and the two
things that decide our timeline — frame export and the QE-dependent operations
— are not ours to decide.

*Measured and written 2026-08-19.*
