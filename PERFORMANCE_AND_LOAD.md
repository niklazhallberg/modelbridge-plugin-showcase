# Performance, and what modelBridge asks of the services it depends on

modelBridge is a Premiere Pro panel that renders generation forms from fal.ai's
OpenAPI documents, runs the generations, and reports what they cost. It talks to
three outside parties: fal.ai, a Cloudflare Worker we operate, and — when the
editor supplies their own key — the Anthropic API.

This document reports two things we measured. First, how fast the panel is,
because a fixed-canvas tool inside a timeline application is judged on whether
it feels present. Second, and more usefully to anyone on the receiving end: how
much traffic we generate, at what cadence, and why each cadence was chosen. The
second part is the one we could not read anywhere else and had to measure on
ourselves.

Every figure carries a date and a method. **Measured** means observed in a live
run against the shipping build. **Derived** means computed from a measured input
and a constant read out of the shipping source — stated as such, never rounded
into a measurement. Anything we did not measure is marked unmeasured rather than
estimated, including one number that matters a great deal and that we cannot
produce from the hardware we have.

**Figures measured 2026-09-01** against a live panel over the Chrome DevTools
Protocol, unless a row says otherwise. Two figures are carried forward from an
internal audit of 2026-08-30 and say so where they appear.

This document does not describe how fal.ai works internally. We have no view of
that. It describes what we ask of their infrastructure, which is the part we are
responsible for.

---

## 1. What the panel costs the person using it

### 1.1 Cold start

**Method.** `location.reload()` on the live panel, then Navigation Timing plus
the full Resource Timing entry list read 45 seconds later. Reproducible on any
install with the DevTools port open. One caveat that changes the numbers if you
skip it: the resource buffer defaults to 250 entries and fills during boot, so
`performance.setResourceTimingBufferSize(5000)` has to be set first or the tail
of the timeline is silently missing.

| Phase | At | Blocks the UI? |
|---|---|---|
| Document response end | 54 ms | — |
| DOM interactive | 111 ms | — |
| **DOMContentLoaded** — 108 deferred scripts parsed and executed | **625 ms** | yes |
| First local backend contact | 451 ms | no |
| OTA payloads (manifest, pricing supplements, endpoint migrations, config) | 454–1,527 ms | no |
| Load event end | 1,509 ms | — |
| Readiness burst: catalogue index, licence, agent status | ~1,980 ms | no |
| fal.ai key probe | 1,979 ms, **1,025 ms long** | no |
| **Panel functionally ready** — catalogue complete (1,295 models), 67 installed models resolved, licence settled | **≈2.2 s** | — |

Nothing after DOMContentLoaded blocks the interface. Every remote fetch on the
boot path has a cached or bundled fallback, which is why 2.2 s is a property of
the build rather than of the network that morning.

**What this is not.** It is a panel restart with a warm backend, warm HTTP cache
and warm local storage. It does not measure the local backend process starting,
a genuinely first-run install with empty caches, or a Premiere launch. Those
three are unmeasured, and we say so rather than model them.

### 1.2 DOMContentLoaded, before and after a deletion pass

On 2026-09-01 we removed a substantial amount of unreachable code and six script
tags. Two readings:

| | Scripts | DOMContentLoaded | Provenance |
|---|---|---|---|
| Before | 114 | 1,629 ms | internal audit, 2026-08-30, one boot |
| After | 108 | **621 ms and 625 ms** | 2026-09-01, two boots |

**We are not claiming the deletions caused that.** The before-figure is a single
boot on a different day; we did not re-measure the old build under controlled
conditions, and a cold-versus-warm HTTP cache alone can account for a difference
of this size. What is established is the current figure, from two readings that
agree to within 4 ms. The attribution is not.

### 1.3 The interactions an editor actually performs

**Model switch.** Measured with `performance.mark`/`measure` markers that already
exist in the shipping build (`mb:switch`), across three real switches:

| Model | Controls rendered | Switch |
|---|---|---|
| A text-to-image model | 19 | 55.7 ms |
| A 19-input video model | 90 | 50.7 ms |
| A reference-to-video model | — | 25.7 ms |

25–56 ms, and it is computation — not network, not the host application. The
measure spans the whole switch: teardown, model resolution, schema read, field
generation, DOM insertion. It is near-flat between 19 and 90 rendered controls.

**Browse and form generation.** Two figures from the internal audit of
2026-08-30, carried forward rather than re-measured:

| | Measured |
|---|---|
| Full Browse render, 1,233 model rows | 147.7 ms median, 167.3 ms max, ~440 ms to painted; zero forced-layout reads |
| Heaviest generation form, 19 inputs | 7.2 ms median, near-flat from 2 to 19 inputs |

We re-checked their validity a different way rather than re-running them: the
files on the render path were last modified 2026-08-27 and 2026-08-29, before the
deletion pass, so the code those numbers describe is unchanged. That establishes
the code, not the timing — a machine with a different processor will read
differently.

All four figures sit below the threshold at which an interaction reads as
instant. We report them because they bound the claim, not because they are
impressive.

---

## 2. Reuse: what a returning model costs

The single most-repeated action in the product is selecting a model you have used
before. **Method:** two controlled switches with resource timings cleared
immediately beforehand, and each model's pricing timestamp read before and after.

| | Schema | Fields | Pricing | Network |
|---|---|---|---|---|
| Model with curated pricing | local storage | local storage | skipped — curated data is authoritative | **0 requests** |
| No curated pricing, priced 1.5 h ago | local storage | local storage | skipped — inside the 24 h window | **0 requests** |
| No curated pricing, priced 25.2 h ago | local storage | local storage | **1 request, 608 ms** | **1 request** |

**The schema and its parsed fields never leave local storage on a reuse.** No
schema fetch fired on any of the three switches. The form you see on a returning
model is rendered from a document already on the machine.

The one call that does go out is a pricing refresh, once per model per 24 hours,
and only for models not covered by curated pricing. **It needs to go.** A rate
can change on the provider's side with nothing in the payload announcing it, and
a stale rate is not a cosmetic problem in a product whose entire cost display is
`quantity × rate`: it produces a confidently wrong number, which is worse than no
number. The refresh is non-blocking, it is skipped entirely where curated data
already covers the model, and a failed or rate-limited response does not count as a
refresh — otherwise one throttled answer would suppress the next attempt for a
full day.

On the 67-model reference install used for these measurements, 5 models had
curated pricing and 31 had pricing older than 24 hours, so 31 would each fire one
request on their next selection. That is the intended steady state, not a defect.

---

## 3. What we ask of each service

This is the part of the document we could not have written by reading anyone
else's. Each cadence below is a choice, and each choice trades freshness for not
making somebody answer more often than the product actually needs.

### 3.1 fal.ai

| Path | Volume | Cadence | Backoff |
|---|---|---|---|
| **Polling a running generation** | **mean 37.2 requests per generation** (median 20, p90 92, longest observed 377) | stepped: fast for the first half-minute of a run, then slower in two further steps | Yes — explicit, in the shipping source |
| Polling a handed-off generation | — | stepped down over the first minutes; 30-minute soft stop | Yes |
| Catalogue synchronisation | a few dozen requests per cycle, paginated | **a few times a day** | n/a — the pointer advances only on success, so it can be slower, never faster |
| Platform health probe | 1 | every 5 min while the panel is visible | none |
| API key validity probe | 1 | once per panel start | n/a |
| Pricing | 1 per model per 24 h on selection | on demand | pacing only |
| Media upload | 1 per media input per generation | on demand | n/a |

**Method for the poll figure.** Derived, and stated as derived: we replayed the
exact cadence constant from the shipping source over 235 real generation
durations recorded by the product itself. It is not a count taken off the wire.
The durations are real; the arithmetic converting them to requests is ours.

**The trade, stated plainly.** A fast first poll exists because a five-second
generation that takes six seconds to appear feels broken. It steps down once the
run is long enough that a second of latency is invisible against the wait, and
there is no reason to keep asking at that rate. The median generation on this
install ran 20 seconds and cost 20 requests; the cost of the fast phase is
bounded by the fact that it ends after the first half-minute.

**The catalogue sync is the cadence we thought hardest about.** The worker runs
discovery, validation and publication as separate phases in rotation, so each
comes round a few times a day. It could have been hourly. It is not, because the
catalogue changes a handful of times a day and nothing in the product degrades
when a new model is visible a few hours late: the cost of that freshness is a
badge count and a "new models" chip being briefly behind. A cycle is a few dozen
requests against a ~1,300-model catalogue, a few times a day, for the whole
customer base — not per customer.

**One probe we know is wasteful, and have not yet fixed.** The 5-minute platform
health check fetches a full OpenAPI document and reads only the HTTP status code
from it. The cadence is defensible; downloading a schema document 288 times a day
to look at one integer is not. It is a one-line change gated on confirming the
endpoint answers `HEAD`, and it is open.

### 3.2 Our own Cloudflare Worker

The worker serves the catalogue snapshot, a schema blocklist, model insights, a
news feed, licensing, and telemetry. Cadences, all read from the shipping source:

| Path | Interval | Pauses when the panel is hidden | Deliberate |
|---|---|---|---|
| News / status poll | periodic, tightening during a provider incident | yes | adaptive by design |
| Telemetry flush | periodic, **and returns immediately when the queue is empty** | no — must run hidden | yes |
| Licence revalidation | 12 h **plus jitter** | yes | the jitter exists so installs do not synchronise |
| Catalogue index | periodic, served stale-while-revalidate | yes | yes |
| Blog feed | matching the feed's own declared TTL | yes | yes |

Boot traffic to the worker, **measured** across four boots on 2026-09-01: one
model-insights request, one blocklist, one news, and three to four catalogue
requests — of which, see §5, only one actually reaches the network.

**What we have not measured** is per-customer-per-day request volume at scale. An
internal estimate exists; it is an estimate, built from assumed session lengths,
and we are not publishing arithmetic dressed as observation.

### 3.3 Anthropic — the agent's context packaging

Agent Mode runs on the editor's own Anthropic key. **Method:** 1,975 real agent
turns recorded by the product between 2026-05-12 and 2026-08-30, all on Haiku 4.5.

| Per turn | Median | Mean | p90 |
|---|---|---|---|
| Cached prefix re-read | **47,495 tokens** | 46,250 | 68,911 |
| Cache written | 629 | 8,467 | 45,373 |
| **New, uncached input** | **370 tokens** | 1,616 | 4,410 |
| Output | 128 | 217 | 439 |

| Across all 1,975 turns | |
|---|---|
| Prefix delivered (read + written) | 108.1 M tokens |
| **Cache hit ratio** | **84.5 %** |

**A median turn carries 47,495 tokens of prefix to deliver 370 tokens of new
content.** The prefix is the always-on instructions plus every tool schema, and all of
them go out on every turn regardless of what the turn is about.
That ratio is the honest headline, and it is why the caching is not optional:

- Every cache breakpoint the API offers is in use.
- The volatile part of the prompt is kept out of the cached blocks. It was not
  always: one changing value sat inside a cached block and made a breakpoint
  structurally unreachable, so nearly every turn re-tokenised the whole
  conversation at full price. The breakpoint existed and could never hit.
- 84.5 % is the evidence it works now.

**A correction we shipped on 2026-09-01.** Cache writes were priced at 1.25× the
base input rate — the 5-minute rate — while every one of our four cache markers
requests a 1-hour TTL, which is 2×.
Across those 1,975 turns the product under-reported its own agent cost by roughly
27 %: $34.36 shown against ≈$46.90 actual. The rates are corrected; **historical
records are marked, not recomputed**, because a customer who exported a report
last week should not find the system quietly revised itself afterwards. The three
surfaces that show a historical agent total now carry a one-line note saying rows
before that date understate their cache writes.

The root cause is worth naming because it is not an arithmetic error: a comment
beside the constants said "5-min rate", and the constants were correct *for a
case the product does not use*. A number that is right for the wrong case reads
as right in review, in a diff, and in a grep. Every rate now names the parameter
it applies to, next to the number.

---

## 4. Conditional requests: half built, and the measured half is smaller than we first claimed

Until 2026-09-01 the product made **zero** conditional requests — every
recurring fetch pulled its whole body whether or not anything had changed. There
is now one revalidation layer shared by the recurring fetches. It owns validators
only and never stores response bodies, so nothing is cached twice.

**What it buys, measured, and what it does not:**

| | Certain? |
|---|---|
| Saves the response **body** | **Yes.** Verified live: our statically-hosted payloads return `304` with a zero-byte body when given a validator |
| Saves the **request** | **No.** A conditional GET is still a request |
| Saves work on our own worker | **Unmeasured, and not implied** |

That third row is the important one. It holds only if the worker can answer 304
*without* reading the data it would otherwise have served, and the worker half
does not exist yet: our own endpoints send no validators, so today every one of
those requests is still a 200. The client half is wired anyway, so adding
validators on the server becomes a deploy on our side with no second change to
shipped panels.

The measured gain today is small and specific: the update manifest went from
three fetches per boot to two, because concurrent requests for the same document
now share one call.

---

## 5. What turned out not to be worth optimising

A metric already below the threshold of perception is not an optimisation
opportunity. Three candidates were ranked as worth fixing and then measured out
of the list.

**The catalogue snapshot fetched four times per boot.** It is a 524 KB document,
requested from four call sites that are not concurrent, and it looked like
2.1 MB of avoidable traffic per boot. It is not. The response carries
`cache-control: public, max-age=3600`, so the browser's own HTTP cache already
collapses them. Measured with the cache bypassed: the **first** request takes
294 ms; the next two take **1.8 ms and 2.1 ms**. On an ordinary reload all of
them are ~2 ms and the network is not touched at all.

| Per boot | |
|---|---|
| Requests actually reaching our worker | **1 at most**, then none for the rest of the hour |
| Extra bytes | **0** |
| Actual waste | 2 × `JSON.parse` of 524 KB = **2.8 ms** |

The recommendation to add a memo layer was withdrawn. The browser had already
solved it, and we had not checked before proposing a fix.

**Two internal audit items were closed on measured time rather than on byte
counts.** One said a per-row cache read moved 627 MB of strings per Browse
render. The byte figure is arithmetically true and is not a time cost: reading
that 365 KB key costs 0.3 µs, the same as reading a key that does not exist,
because the engine does not materialise the string per call. 4,935 reads come to
about 1.5 ms inside a 148 ms render. The second item's cost turned out to be
bounded by a guard already in the code that caps the data structure at ten
entries, making its bad case unreachable.

---

## 6. Where we were wrong

A performance report with no errors in it is not a measurement; it is a summary
of what someone expected to find. Three findings in the first draft of our
internal audit were wrong, and they were wrong in a way worth reporting, because
the pattern is more useful than the individual mistakes.

**All three were rankings built on a number that was not a time cost.**

1. *The catalogue's four fetches* were ranked as the largest remaining traffic
   item at 2.1 MB per boot. Measured: at most one request per hour reaches the
   network, and the redundant calls cost 2.8 ms of parsing (§5).
2. *Conditional requests* were ranked as the single largest available reduction
   in the load we place on our own infrastructure, on the strength of a KV-read
   saving that was never measured and depends on an implementation that does not
   exist (§4).
3. *A per-row storage read* was ranked on 627 MB of string churn, a figure that
   does not correspond to any time spent (§5).

**All three made the product look worse than it is.** That is the part worth
reporting. An audit written to find faults is primed to accept a fault-shaped
answer, and a byte count is fault-shaped in a way a microsecond measurement is
not. One-directional error is evidence about method, not luck, and it was
available for free — we only had to count our own corrections by direction before
publishing, instead of folding them silently into the findings.

Two things changed as a result. A byte count is no longer accepted as a
performance finding without a matching time measurement. And the audit now keeps
a running tally of its own corrections and which way each one pointed, reported
alongside the findings rather than after them.

A fourth correction belongs here too, from the same pass: the cache-write error
in §3.3 was first reported as reaching three customer-facing surfaces. Two of
those were wrong — both exclude agent records entirely, and the third is an
internal report, never the client-facing one. Smaller blast radius than claimed,
and the same direction as the other three.

---

## 7. The largest thing we have not measured

**How much work the panel asks of Premiere Pro on a real timeline.**

While a form for a model that takes media is open, the panel polls the host
application for the current selection. **Measured 2026-09-01** by instrumenting
the host-call bridge over fixed windows:

| Panel state | Host calls per second |
|---|---|
| Idle, no model selected | **0.00** (zero calls in 2.14 minutes) |
| A media-taking model's form open | **5.72** (69 calls in 12.1 seconds), from three distinct selection walkers |
| A different media model | **3.67** — the walker set varies by model |

The cost is strictly conditional: with no form open the panel asks the host
nothing at all. But 46 of the 67 installed models on the reference install take
media, so it is the common state rather than an edge case.

**Every one of those measurements was taken on a nearly empty project.** Each
call walks the timeline's tracks and clips, so its cost scales with the timeline,
and the reference project has almost nothing in it. **We do not know what this
costs on a feature-length edit with hundreds of clips, and we are not going to
guess.** We know the shape of the risk — the scripting engine is single-threaded,
host calls queue, and a call that takes longer than the polling interval will
compound rather than catch up — and the polling is written with backpressure for
exactly that reason: one call in flight at a time, with an escalating retry
window. That is a mitigation, not a measurement.

This is the single largest open question in this document. Closing it needs a
real editor's project, not a synthetic one.

---

## 8. Reproducing this

| Figure | How |
|---|---|
| Cold start | Reload, then read Navigation and Resource Timing. Raise the resource buffer first — the 250-entry default fills during boot |
| Model switch | Read the `mb:switch` performance measure the build already emits |
| Host call rate | Wrap the host bridge, count by function name over a fixed window. Verify the wrapper intercepts before trusting a zero |
| Storage read cost | Benchmark a read of a large key **and** of a key that does not exist. The comparison is the finding |
| Agent tokens | From the product's own generation log |
| Polls per generation | Replay the cadence constant from source over the real durations in that log |

Everything except the agent and generation statistics is reproducible against
any install with the DevTools port open; those two need that install's own
history.

---

## Related

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how the fal.ai API's shape sets the terms
  of the integration: schema-derived forms, terminality classification, and the
  cost-label discipline. That document is about what the API demands; this one is
  about how often we ask.
- [`API_OPTIMIZATION_DECISIONS.md`](API_OPTIMIZATION_DECISIONS.md) — optimisations
  on the fal.ai path evaluated and deliberately not built.
- [`UXP_MIGRATION.md`](UXP_MIGRATION.md) — the same reporting form applied to the
  CEP → UXP transition.
