# What fal.ai's billing signals tell an integration — and where counting stops

**Measured on modelBridge's own fal.ai account, 2026-08-25 to 2026-09-05.**

Integration notes for partners reading this repository. Times are UTC; request
ids are fal.ai's. Where a line rests on something fal.ai wrote rather than on a
measurement, it says so. modelBridge's cost labels (README) exist because of
these facts: the product is built to know where it cannot count, and to say so
in the same place it would otherwise show a number.

## 1. The usage count arrives with the result, never with status

fal.ai reports a run's usage in the `x-fal-billable-units` response header of
the **result** fetch (`GET …/requests/{id}`). Status responses
(`…/requests/{id}/status`) carry no such header.

- Measured 2026-08-25 across four paid runs.
- Measured again 2026-09-05 on `01a0714f-a924-73b1-b870-f47a670509ed` and
  `01a0714f-aadc-79c3-a8e3-4e5a172b6f26`: every status poll had no billing
  header; the result fetch carried `x-fal-billable-units: 0`.

Consequence: an integration that stops reading at `COMPLETED` never learns
what a run used. The result fetch is the only carrier of the count.

## 2. The result stays readable for at least six days, which makes settlement after the fact possible

The result, and the count on it, can be fetched again days later with the same
ordinary API key that submitted the run.

- `01a0514d-94a8-79f2-a93d-9c433963e104` (seedance-2.0/mini, 2026-08-30
  06:13 UTC) and `01a0514d-92db-7253-9e21-48d7c86bee45` (grok-imagine-video,
  same minute) re-read on 2026-09-05: `120.946` and `24.0` units, identical to
  the values recorded on the day. `01a05750-792a-76d2-8dba-3d2d9cf4345e`
  (topaz/sharpen, 2026-08-31) re-read the same day: `8`.
- Proven end to end on 2026-09-05: request `01a070be-e187-7760-8e4f-951310fa7658`
  (section 3) was re-read at 09:35 UTC with the ordinary key, `38.8` units at
  fal.ai's published `$0.007` per unit → **$0.2716**. fal.ai's own
  `billing-events` row for the same id, read at 11:23 UTC with an admin key,
  says `cost_total 0.2716`. Same number, no admin access needed to reach it.

Consequence: a row that could not be priced when the run ended can be priced
later from a count fal.ai still serves. Retention beyond six days is
unmeasured.

## 3. A cancelled run can complete and be charged anyway

- `01a070be-e187-7760-8e4f-951310fa7658` (seedance-2.0/mini, 480p, 4 s):
  submitted 2026-09-05 08:45:51 UTC; cancel requested 0.4 s later, while the
  status was `IN_PROGRESS`; fal.ai answered the cancel with `202`. The run
  completed at 08:47:21 UTC, reported `38.8` units, and the account was
  charged for it.

fal.ai's own documentation says a cancelled in-progress request "may still
complete". This is one run on one model; whether other models stop earlier is
unmeasured.

Consequence: a `202` on cancel is not "no charge". The row stays open until the
result has been re-read (section 2).

## 4. A model can be charged under a different endpoint id

- `01a070c4-6fec-7622-85d1-2ec780811334`, 2026-09-05 08:51:57 UTC: submitted to
  `fal-ai/bytedance/seedance/v1/lite/text-to-video`. The result carried
  `x-fal-bill-as: fal-ai/bytedance/seedance/v1/pro/fast/text-to-video`, and both
  `billing-events` and `usage` list the run under that second id
  (`0.019845` "1m tokens" at `$1.00`).

Consequence: reconciliation keyed on the endpoint you submitted to misses the
row on both sides. `x-fal-bill-as` is the key fal.ai's ledger uses.

## 5. The unit count is not always derivable from the form

- `01a070c7-51d9-75f1-97f9-d76952e75bae`, 2026-09-05 08:55:06 UTC:
  `bytedance/seedream/v5/pro/text-to-image`, one image at `auto_2K`. fal.ai
  prices the model per "unit" at `$0.0675`; the run reported
  `x-fal-billable-units: 2.0` → $0.135. Nothing in the request says "2".
- `01a0514d-92db-7253-9e21-48d7c86bee45` (grok-imagine-video, 2026-08-30):
  `24` "compute seconds" — a unit that exists only after the run and that
  modelBridge holds no verified per-unit rate for.

Consequence: for such models there is no number before the run. modelBridge
shows "No price" beforehand and, afterwards, prices the row from the count
where fal.ai's own rate applies to the reported unit, or shows the count with
no amount where it does not.

## 6. A count of 0 is not a free run, and a 200 on submit is not acceptance of the input

- 2026-08-25: a request refused by a runner `404` returned
  `x-fal-billable-units: 0`, and fal.ai's ledger still booked `0.25` compute
  seconds for it. The same day, a request refused at validation (`422`)
  returned `0` and booked nothing.
- 2026-09-05: two requests with a deliberately invalid body were accepted by
  the queue with `200 IN_QUEUE` and a request id
  (`01a0714f-a924-73b1-b870-f47a670509ed`, `01a0714f-aadc-79c3-a8e3-4e5a172b6f26`);
  validation happened on the worker, the result was `422`, the header `0`, and
  `billing-events` holds a row for each with `output_units 0`, `cost_total 0`.

Consequence: `0` means "the handler reported nothing", not "nothing was
charged"; and a queue submit succeeds before the input is validated.

## 7. The per-request dollar exists only behind admin scope

- 2026-09-05 11:20 UTC, with the API-scoped key that submits runs:
  `GET /v1/models/billing-events` and `GET /v1/models/usage` →
  `403 {"error":{"type":"authorization_error","message":"This API key is not permitted to perform this action."}}`,
  in every form tried (no filter, `request_id` filter, time window).
- The same calls with an admin-scoped key → `200`, one row per request id with
  `cost_total`.
- The admin scope is wider than billing. fal.ai's documentation defines it as
  everything the API scope can do plus CLI operations (`fal deploy`,
  `fal run`), managing apps, and the admin-scoped Platform APIs; the same admin
  key submitted a queue request on 2026-09-05
  (`01a0714f-a924-73b1-b870-f47a670509ed`). `billing-events` and `usage` are
  account-level views with a `login_username` filter, i.e. they cover a team's
  members as a whole.

Position: a key of that scope is more than a plug-in should hold on a user's
behalf, so modelBridge does not ask for it. Every dollar the product shows is
fal.ai's reported count × a rate, never fal.ai's invoice; the exact per-request
amount is read only on the operator's own account, to check the method — as in
section 2.

## 8. Published prices can change without notice

fal.ai's Terms of Service, read 2026-09-05: *"All prices on the Sites are subject
to change at any time without notice, and any new pricing will be posted to the
Sites."* This is fal.ai's statement, not a measurement — no price change has
been observed on this account.

Consequence: a rate stored in an integration has a shelf life. modelBridge
dates every curated rate and stops presenting it as a forecast 90 days after
its last verification.

## What this page deliberately does not claim

- A notice period for price changes: fal.ai's terms say "without notice", and
  nothing here has measured a change.
- Retention of results beyond six days, or that every model stops on cancel:
  one measurement each, stated as such above.
- Anything about fal.ai's invoice: no line in the product shows one, because
  no signal available to an ordinary key carries it (section 7).
