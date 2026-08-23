# NOTICE

**Scope of this file.** modelBridge ships a complete third-party inventory with the extension, in `THIRD_PARTY_LICENSES.md` — every component in the distributed package, its licence, and where the full text lives. That file is the record. This one reproduces the notices whose licences *require* reproduction, and names the components a reader is most likely to ask about; it is deliberately shorter, not a second inventory.

For the complete list — the Node.js runtime embedded in the backend binaries and its aggregated component licences, Adobe's CEP interface library, every direct and transitive npm dependency, and the full per-binary FFmpeg build configurations — read `THIRD_PARTY_LICENSES.md` in the installed extension, or the online copy at <https://docs.modelbridge.app/legal/attributions/>.

If you find an open-source component in modelBridge that is listed in neither, please contact <support@modelbridge.app> so we can correct the record.

---

## MCP-imported Premiere Pro tools

The Agent Mode tool inventory includes a substantial set of Premiere Pro control tools imported from the open-source Premiere Pro MCP project by leancoderkavy, distributed under the MIT License.

- Upstream: <https://github.com/leancoderkavy/premiere-pro-mcp>
- License: MIT

```
MIT License

Copyright (c) leancoderkavy and contributors

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

## Local runtime dependencies

modelBridge's local backend runs a Node.js Express server and invokes FFmpeg and FFprobe as external processes to extract media from Premiere Pro. FFmpeg and FFprobe ship with the plugin as LGPL-only builds; when they are absent the backend falls back to a copy already present on the user's system.

- Node.js and Express — MIT License
- Sharp (image processing) — Apache-2.0 License
- libvips (image processing library used by Sharp) — LGPL-3.0-or-later, dynamically linked and user-replaceable
- FFmpeg / FFprobe — LGPL-2.1-or-later, bundled as LGPL-only builds (compiled without GPL or non-free components) and invoked as external processes, never linked

### Libraries linked into the bundled FFmpeg

These carry reproduction requirements of their own, so they are named here rather than left to the inventory.

- **LAME (libmp3lame) 3.100** — LGPL-2.1-or-later. Linked into both platforms' FFmpeg for MP3 encoding. Source: <https://lame.sourceforge.io/>. The exact source tarball's sha256 ships with the extension in `bin/ffmpeg-provenance.json`.
- **TwoLAME (libtwolame)** — LGPL-2.1-or-later. Present in the Windows build only.

The macOS FFmpeg is built from source rather than downloaded; the Windows build is the released `-win64-lgpl` asset from <https://github.com/BtbN/FFmpeg-Builds>, which links roughly forty further libraries under BSD, MIT and MPL terms. The exact, complete set for the binary actually shipped is the `configuration` string recorded per binary in `bin/ffmpeg-provenance.json` — that file, not this list, is what a licence reviewer should read, because it describes the build in hand rather than the build we last wrote about.

**The macOS build cannot reach the network.** It is configured `--disable-everything` with an explicit allowlist and `--disable-network`, and only two protocols are compiled in: `file` and `pipe`. The media tool your footage passes through has no network code in it. Verifiable from the same `bin/ffmpeg-provenance.json`.

Because the binaries are separate executables and never linked into modelBridge's own code, any of them can be replaced: build FFmpeg from the recorded configure string, or delete the bundled copies and let the backend pick up a system FFmpeg.

An online copy of these attributions is also published at <https://docs.modelbridge.app/legal/attributions/>.

---

← [README](README.md) · [Architecture](ARCHITECTURE.md) — the dependency map in context · [Privacy & Compliance](PRIVACY_AND_COMPLIANCE.md) — what each service receives
