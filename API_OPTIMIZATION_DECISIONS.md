# API Optimization Decisions

A log of optimizations considered for the fal.ai API path and deliberately not
built. Format follows lightweight ADR (Architecture Decision Record)
convention: each entry records the context, what was verified in the actual
codebase (with file references — line numbers measure the codebase as of the
entry's date), the decision, and the concrete condition that would reopen it.

The bar for every entry: the candidate is evaluated against the code as it is,
not against generic best-practice articles.

## Template for new entries

```
### YYYY-MM-DD: <candidate> — <decision>
**Context.** Why this was on the list.
**Verified in code.** What was actually read, with file:line references.
**Decision.** What we did, and why.
**Reconsider when.** The concrete condition that would change the answer.
```

## Decision log

### 2026-09-01: X-Fal-Runner-Hint — not implemented

**Context.** fal.ai's runner-affinity mechanism: the client sends a hint on
submit, and the receiving fal app — if it implements `provide_hints()` — can
steer the request to a runner that already holds the right weights in memory.
Investigated as a cold-start optimization.

**Verified in code.** Every generation submit lives in `node/server.js` — the
panel never talks to fal directly. Three submit paths: `fal.queue.submit` via
`@fal-ai/client` (`node/server.js:166`, taken only for curated-adapter
endpoints), and two raw `POST https://queue.fal.run/${modelPath}` sites
(`node/server.js:7151`, `7625`). Two hardcoded sync calls hit
`fal-ai/any-llm` and `fal-ai/any-llm/vision` (`node/server.js:5510`, `5571`)
for prompt enhancement. Every endpoint string is either a user-installed model
from fal's public catalog or a fal-owned public model. A sweep of the codebase
and every planning document found no own fal deployment, existing or planned,
and zero references to `provide_hints` or runner hints.

**Decision.** Not implemented. Runner affinity requires the *receiving* app to
implement `provide_hints()`. modelBridge calls only public models it neither
owns nor controls, so a client-side hint has no measurable effect — we can
neither know nor influence whether any of the catalog models implements the
server half.

**Reconsider when.** modelBridge ever deploys its own fal app under its own
account. The hint would then be set at the three submit sites above (two of
the three are raw `fetch` calls, so the hint would be a header there, not an
SDK option), and `provide_hints()` would report the loaded model/LoRA.

### 2026-09-01: Cloudflare AI Gateway in front of fal.ai calls — not implemented

**Context.** Cloudflare AI Gateway has first-party provider support for
fal.ai: swap the base URL to
`gateway.ai.cloudflare.com/v1/{account}/{gateway}/fal` and get request
logging, edge caching of identical requests, rate limiting and fallback
rules. It does not speed up GPU work — fal's internal routing runs unchanged
behind it. Investigated as an observability and resilience layer.

**Verified in code.** Four findings.

1. **SDK routing.** `fal.config({ proxyUrl })` is a no-op in our environment:
   `withProxy` in `@fal-ai/client` 1.7.0 (`src/middleware.js:34-37`) returns a
   passthrough when `typeof window === "undefined"` — it proxies only in
   browsers, and our backend is a Node binary. The SDK's `requestMiddleware`
   hook could do the same URL rewrite by hand, so the SDK call sites
   (`node/server.js:166`, `181`) are reachable only with custom middleware.
2. **Large binaries could never route through it.** The normal media path is
   storage-first: `fal.storage.upload` (six sites — `node/server.js:3801`,
   `6779`, `6791`, `6852`, `6907`, `7293`) initiates against the hardcoded
   `https://rest.alpha.fal.ai` (`@fal-ai/client` `src/config.js`) and then
   PUTs the file bytes to a presigned CDN URL — both outside the gateway's
   base-URL scheme. The generation submit itself carries only URLs. (The
   degraded fallback, when a storage upload fails, embeds a compressed data
   URI in the submit payload — `node/server.js:7309-7315` — and would gain an
   extra hop on its largest payload.)
3. **"Swap the base URL" is really a rebuild of the submit→poll→cancel
   chain.** Poll URLs follow what fal returns (`status_url`/`response_url`
   point at `queue.fal.run` directly — `node/server.js:7189-7190`, `8921`),
   and `/fal-cancel` deliberately rejects any host other than `queue.fal.run`
   (`node/server.js:8127`).
4. **Cache value is zero, confirmed from payload construction.** Every submit
   carries the user's prompt plus per-run-unique storage URLs (each
   generation uploads its media fresh). Two identical requests effectively
   never occur — and caching a queue submit POST would be actively harmful,
   binding two UI jobs to one returned `request_id`.

**Decision.** Not implemented. Beyond the mechanics: modelBridge's data flow
is deliberately decentralized — every customer's machine talks to fal
directly with the customer's own API key, and neither the key nor any prompt
ever transits infrastructure we operate. A gateway under our Cloudflare
account would invert that: customer credentials and content through our
account, a new subprocessor in the privacy documentation, and an operated
single point of failure in a product whose resilience rule is that no dead
remote service may ever blank the plugin. The observability gain is small
(per-generation duration and cost are already reported), and the cache gain
is zero.

**Reconsider when.** Generation traffic ever originates from infrastructure
we operate with our own fal credentials — the privacy and resilience calculus
inverts at that point.

## How this file is used

New optimization candidates are evaluated against the actual codebase before
being added to the roadmap — not against generic best-practice articles. This
file exists so a rejected idea is never re-investigated from scratch, and so
the reasoning survives beyond whoever raised it.
