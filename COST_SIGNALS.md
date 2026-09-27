# What a provider's billing signals tell an integration — and where counting stops

**Measured on modelBridge's own fal.ai account, 2026-08-25 to 2026-09-05.** Each
finding below was observed in live runs on that account over that window. Where a line
rests on something fal.ai wrote rather than on a measurement, it says so. The
account-specific evidence — request identifiers, amounts and ledger rows — is kept in an
internal record rather than published here.

modelBridge's cost labels (README) exist because of these findings: the product is built
to know where it cannot count, and to say so in the same place it would otherwise show a
number.

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

Consequence: an accepted cancellation is not "no charge". The row stays open until the
result has been re-read.

## 4. The endpoint a run is accounted under may not be the one it was submitted to

Observed once: a run submitted to one endpoint was accounted under a different one.

Consequence: reconciliation should not assume the endpoint a run was submitted to is the
endpoint it is accounted under. We have not published this as a characterisation of
fal.ai's billing; it is recorded as an integration lesson and shared with fal.ai
directly.

## 5. The unit count is not always derivable from the request

For some models the billable quantity cannot be predicted from the form the user filled
in — nothing in the request implies it, and for some models the unit only exists once the
run has finished.

Consequence: for those models there is no honest number before the run. modelBridge shows
"No price" beforehand, and afterwards prices the row only where the provider's own rate
applies to the unit reported; otherwise it shows the count with no amount.

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
modelBridge does not ask for one. Every amount the product shows is therefore a reported
count multiplied by a known rate — never a copy of an invoice — and the labels say so.

## 8. Published prices can change without notice

fal.ai's Terms of Service, read 2026-09-05: *"All prices on the Sites are subject to
change at any time without notice, and any new pricing will be posted to the Sites."*
This is fal.ai's statement, not a measurement — no price change was observed on this
account.

Consequence: a rate stored in an integration has a shelf life, which is why every curated
rate carries the date it was last verified and stops being presented as a forecast once it
is stale.

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
ask of it
