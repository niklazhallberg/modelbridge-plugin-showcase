# How modelBridge is built for reliability

modelBridge renders an interface for every model in the fal.ai catalog from that
model's own schema, and the catalog changes every week. A per-model fix does not
scale to that. What follows is the machinery that keeps a new model, a new schema
shape or a new code change from reaching an editor as a broken form, a refused
run or a wrong number.

Every figure on this page was measured on **2026-10-21**, against the panel build
on `main` at `e721aa52` and the production Worker at `d013979`. The plugin source
is private; the files behind each claim can be shown to a reviewer on request, and
nothing here is a figure we cannot reproduce from a run.

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
from the CI total by design. The second snapshot was taken 2026-11-21 14:25 UTC;
the other figures on this page are from 2026-10-21.

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

Since 2026-10-21 the verify job runs it after every catalog verification, against
a committed baseline. It raises one alert per new finding, in three classes:

| Class | Disagreement |
|---|---|
| A | the panel gate accepts a value the backend refuses |
| B | the gate refuses a value the schema and the backend accept |
| C | the gate accepts and the backend sends a value the schema rejects, so fal.ai refuses after the panel said OK |

The other classes are listed in the sweep's output without an alert. The step was
added after that day's last scheduled run, so the figures above come from running
the same sweep locally.

**Before and after, 2026-10-21.** The first full sweep ran that afternoon; the
fixes it led to landed the same evening as one round of changes.

| Rows per class | Before | After |
|---|---|---|
| A: gate accepts, backend refuses | 0 | 0 |
| C: backend sends what the schema rejects | 4,231 | 9 |
| G: Dual Mode refuses what the gate accepts | 4,160 | 8 |
| L: a decimal in an integer field is sent unrounded | 2,072 | 0 |
| B: gate refuses what schema and backend accept | 6 | 6 |

The largest single finding was that a decimal typed into any of 2,072 integer
fields in 924 models passed the gate and was refused by fal.ai. Each of the nine
remaining baseline rows is named in the audit: four are artefacts of the sweep's
own reference evaluator, and the other five are registered follow-ups.

## 3. Resolvers instead of per-model lists

The catalog grows every week, and a new schema shape usually arrives on many models
at once. On 2026-10-21 one shape, a `duration` enum mixing a string with numbers
(`["auto", 5, 6, … 20]`), was on 16 fields in 16 models across more than one model family. A per-model
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
- **The backend is never stricter than the gate.** Where the panel gate has
  accepted a value, the backend passes it on with a warning rather than refusing
  it a second time with different words.

The sweep in section 2 is what checks that these resolvers really are the only
answer: a layer that starts answering on its own shows up as a new row.

## 4. Parameter help coverage

Every input field a model exposes gets a plain-language explanation and, where the
topic deserves one, a link to a docs section. The rule since 2026-09-01: every
field that is not self-explanatory must resolve to curated help.

**The coverage check.** The verify job writes the catalog-wide field union, and a
coverage check runs at every commit and at release. Since 2026-10-22 a field
fal.ai adds is recorded as pending and listed with its age; what fails a commit is
something a person did, such as removing help from a field or defining a field in
panel code without help. An entry leaves the backlog when its help lands.

| Measured 2026-10-21 | |
|---|---|
| Distinct input fields across 1,286 models | 1,113 |
| Marked self-explanatory | 283 |
| Resolved to curated help | 633 |
| Backlog (175 without an entry, 22 routed to the general section) | 197 |

On 2026-11-16 the backlog held 906 entries (884 without an entry, 22 routed to the
general section), most of them fields recorded as pending since the rule changed.

**The parameter index.** Every field in the union also gets a factual entry on
[docs.modelbridge.app/academy/parameter-index](https://docs.modelbridge.app/academy/parameter-index/),
generated from the union and rebuilt after each verification. The live page carried
1,113 field anchors on 2026-10-21, one per field, so a field fal.ai added this morning has a
working help link before anyone has written a word about it.

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

**Before a push.** The pre-push hook runs a check on the guards themselves. For 43
guard cases (counted 2026-11-16) it plants a violation the guard must refuse and a clean input it must
pass, against the real guard on the real tree. A guard that has never been seen to
fail is treated as a step, not a check.

**Before a customer build.** The gate in front of a customer build exists today: a
release build is refused unless it is built from a clean, published, untagged
state of the main branch, with a bundled ffmpeg that carries everything the
backend uses and an identity that matches the extension manifest. Version 1.0.0
was set on 2026-11-21. The signing and notarisation steps behind the gate are not
built yet, so no customer installer has been produced.

## 6. What is running is recorded, not assumed

**The panel.** Every deploy of the panel into Premiere writes a provenance record.
A deploy ledger is rebuilt from those records, 151 recorded deploys as
of 2026-10-21. A second command compares every installed file with the commit the
ledger records. On 2026-10-21 it reported that 2,368 files match `e721aa52`.
A third recreates each installed file from the recorded chain of deploys and refuses if the bytes do not come out equal.

**The Worker.** The Worker's deploy command is a wrapper that records the commit
it deploys. A companion check reads that record back from production and answers
in one of four ways: match, mismatch with a direction and
distance, a commit this repository does not contain, or "cannot determine".
The last is never reported as a pass. On 2026-10-21: match, production ran `d013979`.

## 7. Every licence state, replayed through the real Worker

Licences are verified server-side, and the panel has a set of licence states a
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
cover the states that existed on that date plus the transitions between them: a
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
