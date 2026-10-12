# Qodex 2007 Skill / Qodex 2007 技能

QQ 2007/2012 蓝白风格 Windows 皮肤的本地 Codex Skill 与源码包。仅保留 **原生 / QQ** 两种模式。

A locally saved Codex Skill and source package for the QQ 2007/2012 blue-white Windows skin. Only **原生 (Native) / QQ** modes remain.

- 窄版项目/聊天管理器（最小宽度 300px），独立横向聊天窗口（默认 960×720）。  
  Narrow project/chat manager (300px minimum), separate landscape chats (960×720 default).
- QQ 参考风格渐变、小企鹅头像、紧凑的原生操作工具栏，以及单一编辑区和发送按钮。  
  QQ reference gradients, small penguin avatar, compact native action toolbar and one editor/Send.
- 保留原程序内置的完成提示咳嗽音效、原生设置，以及简洁的新建空白聊天流程。  
  Original bundled completion cough; native Settings and clean blank-chat flow.
- 对齐窗口、滚动条、工具栏和输入区域的边缘；不使用外部停靠窗口或托盘图标。  
  Aligned window, scrollbar, toolbar and input edges; no external docking window or tray icon.

请阅读 [SKILL.md](SKILL.md) 和[部署说明](references/deployment.md)。将此文件夹复制到你的 Codex skills 目录，即可安装技能指令。运行时需要用户自行持有的受支持 Codex 应用副本，以及 Node 22 或更高版本。本包不会下载或包含 Codex 应用本身。

Read [SKILL.md](SKILL.md) and [deployment](references/deployment.md). Copy this folder into your Codex skills directory to install the Skill instructions. Running it requires a user-owned supported Codex application copy and Node 22+. It never downloads or includes Codex itself.

支持的原生补丁版本：**26.1007.2314.0 / 0.162.0-alpha.17.2**。此版本已通过本地验证；其他版本及多显示器 DPI 场景尚未验证。

Supported native patch: **26.1007.2314.0 / 0.162.0-alpha.17.2**. Local verification has passed for this version; other versions and multi-monitor DPI remain unverified.

此文件夹已整理为可存入 GitHub 仓库的形式；不会自动创建或发布仓库。请勿提交部署配置文件、身份验证信息、数据库或应用二进制文件。源码和素材归属请参阅 [NOTICE.md](NOTICE.md)；本包不宣称对继承的第三方代码或 QQ 品牌元素拥有统一授权。

This folder is ready to be saved in a GitHub repository; no repository is created or published automatically. Do not commit deployment profiles, auth, databases or application binaries. See [NOTICE.md](NOTICE.md) for source/material attribution; no blanket license is claimed for inherited third-party code or QQ branding.

原生补丁还会检查精确的 ASAR 包版本 `26.1007.21434` 和主代码块 `main-BklS_2Y2.js`；GUI、商店和引擎的版本标识对应不同组件。

Native patch also checks the exact ASAR package version `26.1007.21434` and main chunk `main-BklS_2Y2.js`; GUI/store/engine version labels refer to different components.
