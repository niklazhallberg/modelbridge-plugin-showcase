# What a provider's billing signals tell an integration — and where counting stops

**Measured on modelBridge's own fal.ai account, 2026-08-25 to 2026-09-05.** Each
finding below was observed in live runs on that account over that window. Where a line
rests on something fal.ai wrote rather than on a measurement, it says so. The
account-specific evidence — request identifiers, amounts and ledger rows — is kept in an
internal record rather than published here.

These findings are why modelBridge labels every cost figure with where it came from, and
shows "No price" where nothing can be counted before the run.

No one can state the cost of a run before it runs. modelBridge shows an estimate, labels
its source, and refines it from the editor's own completed runs: the usage fal.ai reports
for a model and its settings feeds the next estimate for the same settings. The last
section describes how.

## 1. The usage count arrives with the result, not with status

A run's usage count is reported on the **result** fetch. Status responses do not carry
it.

Consequence: an integration that stops reading once a run reports completion never learns
what the run used. The result is the only carrier of the count, so the poll loop cannot be
the only thing that reads.

## 2. The result stays readable for days, which makes settlement after the fact possible

The result, and the count on it, can be fetched again days later with the same ordinary
key that submitted the run. Measured repeatedly across several models; the counts matched
the values recorded on the day in every case.

Consequence: a row that could not be priced when the run ended can be priced later from a
count the provider still serves. Retention beyond the window we measured is unmeasured,
so the product does not depend on it.

## 3. A cancelled run can complete and be charged anyway

A cancel request accepted while a run was in progress returned success, and the run
completed and was charged regardless. fal.ai's own documentation says a cancelled
in-progress request "may still complete". This was one run on one model; whether other
models stop earlier is unmeasured.

Consequence: an accepted cancellation is not "no charge". The cancelled row is re-read
from fal.ai afterwards — for several days — and is
counted as spend if the result then reports usage.

## 4. The endpoint a run is accounted under may not be the one it was submitted to

Observed once: a run submitted to one endpoint was accounted under a different one.

Consequence: reconciliation should not assume the endpoint a run was submitted to is the
endpoint it is accounted under. modelBridge records the endpoint named on the result and
reconciles against that one. This is recorded as an integration lesson, not as a
characterisation of fal.ai's billing.

## 5. The unit count is not always derivable from the request

For some models the billable quantity cannot be predicted from the form the user filled
in — nothing in the request implies it, and for some models the unit only exists once the
run has finished.

Consequence: for those models there is no honest number before the run. modelBridge shows
"No price" beforehand, and afterwards prices the row only where the provider's own rate
applies to the unit reported; otherwise it shows the count with no amount. (A model that
did have an estimate keeps it in that case, labelled Calculated.)

## 6. A count of zero is not a free run, and an accepted submission is not an accepted input

Two separate observations. A request refused by a runner reported zero usage while the
provider's ledger still booked a small amount for it. And a deliberately invalid request
was accepted by the queue with a request id, then failed validation on the worker — so a
successful submission is not evidence that the input was valid.

Consequence: zero means "the handler reported nothing", not "nothing was charged"; and a
queue accepting a submission is not the same thing as the input being accepted.

## 7. The per-request amount exists only behind a wider scope

The per-request amount is not available to the key that submits runs. It is reachable only
with a credential whose scope is considerably wider than generating.

Position: a key of that scope is more than a plug-in should hold on a user's behalf, so
modelBridge does not ask for one. A Metered amount is therefore the count fal.ai reported
multiplied by fal.ai's published rate for that unit. Every other amount is modelBridge's
own calculation and is labelled as such. No amount is a copy of an invoice.

## 8. Published prices can change without notice

fal.ai's Terms of Service, read 2026-09-05: *"All prices on the Sites are subject to
change at any time without notice, and any new pricing will be posted to the Sites."*
This is fal.ai's statement, not a measurement — no price change was observed on this
account.

Consequence: a rate stored in an integration has a shelf life, which is why every curated
rate carries the date it was last verified. Once that date is too old, the figure is still
shown, but labelled as a starting price that is due for a re-check, not as an estimate.

## How the estimate uses these signals

Read from the shipping source, not measured.

- **A fixed order of sources.** A curated rate checked against the provider's model page
  comes first, then what the editor's own runs have taught, then the provider's published
  unit rate shown as a "From" starting price. With no source there is no number.
- **Learning is per model and per settings combination.** A learned figure is used only
  after several completed runs at those settings, and it takes a middle value, so one
  unusual run does not move it. Repeated deviation is flagged as a possible price change,
  and a figure nobody has used for a long time is retired.
- **One run can teach a quantity.** Where fal.ai counts a unit the form does not show,
  the number of units fal.ai counted per second on a completed run is applied to other
  lengths at the same settings. Until a second run agrees, the figure stays a starting
  price and is labelled as one.
- **The estimate demotes itself.** When a metered run lands well above what was quoted,
  the next figure for that model is shown as a "From" price with both numbers beside it,
  until a run lands near its quote again.
- **A count becomes an amount only in its own unit.** If the rate is not denominated in
  the unit fal.ai reported, the row shows the count without an amount instead of a wrong
  one.
- **Quote and outcome sit on the same row.** The inputs that set the price are pinned at
  submit and the quote is stored with the run, so quoted and metered can be compared per
  generation. A row settled late is priced, but does not teach the estimate.

## What this page deliberately does not claim

- A notice period for price changes: the terms say "without notice", and nothing here
  measured a change.
- That results stay readable indefinitely, or that every model stops on cancel: one
  measurement each, stated as such above.
- Anything about the provider's invoice: no line in the product shows one, because no
  signal available to an ordinary key carries it (§7).
- A characterisation of how fal.ai bills. §4 is an integration lesson about
  reconciliation, not a claim about their billing.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — how the API's shape sets the
terms of the integration · [Performance and load](PERFORMANCE_AND_LOAD.md) — how often we
ask of it · [API optimisation decisions](API_OPTIMIZATION_DECISIONS.md) — what we chose
not to build
