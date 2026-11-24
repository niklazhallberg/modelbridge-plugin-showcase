# NOTICE

**Scope of this file.** modelBridge ships a complete third-party inventory with the extension, in `THIRD_PARTY_LICENSES.md` — every component in the distributed package, its licence, and where the full text lives. That file is the record. This one reproduces the notices of the third-party code copied into modelBridge's own source, and names the components a reader is most likely to ask about; it is deliberately shorter, not a second inventory.

For the complete list — the Node.js runtime embedded in the backend binaries and its aggregated component licences, Adobe's CEP interface library, every direct and transitive npm dependency, and the full per-binary FFmpeg build configurations — read `THIRD_PARTY_LICENSES.md` in the installed extension, or the online copy at <https://docs.modelbridge.app/legal/attributions/>.

If you find an open-source component in modelBridge that is listed in neither, please contact <info@modelbridge.app> so we can correct the record.

---

## MCP-imported Premiere Pro tools

The Agent Mode tool inventory includes Premiere Pro control tools imported from the open-source Premiere Pro MCP project by leancoderkavy, distributed under the MIT License: 74 of Agent Mode's 135 tools, counted 2026-11-24.

- Upstream: <https://github.com/leancoderkavy/premiere-pro-mcp>
- License: MIT

```
MIT License

Copyright (c) 2025 Premiere Pro MCP Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Lucide icons

The line icons beside the rows of a summary card in the Agent tab are shapes from Lucide (<https://lucide.dev>), copied into the source as SVG path data. No Lucide package is installed or bundled.

- License: ISC

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
of Feather (MIT). All other copyright (c) for Lucide are held by Lucide
Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

---

## Local runtime dependencies

modelBridge's local backend runs a Node.js Express server and invokes FFmpeg and FFprobe as external processes to extract media from Premiere Pro. FFmpeg and FFprobe ship with the plugin as LGPL-only builds; when they are absent the backend falls back to a copy already present on the user's system.

- Node.js and Express — MIT License
- Sharp (image processing) — Apache-2.0 License
- libvips (image processing library used by Sharp) — LGPL-3.0-or-later, dynamically linked and user-replaceable
- FFmpeg / FFprobe — LGPL-2.1-or-later, bundled as LGPL-only builds (compiled without GPL or non-free components) and invoked as external processes, never linked

### Libraries linked into the bundled FFmpeg

These carry reproduction requirements of their own, so they are named here rather than left to the inventory.

- **LAME (libmp3lame) 3.100** — LGPL-2.1-or-later. Linked into the macOS FFmpeg for MP3 encoding. Source: <https://lame.sourceforge.io/>. The exact source tarball's sha256 ships with the extension in `bin/ffmpeg-provenance.json`.

The macOS FFmpeg is built from source rather than downloaded. modelBridge is macOS only for now, so it is the only build in the distributed package. The exact, complete set of libraries for the binary shipped is the `configuration` string recorded per binary in `bin/ffmpeg-provenance.json`, with the SHA-256 and how the binary was obtained. That file is the record for the binary actually shipped.

**The bundled macOS build cannot reach the network.** It is configured `--disable-everything` with an explicit allowlist and `--disable-network`, and only two protocols are compiled in: `file` and `pipe`.

The claim is about that binary. Where the bundled binaries are absent the backend uses a system copy instead, which is someone else's build that modelBridge does not control and that has no entry in the provenance file. In every case ffmpeg is handed local file paths only and is never asked to open a URL.

A Windows build is not distributed yet. When it is, its FFmpeg will be the released LGPL asset from <https://github.com/BtbN/FFmpeg-Builds>, which links 42 external libraries, LAME and TwoLAME among them, the rest under BSD, MIT and MPL terms. That is a downloaded build with network protocols present, and it will be listed in the same provenance file.

Because the binaries are separate executables and never linked into modelBridge's own code, any of them can be replaced: build FFmpeg from the recorded configure string, or delete the bundled copies and let the backend pick up a system FFmpeg.

---

## Trademarks

fal.ai, Adobe, Premiere Pro, Anthropic and Claude are trademarks of their respective owners. They are named here only to identify the services and the host application modelBridge works with. modelBridge is an independent product and is not affiliated with, endorsed by or sponsored by any of them.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — the dependency map in context · [Privacy & Compliance](PRIVACY_AND_COMPLIANCE.md) — what each service receives
