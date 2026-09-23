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
2026-09-01. Classified, and partially re-checked, 2026-09-09.** Where two readings
differ, both are shown. Anything carried forward without re-measuring says so.

## How to read this document: five classes of claim

A migration document mixes things that are true in completely different ways, and
a reader who cannot tell them apart has to take all of them on the same trust.
Section 8 assigns a class to the twenty-two rows that carry a conclusion — the
ones where being wrong would change what we build. The remaining figures, in
sections 1 and 4, are all class [SOURCE] and carry their reading's date in place.

| Class | What it means | How it can be wrong |
|---|---|---|
| **[SOURCE]** | A fact about our own code, produced by search over the tree on a stated date | It rots. Our codebase changes weekly, so a figure is a reading, not a property |
| **[PLATFORM]** | A statement Adobe publishes about UXP today, quoted from Adobe's own material | It can be superseded, and we can have read it wrong or read a stale page |
| **[ASSUMPTION]** | Something about the UXP runtime we have *not* verified, inferred from documentation, from third parties, or from the CEP behaviour we know | It can simply be false. We have not run it |
| **[PROTOTYPE]** | Work that would settle an assumption, which we have not done yet | Nothing is wrong with it; it does not exist yet, and no conclusion may rest on its expected result |
| **[DEPRECATED]** | A claim we or our own earlier plan published and that measurement has since falsified | It is here to be retired, not believed. Section 7.1 lists them |

**Nothing in this document is class [PROTOTYPE] pretending to be class [PLATFORM].**
That is the substitution we are most concerned to avoid, because it is the one
that reads as confidence. Where we have not run something, the row says so and no
argument downstream leans on it.

**One boundary worth stating plainly: no new platform check was run for the
2026-09-09 pass.** That pass re-measured our own source and classified what was
already here. Every [PLATFORM] row still carries the date of the check that
established it, and the oldest of those is now more than a week old. A [PLATFORM]
row is a statement about what Adobe said on a date, never about what is true now.

---

## 1. What is isolated today  — [SOURCE]

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
seventeen are in one adapter file, and a pre-commit guard
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

## 2. What cannot be adapted  — mixed; each subsection is tagged

Three things do not change shape. They change substance, and no adapter layer
helps with any of them.

### 2.1 UXP cannot run FFmpeg — so the backend becomes a companion app  
*[PLATFORM] on the launch limitation · [SOURCE] on everything it costs us*

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
half turns out to be the cheap one. The module that spawns and supervises the
backend — whose whole reason for existing disappears — is called **39 times from
13 files**, and the distribution decides the work: a handful of call sites
survive untouched, most change meaning but not shape ("the backend is up when
this resolves" stays the contract; launch-and-health-check replaces
spawn-and-health-check), and a few disappear together with the system Node they
looked for. That is a body change on the panel side, not a signature change —
**provided** the backend's address is resolved in one place rather than written
down at each call site. Today it is not, and consolidating that is on our own
list as a pre-launch item, because it is a string constant with no behaviour
attached and it converts the largest remaining unknown in this section into a
one-function edit.

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
*[SOURCE] on the count · [PLATFORM] on the bundled entry point*

The panel is 114 script tags — 107 of them panel modules, all deferred, sharing
state through 802 distinct globals. (106 / 99 / 753 on 19 Aug; the surface grew
by eight modules and forty-nine globals in eleven days, which is worth knowing
when reading any of the numbers in this document as a fixed property.) UXP requires a
bundled entry point. This is a known, mechanical rebuild, and we treat it as
such; the interesting part is section 4, where we describe the one thing we did
that made it tractable.

### 2.3 Twenty-two user-facing operations depend on the QE DOM  
*[SOURCE] throughout — what replaces them is an open question, not a claim*

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
*[SOURCE] on both numbers · [DEPRECATED] on the parity table read as coverage*

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
*[PLATFORM] on the identifier UXP offers · [ASSUMPTION] on what it would do to a seat model · [SOURCE] on our own identity provider*

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

**Measuring that turned up a live defect in our own code, worth reporting at its
real size rather than the size it first sounded.** The panel had a *second*
producer of the same id, and on some installs the two disagreed. What that did
**not** affect is the licence binding, which is where we first expected the
damage: the binding never reads the file as authority, and the panel sends no
identifier to any licence call. What it did affect is the file's two actual jobs
— telling us which install we are looking at when a customer writes in, and
letting the panel converge on the backend's value. Fixed 2026-09-01: one
producer, the panel reads and never writes, and it now returns nothing rather
than inventing an id when the backend has not written one yet. Pinned by a test
that fails against the previous build.

The general shape is one we keep finding in our own code and have a written rule
for: the same truth produced independently in two places, agreeing until it
doesn't. It is also the reason the UXP answer here is a provider swap — one
producer is portable, two are a merge.

What we would still like to know is in question 6 below.

---

## 3. What we got right  — [SOURCE]

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

**A migration wrapper, now with a test under it — and a version-stamp claim we
have had to narrow.** Migrations of the installed-model store run behind a
wrapper that takes a backup first, dry-runs against a clone second, and aborts
rather than proceeding when either step fails. That wrapper exists because a
migration once destroyed user data, and it is the reason we are not writing one
under time pressure during the port.

This paragraph has now been wrong in both directions, which is why it is the
longest one in this section.

*The first error was too strong.* We described the wrapper as "tested" and on
2026-08-30 had to correct that: its guarantees were read from the source and
proven by nothing.

*That correction is now itself out of date, in our favour, so it needs saying
plainly.* **As of 2026-09-09 the wrapper has a characterisation suite** covering
backup refusal, a dry run that crashes, a no-op, a clean migration, a failure
part-way through, and what the wrapper hands the migration function. It was verified the honest way rather than by being green: three
defects were planted in copies of the tree — the backup abort removed, the
dry-run abort made non-fatal, and a model that fails mid-apply dropped before the
save — and the suite went red in the right rows for each, while its
controls stayed green in every arm.

*And the sentence beside it was too broad all along.* We wrote "persisted data
carries a schema version". Measured 2026-09-09 across our durable documents:
**three carry one and four do not** — installed models, generation logs and
external costs are stamped; settings, two learned-value stores and the licence
store are not. Our own policy requires the stamp. This is a gap in the product,
it was covered by a sentence in this document that was true of the files we
happened to think of, and it is the kind of thing a port discovers at the worst
moment.

Two limits on the good news, so it is not read as more than it is: the suite
covers **this wrapper only**, not the six other migration paths beside it; and
nothing structurally forces a migration through the wrapper, so a data migration
written during the port could still bypass it entirely. A safeguard with a test
is worth more than one without. Neither is a gate.

---

## 4. What we got wrong  — [SOURCE], and [DEPRECATED] for what they retire

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

## 5. Open questions to the platform owner  — the boundary of [PLATFORM]

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

## 6. No-Go criteria for our UXP beta  — refusals, not claims

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
| **Frame export** | **Not the existence of an API — a completed spike.** Documented candidate paths may already exist, and a documented API is not parity: our contract is the seven obligations in 7.2, not "export a frame". This is falsified only by a focused spike, against a named Premiere version, demonstrating the whole of the contract that applies to a given workflow: (1) source-clip rather than sequence-render fidelity; (2) selected media-range output where the workflow needs a range; (3) per-model schema conformance; (4) measurement taken from the produced artifact; (5) the applicable audio and multi-asset behaviour; (6) a writable destination that persists adjacent to the project; (7) unified failure, timeout and recovery semantics. A candidate that carries some of them is a partial answer and is recorded as one | Only then does the companion application lose its main reason to exist, and most of the 13 FFmpeg routes become unnecessary rather than relocated. Until then the sidecar stands, whatever the documentation says |
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

### What the 9 September pass did and did not do

It re-measured our own source, classified every load-bearing claim by the five
classes at the top, and retired the ones measurement has falsified.

**It ran no new platform check.** No Adobe page was re-read, no UXP API was
exercised, no host was launched. So every [PLATFORM] row still stands on the
check that established it — the oldest of them from 30 August — and every
[ASSUMPTION] row is exactly as unverified as it was. A reader who wants the
current platform position should treat section 5 as the list of what to ask, not
as a list of what has been answered.

What it did re-check, with the same instrument as before, so the comparison
means something:

| Row | 30 Aug | 9 Sep | Verdict |
|---|---|---|---|
| Provider API key storage — direct calls left | 0 | **0** | holds |
| Opening external URLs — direct calls left | 0 | **0** | holds |
| Path construction — direct calls left | 0 | **0** | holds |
| Browser storage — adapter exists? | no | **still no** | the 0 % stands, and it is by construction |

The three finished surfaces are still finished, nine days on, which is the useful
part: a surface at 100 % has stayed there through another week of ordinary work,
and that is the claim section 1 makes about why they hold.

On browser storage, one clarification a reader is entitled to, because the answer
looks like a technicality and is not: we do have a wrapper over `localStorage`,
and it is not an adapter. It manages the quota *within* the platform API rather
than abstracting the platform, so it does nothing for a runtime that has no
`localStorage` at all. The 0 % is real.

The remaining rows in section 1 — host calls, both file-system rows, the script
and global counts, the ExtendScript surface — were **not** re-measured with the
original instrument, and we are not restating them from a different one. A number
produced by a different search is a different measurement, not a correction, and
publishing it as an update to the table would be the same error in a new
direction. They carry their 30 August reading.

### 7.1 Deprecated — claims measurement has retired

These were published, by us or by our own earlier internal plan (April 2026).
They are listed so a reader who has seen them elsewhere knows they are dead.

| Retired claim | What measurement found | Retired |
|---|---|---|
| "Persisted data carries a schema version" | Three of our durable documents carry one; four do not | 2026-09-09 |
| "Frame export has no UXP API today" — published in this document's own register as [PLATFORM] | An absence Adobe does not state, so nothing could be quoted for it. What we can support is narrower: no *proven parity* for our contract. See 7.2 | 2026-09-09 |
| "The migration wrapper has no automated test" | It has one, with red-first evidence — see section 3 | 2026-09-09 |
| "UXP cannot spawn processes" | It can. The limitation is narrower and more specific: no arguments, no captured output | 2026-08-30 |
| "The FFmpeg dependency is 5 endpoints — the extraction pipeline" | 13 endpoints, spread across result delivery, thumbnails, preflight and the agent's own media inspection: product-wide, not feature-level | 2026-08-30 |
| "The backend resolves its layout at 56 call sites across two modules" | 29 across four — our own figure was roughly double, in the direction that overstated our difficulty | 2026-08-30 |
| "The parity table shows 0 confirmed impossible" | True only over the 9 % of the ExtendScript surface it examined; quoting it as coverage is what made it comforting | 2026-08-30 |
| "Two of four platform surfaces are at 100 %" | Three were, in the same table that said two — an editing error, corrected rather than quietly fixed | 2026-08-30 |
| Adoption percentages published before 2026-09-01 | Computed over a denominator that excluded the panel's largest platform dependency | 2026-09-01 |
| Plan: "81 script tags" | 114 | 2026-08-30 |
| Plan: "58 direct path calls across 25 files" | 0 — fully routed through an adapter | 2026-08-19 |
| Plan: "73 direct file-system acquisitions across 27 files" | 44 routed / 46 direct at the last reading | 2026-08-30 |
| Plan: "the host-call adapter has not been built" | It exists under a different name and was already three-quarters adopted; the plan never mentions that name | 2026-08-19 |
| Plan: adapters needed for platform events and file dialogs | The surfaces they would cover measured two listeners and zero dialog calls. Not built — see section 4.3 | 2026-08-19 |
| Plan: a named file is "the CEP bootstrap" | It is loaded by nothing. Dead code, since deleted | 2026-08-19 |

The pattern across the bottom half of that table is worth naming, because it is
the argument for this whole document having a date on it: **our own plan was
wrong in both directions.** It overstated some dependencies and understated
others, and at one point four of our documents carried four different values for
the same count. A migration plan that is not re-measured does not decay evenly
toward pessimism — it decays toward whatever was convenient to write.

---

### 7.2 The one negative claim we had no standing to make

Section 7.1's second row is the only retirement in this document that was caused
by *this* document. It is worth its own heading because it is the failure the
classification pass at the top exists to prevent, committed in the pass itself.

The register published **"frame export has no UXP API today"** as class
`[PLATFORM]` — the class defined at the top as *a statement Adobe publishes about
UXP, quoted from Adobe's own material*. **Adobe publishes no statement of
absence.** There was nothing to quote, so the row could not have been that class
whatever the underlying facts turn out to be. It was an absence of evidence
rendered as evidence of absence, and it was dated 30 August, which was the date
of the last time we asked the question rather than the date anything was
established.

The material that was already here had it right and we made it worse. Question 1
in section 5 asks *"Is there, or will there be, a UXP API for extracting a frame
or a media range from a timeline clip?"*, and section 7's table states the
condition that would settle it. A question became a conclusion in the summary of
itself.

**What we can support, and what replaces it.** Documented candidate APIs may
exist — a sequence-frame export path and a sequence-export path are the two we
know to go and look at. Neither has been shown to satisfy our contract, and our
contract is not "export a frame". It is: *given a selected clip's **source** media
and an in/out range, produce a real file at a writable path, conformed to the
destination model's schema, and report the file's **measured** dimensions and
duration.* Seven obligations sit inside that sentence, and a still-frame API is
evidence about roughly one of them:

| # | Obligation | Why a sequence-frame API does not settle it |
|---|---|---|
| 1 | **Source fidelity** — the clip's source media, not a sequence render | A sequence-frame export renders the *sequence*: effects, transforms, scaling to sequence frame size, letterboxing. Different pixels. Whether that difference is acceptable is a product decision, not a porting detail |
| 2 | **Media-range export** — an encoded sub-range, not a still | Video-to-video and image-to-video need a container and a codec |
| 3 | **Schema conformance** — per model, at call time | Min/max dimensions, aspect bounds, file-size caps, format allowlist, resolved from the destination model rather than from a fixed preset |
| 4 | **Artifact measurement** | Dimensions and duration read back from the produced file, never assumed from the request |
| 5 | **Audio and multi-asset handling** | Separate shapes with their own obligations |
| 6 | **A writable destination** outside plugin-scoped storage | Feeds upload, then persistence adjacent to the customer's project |
| 7 | **Unified error and recovery behaviour** | One error pipeline, one identity per failure, no dependency on a second application being installed and responsive |

A sequence-export path plausibly reaches obligation 2 and is where we expect the
**condition-dependent** answers to sit: asynchronous, dependent on a second
application, preset-driven where we need schema-driven. That is a different
verdict from "unavailable", and the difference decides whether it is a
fallback or a non-starter.

**So the unresolved work is a spike, not a re-read.** Seven rows, each answered
by making the call and measuring the artifact rather than by reading a page —
which is the discipline our own CEP measurements already forced on us, where the
obvious frame-grab member on the supported object is `undefined` at runtime and
throws, and only a second route works. A documented API is not a working one
until someone has called it.

Until that spike runs, this row stays `[ASSUMPTION]`. It is not evidence that the
companion application is permanent, and no row in section 6 or section 7 may lean
on it as if it were.

---

## 8. Claim register

The twenty-two rows a conclusion in this document rests on, by class. Not every
figure — the adoption quotas in section 1 and the two mistakes in section 4 are
class [SOURCE] throughout, and are dated where they stand. These are the ones
where being wrong changes what we build.

The last column is what would have to happen for the row to change, written as a
falsifiable condition: a claim with no stated falsifier cannot be re-checked,
only re-asserted.

| # | Claim | Class | Established | Falsified by |
|---|---|---|---|---|
| 1 | Three platform surfaces have zero direct calls left | [SOURCE] | 30 Aug, re-checked 9 Sep | A direct call appearing outside the adapter |
| 2 | Host calls are ~77 % routed; the generation pipeline is the unbridged subsystem | [SOURCE] | 30 Aug | Re-running the same search |
| 3 | The panel makes ~384 `localStorage` calls and has no adapter for them | [SOURCE] | 1 Sep, adapter absence re-checked 9 Sep | An adapter landing, or the sites being removed |
| 4 | UXP provides no `localStorage` | [PLATFORM] | 1 Sep | Adobe shipping one |
| 5 | UXP can launch a process but cannot pass arguments or capture output | [PLATFORM] | 30 Aug | Adobe changing the documented limitation |
| 6 | Therefore the backend must become a companion application | [ASSUMPTION] | 30 Aug | Row 5 changing, or row 10 resolving in our favour |
| 7 | 13 backend endpoints invoke external media tooling | [SOURCE] | 19 Aug, carried forward | Re-measuring |
| 8 | UXP requires a bundled entry point | [PLATFORM] | 19 Aug | Adobe supporting script tags |
| 9 | 22 user-facing operations have an unsupported host API as their only implementation | [SOURCE] | 19 Aug | Supported equivalents arriving — question 2 |
| 10 | A hybrid plugin might link a media library directly instead of shelling out | [ASSUMPTION] | 30 Aug | Adobe documenting the sandbox boundary — question 4 |
| 11 | We could evaluate row 10 by building one | [PROTOTYPE] | not started | Building it. **No conclusion in this document rests on it** |
| 12 | UXP's user identifier is account-bound, not machine-bound | [PLATFORM] | 30 Aug | A machine-scoped identifier appearing — question 6 |
| 13 | An account-bound identity would make a two-device seat model unenforceable | [ASSUMPTION] | 30 Aug | Building it and finding otherwise |
| 14 | Our identity provider is a single function inside the process that becomes the companion app, so the sandbox never needs it | [SOURCE] | 30 Aug, still single-writer 9 Sep | A second producer appearing — it has happened once |
| 15 | Secure storage is documented as a cache, not persistent storage | [PLATFORM] | 30 Aug | Adobe restating it |
| 16 | A lost seat record cannot be regenerated without consuming a second slot | [ASSUMPTION] | 30 Aug | A supported cleared-vs-never-written signal — question 5 |
| 17 | CEP still works end to end in Premiere Pro 26.3.2 | [SOURCE] — a live host measurement | 1 Sep | Any later version. **One version, one platform, one machine** |
| 18 | Adobe's stated support window is roughly a calendar year from 25.6 | [PLATFORM] | 30 Aug | Adobe publishing a date |
| 19 | Our extraction contract has no *proven* UXP parity. Documented candidate APIs may exist — a sequence-frame path and a sequence-export path are the two we know to look at — but none has been shown to satisfy the whole contract | [ASSUMPTION] — see 19a | 9 Sep | A spike, not a document. Question 1, and 7.2 below |
| 19a | *Retired 2026-09-09:* "frame export has no UXP API today", published here as [PLATFORM] | [DEPRECATED] | — | Adobe publishes no statement of absence, so nothing could have been quoted. See 7.2 |
| 20 | The migration wrapper's behaviour is pinned by a characterisation suite | [SOURCE] | 9 Sep | A row going red |
| 21 | Three of our durable documents carry a schema version and four do not | [SOURCE] | 9 Sep | Stamping the four |

**Rows 6, 13, 16 and 19 are the load-bearing assumptions**, and all four concern
things we have not run. Each one is also the subject of an open question in
section 5, which is not a coincidence: an assumption we could settle ourselves
would not be a question for the platform owner. If any of the three is wrong, the
architecture that follows from it is wrong, and we would rather that be legible
in a table than buried in a paragraph that reads like a conclusion.

---

---

## In summary

If you are reading this to evaluate whether we understand what we are taking on:
the adapter work is further along than our own plan believed, the storage adapter
is a real self-inflicted setback and `localStorage` is a larger one we were not
counting, and the things that decide our timeline — frame export, the
QE-dependent operations, and now whether hybrid plugins relax the sandbox — are
not ours to decide.

What the classification pass adds to that summary is a boundary rather than a
new fact. Of the twenty-two rows in section 8, **nine are measurements of our own
code, six are quotations of what Adobe publishes, five are assumptions we have not
run, one is work we have not started, and one is a claim of our own that we have
had to retire.** Four of the five assumptions — rows 6, 13, 16 and 19 — are ones
the architecture rests on; the fifth, row 10, is the one that would retire part of
it. We would rather a reader could see that split in a table than have to infer it
from the confidence of the prose.

That split moved on 9 September, and not in the flattering direction: one row left
`[PLATFORM]` for `[ASSUMPTION]` because we had asserted an absence nobody
published. Section 7.2 is that correction. A register whose distribution never
worsens is not being re-read.

*Measured and written 2026-08-19. Re-measured, corrected and extended 2026-08-30.
Host chain verified live against Premiere Pro 26.3.2 and the `localStorage` row
added 2026-09-01. Source re-checked in part, every claim classified, and the
retired claims collected, 2026-09-09 — with no new platform check in that pass.
Every figure carries the reading it came from.*

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — the CEP system these figures measure · [Roadmap](ROADMAP.md) — where the migration sits among the other work
