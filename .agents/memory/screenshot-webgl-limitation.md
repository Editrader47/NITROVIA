---
name: Screenshot tool WebGL limitation
description: The appPreview Screenshot tool fails to render react-three-fiber / Three.js canvases with "Error creating WebGL context".
---

When screenshotting an app that uses `@react-three/fiber` / Three.js, the Screenshot tool's headless
browser reports `GL_VENDOR = Disabled`, `Sandboxed = yes`, `BindToCurrentSequence failed` and throws
`THREE.WebGLRenderer: Error creating WebGL context`, even when the scene code is correct.

**Why:** the headless Chromium instance used for `Screenshot` (appPreview) does not have GPU/ANGLE
access in this sandbox. This reproduces even with `gl={{ failIfMajorPerformanceCaveat: false }}` and
even on a minimal scene, so it is an environment constraint, not a bug to chase in app code.

**How to apply:** verify WebGL/3D apps via `tsc --noEmit`, workflow logs, and non-3D screens (menus,
HUD overlays) with Screenshot. Do not conclude the 3D scene itself is broken solely from a Screenshot
WebGL error — the real user's browser (with actual GPU access) renders these scenes normally.
