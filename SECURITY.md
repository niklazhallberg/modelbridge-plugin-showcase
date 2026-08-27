# Security

Report a vulnerability to <info@modelbridge.app>. Please include what you
found and how to reproduce it; we will confirm receipt and tell you what we
intend to do about it.

**In scope.** Two things in this repository are live infrastructure rather than
documentation, and both are worth reporting on:

- **The over-the-air payloads** (`ota-manifest.json` and the JSON files it
  declares). Installed panels fetch these. Each payload is pinned by SHA-256 in
  the manifest and the fetchers fail closed to the copy bundled in the
  extension, so a mismatch disables a channel rather than applying it — but the
  manifest itself is unsigned, so anyone who can write to this repository
  controls both a payload and its pin. Findings that widen that, or that get
  past the pin, are in scope.
- **The data-erasure endpoint** documented in `PRIVACY_AND_COMPLIANCE.md` §7.

**Out of scope.** The plugin source is not in this repository; issues in the
panel, the local backend or the Premiere Pro integration go to the same address
but cannot be reproduced from here.

Please do not open a public issue for anything security-relevant.
