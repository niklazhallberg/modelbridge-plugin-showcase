# How modelBridge is built for reliability

modelBridge renders an interface for every model in the fal.ai catalog from that
model's own schema, and the catalog changes every week. A per-model fix does not
scale to that. What follows is the machinery that keeps a new model, a new schema
shape or a new code change from reaching an editor as a broken form, a refused
run or a wrong number.

Figures are dated. Those marked 2026-10-21 were measured against panel commit
`e721aa52`; those marked 1.0.0 against `5b583e78`, the commit the 1.0.0 installer was
first built from. The plugin source is private; the files behind each claim can be shown to
a reviewer on request, and every figure here comes from a run or a count that can be
repeated.

| Area | What it catches | Where it runs |
|---|---|---|
| [Catalog verification](#1-the-catalog-is-verified-on-a-schedule) | a model whose schema does not resolve, or whose output cannot reach Premiere | Worker cron, and CI twice a day |
| [Interpretation sweep](#2-every-field-of-every-model-through-every-layer) | two layers of the product disagreeing about one value | CI, after each catalog verification |
| [Shared resolvers](#3-resolvers-instead-of-per-model-lists) | the same question answered differently in different places | every layer, at runtime |
| [Parameter help](#4-parameter-help-coverage) | a field shipping with no explanation, or a help text inventing a number | pre-commit, CI, docs build |
| [Guards](#5-guards-before-a-commit-a-push-and-a-release) | a known defect class re-entering the code | pre-commit, pre-push, release build |
| [Deploy provenance](#6-what-is-running-is-recorded-not-assumed) | "we think production runs X" | every deploy, on demand |
| [Licence simulator](#7-every-licence-state-replayed-through-the-real-worker) | a licence state the panel renders wrongly | on demand, offline and in the live panel |
| [Live verification](#8-verified-in-the-real-panel-and-with-real-generations) | a finding that holds in source but not on screen | the running panel in Premiere |
| [Run-time behaviour](#9-at-run-time-a-paid-generation-is-not-lost) | a paid run lost to a dropped connection, a restart or a stalled upload | the panel and local backend, on the editor's machine |

---

## 1. The catalog is verified on a schedule

Two systems check the catalog independently, so neither one's outage hides the other's.

**The Worker** runs on a schedule, several times a day, so a new model is picked
up the same day. A new model is schema-validated before it is announced in the
panel. A model is treated as removed only after its absence has been confirmed
over several complete passes, and removal processing is skipped entirely if a
large part of the catalog vanishes at once, which is a fal.ai API problem rather
than real removals.

**CI** runs a catalog verification twice a day. It lists the active fal.ai
catalog, reads each new or changed model's OpenAPI schema (an unchanged, already
verified model is re-read on a slower rotation), and classifies each model with
the same predicate the panel runs when a user adds a model, so the catalog verdict
and the install verdict cannot drift apart. Its requests to fal.ai are paced and
back off when fal.ai asks it to.

| Verdict | Meaning | 2026-10-21 | 2026-11-21 |
|---|---|---|---|
| Verified | the schema resolved and parsed | 1,225 | 1,172 |
| Prompt interface | live on fal.ai with a supported category, but its schema is unavailable. Offered with a prompt interface and re-checked regularly | 69 | 16 |
| Blocked | proven incompatible: the schema resolved and no output can ever carry a media URL | 8 | 12 |
| Pending | a transient failure, retried | 1 | 0 |

The rules that keep this honest:

- **Blocked means proven.** Timeouts, 5xx, 404s and schema-expansion failures are
  never grounds to block. An access refusal (401/403) is never escalated to
  a prompt interface: a schema the verifier may not read says nothing about whether a
  customer's key can run the model.
- **The stronger verdict wins.** When the Worker has validated a model itself, a
  later CI "pending" for the same model does not delete that approval. A CI
  "blocked" still does.
- **Ask fal.ai with the id fal.ai published.** An endpoint is always queried by
  the id the catalog gives it, so a missing schema is a statement about the schema
  and not about a string we invented.

The panel's own count comes from a separate catalog fetch and differs slightly
from the CI total by design.

**The monitoring is itself monitored.** The daily job pings an external dead man's
switch only after it succeeds, so a schedule that silently stops running raises an
alert. A separate step checks the Anthropic model ids the agent is pinned to against
their retirement dates, and treats a source it could not read as unverified, not as
clear.

## 2. Every field of every model, through every layer

A value the user picks passes through several layers before fal.ai sees it, from
the form that collects it to the local backend that sends it, with Dual Mode in
between when two models run side by side. Each answers
"what is this value, and is it allowed?". When two of them answer differently, the
user sees a form that says yes and a run that fails, or a form that refuses a
valid value.

The interpretation sweep runs each of those layers as shipped, not a copy, against
an independent reference for what the schema itself accepts. For every non-media
field it derives candidate values from the schema, weighted toward the edge cases
a form is most likely to get wrong, and records every layer's answer.

Run on 2026-10-21: **1,289 of 1,294 installable models, 11,919 fields, 90,738 candidate
values, in about 70 seconds.** The five schemas it could not load are three with no
schema components and two WebSocket endpoints with no input schema.

The verify job runs it after every catalog verification, against a committed
baseline. When the set of findings the baseline does not name changes, it sends one
notification, in three classes. A sweep that could not run, or that read too few
schemas to mean anything, is reported the same way and never read as a clean result.

| Class | Disagreement |
|---|---|
| A | the panel gate accepts a value the backend refuses |
| B | the gate refuses a value the schema and the backend accept |
| C | the gate accepts and the backend sends a value the schema rejects, so fal.ai refuses after the panel said OK |

The other classes are listed in the sweep's output without a notification.

**Before and after the first full sweep (2026-10-21).**

| Rows per class | Before | After |
|---|---|---|
| A: gate accepts, backend refuses | 0 | 0 |
| C: backend sends what the schema rejects | 4,231 | 9 |
| G: Dual Mode refuses what the gate accepts | 4,160 | 8 |
| L: a decimal in an integer field is sent unrounded | 2,072 | 0 |
| B: gate refuses what schema and backend accept | 6 | 6 |

The largest single finding was that a decimal typed into any of 2,072 integer
fields in 924 models passed the gate and was refused by fal.ai. The baseline shipped
with 1.0.0 names one remaining row, a class B refusal on a single field.

## 3. Resolvers instead of per-model lists

The catalog grows every week, and a new schema shape usually arrives on many models
at once. On 2026-10-21 one shape, a `duration` enum mixing a string with numbers
(`["auto", 5, 6, … 20]`), was on 16 fields in 16 models. A per-model
fix would have to be repeated for each model, and again for the next family.

Instead, each question has one resolver in a module every layer shares, and every
layer calls it:

| Question | Resolver | Called by |
|---|---|---|
| Is this value one of the field's options, and which one? | the enum resolver | form, gate, transformer, Dual Mode planner, backend |
| Is this number allowed here? | the numeric resolver | parser, form, gate, Dual Mode planner, backend |
| Which fields are required for these values? | the requirement resolver | parser, form, gate, Dual Mode planner, backend |

The rules each one holds:

- **The enum resolver returns the schema's own entry**, so the payload carries the
  schema's type: the number `5`, not the string `"5"` the form control held.
- **The numeric resolver refuses at the gate** what the schema refuses: a decimal
  in an integer field, a value outside the bounds, an exclusive bound itself, a
  value off a `multipleOf` grid. The refusal uses the same words as the field's
  hint, before Generate is pressed.
- **The requirement resolver evaluates conditional schemas** (`if`/`then`,
  `dependentRequired`). A condition it cannot decide leaves nothing required, and
  fal.ai still judges the real rule at submit.
- **The backend is never stricter than the gate.** An option the gate accepted is
  passed on with a warning, and a number is judged by the same resolver with the same
  words, so the backend cannot refuse what the gate allowed.

The sweep in section 2 is what checks that these resolvers really are the only
answer: a layer that starts answering on its own shows up as a new row.

## 4. Parameter help coverage

Every input field a model exposes gets a plain-language explanation and, where the
topic deserves one, a link to a docs section. The rule since 2026-09-01: every
field that is not self-explanatory must resolve to curated help.

**The coverage check.** The verify job writes the catalog-wide field union, and a
coverage check runs at every commit, and again as a required step of the release
checklist. A field fal.ai adds is recorded as pending and listed with its age; what
fails a commit is something a person did, such as removing help from a field or
defining a field in panel code without help. An entry leaves the backlog when its
help lands.

| At 1.0.0 (union generated 2026-11-24) | |
|---|---|
| Distinct input fields across 1,173 verified models | 1,821 |
| Backlog (893 without an entry, 22 routed to the general section) | 915 |
| Of the backlog, fields the catalog added and CI recorded as pending | 726 |

The union counted 1,113 fields on 2026-10-21. The growth is fal.ai's catalog adding
fields, which is why a new field is recorded as pending instead of failing a commit.

**The parameter index.** Every field in the union also gets a factual entry on
[docs.modelbridge.app/academy/parameter-index](https://docs.modelbridge.app/academy/parameter-index/),
generated from the union and rebuilt after each verification. It carries one anchor
per field, so a field fal.ai added this morning has a working help link before anyone
has written a word about it.

**Drafted by AI, shipped by a person.** Claude drafts help for the most-used
uncovered fields on a schedule. Any draft that fails two gates is discarded:

- **Citation.** A route must quote, word for word, a sentence from the target
  section showing that the section covers this field.
- **Numbers.** Every number in a draft must come from the provider's own
  description, range, default or options for that field, or from the target
  section's text. A number from anywhere else discards the draft.

Surviving drafts are proposed for review, never merged automatically, and the panel
cannot link to help that the docs site does not carry yet. A person reviews and
merges; the panel entry ships with the next release.

## 5. Guards before a commit, a push and a release

**Before a commit.** The pre-commit hook runs about thirty mechanical checks. Each
exists because a defect of its kind once shipped or nearly did. Among them:

| Guard | Refuses |
|---|---|
| Docs links | a "Learn more" link the panel can emit that lands on a docs heading which does not exist |
| Render contract | a schema field type, or a type-and-container pairing, the renderer does not know. An unknown shape is a failure, never a silent fallback |
| Parameter coverage | help removed from a catalog field, or a field defined in panel code with no curated help |
| Cost terminology | cost wording that presents modelBridge's arithmetic as fal.ai's invoice |
| ExtendScript syntax | modern syntax in ExtendScript, which fails at parse inside Premiere |
| Link hosts | a link or address pointing at a host or mailbox we have not verified we own |
| Failure surface | a failed generation reported on two surfaces, or on none |
| Over-the-air hashes | an over-the-air payload whose pinned hash no longer matches, which installed panels would silently reject |

**Before a commit and before a push.** A check runs on the guards themselves. For 44
guard cases (counted at 1.0.0) it plants a violation the guard must refuse and a clean
input it must pass, against the real guard on the real tree. A guard that has never
been seen to fail is treated as a step, not a check. The pre-push hook also re-runs
the regression rows written for every finding fixed after a paid live generation
test; the same rows run in CI on pull requests and on the main branch. One of the
guards fails any backend route able to spend on the customer's key unless it is
behind the licence check.

**Test counts have one producer.** A published test count can only come from a
recorded run. A suite that does not report fails that run, and a ratchet refuses a
suite that was green going red without a written reason.

**Before a customer build.** A release build is refused unless it is built from a
clean, published, untagged state of the main branch, with a bundled ffmpeg that
carries everything the backend uses and an identity that matches the extension
manifest. The 1.0.0 installer, rebuilt 2026-11-25 from plugin commit `bb945e1c`, is
signed with a Developer ID
Installer certificate, notarised by Apple and stapled (checked 2026-11-25 with
`pkgutil --check-signature`, `spctl -a -vv -t install` and `xcrun stapler validate`).

## 6. What is running is recorded, not assumed

**The panel.** Every deploy of the panel into Premiere writes a provenance record.
A deploy ledger is rebuilt from those records; it held 364 recorded deploys when
1.0.0 was built. A second command compares every installed file with the commit the
ledger records. A third recreates each installed file from the recorded chain of deploys and refuses if the bytes do not come out equal.

**The Worker.** The Worker's deploy command is a wrapper that records the commit
it deploys. A companion check reads that record back from production and answers
in one of four ways: match, mismatch with a direction and
distance, a commit this repository does not contain, or "cannot determine".
The last is never reported as a pass.

## 7. Every licence state, replayed through the real Worker

Licence state is issued by the licence service and checked by the local backend
before paid work starts ([Security](SECURITY.md)), and the panel has a set of licence states a
customer can be in, from trial and active through paused, unpaid, refunded,
revoked and "this computer is not the active one". Each state is designed and
reviewed on all three surfaces where it appears: the Generate tab, the Agent tab
and Settings.

A licence simulator drives those states the way Lemon Squeezy produces them.
Webhook deliveries go through the real Worker source running in a sandbox with a
controllable clock, and from there through the shipped backend and panel code.
Deliveries are built from captured real ones; event types we have not yet received
for real are derived from the nearest captured one and marked as assumed.
Transitions that depend on time passing are reached in seconds. Nothing touches
production state or Lemon Squeezy.

Run on 2026-10-21 against the production Worker commit: **25 scenarios, each
reaching its intended state with zero findings, in about 15 seconds.** The 25
cover the states plus the transitions between them: a
slow backend start, an unreadable cache, a third computer refused, a payment that
recovers on "Check again".

Each state is then rendered into the running panel and all three tabs are
captured, which is how every state was reviewed. A test fails if a state has a
fixture and no way to display it.

## 8. Verified in the real panel, and with real generations

**On screen, not in source.** A claim about what an editor sees is checked in the
running panel. The browser-side suites run inside the installed panel
in Premiere on a development machine, over the DevTools protocol. A suite that
cannot report counts as a failure, so a suite that never ran cannot read as green.
During design review, edited panel files can be served into the
running panel without a deploy.

**With fal.ai, cheaply.** When a finding depends on what fal.ai itself does, we run
the cheapest real generation that settles it. On 2026-10-21 the sweep predicted that
fal.ai refuses a decimal in an integer field and a value off a `multipleOf` grid.
Two real requests confirmed both: refused before running with
`int_from_float` and `multiple_of`, at no cost. That is what justified refusing those
values at the gate rather than rounding them silently.

**Agent behaviour as a frequency.** Agent Mode behaviour is measured with repeated
runs of the same case, reported as a pass rate
and the number of distinct tool paths. A single run cannot tell a fix from chance.

## 9. At run time: a paid generation is not lost

Sections 1 to 8 are about what happens before a build reaches an editor. This one
is about what the shipped panel does when something goes wrong during a run. Read
from the 1.0.0 source.

- **Lost contact is kept apart from provider failure.** A status request that errors,
  or a dropped connection, is not shown as a failed generation. It is tolerated for a
  bounded period of unbroken failure, which any successful answer resets, and then
  reported as lost contact that the editor can act on. The run stays recoverable.
- **A failure is final only when fal.ai says so for that request.** Error-shaped
  fields on a queued, running or completed status are not taken as proof. The rule
  was built from captured real responses and is tested offline.
- **Interrupted generations are resumed.** Each submitted request is recorded durably
  under fal.ai's request id, holding metadata only, and is picked up again after a
  panel or Premiere restart. Resumption has a limit counted from submission that a
  restart cannot extend.
- **Delivery is tracked per output, not per request.** An output that was saved and
  whose file has since disappeared is a different state from one never delivered, so
  a result is neither downloaded twice nor reported as present when it is gone.
- **Uploads are bounded by stall, not by elapsed time.** An upload is given up only
  when no bytes have moved for a set period, so a large clip on a slow connection is
  not cut off.
- **A silent agent reply is detected.** An Agent Mode reply that starts and then goes
  quiet, as after sleep or on a captive network, is reported as a connection error
  instead of waiting out a much longer request timeout.
- **Over-the-air payloads fail closed.** Each payload is checked against the hash
  pinned in the manifest before use. A mismatch, an unverifiable digest or a missing
  pin leaves the last verified or bundled copy in place. A workflow in this
  repository checks the same pins on the publishing side.
- **A renamed model is migrated, not marked gone.** Known endpoint renames move an
  installed model to its new id, from a table that accepts only confirmed moves.
- **Dual Mode sends two prepared payloads under one authorisation**, and stops both
  if the inputs change in between.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) · [Security](SECURITY.md) ·
[Performance and load](PERFORMANCE_AND_LOAD.md)
