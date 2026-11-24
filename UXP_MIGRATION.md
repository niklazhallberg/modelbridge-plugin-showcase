# CEP → UXP: where this migration stands

Adobe has announced that CEP is retired at the end of 2029. For Premiere Pro, new
CEP submissions end in December 2027 and CEP is disabled by default from December
2028 ([Adobe's September 2026 announcement](https://blog.developer.adobe.com/en/publish/2026/09/investing-in-the-future-of-creative-cloud-extensibility-uxp-comes-to-our-flagship-applications)).
modelBridge 1.0.0 is a CEP panel and keeps working on Premiere versions that run
CEP. This document says what has to change before those dates, what is already
separated from CEP, where our own early decisions were wrong, and what we do not
yet know.

It leads with numbers, and every figure is dated: these are measurements of a
moving codebase, not properties of it. Counts are from the source the 1.0.0
installer was built from (2026-11-24) unless a date is given. Anything we have not
measured is marked as unmeasured, not estimated.

## How to read this document: five classes of claim

A migration document mixes things that are true in different ways. Section 8
assigns a class to the rows that carry a conclusion, the ones where being wrong
would change what we build. The remaining figures, in sections 1 to 4, are class
[SOURCE] and carry their date in place.

| Class | What it means | How it can be wrong |
|---|---|---|
| **[SOURCE]** | A fact about our own code, produced by search over the tree on a stated date | It rots. The codebase changes weekly, so a figure is a reading, not a property |
| **[PLATFORM]** | A statement Adobe publishes about UXP, quoted from Adobe's own material | It can be superseded, and we can have read it wrong or read a stale page |
| **[ASSUMPTION]** | Something about the UXP runtime we have *not* verified, inferred from documentation, from third parties, or from the CEP behaviour we know | It can simply be false. We have not run it |
| **[PROTOTYPE]** | Work that would settle an assumption, which we have not done yet | It does not exist yet, and no conclusion may rest on its expected result |
| **[DEPRECATED]** | A claim we published that measurement or a later reading has falsified | It is here to be retired, not believed. Section 7.1 lists them |

A [PLATFORM] row is a statement about what Adobe said on a date, never about what
is true now. No UXP API has been exercised for this document.

---

## 1. What is isolated today  — [SOURCE]

The strategy has been to put platform-specific calls behind adapters inside the
CEP codebase, so the migration becomes a swap of implementations instead of a
rewrite of everything that touches them. Progress at 1.0.0, as quotas with
denominators:

| Platform surface | Routed | Direct left | Adoption |
|---|---|---|---|
| Path construction | 81 | **0** | **100 %** |
| Opening external URLs | 25 | **0** | **100 %** |
| Provider API key storage | 17 | **0** | **100 %** |
| Premiere host calls, in the panel's script modules | 172 | 32 | **84 %** |
| Premiere host calls, in the panel's HTML page | 0 | 18 | **0 %** |
| File system, by acquisition site | 57 | 45 | **56 %** |
| Process launches from the panel | 0 | 8 | **0 %** |
| **Browser storage (`localStorage`)** | 0 | **about 400** | **0 %** |

Method: adapter call sites against direct calls outside the adapter, comment lines
excluded. The same searches reproduce the figures published for 2026-10-21 exactly
or within nine per cell, so the two readings compare like with like. Counted by
API invocation instead of by acquisition site, the file-system row was 57 routed
against 99 direct on 2026-10-21; that count was not re-taken for 1.0.0.

Three surfaces are finished: zero remaining direct calls, verified by search across
the panel source. With the HTML page counted, host-call adoption is 172 of 222,
about 77 %. File I/O is the laggard. Process launches sit in eight places in five
files, with no adapter.

`localStorage` is the largest row: about 400 call sites in nearly 60 files, more
than the direct file-system and host calls combined. UXP documents a synchronous
`localStorage`, so those calls may not need to change shape. What UXP does not
give is access to the data the CEP panel has already stored, so this row is a data
move (section 4.2). The existing wrapper over `localStorage` manages quota inside
the platform API and is not an adapter, so the 0 % is real.

### A surface holds where something holds it

Three surfaces are at 100 % because they are finished, and they have stayed there
through every reading since August. One newer subsystem, the usage layer, is clean
because a pre-commit guard keeps it clean: every file in it except one adapter is
mechanically forbidden from touching the file system, `CSInterface` or the
ExtendScript bridge, so that layer has one file to rewrite for UXP instead of
five, and a test suite that runs without a host. Everywhere else, the file system
absorbs new work at whatever rate new work is written.

### The distribution matters more than the average

Host-call adoption is split by subsystem, and that is a deliberate ordering:

- **The agent layer is essentially fully bridged.** 160 of its 161 host calls go
  through the adapter.
- **The generation pipeline is unbridged.** 28 direct calls sit in the four
  modules that carry media extraction, validation, preview and dual-model runs.
  None of the four calls the adapter yet.

The generation pipeline is the launch-critical path, and the adapter wraps calls
in promises with deadlines. Converting it changes timeout and error behaviour in
the code where a failure costs a customer money. We chose to convert it after
launch instead of reporting a rounder number before it. Version 1.0.0 was built
with that conversion still ahead of us.

---

## 2. What changes substance  — mixed; each subsection is tagged

No adapter layer settles the things in this section. 2.1 and 2.3 have to be
rebuilt or replaced, 2.2 has to be reviewed, 2.4 is the size of the port, and 2.5
ends in a provider swap.

### 2.1 UXP cannot run FFmpeg for us, so the backend becomes a companion application
*[PLATFORM] on the launch limitation · [ASSUMPTION] on the conclusion · [SOURCE] on what it costs*

modelBridge's local backend is an Express server that shells out to FFmpeg and
FFprobe for every media operation that touches real footage, and uses one native
image-processing addon. UXP has no Node runtime in the panel. It *can* launch a
process, but the documented `launchProcess` permission says "it's not possible to
pass any parameters, nor to capture the output of the command", and every
extraction we run is arguments plus captured output. So the backend has to become
a separately installed companion application that the panel talks to over HTTP,
unless frame export (question 1) or hybrid plugins (question 4) change that.
Section 8 classes that conclusion as an assumption for that reason.

Measured against the backend:

- **77 routes** in the main server at 1.0.0 (74 on 2026-10-21), plus 13 registered
  by the agent module.
- On 2026-08-19, **25 routes were network-only**, 16 spawned a child process and
  13 of those invoked FFmpeg or FFprobe. That breakdown was not re-taken; audio
  analysis and loudness routes have been added since, so read 13 as a floor.
  Result delivery, thumbnails, preflight validation and the agent's own media
  inspection all sit on it, which makes this a product-wide dependency.
- **1 native addon** (image processing), which must load from real disk and not
  from a packed snapshot. It is still the only native addon in the backend's
  dependencies.

**Much of the companion application already exists.** [SOURCE]

- The backend already ships as a standalone executable, built for macOS arm64,
  macOS x64 and Windows x64, and the panel prefers it over a system Node.
- The product is already delivered through a signed and notarised macOS installer,
  which is the kind of installer a companion application needs.
- The backend's lifecycle is already supervised. It listens on the loopback
  interface only and refuses callers it cannot verify. It shuts itself down when
  the panel that started it is gone, and the panel accepts a running backend only
  if its identity matches.
- Durable user data already lives outside the extension folder, in the per-user
  application-data folder, as files and not only in browser storage. A commit
  guard forbids writes inside the installed extension.

**What is left on this side.**

- *The layout.* The backend resolves its own root at runtime to find its
  configuration, staging directory, native addon and prompt files, in four
  modules (29 call sites on 2026-08-30, not re-counted). A companion application
  that does not preserve the same relative layout does not fail loudly. It starts,
  serves most routes, and breaks unrelated things quietly. The packaging is
  designed around that failure.
- *The address.* The backend's address is written out on 91 lines in 42 panel
  files instead of being resolved in one place. Consolidating it is a string
  change with no behaviour attached. It was meant to happen before launch, and
  1.0.0 was built without it.
- *The supervisor.* The panel module that spawns and supervises the backend was
  called 39 times from 13 files on 2026-10-21. Most call sites change meaning but
  not shape: launch-and-health-check replaces spawn-and-health-check.
- *The caller check.* The backend recognises the panel by the CEP panel's own
  origin. A UXP panel will present a different one, so the check needs a UXP
  equivalent.
- *The launcher.* The panel will launch the companion application through a URL
  scheme that application registers, which UXP supports. The scheme arrives with
  the installer that first carries the companion application.

For us, the UXP migration and building, signing, distributing and launching a
companion desktop application are the same project.

### 2.2 The panel loads as 149 script tags, and whether to bundle them is our choice
*[SOURCE] on the count · [PLATFORM] on the script entry point*

At 1.0.0 the panel page has 149 script tags: 142 deferred panel modules, one
platform library and six inline blocks. The modules share state through 949
`window` globals by the load-order guard's count. The page also has 24 inline
handler attributes. (114 tags on 2026-08-30 and 146 on 2026-10-21: the surface
grows while we measure it.)

Bundling is optional under UXP: Adobe's TypeScript guide supports ordinary scripts
with a script entry. Globals, load order, DOM assumptions and inline handlers
still need review either way. Section 3 describes the one thing that makes the
review tractable.

### 2.3 A set of agent operations depends on the QE DOM
*[SOURCE] throughout — what replaces them is an open question, not a claim*

Premiere's QE DOM is undocumented and unsupported, and a set of timeline
operations has no equivalent in the supported ExtendScript DOM. On 2026-08-19,
**22 user-facing operations had QE as their only implementation**, all in the
agent layer and all timeline editing: precision trim variants, razor and split,
effect and transition application, track manipulation, clip speed and the related
family. When QE is unavailable these fail hard, because there is nothing to
degrade to. That count was not re-taken; at 1.0.0 QE is switched on at 23 places
and 31 functions touch it directly, so read 22 as a floor.

- **The direct reference count understates the exposure about five times.**
  Counting the entry points gave 48 references on 2026-08-19; counting what those
  entry points then manipulate gave 234.
- **The core generation path does not depend on QE.** Media import uses the
  supported DOM and reaches for QE only as a recoverable fallback when track
  creation fails, then reports an error if both routes fail. The product survives
  QE loss. The agent's timeline editing does not.

Adobe states that ExtendScript is not affected by the CEP transition. That is a
statement about the scripting language, and we have not established what it means
for a UXP panel calling these operations. Question 2 is about this.

### 2.4 The ExtendScript surface is the size of the port
*[SOURCE]*

The host layer defines 402 top-level ExtendScript functions at 1.0.0 (about 380
on 2026-10-21, 261 on 2026-08-19), the functions behind the agent tools imported from an
open-source project among them. This is the surface a UXP build has to reach, one way or
another.

No operation-by-operation mapping to UXP exists yet. An earlier list of 25
candidate names was withdrawn, because a name match is not evidence of parity.

### 2.5 Machine identity, and what an account-bound identity would do to a seat
*[PLATFORM] on the identifier UXP offers · [ASSUMPTION] on what it would do to a seat model · [SOURCE] on our own identity provider*

Licence binding rests on an install identity derived from the machine. It is the
local half of a "two registered computers, one generating at a time" seat model.

UXP offers `userInfo.userId()`, a GUID that is **bound to the Adobe account, not
the machine**. Adobe's developer forum reports that it is a different identifier
from the one CEP exposes, with no published mapping between them.

Swapping one for the other is not like for like. Under an account-bound identity,
one person on two machines presents the **same** identifier, so a seat model sees
one device where the customer has two. Two people sharing one machine present two
identifiers where the licence should see one. Neither is detectable locally.

Our position: the install identity is produced in one place, and that place is
the local backend, the process that becomes the companion application and keeps a
full runtime. So the machine-derived identity does not have to enter the UXP
sandbox, and the account-bound GUID is not a dependency we need to take. That
makes the UXP answer a provider swap. (A second producer existed in the panel
until 2026-09-01. It did not affect licence binding. There is one producer now,
pinned by a test.)

What we would still like to know is in question 6.

---

## 3. What we got right  — [SOURCE]

These were decisions made for other reasons, mostly to stop recurring bug classes,
that turned out to be migration groundwork.

**One machine-checked dependency graph.** A pre-commit guard parses the panel's
script order and every global provider, and fails the commit when a module reads a
global whose provider loads later. At 1.0.0 it maps 949 providers across all 142
panel scripts and reports zero violations. It was built because that failure had
shipped twice. Its side effect is that the inter-file half of the import graph a
bundler needs already exists as a checked artifact.

**One resolver per question.** Questions that used to be answered independently in
several places — is this model installed, does this endpoint resolve, does this
generation count as spend, is this licence state indeterminate — have one
implementation each. A port re-verifies each once.

**One error pipeline.** Every user-facing error passes through one translator and
one renderer. UXP will change how surfaces behave, and that change lands in one
component.

**Backup before migration.** Every migration of the installed-model list first
writes a timestamped backup of the whole list and does not proceed if that write
fails. This backup-first behaviour is covered by tests for the store-adoption path
and the endpoint-id migration. A stricter wrapper that also rehearses the change on
a copy exists in the source, but at 1.0.0 no migration uses it and no test
exercises it. Nothing forces a new migration through either, so a data migration
written during the port could still bypass both. Neither is a gate.

**Schema versions, where the data cannot be regenerated.** Four durable stores
carry a schema version: installed models, generation logs, external costs and
settings. Three do not: two learned-value stores and the licence store. The two
learned-value stores version each record and discard stale ones. Our own policy
requires the stamp, so the three are a gap.

**A newer file is never overwritten.** A stamped store written by a newer build is
refused and locked, not overwritten. That is the behaviour needed while a CEP and
a UXP build read the same data.

**Host behaviour is recorded from a live host.** A snapshot generated on Premiere
Pro lists what the host has and lacks, and a commit guard refuses calls to methods
the snapshot does not know. Every guard named here, the load-order and usage-layer
guards included, is also run against a planted violation, so a guard that has
stopped refusing fails the commit.

---

## 4. What we got wrong  — [SOURCE], and [DEPRECATED] for what they retire

### 4.1 Our storage adapter is synchronous, against our own rule

Our development policy says new storage and host APIs must return promises, so
that CEP's synchronous behaviour does not leak into call sites that will be
asynchronous under UXP. The host-call adapter follows it. The storage adapter does
not: at 1.0.0 it has twenty methods, and nineteen return values directly. One,
added later for binary reads, returns a promise. The credential adapter offers a
promise API, but 13 of its 16 call sites still use its synchronous mirror, so
those calls change too.

UXP's file system API is asynchronous, so replacing the storage adapter's
implementation is not a body swap. It is a signature change at each of its 57
call sites, plus the direct file-system calls not yet converted, plus the
module-load-time reads (19 on 2026-08-30, not re-counted) that run before anything
can await. We built the largest adapter in the shape that makes its own
replacement hardest.

### 4.2 The largest platform dependency had no quota row until 2026-09-01

The panel's `localStorage` use had no adapter, no row in section 1 and no place in
the migration plan beyond a footnote. Until that date every adoption percentage we
published was computed over a denominator that excluded its largest term. The row
is in section 1 now.

The adapter is still not built, deliberately. UXP has a synchronous
`localStorage`, so the calls may not need to change shape at all, and the thing to
design is the data move: deciding what owns each stored value, and exporting and
importing it. The installed-model list, the ledger and settings already have a
copy on disk outside the extension, which narrows that move. We have not run any
of this in UXP, so the row stays at a visible 0 %.

### 4.3 Closed: two adapters we planned and did not need

An earlier plan specified adapters for platform event handling and file dialogs.
Measuring the surfaces found three host event listeners and zero dialog calls at
1.0.0. We did not build them.

### 4.4 Corrections

Three [PLATFORM] statements we published were wrong and were corrected on
2026-11-16 against Adobe's announcement and reference pages: the support window
(we had read it as CEP removal around November 2026), `localStorage` (we had
written that UXP has none), and bundling (we had written that it is required).
All three had made the migration sound harder or more urgent than it is.

---

## 5. Open platform questions  — what we do not know, and what each answer decides

1. **Frame and clip export.** Is there, or will there be, a UXP API for extracting
   a frame or a media range from a timeline clip? The answer decides whether the
   companion application is a permanent part of the architecture or a transitional
   one. It is the highest-leverage unknown we have. Section 7.2 states what would
   count as an answer.

2. **Supported equivalents for the QE-dependent operations.** For the operations
   in section 2.3, the timeline editing family with no supported DOM equivalent,
   what is the intended supported path? The answer separates "not yet" from "not
   planned" before a beta is committed to it. Adobe's local MCP integrations for
   Premiere, announced 2026-11-10 with a private beta in early 2027, may offer a
   supported route for some of them; see [ROADMAP.md](ROADMAP.md).

3. **Source Monitor.** Is the Source Monitor scriptable from UXP, and to what
   depth? Opening a result for full-resolution evaluation and reading its In/Out
   points is a workflow editors use daily.

4. **Hybrid plugins and the sandbox boundary.** Hybrid plugins (announced April
   2026, Premiere 26.2) load dynamically linked C++ libraries at runtime, and the
   announced use cases include performance-intensive audio and video processing.
   Could a hybrid plugin link a media library directly, `libavcodec` and the
   libraries beside it, instead of shelling out to a binary? If it could, the
   companion application in section 2.1 is transitional.

   What we cannot find is Adobe's own statement of the sandbox boundary for native
   modules: whether a hybrid plugin may read and write arbitrary user file paths
   and not only plugin-scoped storage, what it may do with processes and sockets,
   and whether any of that is contractual. Linking a GPL or LGPL media library is
   also a different licensing obligation from invoking a separate binary, and we
   have not settled that on our side.

5. **Secure storage, when the data is a seat and not a session.** The
   documentation says secure storage "should be regarded as a cache rather than a
   persistent storage", and that stored data "should be able to be regenerated
   from plugins after the time of loss". The open question is the supported
   pattern when regeneration is not free.

   The concrete case: a licence activation consumes one of a small number of
   device slots. If local state is lost, the plugin cannot regenerate it locally.
   It has to re-activate, and a re-activation against a server that still holds
   the previous activation either consumes a second slot or has to be reconciled
   by a release call that depends on the identifier that was lost. The customer
   with two devices discovers they have one.

   So: is there a supported signal that secure storage was cleared, as distinct
   from never written, so a plugin can tell a first run from a loss?

6. **Machine-scoped identity.** Following section 2.5: is there a supported way
   for a UXP plugin to obtain an identifier scoped to the **machine** and not to
   the Adobe account? A stable, opaque, per-installation value that survives a
   plugin reinstall is enough. The answer decides whether a device-based licence
   model is something a UXP plugin can implement at all.

7. **Companion applications and marketplace policy.** If frame export does not
   arrive, the architecture requires a separately installed helper application.
   What is the guidance for extensions that depend on one: for distribution, for
   review, and for the permissions the panel needs to talk to it?

---

## 6. No-Go criteria for our UXP beta  — refusals, not claims

We will not ship a UXP beta while any of these is true. They are written as
refusals so that a slipping date cannot quietly become a lowered bar.

1. The core path — select a clip, generate, import, place on the timeline — does
   not work end to end on both macOS and Windows.
2. The companion application fails to launch or loses its connection without a
   recovery path a non-technical user can follow.
3. Data migration loses any irreplaceable customer data: installed models,
   credentials, licence state or cost history.
4. Licence migration consumes an additional device slot without explicit consent.
5. Any operation the product advertises has no working UXP path, including its
   error, timeout and Stop behaviour.
6. Startup, responsiveness, memory or media-processing time is worse than the
   budgets set from the CEP baseline before the beta. Those budgets are not set
   yet.
7. The Windows path is unverified on real hardware, including installation, media
   extraction, import and behaviour after an application restart.

---

## 7. What we re-verify, and what the platform has said

Every figure here describes a codebase that changes weekly, so we re-measure
instead of re-quoting. The platform items below are meant to be re-read monthly.
We have not kept that cadence: the platform readings are from 2026-08-30,
2026-10-21 and 2026-11-16.

**The support window.** [PLATFORM] Adobe's September 2026 announcement places CEP
retirement at the end of 2029, with new CEP submissions for Premiere ending in
December 2027 and CEP disabled by default in December 2028. The announcement also
says ExtendScript is not affected by this transition. The schedule we plan
against is that one.

**CEP works today, measured.** [SOURCE] On 2026-09-01, against **Premiere Pro
26.3.2**:

| Step | Result |
|---|---|
| Panel loads and renders | works |
| Local backend spawns and answers its health check | works |
| A generation runs end to end | works |
| Result imports to the timeline through the ExtendScript bridge | works |

On 2026-10-21 the panel was loaded and running in **Premiere Pro 26.5.1** (CEP
12.0.1) and its backend answered its health check; no generation was run for that
check. This is one version on one platform on one machine. It says nothing about
Adobe's intent and does not buy time.

**The two checks that could retire an architecture.** Both are written as
falsifiable conditions.

| Check | What would have to be true to change the decision | What we do if it is |
|---|---|---|
| **Frame export** | Not the existence of an API: a completed spike, against a named Premiere version, demonstrating the part of the contract in 7.2 that applies to a given workflow. A candidate that carries some of the obligations is a partial answer and is recorded as one | Only then does the companion application lose its main reason to exist, and most of the FFmpeg routes become unnecessary instead of relocated |
| **Hybrid plugins** | All four: (1) a hybrid plugin may link a media library and not only shell to a binary; (2) it may read and write arbitrary user file paths; (3) the licensing of what we would link is compatible with a commercial plugin; (4) Adobe documents the sandbox boundary, so that we are not shipping a customer-facing dependency on an inference | The companion application becomes transitional. We would still ship it first, and stop designing its installer as a permanent part of the product |

On hybrid plugins, (1) is plausible from Adobe's stated use cases, and we cannot
evaluate (2) or (4): Adobe's hybrid-plugin pages say nothing about the sandbox,
file system, process control or networking.

### 7.1 Deprecated — public statements that are superseded

A reader may have seen these in earlier versions of this repository. They are
retired.

- "Adobe will remove CEP support around November 2026." Adobe's schedule is the
  one above.
- "UXP provides no `localStorage`." It documents a synchronous one; what is not
  established is access to the CEP panel's stored data.
- "UXP requires a bundled entry point." Bundling is optional.
- "UXP cannot spawn processes." It can launch one, without arguments and without
  captured output.
- "Host calls are 82 % routed." That counted the script modules only, on
  2026-10-21. The 1.0.0 figures are 84 % there and 77 % with the HTML page.
- "Frame export has no UXP API today." Adobe publishes no statement of absence,
  so this could not be quoted. See 7.2.

### 7.2 Frame export: what would count as an answer

Documented candidate APIs may exist: a sequence-frame export path and a
sequence-export path are the two we know to look at. Neither has been shown to
satisfy our contract, and the contract is not "export a frame". It is: *given a
selected clip's **source** media and an in/out range, produce a real file at a
writable path, conformed to the destination model's schema, and report the file's
**measured** dimensions and duration.* Seven obligations sit inside that sentence:

| # | Obligation | Why a sequence-frame API does not settle it |
|---|---|---|
| 1 | **Source fidelity** — the clip's source media, not a sequence render | A sequence-frame export renders the *sequence*: effects, transforms, scaling to sequence frame size, letterboxing. Whether that difference is acceptable is a product decision |
| 2 | **Media-range export** — an encoded sub-range, not a still | Video-to-video and image-to-video need a container and a codec |
| 3 | **Schema conformance** — per model, at call time | Dimension limits, aspect bounds, file-size caps and a format allowlist, resolved from the destination model and not from a fixed preset |
| 4 | **Artifact measurement** | Dimensions and duration read back from the produced file, never assumed from the request |
| 5 | **Audio and multi-asset handling** | Separate shapes with their own obligations |
| 6 | **A writable destination** outside plugin-scoped storage | Feeds upload, then persistence beside the customer's project |
| 7 | **Unified error and recovery behaviour** | One error pipeline, one identity per failure, no dependency on a second application being installed and responsive |

A sequence-export path plausibly reaches obligation 2, and is where we expect
condition-dependent answers: asynchronous, dependent on a second application,
preset-driven where we need schema-driven. That is a different verdict from
"unavailable".

The unresolved work is a spike, not a re-read: seven rows, each answered by making
the call and measuring the artifact. Our own CEP measurements forced the same
discipline: the obvious frame-grab member on the supported object is `undefined`
at runtime and only a second route works. Until the spike runs, row 19 in section
8 stays [ASSUMPTION]. It is not evidence that the companion application is
permanent.

---

## 8. Claim register

The rows a conclusion in this document rests on, by class. The last column is what
would have to happen for the row to change: a claim with no stated falsifier
cannot be re-checked, only re-asserted.

| # | Claim | Class | Established | Falsified by |
|---|---|---|---|---|
| 1 | Three platform surfaces have zero direct calls left | [SOURCE] | 2026-08-30; holds at 1.0.0 | A direct call appearing outside the adapter |
| 2 | Host calls are 84 % routed in the panel's script modules and 77 % with its HTML page counted; the generation pipeline is the unbridged subsystem | [SOURCE] | 1.0.0 | Re-running the same search, over both |
| 3 | The panel makes about 400 `localStorage` calls and has no adapter for them | [SOURCE] | 2026-09-01; holds at 1.0.0 | An adapter landing, or the sites being removed |
| 4 | UXP provides a synchronous `localStorage` | [PLATFORM] | Adobe's reference pages, read 2026-11-16 | Adobe removing it. Whether it reaches the data the CEP panel has stored is not established |
| 5 | UXP can launch a process but cannot pass arguments or capture output | [PLATFORM] | 2026-08-30 | Adobe changing the documented limitation |
| 6 | Therefore the backend must become a companion application | [ASSUMPTION] | 2026-08-30 | Row 5 changing, or row 10 or 19 resolving the other way |
| 7 | At least 13 backend endpoints invoke external media tooling | [SOURCE] | 2026-08-19; a floor | Re-measuring |
| 8 | Bundling is optional under UXP; a script entry is supported | [PLATFORM] | Adobe's TypeScript guide, read 2026-11-16 | Adobe requiring a bundle |
| 9 | At least 22 user-facing operations have an unsupported host API as their only implementation | [SOURCE] | 2026-08-19; a floor | Supported equivalents arriving — question 2 |
| 10 | A hybrid plugin might link a media library directly instead of shelling out | [ASSUMPTION] | 2026-08-30 | Adobe documenting the sandbox boundary — question 4 |
| 11 | We could evaluate row 10 by building one | [PROTOTYPE] | not started | Building it. **No conclusion in this document rests on it** |
| 12 | UXP's user identifier is account-bound, not machine-bound | [PLATFORM] | 2026-08-30 | A machine-scoped identifier appearing — question 6 |
| 13 | An account-bound identity would make a two-device seat model unenforceable | [ASSUMPTION] | 2026-08-30 | Building it and finding otherwise |
| 14 | Our install identity is produced in one place, inside the process that becomes the companion application, so the sandbox never needs it | [SOURCE] | 2026-09-01; holds at 1.0.0 | A second producer appearing. It has happened once |
| 15 | Secure storage is documented as a cache, not persistent storage | [PLATFORM] | 2026-08-30 | Adobe restating it |
| 16 | A lost seat record cannot be regenerated without consuming a second slot | [ASSUMPTION] | 2026-08-30 | A supported cleared-or-never-written signal — question 5 |
| 17 | CEP works end to end in Premiere Pro 26.3.2 | [SOURCE] — a live host measurement | 2026-09-01; panel and backend also ran in 26.5.1 on 2026-10-21, with no generation run | Any later version. **One version, one platform, one machine** |
| 18 | Adobe places CEP retirement at the end of 2029, with new CEP submissions for Premiere ending in December 2027 and CEP disabled by default in December 2028 | [PLATFORM] | Adobe's September 2026 announcement, read 2026-11-16 | Adobe revising the schedule |
| 19 | Our extraction contract has no *proven* UXP parity. Documented candidate APIs may exist, but none has been shown to satisfy the whole contract | [ASSUMPTION] | 2026-09-09 | A spike, not a document. Question 1, and 7.2 |
| 20 | Four of our durable stores carry a schema version and three do not | [SOURCE] | 2026-10-21; holds at 1.0.0 | Stamping the three |

**Rows 6, 13, 16 and 19 are the load-bearing assumptions**, and all four concern
things we have not run. Each is also the subject of an open question in section 5.
If any of the four is wrong, the architecture that follows from it is wrong.

---

## In summary

The adapter work is further along than our first plan believed, and much of the
companion application already exists: a standalone backend, a signed installer, a
supervised lifecycle and data kept outside the extension. The synchronous storage
adapter is a self-inflicted setback, and `localStorage` is a large surface whose
cost is a data move. The things that decide the timeline — frame export, the
QE-dependent operations, and what hybrid plugins are allowed to do — are not ours
to decide. Adobe's schedule gives until December 2027 for new CEP submissions and
December 2028 before CEP is off by default.

*Last measured against the 1.0.0 source, 2026-11-24. Platform statements last read
2026-11-16. Earlier readings are dated where they appear.*

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — the CEP system these figures measure · [Roadmap](ROADMAP.md) — where the migration sits among the other work
