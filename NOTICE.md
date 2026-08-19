# NOTICE

Third-party open-source components incorporated into modelBridge, with the license terms that govern their use. Where a license requires that its text and copyright notice be reproduced, that text appears here in full.

If you find an open-source component in modelBridge that is not listed here, please contact <support@modelbridge.app> so we can correct the record.

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
- FFmpeg / FFprobe — LGPL, bundled as LGPL-only builds (compiled without GPL or non-free components) and invoked as external processes, never linked

An online copy of these attributions is also published at <https://docs.modelbridge.app/legal/attributions/>.
