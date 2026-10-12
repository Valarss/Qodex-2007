# Deployment and rollback

1. Locate the real installed GUI application (ChatGPT.exe plus resources/app.asar), the user's current launcher and any existing QQ engine. Check version; this patch supports 0.162.0-alpha.17.2 only.
2. Back up the currently customized CSS/renderer and launcher. Don't copy or publish browser profiles, authentication, databases, logs, screenshots of personal chats or WindowsApps binaries.
3. Build a separate copy: `powershell -File scripts/Build.ps1 -SourceApp <app-directory> -Destination <new-local-directory> -NodePath <node.exe>`.
4. Start: `powershell -File scripts/Start.ps1 -AppDir <destination>/app -NodePath <node.exe>`. Its independent browser profile lives beside the copy; the Codex backend still provides the existing user chats. Debug port is loopback-only 9343. If occupied by an unrelated app, stop and resolve the conflict.
5. Inspect both manager and a chat. Manager is identified by sessionStorage role, not just URL. New chat clears inherited project context using the original project-picker action, without clearing later deliberate choices. Native Settings is allowed to show and expand the manager temporarily.
6. Test the original cough using soundMonitor.preview('completed'); audio duration is about 0.626s. Actual audibility depends on the user's OS output device. The manager must not play duplicate cues.
7. Exit: scripts/Stop.ps1 restores native appearance and stops only processes identified by tracked PID and matching script command. Full rollback: close the copy and open the official original app. No automatic startup registration or desktop shortcut change occurs.

The build outputs a matched ASAR/executable pair with updated integrity hashes. Do not mix members of different pairs. The copied executable's signature changes; official installation stays intact. Roll back rather than bypassing a version/integrity failure.

Known limits: native border/first unpainted OS frame, mixed monitor DPI and automatic docking during cross-monitor dragging need real desktop verification. Existing renderer includes inherited internal implementations, but GF Live/custom/library modes are inaccessible and no character assets are bundled.

Native patch also checks the exact ASAR package version `26.1007.21434` and main chunk `main-BklS_2Y2.js`; GUI/store/engine version labels refer to different components.
