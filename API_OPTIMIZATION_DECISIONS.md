# API Optimization Decisions

A log of optimizations considered for the fal.ai API path and deliberately not
built. Format follows lightweight ADR (Architecture Decision Record)
convention: each entry records the context, what was verified in the actual
codebase as of the entry's date, the decision, and the concrete condition that
would reopen it. The last section lists what is built.

## Template for new entries

```
### YYYY-MM-DD: <candidate> — <decision>
**Context.** Why this was on the list.
**Verified in code.** What was actually read.
**Decision.** What we did, and why.
**Reconsider when.** The concrete condition that would change the answer.
```

## Decision log

### 2026-09-01: X-Fal-Runner-Hint — not implemented

**Context.** fal.ai's runner-affinity mechanism: the client sends a hint on
submit, and the receiving fal app — if it implements `provide_hints()` — can
steer the request to a runner that already holds the right weights in memory.
Investigated as a cold-start optimization.

**Verified in code.** Every generation submit is made by the local backend
through fal.ai's queue API; the panel never submits to fal directly. The official
client is used only for storage uploads and as a fallback for fetching a result.
Every endpoint string is either a user-installed model from fal's public catalog
or a fal-owned public model. A sweep of the codebase and every planning document
found no own fal deployment, existing or planned, and zero references to
`provide_hints` or runner hints.

**Decision.** Not implemented. Runner affinity requires the *receiving* app to
implement `provide_hints()`. modelBridge calls only public models it neither
owns nor controls, so a client-side hint has no measurable effect — we can
neither know nor influence whether any of the catalog models implements the
server half.

**Reconsider when.** modelBridge ever deploys its own fal app under its own
account. The hint would then be set at the submit sites (a header on the raw queue
calls), and `provide_hints()` would report the loaded model/LoRA.

**Re-checked 2026-10-21 and against the 1.0.0 source.** Still no own fal
deployment and no reference to `provide_hints` or runner hints. (On 2026-09-01
one submit path went through the client library. It was retired after a
2026-09-25 measurement showed the queue API reaching every endpoint.)

### 2026-09-01: Cloudflare AI Gateway in front of fal.ai calls — not implemented

**Context.** Cloudflare AI Gateway has first-party provider support for
fal.ai: swap the base URL to
`gateway.ai.cloudflare.com/v1/{account}/{gateway}/fal` and get request
logging, edge caching of identical requests, rate limiting and fallback
rules. It does not speed up GPU work — fal's internal routing runs unchanged
behind it. Investigated as an observability and resilience layer.

**Verified in code.** Four findings.

1. **SDK routing.** The client library's proxy option is a no-op in our
   environment: it proxies only in browsers, and our backend is a Node binary.
   Its request-middleware hook could do the same URL rewrite by hand, so the
   client call sites are reachable only with custom middleware.
2. **Large binaries could never route through it.** The normal media path is
   storage-first: file bytes go to fal's storage through a presigned upload,
   outside the gateway's base-URL scheme, and the generation submit itself
   carries only URLs. (The degraded fallback, when a storage upload fails,
   embeds a compressed data URI in the submit payload and would gain an extra
   hop on its largest payload.)
3. **"Swap the base URL" is really a rebuild of the submit→poll→cancel
   chain.** Poll URLs follow what fal returns, which point at fal's queue host
   directly, and the cancel path deliberately rejects any other host.
4. **Cache value is zero, confirmed from payload construction.** A submit
   with media carries storage URLs that are new for each run, so those
   requests never repeat. A text-only submit can repeat exactly, but a repeat
   is a request for a new generation, and a cached queue response would bind
   two jobs in the panel to one `request_id`.

**Decision.** Not implemented. Beyond the mechanics: modelBridge's data flow
is deliberately decentralized — every customer's machine talks to fal
directly with the customer's own API key, and neither the key nor any prompt
ever transits infrastructure we operate. A gateway under our Cloudflare
account would invert that: customer credentials and content through our
account, a new subprocessor in the privacy documentation, and an operated
single point of failure in a product whose resilience rule is that no dead
remote service may ever blank the plugin. The observability gain is small
(per-generation duration and usage-based cost are already recorded locally),
and a cache would return the wrong thing (finding 4).

**Reconsider when.** Generation traffic ever originates from infrastructure
we operate with our own fal credentials — the privacy and resilience calculus
inverts at that point.

**Re-checked 2026-10-21 and against the 1.0.0 source.** Findings 2–4 stand.
Storage uploads are now bounded by progress, not by a fixed time limit, so a slow
upload of a large clip completes as long as bytes keep moving. The bytes still go
straight to fal's storage, outside any gateway's base URL.

## What is built

The other side of the log: request economy that is in the shipping build. Read
from the 1.0.0 source; the measured effect, where there is one, is in
[Performance and load](PERFORMANCE_AND_LOAD.md).

**Toward fal.ai**

- Status polling slows down as a run gets longer, and follows the status URL
  fal.ai returns.
- A model's rate is read when the editor selects the model and the stored rate
  has aged out, not on a timer per catalogue entry.
- A pricing lookup is cached briefly, and a failed or rate-limited answer is never
  cached as if it were a rate.
- The fal.ai key is attached only to requests for fal.ai's own hosts.
- Recomputing the estimate while the editor types is debounced and local. It makes
  no request.

**Toward static files and our own service**

- Recurring fetches revalidate with the validators the server sent, concurrent
  requests for one document share one call, and any failure falls back to a plain
  fetch.

**Toward Anthropic, in Agent Mode**

- The prompt is cached in four segments: tool definitions, the static
  instructions, the per-turn context and the conversation so far. The cache
  lifetime is one hour, chosen because an editor's pause between messages is often
  longer than five minutes.
- Only a core set of tools and those of the workflow in progress are sent in full.
  The rest are deferred and found through tool search when a turn needs them.
- Context size is measured with the provider's token-counting endpoint, not
  guessed from character counts.
- The agent's own cost figure prices cache writes at the one-hour rate, and a test
  pins that.

## How this file is used

New optimization candidates are evaluated against the actual codebase before
being added to the roadmap — not against generic best-practice articles. This
file exists so a rejected idea is never re-investigated from scratch, and so
the reasoning survives beyond whoever raised it.
