# Security and tamper resistance

modelBridge ships as a Premiere Pro panel that runs on the customer's own machine,
alongside a local backend process and a hosted entitlement service. This document
describes how that surface is defended, what the threat model deliberately excludes,
and how security work is verified.

It describes posture, not implementation. Specific mechanisms, endpoints and
signature formats are intentionally omitted.

---

## Threat model

The panel is JavaScript on a customer's disk. It can be read, edited and replayed by
anyone who owns the machine. Any security claim that depends on that code being
unreadable would be false, so none is made here.

The design target is therefore not impossibility. It is three properties:

1. **The server is the authority for entitlement state.** Entitlement is issued and
   signed by the hosted service. It cannot be minted, extended or transferred by the
   client.
2. **Circumvention costs ongoing effort.** A bypass must be repeated by each person
   who wants one, and repeated again after each release — it cannot be performed once
   and distributed as a durable artifact.
3. **Nothing is open by accident.** Anything reachable is reachable because it was
   decided, not because nobody looked.

Property 3 is the one that gets audited. Properties 1 and 2 are design constraints.

---

## Entitlement integrity

- **Signed state, verified locally, failing closed.** Entitlement is carried as a
  signed statement issued by the service. Verification failure denies rather than
  degrades: an unreadable or unverifiable statement never resolves to "allowed".

- **Statements are minted for one installation.** An entitlement statement is issued
  against a specific installation and is refused on any other, so a licence file
  lifted from one machine does not activate a second seat by itself.

- **Time is not client-supplied.** Offline tolerance is measured against a signed
  reference issued by the service. Moving the system clock backwards does not extend
  or reset an offline allowance.

- **Revocation is an operator action, not a release.** A compromised or shared key can
  be revoked centrally and takes effect on the next contact with the service, without
  shipping a new build to anyone.

- **Abuse controls on the licence path.** Activation is rate limited per source
  address and renewal per installation. Structurally malformed input is classified and
  rejected before it reaches any cryptographic or third-party call, so a malformed
  request cannot be used to probe, amplify, or generate noise in operational alerting.

---

## Failure behaviour is asymmetric on purpose

Two different unknowns are treated differently, deliberately:

- **Unknown entitlement blocks spending.** If the product cannot establish that a
  customer is entitled, billable work is refused rather than allowed. The failure
  direction never favours us at the customer's expense.

- **Unknown identity does not accuse the customer.** A network failure, an
  unreachable service, or an unreadable local value resolves to *indeterminate*, not
  to *invalid*. A paying customer with a bad connection is never locked out, never
  told their key is invalid, and never sold a second subscription. Only a positively
  established rejection produces a rejection message.

This distinction is enforced through shared resolvers rather than repeated per
screen, so two surfaces cannot disagree about the same customer.

---

## Local backend surface

The panel is supported by a local backend process on the customer's machine.

- It binds the loopback interface only and is not reachable from the network.
- Write requests that arrive carrying a browser origin are rejected, which closes the
  class of attack where a hostile web page open in any browser drives the local
  process while the panel is running.
- Caller-supplied output names are stripped to a bare filename before any write, so
  no request can place a file outside its intended directory.
- Unused routes are deleted rather than left dormant. A prior audit pass removed
  roughly 370 lines across seven unreferenced endpoints — including latent file and
  network primitives — on the principle that an unreachable capability behind a local
  port is still a capability.

---

## Customer data

- Customers bring their own model-provider and assistant API keys. Credentials are
  stored locally and are never proxied through, or stored by, modelBridge's services.
- Your project stays on your machine. What you send to a model goes to that provider
  under your own key — nothing passes through modelBridge's servers, and nothing about
  your footage is sent for entitlement purposes.
- Entitlement traffic carries the licence key, the installation's identifiers, and the
  subscription facts the service returns — including the name and email held by the
  payment provider. It carries no prompt, media or project data.

---

## How this is verified

Security work in this project follows the same evidence rules as the rest of the
codebase:

- **Findings come from read-only audits with dated reports.** Each audit enumerates
  what was examined, what held, and what did not. Reports are retained rather than
  replaced, so a claim can be traced to the pass that established it.

- **A fix is not accepted until a test fails without it.** Regression tests for
  security fixes are written and run *red against unmodified code* before the fix
  lands, then shown to turn green. A test that passes both before and after proves
  nothing and is treated as a defect in the test.

- **Public claims are audited against code.** The statements in this document were
  checked line by line against the implementation, and the ones that outran it were
  corrected here rather than defended. Documentation drift is treated as a defect
  class with its own audits.

- **Findings are triaged, not silently closed.** Everything an audit surfaces is
  either fixed, or recorded with an explicit priority and a stated cost of deferral.

---

## What is accepted, and why

Stating this is part of the posture, not a caveat to it.

- **The panel layer is inspectable and modifiable by the machine's owner.** A
  technically capable user can alter their own installation. This is inherent to the
  extension format and is not presented as solved. The consequence is bounded: it must
  be redone against each release, and it grants nothing to anyone else.

- **Run-time enforcement is a client-side gate.** Generation runs directly from the
  customer's machine to their model provider under their own key, so no server of ours
  sits in that path to enforce it. The gate fails closed, but it is a gate the machine
  owner can reach. This is a documented limit, not an oversight.

- **The economics are deliberately unattractive.** Because customers supply their own
  provider keys, a circumvented installation consumes none of modelBridge's compute.
  The exposure is subscription revenue from a single machine, not cost.

- **What is defended against is scale.** The properties above exist to ensure that no
  single act — a copied file, a moved clock, a shared key — can be turned into
  unlimited access for others. That is the boundary that is actually enforced.

---

## Reporting

Security reports are welcome and are triaged ahead of feature work. Please do not open
a public issue for anything security-relevant.

Contact: `info@modelbridge.app` — include what you found and how to reproduce it. We
will confirm receipt and tell you what we intend to do about it.

**In scope, in this repository.** Two things here are live infrastructure rather than
documentation:

- **The over-the-air payloads** (`ota-manifest.json` and the JSON files it declares).
  Installed panels fetch these. Each payload is pinned by SHA-256 in the manifest and
  the fetchers fail closed to the copy bundled in the extension, so a mismatch disables
  a channel rather than applying it — but the manifest itself is unsigned, so anyone who
  can write to this repository controls both a payload and its pin. Findings that widen
  that, or that get past the pin, are in scope.
- **The data-erasure endpoint** documented in `PRIVACY_AND_COMPLIANCE.md` §7.

**In scope, elsewhere.** The plugin source is not in this repository, so an issue in the
panel, the local backend or the Premiere Pro integration cannot be reproduced from here
— but the surfaces this document describes are exactly those, and reports about them go
to the same address and are treated the same way. Say what you observed; we will
reproduce it on our side.
