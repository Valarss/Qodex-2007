---
name: qodex-2007
description: Install, maintain, verify, or roll back the Windows Qodex 2007 QQ blue-and-white skin with a narrow project manager and separate rectangular chat windows. Use for this specific QQ skin; not for other character themes.
---
# Qodex 2007

Use only the two modes 原生 and QQ. Preserve the user's existing chats, authentication and project organization.

Read [the deployment procedure](references/deployment.md) before modifying an application copy. The native patch is version-specific: Codex 26.1007.2314.0 / 0.162.0-alpha.17.2. Stop on a version mismatch rather than guessing offsets.

Reuse an existing Qodex deployment when present. For a new deployment, stage a separate application copy with scripts/Build.ps1; never replace WindowsApps. Start with scripts/Start.ps1 and an explicitly supplied application directory and Node executable. Node must support WebSocket (Node 22+). No packages need downloading.

The implementation keeps QQ reference gradients and black body text, small QQ avatar, 300px manager, 960x720 new chats, native buttons in one compact toolbar, a single real editor/Send, original bundled cough on completion, no independent docking window/tray helper. The manager/native Settings distinction and blank chat readiness are essential; don't classify every index.html window as the manager.

After any change, inspect both live windows through loopback CDP 9343. Verify the two-option selector, manager/chat roles, one editor/Send, project navigation, settings visibility, alignment, startup and audio playback. Keep untested multi-monitor DPI, real upload/audio recording and long-running behavior explicitly pending. Never send a test message without authorization.

Use scripts/Stop.ps1 to remove skin behavior; close the copied application and open the original application for full rollback. Keep backups and the original installation intact. Preparing this package does not authorize GitHub publication or replacing the user's launcher.

Native patch also checks the exact ASAR package version `26.1007.21434` and main chunk `main-BklS_2Y2.js`; GUI/store/engine version labels refer to different components.

## Install with the desktop launcher

Use scripts/Install.ps1 to install the bundle, build a supported local application copy, and create the per-user desktop shortcut **Qdex 2007** with assets/qq-penguin.ico. SourceApp and NodePath may be supplied; automatic discovery uses the installed OpenAI.Codex package and local node executable only, never downloads. ExistingAppDir is for a verified existing patched copy. Keep the configured ProfileDir stable to remember native/QQ across launches. This is automatic loading when the application opens, not Windows login autostart.

After successful installation, you MUST explain usage in the user's current chat without requiring another question. State the actual verified result and exact shortcut name; explain double-clicking projects/chats, top-right native/QQ switch and remembered selection, original Codex entry vs Qdex entry, and rollback via Stop.ps1/original app. Read references/first-use.md and adapt its Chinese wording. Do not claim a shortcut works until its target, icon and launch result have been checked. If only skill instructions were copied, say application installation is still pending. Do not post a new prompt/message via an API; the installation assistant's own final response is the explanation.

For an existing Headroom-integrated installation, preserve the user's original ChatGPT desktop entry and proxy/routing chain. Do not create a second launcher when the user wants the existing entry retained; use Install.ps1 -NoDesktopShortcut for such maintenance, and adapt the final usage explanation accordingly.
