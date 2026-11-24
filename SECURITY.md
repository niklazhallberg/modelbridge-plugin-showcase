# Security and tamper resistance

modelBridge ships as a Premiere Pro panel that runs on the customer's own machine,
alongside a local backend process and a hosted entitlement service. This document
describes how that surface is defended, what the threat model deliberately excludes,
and how security work is verified.

It describes behaviour. Exact endpoints, header names and formats are left out.
Statements about the plugin were last checked against the source the 1.0.0 installer
was built from. The hosted service's source is separate, and statements about it are
design statements.

---

## Threat model

The panel is JavaScript on a customer's disk. It can be read, edited and replayed by
anyone who owns the machine. Any security claim that depends on that code being
unreadable would be false, so none is made here.

The design target is therefore not impossibility. It is three properties:

1. **The server is the authority for entitlement state.** Entitlement is issued by
   the hosted service. It cannot be minted, extended or transferred by the client.
2. **Circumvention costs ongoing effort.** A bypass must be repeated by each person
   who wants one, and repeated again after each release — it cannot be performed once
   and distributed as a durable artifact.
3. **Nothing is open by accident.** Every route of the local backend is behind the
   caller check described below, except two status checks.

Property 3 is the one that gets audited. Properties 1 and 2 are design constraints.

---

## Entitlement integrity

Licence state is issued and signed by the licence service. The local backend checks
that signature, and that the licence belongs to this computer, before each request
that starts paid work. One check covers every route that can spend on the customer's
provider key, and a pre-commit guard fails if such a route is added without it. What
that means for a customer:

- **A licence covers two computers, one of them active at a time.**
- **Offline is tolerated for 14 days.** A panel that cannot reach the licence service
  keeps working for 14 days since its last successful check before it stops starting
  paid work, and it never responds to an unreachable service by asking for the licence
  key again. Generation itself needs the internet, so this window only matters to
  someone who can reach fal.ai but not us. Elapsed time is cross-checked against the
  time the provider's responses carry, so setting the clock back does not extend the
  window.
- **Revocation is an operator action, not a release.** A refunded or revoked licence
  stops working on the next contact with the service, without shipping a new build to
  anyone.

---

## Failure behaviour is asymmetric on purpose

Two different unknowns are treated differently, deliberately:

- **Unknown entitlement blocks spending.** If the product cannot establish that a
  customer is entitled, new paid work is refused rather than allowed. Work that was
  already started is allowed to finish and be collected, so a customer is not charged
  by the provider for a result the panel then discards.

- **Unknown identity does not accuse the customer.** A network failure, an
  unreachable service, or an unreadable local value resolves to *indeterminate*, not
  to *invalid*. A paying customer with a bad connection is not told their key is
  invalid and is not asked to buy again; paid work stops only after 14 days without a
  successful check. Only a positively established rejection produces a rejection
  message.

This distinction is enforced through shared resolvers rather than repeated per
screen, so two surfaces cannot disagree about the same customer.

---

## Local backend surface

The panel is supported by a local backend process on the customer's machine.

- **Loopback only.** It binds the loopback interface and is not reachable from the
  network.
- **Exact host.** A request whose host value is not the backend's own loopback address
  and port is refused, which blocks DNS rebinding from a browser.
- **Caller check on every route except two read-only status checks.** A request is
  accepted only if it carries the panel's own origin, or carries no browser origin and
  a private caller token kept on the machine. A request with any web origin is refused.
  The check runs before a request body is parsed and covers the Agent Mode routes too.
  This stops a web page open in a browser from driving the local process. It does not
  stop another program already running under the same user account, which is outside
  what a local process can defend against.
- **The caller token** is random, readable only by the user's account, compared in
  constant time and never forwarded to any other destination.
- **Cross-origin responses are never wildcarded.** Only the panel's origin can read a
  response.
- **File writes.** Caller-supplied output names are reduced to a bare filename before a
  write, and exports go to a fixed folder. Saving a result into a project uses the
  project folder the panel passes in.
- **Outbound fetches on the editor's behalf.** A link the agent is asked to fetch must
  resolve to public addresses, and every redirect is checked the same way. Loopback,
  private-network and cloud-metadata addresses are refused, and an address that cannot
  be classified is treated as private.
- **Smaller hardening.** External tools are started without a shell. Logs reduce media
  and result links to their origin. Error responses strip file paths and tool output.
  Feed HTML is sanitised before the panel shows it. Development routes answer "not
  found" in a shipped build. The backend ends when the panel that started it is gone.

---

## Credentials

- Customers bring their own fal.ai and Anthropic API keys. The keys are never proxied
  through, or stored by, modelBridge's services.
- **Stored unencrypted, readable by the user's account only.** The keys sit in a file
  in the plugin's data folder, outside the signed extension folder, and in the panel's
  local storage. The file is written with owner-only permissions through an atomic
  replace, and an older, looser file is tightened at every start. The API keys are not
  held in the system keychain in 1.0.0. Anyone with access to the user account can read the keys.
- **The fal.ai key is sent only to fal.ai.** It is attached to requests for a fixed
  list of fal.ai hosts over HTTPS, and the source a schema is read from can be
  repointed only to those hosts.

---

## Customer data

- Your project stays on your machine. What you send to a model goes from your machine
  to that provider under your own key. modelBridge's services are not in that path, and
  nothing about your footage is sent for entitlement purposes.
- **One feature sends result links to a modelBridge service.** *Live preview in mobile*
  is off until you open it. From then on the link to each finished result on fal.ai's
  servers goes to the preview service, so your phone can show it. The media itself does
  not. The read link is random and revocable, and the secret that allows writing to it
  never reaches the panel.
- **NDA mode is enforced in the backend, at the point where data would leave**, not
  only in the panel: timeline frames and the mobile preview are refused there.
- Error reports and usage measurements are optional and separate; what each carries is
  in [Privacy & Compliance](PRIVACY_AND_COMPLIANCE.md).
- Entitlement traffic carries the licence key, the installation's identifiers and a
  device name (platform, processor model and a random tag; since 2026-09-27 never
  the computer's network name), and the subscription facts the service returns —
  including the name and email held by the payment provider. It carries no prompt,
  media or project data.

---

## Updates and the installer

- **The installer** is signed with a Developer ID Installer certificate, notarised by
  Apple and stapled. The [release page](https://github.com/niklazhallberg/modelbridge-plugin-showcase/releases/tag/v1.0.0)
  gives its SHA-256 and the commands that check the signature.
- **Updates are never installed automatically.** The panel shows a notice with a link
  to an allowlisted HTTPS address, and the editor installs the update.
- **Over-the-air payloads are data, not code.** Error explanations, configuration,
  renamed-model lists and pricing supplements are fetched from this repository. Each is
  checked against a SHA-256 value pinned in the manifest before use. A mismatch, a
  missing pin or unavailable hashing rejects the payload and keeps the last verified
  copy or the one bundled in the extension. The pin is published in the same repository
  as the payload, so it protects against corruption and a mismatched publish, not
  against someone who can write to this repository.
- **Supported version:** the latest release. Requirements: Premiere Pro 23.0 or later,
  macOS 12 or later.

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

- **Public claims are audited against code.** The statements in this document are
  checked against the implementation, most recently for 1.0.0, and the ones that
  outran it were corrected here rather than defended. Documentation drift is treated
  as a defect class with its own audits.

- **Findings are triaged, not silently closed.** Everything an audit surfaces is
  either fixed, or recorded with an explicit priority and a stated cost of deferral.

---

## What is accepted, and why

- **The panel layer is inspectable and modifiable by the machine's owner.** A
  technically capable user can alter their own installation. This is inherent to the
  extension format and is not presented as solved. The consequence is bounded: it must
  be redone against each release, and it grants nothing to anyone else.

- **Run-time enforcement is a client-side gate.** Generation runs directly from the
  customer's machine to their model provider under their own key, so no server of ours
  sits in that path to enforce it. The gate refuses to start paid work when
  entitlement cannot be established. This is a documented limit, not an oversight.

- **A bypass costs modelBridge no compute.** Because customers supply their own
  provider keys, a circumvented installation consumes none of modelBridge's compute.
  The exposure is subscription revenue from a single machine, not cost.

- **The panel is not sandboxed.** A CEP panel runs with Node enabled and has the
  access of the user's account. No claim of sandboxing is made.

- **What is defended against is scale.** The properties above exist to ensure that no
  single act — a copied file or a shared key — can be turned into
  unlimited access for others. That is the boundary that is actually enforced.

---

## Reporting

Security reports are handled before feature work. Please do not open
a public issue for anything security-relevant.

Contact: `info@modelbridge.app` — include what you found and how to reproduce it. We
will confirm receipt and tell you what we intend to do about it.

**In scope, in this repository.** The payloads published here are live infrastructure
rather than documentation: installed panels fetch them, and the channel fails closed on
an integrity mismatch, keeping the last verified copy or the one bundled in the
extension. Findings that would weaken that check are in scope, as are the data-access
and erasure paths described in the privacy material.

**In scope, elsewhere.** The plugin source is not in this repository, so an issue in the
panel, the local backend or the Premiere Pro integration cannot be reproduced from here
— but the surfaces this document describes are exactly those, and reports about them go
to the same address and are treated the same way. Say what you observed; we will
reproduce it on our side.
