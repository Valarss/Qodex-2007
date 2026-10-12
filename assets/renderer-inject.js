((cssText, customCssText, objectLiveCssText, artDataUrl, qqArtDataUrl, petDataUrl, retroFrameDataUrl, qqAvatarDataUrl, coughAudioDataUrl, objectLiveCharacterDataUrl, objectLiveStateVideos, objectLiveCharacterConfig, compatibilityRules, deepThemeAssets, themeConfig, qqThemeConfig, libraryThemes) => {
  const STATE_KEY = "__CODEX_QQ_SKIN_STATE__";
  const DISABLED_KEY = "__CODEX_QQ_SKIN_DISABLED__";
  const STYLE_ID = "codex-qq-skin-style";
  const CHROME_ID = "codex-qq-skin-chrome";
  const COMPANION_ID = "codex-qq-skin-companion";
  const USAGE_PANEL_ID = "codex-qq-skin-usage-panel";
  const USAGE_TOGGLE_ID = "codex-qq-skin-usage-toggle";
  const HOME_PET_ID = "codex-qq-skin-home-pet";
  const RIGHT_TRAY_ID = "codex-qq-skin-right-tray";
  const RETRO_SHELL_ID = "codex-qq-skin-retro-shell";
  const RETRO_PROFILE_ID = "codex-qq-skin-retro-profile";
  const TOGGLE_ID = "codex-qq-skin-toggle";
  const LIBRARY_MENU_ID = "codex-qq-skin-library-menu";
  const CHARACTER_MENU_ID = "codex-object-live-character-menu";
  const WEATHER_ID = "codex-qq-skin-weather";
  const WEATHER_HUD_ID = "codex-qq-skin-weather-hud";
  const WEATHER_AUDIO_ID = "codex-qq-skin-weather-audio";
  const OBJECT_LIVE_ID = "codex-object-live-stage";
  const OBJECT_LIVE_CONTROL_ID = "codex-object-live-control";
  const ENABLED_STORAGE_KEY = "codex-qq-skin-enabled";
  const MODE_STORAGE_KEY = "codex-qq-skin-mode";
  const LIBRARY_SWITCH_KEY = "codex-qq-skin-library-switch";
  const CHARACTER_SWITCH_KEY = "codex-object-live-character-switch";
  const CHARACTER_PREFERENCE_KEY = "codex-object-live-character-preference";
  const USAGE_MODE_KEY = "codex-qq-skin-usage-mode";
  const USAGE_NET_MODE_KEY = "codex-qq-skin-usage-net-mode";
  const USAGE_REFRESH_KEY = "codex-qq-skin-usage-refresh";
  const NATIVE_LIVE_REQUEST_KEY = "codex-object-live-native-live-request";
  const OBJECT_LIVE_LAYOUT_KEY = "codex-object-live-task-layout";
  const NATIVE_APPEARANCE_STATE_KEY = "__CODEX_QQ_SKIN_NATIVE_APPEARANCE__";
  const NEON_STORM_THEME_IDS = new Set(["preset-neon-storm", "custom-neon-storm"]);
  const LIBRARY_THEMES = Array.isArray(libraryThemes)
    ? libraryThemes.filter((item) => item && typeof item.id === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(item.id))
    : [];
  const SHELL_ATTR = "data-dream-shell";
  const ART_ATTRS = [
    "data-dream-art-wide", "data-dream-art-safe", "data-dream-task-mode",
    "data-dream-art-safe-area", "data-dream-art-task-mode", "data-dream-art-aspect",
    "data-dream-art-ready", "data-dream-art-fit", "data-dream-three-pane", "data-dream-summary-state", "data-dream-left-sidebar",
    "data-qq-usage-mode", "data-qq-usage-state", "data-qq-weather", "data-qq-settings",
    "data-qq-weather-audio", "data-object-live-home", "data-object-live-voice",
    "data-object-live-layout", "data-object-live-appearance",
  ];
  const VERSION = __QQ_SKIN_VERSION_JSON__;
  const STYLE_REVISION = __QQ_SKIN_STYLE_REVISION_JSON__;
  const CUSTOM_THEME = themeConfig && typeof themeConfig === "object" ? themeConfig : {};
  const QQ_THEME = qqThemeConfig && typeof qqThemeConfig === "object" ? qqThemeConfig : {};
  const DEEP_THEME_ASSETS = deepThemeAssets && typeof deepThemeAssets === "object" ? deepThemeAssets : {};
  const OBJECT_LIVE_STATE_VIDEOS = objectLiveStateVideos && typeof objectLiveStateVideos === "object"
    ? objectLiveStateVideos : {};
  const OBJECT_LIVE_CHARACTER_CONFIG = objectLiveCharacterConfig && typeof objectLiveCharacterConfig === "object"
    ? objectLiveCharacterConfig : { id: "builtin-cyber-girlfriend", mode: "dynamic", builtin: true };
  const requestedObjectLiveAppearance = ["light", "dark"].includes(OBJECT_LIVE_CHARACTER_CONFIG.appearance)
    ? OBJECT_LIVE_CHARACTER_CONFIG.appearance : "auto";
  let objectLiveAppearance = requestedObjectLiveAppearance === "auto"
    ? "dark"
    : requestedObjectLiveAppearance;
  let objectLiveCharacterPreference = OBJECT_LIVE_CHARACTER_CONFIG.builtin ? "follow" : "selected";
  try {
    const savedCharacterPreference = window.localStorage?.getItem(CHARACTER_PREFERENCE_KEY);
    if (["follow", "selected"].includes(savedCharacterPreference)) {
      objectLiveCharacterPreference = savedCharacterPreference;
    }
  } catch {}
  let objectLiveFollowRequest = "";
  const COMPATIBILITY_RULES = compatibilityRules && typeof compatibilityRules === "object"
    ? compatibilityRules : { roles: {} };
  const CUSTOM_THEME_KINDS = new Set(["custom-native", "deep-custom"]);
  // GF Live is the bundled flagship experience. A user's explicit selection
  // in localStorage still wins on every later launch.
  let skinMode = "qq";
  try {
    const savedMode = window.localStorage?.getItem(MODE_STORAGE_KEY);
    const legacyEnabled = window.localStorage?.getItem(ENABLED_STORAGE_KEY);
    if (["native", "qq"].includes(savedMode)) skinMode = savedMode;
    else if (legacyEnabled === "false") skinMode = "native";
    
  } catch {}
  // Newer Codex home pages insert a .home-banners row above the real stack.
  // Detect that from the live DOM only — version strings are unnecessary.
  const detectHomeLayoutKind = (home) => {
    if (home?.querySelector?.(":scope .home-banners")) return "banners";
    if (home?.children?.length >= 2) {
      const hasContentChild = [...home.children].some((child) =>
        child.querySelector?.('[data-feature="game-source"], .composer-surface-chrome'));
      const firstIsContent = Boolean(
        home.firstElementChild?.querySelector?.('[data-feature="game-source"], .composer-surface-chrome'),
      );
      if (hasContentChild && !firstIsContent) return "banners";
    }
    return "legacy";
  };
  const resolveHomeStack = (home) => {
    if (!home) return null;
    if (detectHomeLayoutKind(home) === "banners") {
      return [...home.children].find((child) =>
        child.querySelector?.('[data-feature="game-source"], .composer-surface-chrome')) || null;
    }
    return home.firstElementChild || null;
  };
  const syncHomeLayoutMarks = (home) => {
    const layout = detectHomeLayoutKind(home);
    const root = document.documentElement;
    if (root) setAttribute(root, "data-qq-home-layout", layout);
    const stackClass = skinMode === "qq" ? "qq-skin-home-stack" : "dream-skin-home-stack";
    const otherStackClass = skinMode === "qq" ? "dream-skin-home-stack" : "qq-skin-home-stack";
    for (const node of document.querySelectorAll(".qq-skin-home-stack, .dream-skin-home-stack")) {
      if (!home || !home.contains(node)) {
        node.classList.remove("qq-skin-home-stack", "dream-skin-home-stack");
      }
    }
    if (!home || !["qq", "custom"].includes(skinMode)) return null;
    const stack = resolveHomeStack(home);
    if (!stack) return null;
    stack.classList.add(stackClass);
    stack.classList.remove(otherStackClass);
    for (const node of home.querySelectorAll(".qq-skin-home-stack, .dream-skin-home-stack")) {
      if (node !== stack) node.classList.remove("qq-skin-home-stack", "dream-skin-home-stack");
    }
    return stack;
  };
  if (skinMode === "custom" && !CUSTOM_THEME_KINDS.has(CUSTOM_THEME.kind)) skinMode = "qq";
  let THEME = skinMode === "qq" ? QQ_THEME : CUSTOM_THEME;
  let ART = THEME.art && typeof THEME.art === "object" ? THEME.art : {};
  let LAYOUT = THEME.layout && typeof THEME.layout === "object" ? THEME.layout : {};
  let SOUND = THEME.sound && typeof THEME.sound === "object" ? THEME.sound : {};
  const CUSTOM_ART_METADATA = CUSTOM_THEME.artMetadata && typeof CUSTOM_THEME.artMetadata === "object"
    ? CUSTOM_THEME.artMetadata : null;
  const ANALYSIS_CACHE_KEY = "__CODEX_QQ_SKIN_ANALYSIS_CACHE__";
  const THEME_VARIABLES = [
    "--ds-bg", "--ds-panel", "--ds-panel-2", "--ds-green", "--ds-lime",
    "--ds-cyan", "--ds-purple", "--ds-text", "--ds-muted", "--ds-line",
    "--ds-bg-rgb", "--ds-panel-rgb", "--ds-panel-2-rgb", "--ds-accent-rgb",
    "--ds-accent-alt-rgb", "--ds-secondary-rgb", "--ds-highlight-rgb",
    "--ds-text-rgb", "--ds-muted-rgb", "--ds-line-rgb",
    "--dream-art-focus-x", "--dream-art-focus-y", "--dream-art-position",
    "--qq-skin-focus-x", "--qq-skin-focus-y", "--qq-skin-art-position",
    "--qq-skin-name", "--qq-skin-tagline", "--qq-skin-project-prefix",
    "--qq-skin-project-label", "--dream-three-pane-min-width", "--dream-right-panel-width",
    "--dream-retro-frame", "--dream-summary-panel-width",
    "--dream-right-tray-inset", "--dream-right-panel-right",
    "--dream-deep-right", "--dream-deep-sidebar", "--dream-deep-watermark",
    "--dream-deep-brand", "--dream-deep-avatar", "--dream-deep-right-width",
    "--dream-deep-right-right", "--dream-deep-right-bottom", "--dream-deep-right-opacity",
    "--dream-deep-sidebar-size", "--dream-deep-sidebar-y", "--dream-deep-sidebar-opacity",
    "--dream-deep-watermark-width", "--dream-deep-watermark-x", "--dream-deep-watermark-y",
    "--dream-deep-watermark-opacity", "--dream-deep-brand-title", "--dream-deep-brand-subtitle",
  ];
  const installToken = {};
  const autoOpenedSummaryToggles = new WeakSet();
  const autoOpenedSidebarToggles = new WeakSet();
  const existingAnalysisCache = window[ANALYSIS_CACHE_KEY];
  const analysisCache = existingAnalysisCache && typeof existingAnalysisCache.get === "function" &&
    typeof existingAnalysisCache.set === "function" ? existingAnalysisCache : new Map();
  window[ANALYSIS_CACHE_KEY] = analysisCache;
  let artAnalysis = (skinMode === "custom" && typeof CUSTOM_THEME.artKey === "string")
    ? analysisCache.get(CUSTOM_THEME.artKey) ?? null
    : null;
  let analysisTimer = null;
  let samplingNativeShell = false;
  let rootObserver = null;
  let routeSettleTimer = null;
  const now = () => typeof performance === "object" && typeof performance.now === "function"
    ? performance.now() : Date.now();
  const metrics = {
    ensureCalls: 0,
    rootPasses: 0,
    routePasses: 0,
    layoutReads: 0,
    attributeWrites: 0,
    styleWrites: 0,
    textWrites: 0,
    analysisRuns: 0,
    analysisCacheHits: artAnalysis ? 1 : 0,
    startupPasses: 0,
    firstEnsureMs: null,
    analysisMs: null,
  };
  let skinEnabled = skinMode !== "native";
  window[DISABLED_KEY] = !skinEnabled;

  const previous = window[STATE_KEY];
  const dataUrlToObjectUrl = (dataUrl, fallbackMime) => {
    const comma = dataUrl.indexOf(",");
    const mime = /^data:([^;,]+)/.exec(dataUrl)?.[1] || fallbackMime;
    const binary = atob(dataUrl.slice(comma + 1));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  };
  const artUrl = dataUrlToObjectUrl(artDataUrl, "image/png");
  const qqArtUrl = dataUrlToObjectUrl(qqArtDataUrl, "image/png");
  const petUrl = dataUrlToObjectUrl(petDataUrl, "image/png");
  const retroFrameUrl = dataUrlToObjectUrl(retroFrameDataUrl, "image/png");
  const qqAvatarUrl = dataUrlToObjectUrl(qqAvatarDataUrl, "image/png");
  const coughAudioUrl = dataUrlToObjectUrl(coughAudioDataUrl, "audio/mpeg");
  const objectLiveCharacterUrl = dataUrlToObjectUrl(objectLiveCharacterDataUrl, "image/png");
  const objectLiveStateVideoUrls = Object.fromEntries(Object.entries(OBJECT_LIVE_STATE_VIDEOS)
    .filter(([, dataUrl]) => typeof dataUrl === "string" && dataUrl.startsWith("data:"))
    .map(([key, dataUrl]) => [key, dataUrlToObjectUrl(dataUrl, "video/webm")]));
  const deepThemeUrls = Object.fromEntries(Object.entries(DEEP_THEME_ASSETS)
    .filter(([, dataUrl]) => typeof dataUrl === "string" && dataUrl.startsWith("data:"))
    .map(([key, dataUrl]) => [key, dataUrlToObjectUrl(dataUrl, "image/png")]));

  if (previous?.observer) previous.observer.disconnect();
  if (previous?.rootObserver) previous.rootObserver.disconnect();
  if (previous?.resizeObserver) previous.resizeObserver.disconnect();
  if (previous?.timer) clearInterval(previous.timer);
  if (previous?.startupTimer) clearInterval(previous.startupTimer);
  if (previous?.scheduler?.timeout) clearTimeout(previous.scheduler.timeout);
  if (previous?.scheduler?.frame != null && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(previous.scheduler.frame);
  }
  if (previous?.analysisTimer) clearTimeout(previous.analysisTimer);
  if (previous?.titlebarAttach?.timer) clearTimeout(previous.titlebarAttach.timer);
  if (previous?.resizeHandler) window.removeEventListener("resize", previous.resizeHandler);
  if (previous?.routeInteractionHandler && typeof document.removeEventListener === "function") {
    document.removeEventListener("click", previous.routeInteractionHandler, true);
  }
  previous?.soundMonitor?.cleanup?.();
  previous?.weatherMonitor?.destroy?.();
  previous?.objectLiveCleanup?.();
  // Rebuild floating chrome that closes over the previous generation. Keep the
  // shared <style id="codex-qq-skin-style"> node when a skin stays enabled so
  // reinject can reuse it; native mode must strip every painted leftover.
  document.getElementById(TOGGLE_ID)?.remove();
  document.getElementById(LIBRARY_MENU_ID)?.remove();
  document.getElementById(COMPANION_ID)?.remove();
  document.getElementById(USAGE_PANEL_ID)?.remove();
  document.getElementById(USAGE_TOGGLE_ID)?.remove();
  document.getElementById(HOME_PET_ID)?.remove();
  document.getElementById(RIGHT_TRAY_ID)?.remove();
  document.getElementById(RETRO_SHELL_ID)?.remove();
  document.getElementById(RETRO_PROFILE_ID)?.remove();
  document.getElementById(CHROME_ID)?.remove();
  document.getElementById(WEATHER_ID)?.remove();
  document.getElementById(WEATHER_HUD_ID)?.remove();
  document.getElementById(WEATHER_AUDIO_ID)?.remove();
  document.getElementById(OBJECT_LIVE_ID)?.remove();
  document.querySelectorAll(".dream-retro-profile-host").forEach((node) =>
    node.classList.remove("dream-retro-profile-host"));
  document.querySelectorAll(".qq-skin-home-stack, .dream-skin-home-stack").forEach((node) =>
    node.classList.remove("qq-skin-home-stack", "dream-skin-home-stack"));
  document.querySelectorAll(".qq-skin-home, .dream-skin-home, .qq-skin-home-shell, .dream-skin-home-shell").forEach((node) => {
    node.classList.remove("qq-skin-home", "dream-skin-home", "qq-skin-home-shell", "dream-skin-home-shell");
  });
  if (skinMode === "native") {
    document.getElementById(STYLE_ID)?.remove();
    document.documentElement?.classList.remove("codex-qq-skin", "codex-dream-skin", "codex-object-live");
    document.documentElement?.removeAttribute("data-qq-home-layout");
  }
  if (previous?.mediaHandler && previous?.mediaQuery) {
    try { previous.mediaQuery.removeEventListener("change", previous.mediaHandler); } catch {}
  }

  const cssString = (value) => JSON.stringify(String(value ?? ""));

  const setStyleProperty = (root, name, value) => {
    if (root.style.getPropertyValue(name) !== value) {
      root.style.setProperty(name, value);
      metrics.styleWrites += 1;
    }
  };

  const setAttribute = (root, name, value) => {
    const normalized = String(value);
    if (root.getAttribute(name) !== normalized) {
      root.setAttribute(name, normalized);
      metrics.attributeWrites += 1;
    }
  };

  const setTextContent = (node, value) => {
    if (node && node.textContent !== value) {
      node.textContent = value;
      metrics.textWrites += 1;
    }
  };

  /**
   * QQ is a deliberately light, classic skin. Codex writes its active native
   * palette as inline --color-* variables, so merely declaring color-scheme
   * cannot prevent dark popovers and portals. Snapshot those native values,
   * let Codex's own electron-light stylesheet take over while QQ is active,
   * then restore the exact previous palette on exit.
   */
  const forceNativeLightForQQ = () => {
    const root = document.documentElement;
    let snapshot = window[NATIVE_APPEARANCE_STATE_KEY];
    if (!snapshot) {
      snapshot = {
        variant: root.classList.contains("electron-dark") ? "dark" : "light",
        themeAttribute: root.getAttribute("data-theme"),
        properties: Array.from(root.style || [])
          .filter((name) => name.startsWith("--color-") || name.startsWith("--codex-base-"))
          .map((name) => [name, root.style.getPropertyValue(name), root.style.getPropertyPriority(name)]),
      };
      window[NATIVE_APPEARANCE_STATE_KEY] = snapshot;
    }
    for (const name of Array.from(root.style || [])) {
      if (name.startsWith("--color-") || name.startsWith("--codex-base-")) {
        root.style.removeProperty(name);
      }
    }
    root.classList.remove("electron-dark");
    root.classList.add("electron-light");
    if (root.getAttribute("data-theme") !== "light") root.setAttribute("data-theme", "light");
  };

  const restoreNativeAppearance = () => {
    const root = document.documentElement;
    const snapshot = window[NATIVE_APPEARANCE_STATE_KEY];
    if (!snapshot) return;
    for (const name of Array.from(root.style || [])) {
      if (name.startsWith("--color-") || name.startsWith("--codex-base-")) {
        root.style.removeProperty(name);
      }
    }
    for (const [name, value, priority] of snapshot.properties || []) {
      root.style.setProperty(name, value, priority || "");
    }
    root.classList.remove("electron-dark", "electron-light");
    root.classList.add(snapshot.variant === "dark" ? "electron-dark" : "electron-light");
    if (snapshot.themeAttribute != null) root.setAttribute("data-theme", snapshot.themeAttribute);
    else root.removeAttribute("data-theme");
    delete window[NATIVE_APPEARANCE_STATE_KEY];
  };

  const parseRgb = (value) => {
    if (!value || value === "transparent") return null;
    const hex = String(value).trim().match(/^#([0-9a-f]{6})$/i);
    if (hex) {
      const number = Number.parseInt(hex[1], 16);
      return { r: number >> 16, g: (number >> 8) & 255, b: number & 255 };
    }
    const m = String(value).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (!m) return null;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const rgbString = (value) => {
    const rgb = parseRgb(value);
    return rgb ? `${Math.round(rgb.r)} ${Math.round(rgb.g)} ${Math.round(rgb.b)}` : null;
  };

  const rgbToHex = ({ r, g, b }) => `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;

  const rgbToHsl = ({ r, g, b }) => {
    const values = [r, g, b].map((value) => value / 255);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const lightness = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: lightness };
    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let hue;
    if (max === values[0]) hue = (values[1] - values[2]) / delta + (values[1] < values[2] ? 6 : 0);
    else if (max === values[1]) hue = (values[2] - values[0]) / delta + 2;
    else hue = (values[0] - values[1]) / delta + 4;
    return { h: hue * 60, s: saturation, l: lightness };
  };

  const hslToRgb = ({ h, s, l }) => {
    const hue = ((h % 360) + 360) % 360 / 360;
    if (s === 0) {
      const neutral = Math.round(l * 255);
      return { r: neutral, g: neutral, b: neutral };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const channel = (offset) => {
      let t = hue + offset;
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return { r: channel(1 / 3) * 255, g: channel(0) * 255, b: channel(-1 / 3) * 255 };
  };

  const luminance = ({ r, g, b }) => {
    const lin = [r, g, b].map((c) => {
      const x = c / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };

  /** Detect Codex app light/dark shell for CSS branching. */
  const detectShellMode = () => {
    const root = document.documentElement;
    const body = document.body;
    const cls = `${root.className || ""} ${body?.className || ""}`.toLowerCase();

    if (/\b(dark|theme-dark|appearance-dark)\b/.test(cls)) return "dark";
    if (/\b(light|theme-light|appearance-light)\b/.test(cls)) return "light";

    const dataTheme = (
      root.getAttribute("data-theme") ||
      root.getAttribute("data-appearance") ||
      root.getAttribute("data-color-mode") ||
      body?.getAttribute("data-theme") ||
      body?.getAttribute("data-appearance") ||
      ""
    ).toLowerCase();
    if (dataTheme.includes("dark")) return "dark";
    if (dataTheme.includes("light")) return "light";

    // Radios in profile menu (if present in DOM)
    const checked = document.querySelector('input[name="appearance-theme"]:checked');
    if (checked) {
      const label = (checked.getAttribute("aria-label") || checked.value || "").toLowerCase();
      if (label.includes("暗") || label.includes("dark")) return "dark";
      if (label.includes("浅") || label.includes("light")) return "light";
      if (label.includes("系统") || label.includes("system")) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    }

    // The skin itself declares color-scheme on :root.  Once installed,
    // reading getComputedStyle(root) directly would therefore keep `auto`
    // themes locked to the previous shell mode. Temporarily remove only our
    // own root class/attribute, sample the native computed scheme, then restore
    // synchronously. Mutation records created by this probe are drained below
    // so the root observer does not schedule a redundant ensure pass.
    try {
      const hadQQSkin = root.classList.contains("codex-qq-skin");
      const hadCustomSkin = root.classList.contains("codex-dream-skin");
      const savedShell = root.getAttribute(SHELL_ATTR);
      samplingNativeShell = true;
      if (hadQQSkin) root.classList.remove("codex-qq-skin");
      if (hadCustomSkin) root.classList.remove("codex-dream-skin");
      if (savedShell !== null) root.removeAttribute(SHELL_ATTR);
      let colorScheme = "";
      try {
        colorScheme = getComputedStyle(root).colorScheme || "";
      } finally {
        if (hadQQSkin) root.classList.add("codex-qq-skin");
        if (hadCustomSkin) root.classList.add("codex-dream-skin");
        if (savedShell !== null) root.setAttribute(SHELL_ATTR, savedShell);
        rootObserver?.takeRecords?.();
        samplingNativeShell = false;
      }
      if (colorScheme.includes("dark") && !colorScheme.includes("light")) return "dark";
      if (colorScheme.includes("light") && !colorScheme.includes("dark")) return "light";
    } catch {
      samplingNativeShell = false;
    }

    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {}

    // Only use surface luminance before the skin owns those surfaces. Sampling
    // our own translucent layers would create route-dependent light/dark flips.
    if (!root.classList.contains("codex-qq-skin") && !root.classList.contains("codex-dream-skin")) {
      const samples = [
        body,
        document.querySelector("main.main-surface"),
        document.querySelector("aside.app-shell-left-panel"),
      ].filter(Boolean);
      let votesLight = 0;
      let votesDark = 0;
      for (const el of samples) {
        try {
          const rgb = parseRgb(getComputedStyle(el).backgroundColor);
          if (!rgb) continue;
          const L = luminance(rgb);
          if (L >= 0.55) votesLight += 1;
          else if (L <= 0.25) votesDark += 1;
        } catch {}
      }
      if (votesLight > votesDark) return "light";
      if (votesDark > votesLight) return "dark";
    }
    return "light";
  };

  const makeAdaptivePalette = (sample, shell) => {
    const source = sample || { r: 108, g: 126, b: 136 };
    const hsl = rgbToHsl(source);
    const hue = hsl.s < 0.12 ? 214 : hsl.h;
    const saturation = clamp(hsl.s, 0.38, 0.72);
    const accent = hslToRgb({ h: hue, s: saturation, l: shell === "light" ? 0.42 : 0.66 });
    const accentAlt = hslToRgb({ h: hue + 12, s: saturation * 0.82, l: shell === "light" ? 0.52 : 0.73 });
    const secondary = hslToRgb({ h: hue - 24, s: saturation * 0.64, l: shell === "light" ? 0.56 : 0.62 });
    const highlight = hslToRgb({ h: hue + 24, s: saturation * 0.76, l: shell === "light" ? 0.36 : 0.58 });
    const neutral = (lightness, chroma = 0.08) => rgbToHex(hslToRgb({ h: hue, s: chroma, l: lightness }));
    return shell === "light" ? {
      background: neutral(0.965, 0.07),
      panel: neutral(0.987, 0.035),
      panelAlt: neutral(0.945, 0.09),
      accent: rgbToHex(accent),
      accentAlt: rgbToHex(accentAlt),
      secondary: rgbToHex(secondary),
      highlight: rgbToHex(highlight),
      text: neutral(0.13, 0.10),
      muted: neutral(0.42, 0.08),
      line: `rgba(${Math.round(accent.r)}, ${Math.round(accent.g)}, ${Math.round(accent.b)}, .24)`,
    } : {
      background: neutral(0.055, 0.045),
      panel: neutral(0.085, 0.04),
      panelAlt: neutral(0.125, 0.05),
      accent: rgbToHex(accent),
      accentAlt: rgbToHex(accentAlt),
      secondary: rgbToHex(secondary),
      highlight: rgbToHex(highlight),
      text: neutral(0.93, 0.025),
      muted: neutral(0.69, 0.03),
      line: `rgba(${Math.round(accent.r)}, ${Math.round(accent.g)}, ${Math.round(accent.b)}, .28)`,
    };
  };

  const resolvedShell = () => {
    if (THEME.appearance === "light" || THEME.appearance === "dark") return THEME.appearance;
    // Image luminance may tune accents and scrims, but auto appearance follows
    // Codex/ChatGPT (or the OS fallback) so a bright wallpaper cannot flip a
    // native dark session back to a light shell after analysis.
    return detectShellMode();
  };

  const applyTheme = (root, shell) => {
    const colors = THEME.colors || {};
    // The bundled QQ preset is a fixed product palette, not an uploaded-image
    // palette. Never let the previous custom image analysis tint its icons,
    // sidebars, or panels after switching back to QQ mode.
    const explicit = new Set(skinMode === "qq"
      ? Object.keys(colors)
      : (Array.isArray(THEME.explicitColorKeys) ? THEME.explicitColorKeys : []));
    const adaptive = makeAdaptivePalette(artAnalysis?.accentRgb, shell);
    const legacyLight = skinMode !== "qq" && !THEME.appearance && shell === "light";
    const structural = new Set(["background", "panel", "panelAlt", "text", "muted"]);
    const pick = (name) => {
      const allowExplicit = explicit.has(name) && !(legacyLight && structural.has(name));
      return allowExplicit && typeof colors[name] === "string" ? colors[name] : adaptive[name];
    };
    const accent = pick("accent");
    const accentAlt = explicit.has("accentAlt") ? pick("accentAlt") : (explicit.has("accent") ? accent : adaptive.accentAlt);
    const variables = {
      "--ds-bg": pick("background"),
      "--ds-panel": pick("panel"),
      "--ds-panel-2": pick("panelAlt"),
      "--ds-green": accent,
      "--ds-lime": accentAlt,
      "--ds-cyan": pick("secondary"),
      "--ds-purple": pick("highlight"),
      "--ds-text": pick("text"),
      "--ds-muted": pick("muted"),
      "--ds-line": explicit.has("line") && typeof colors.line === "string" ? colors.line : adaptive.line,
    };

    for (const [name, value] of Object.entries(variables)) {
      if (typeof value === "string" && value) setStyleProperty(root, name, value);
    }
    const rgbVariables = {
      "--ds-bg-rgb": variables["--ds-bg"],
      "--ds-panel-rgb": variables["--ds-panel"],
      "--ds-panel-2-rgb": variables["--ds-panel-2"],
      "--ds-accent-rgb": variables["--ds-green"],
      "--ds-accent-alt-rgb": variables["--ds-lime"],
      "--ds-secondary-rgb": variables["--ds-cyan"],
      "--ds-highlight-rgb": variables["--ds-purple"],
      "--ds-text-rgb": variables["--ds-text"],
      "--ds-muted-rgb": variables["--ds-muted"],
      "--ds-line-rgb": variables["--ds-line"],
    };
    for (const [name, value] of Object.entries(rgbVariables)) {
      const rgb = rgbString(value);
      if (rgb) setStyleProperty(root, name, rgb);
    }
    setStyleProperty(root, "--qq-skin-name", cssString(THEME.name || "Codex QQ Skin"));
    setStyleProperty(root, "--qq-skin-tagline", cssString(THEME.tagline || "Make something wonderful."));
    setStyleProperty(root, "--qq-skin-project-prefix", cssString(THEME.projectPrefix || "选择项目 · "));
    setStyleProperty(root, "--qq-skin-project-label", cssString(THEME.projectLabel || "◉  选择项目"));
  };

  const applyArtMetadata = (root) => {
    // QQ is a closed product pack. Never inherit uploaded-image analysis/metadata,
    // or ambient/wide wallpaper rules will keep painting custom art after a switch.
    let safeArea;
    let taskMode;
    let wide;
    let aspect;
    let focusX;
    let focusY;
    let artReady;
    if (skinMode === "qq") {
      safeArea = ART.safeArea && ART.safeArea !== "auto" ? ART.safeArea : "center";
      taskMode = ART.taskMode && ART.taskMode !== "auto" ? ART.taskMode : "off";
      wide = false;
      aspect = "landscape";
      focusX = typeof ART.focusX === "number" ? ART.focusX : 0.5;
      focusY = typeof ART.focusY === "number" ? ART.focusY : 0.5;
      artReady = true;
    } else {
      const profile = artAnalysis || CUSTOM_ART_METADATA;
      const inferredSafe = profile?.safeArea || "center";
      safeArea = ART.safeArea && ART.safeArea !== "auto" ? ART.safeArea : inferredSafe;
      taskMode = ART.taskMode && ART.taskMode !== "auto"
        ? ART.taskMode : profile?.taskMode || "ambient";
      wide = profile?.wide || false;
      aspect = profile?.aspect || "unknown";
      focusX = typeof ART.focusX === "number" ? ART.focusX
        : profile?.focusX ?? (safeArea === "left" ? 0.72 : safeArea === "right" ? 0.28 : 0.5);
      focusY = typeof ART.focusY === "number" ? ART.focusY : profile?.focusY ?? 0.5;
      artReady = Boolean(artAnalysis);
    }
    const canonicalSafe = ["left", "right", "center", "none"].includes(safeArea)
      ? safeArea : "center";
    // A conventional photo is much taller than the panoramic home hero. Using
    // cover there can remove most of a portrait (including the head or body).
    // Reserve cropping for genuinely wide artwork; fit ordinary photo and
    // portrait compositions completely inside the new-task build panel.
    const artFit = ["portrait", "square", "landscape"].includes(aspect) ? "contain" : "cover";
    const focusXValue = `${(clamp(focusX, 0, 1) * 100).toFixed(2)}%`;
    const focusYValue = `${(clamp(focusY, 0, 1) * 100).toFixed(2)}%`;

    setAttribute(root, "data-dream-art-wide", wide ? "true" : "false");
    setAttribute(root, "data-dream-art-safe", canonicalSafe);
    setAttribute(root, "data-dream-task-mode", taskMode);
    setAttribute(root, "data-dream-art-safe-area", safeArea);
    setAttribute(root, "data-dream-art-task-mode", taskMode);
    setAttribute(root, "data-dream-art-aspect", aspect);
    setAttribute(root, "data-dream-art-fit", artFit);
    setAttribute(root, "data-dream-art-ready", artReady ? "true" : "false");
    setStyleProperty(root, "--dream-art-focus-x", focusXValue);
    setStyleProperty(root, "--dream-art-focus-y", focusYValue);
    setStyleProperty(root, "--dream-art-position", `${focusXValue} ${focusYValue}`);
    setStyleProperty(root, "--qq-skin-focus-x", focusXValue);
    setStyleProperty(root, "--qq-skin-focus-y", focusYValue);
    setStyleProperty(root, "--qq-skin-art-position", `${focusXValue} ${focusYValue}`);
  };

  const analyzeArt = () => new Promise((resolve) => {
    const startedAt = now();
    metrics.analysisRuns += 1;
    if (typeof window.Image !== "function" || !document?.createElement) {
      metrics.analysisMs = Number((now() - startedAt).toFixed(3));
      resolve(null);
      return;
    }
    const image = new window.Image();
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (analysisTimer) clearTimeout(analysisTimer);
      analysisTimer = null;
      metrics.analysisMs = Number((now() - startedAt).toFixed(3));
      resolve(value);
    };
    analysisTimer = setTimeout(() => finish(null), 6000);
    image.onerror = () => finish(null);
    image.onload = () => {
      try {
        const ratio = image.naturalWidth / image.naturalHeight;
        if (!Number.isFinite(ratio) || ratio <= 0) throw new Error("Invalid image dimensions");
        const maxDimension = 96;
        const width = Math.max(16, Math.round(ratio >= 1 ? maxDimension : maxDimension * ratio));
        const height = Math.max(16, Math.round(ratio >= 1 ? maxDimension / ratio : maxDimension));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext?.("2d", { willReadFrequently: true });
        if (!context) throw new Error("Canvas is unavailable");
        context.drawImage(image, 0, 0, width, height);
        const data = context.getImageData(0, 0, width, height).data;
        const samples = new Array(width * height);
        const bins = Array.from({ length: 24 }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));
        let lightTotal = 0;
        let count = 0;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const offset = (y * width + x) * 4;
            if (data[offset + 3] < 32) continue;
            const rgb = { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
            const light = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
            const hsl = rgbToHsl(rgb);
            samples[y * width + x] = { light, saturation: hsl.s };
            lightTotal += light;
            count += 1;
            if (hsl.s >= 0.16 && hsl.l >= 0.16 && hsl.l <= 0.86) {
              const bin = bins[Math.min(23, Math.floor(hsl.h / 15))];
              const weight = hsl.s * (1 - Math.abs(hsl.l - 0.52) * 0.85);
              bin.weight += weight;
              bin.r += rgb.r * weight;
              bin.g += rgb.g * weight;
              bin.b += rgb.b * weight;
            }
          }
        }
        if (!count) throw new Error("Image has no visible pixels");
        const brightness = lightTotal / count;
        const information = (start, end) => {
          let total = 0;
          let totalSquared = 0;
          let edges = 0;
          let edgeCount = 0;
          let pixels = 0;
          for (let y = 0; y < height; y += 1) {
            for (let x = start; x < end; x += 1) {
              const sample = samples[y * width + x];
              if (!sample) continue;
              total += sample.light;
              totalSquared += sample.light * sample.light;
              pixels += 1;
              const previous = x > start ? samples[y * width + x - 1] : null;
              const above = y > 0 ? samples[(y - 1) * width + x] : null;
              if (previous) { edges += Math.abs(sample.light - previous.light); edgeCount += 1; }
              if (above) { edges += Math.abs(sample.light - above.light); edgeCount += 1; }
            }
          }
          const mean = pixels ? total / pixels : 0;
          const variance = pixels ? Math.max(0, totalSquared / pixels - mean * mean) : 1;
          return Math.sqrt(variance) * 0.58 + (edgeCount ? edges / edgeCount : 1) * 0.42;
        };
        const zoneWidth = Math.max(1, Math.floor(width * 0.38));
        const leftInformation = information(0, zoneWidth);
        const rightInformation = information(width - zoneWidth, width);
        let safeArea = "center";
        if (leftInformation < rightInformation * 0.86) safeArea = "left";
        else if (rightInformation < leftInformation * 0.86) safeArea = "right";

        let saliencyTotal = 0;
        let saliencyX = 0;
        let saliencyY = 0;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const sample = samples[y * width + x];
            if (!sample) continue;
            const previous = x > 0 ? samples[y * width + x - 1] : null;
            const above = y > 0 ? samples[(y - 1) * width + x] : null;
            const edge = (previous ? Math.abs(sample.light - previous.light) : 0) +
              (above ? Math.abs(sample.light - above.light) : 0);
            const weight = 0.01 + Math.abs(sample.light - brightness) * 0.48 +
              sample.saturation * 0.34 + edge * 0.28;
            saliencyTotal += weight;
            saliencyX += (x + 0.5) / width * weight;
            saliencyY += (y + 0.5) / height * weight;
          }
        }
        let focusX = saliencyTotal ? saliencyX / saliencyTotal : 0.5;
        let focusY = saliencyTotal ? saliencyY / saliencyTotal : 0.5;
        if (safeArea === "left") focusX = Math.max(0.64, focusX);
        if (safeArea === "right") focusX = Math.min(0.36, focusX);
        focusX = clamp(focusX, 0.12, 0.88);
        focusY = clamp(focusY, 0.18, 0.82);

        const accentBin = bins.reduce((best, candidate) => candidate.weight > best.weight ? candidate : best, bins[0]);
        const accentRgb = accentBin.weight > 0 ? {
          r: accentBin.r / accentBin.weight,
          g: accentBin.g / accentBin.weight,
          b: accentBin.b / accentBin.weight,
        } : null;
        const aspect = ratio >= 2.25 ? "ultrawide" : ratio >= 1.45 ? "wide"
          : ratio >= 1.08 ? "landscape" : ratio >= 0.9 ? "square" : "portrait";
        finish({
          width: image.naturalWidth,
          height: image.naturalHeight,
          ratio,
          wide: ratio >= 1.75,
          aspect,
          brightness,
          shell: brightness >= 0.58 ? "light" : "dark",
          safeArea,
          focusX,
          focusY,
          taskMode: ratio >= 2.25 ? "banner" : "ambient",
          accentRgb,
        });
      } catch {
        finish(null);
      }
    };
    image.src = artUrl;
  });

  let chromeParts = null;
  let companionParts = null;
  let usageParts = null;
  let usageSnapshot = window.__CODEX_QQ_SKIN_USAGE_SNAPSHOT__ && typeof window.__CODEX_QQ_SKIN_USAGE_SNAPSHOT__ === "object"
    ? window.__CODEX_QQ_SKIN_USAGE_SNAPSHOT__
    : { schemaVersion: 1, status: "loading", scope: "device" };
  let companionSnapshot = window.__CODEX_QQ_SKIN_COMPANION_SNAPSHOT__ &&
    typeof window.__CODEX_QQ_SKIN_COMPANION_SNAPSHOT__ === "object"
    ? window.__CODEX_QQ_SKIN_COMPANION_SNAPSHOT__
    : { schemaVersion: 1, status: "loading", github: [] };
  const BLIND_BOX_STORAGE_KEY = "codex-qq-skin-project-blind-box";
  const BLIND_BOX_DECOR = ["globe", "rocket", "trophy", "cat"];
  let companionBlindBox = {
    currentId: 0,
    history: [],
    favorites: [],
    avoidedIds: [],
    avoidedLanguages: [],
    discoveries: 0,
    unlocked: [],
  };
  try {
    const saved = JSON.parse(window.localStorage?.getItem(BLIND_BOX_STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      companionBlindBox = {
        currentId: Number(saved.currentId) || 0,
        history: Array.isArray(saved.history) ? saved.history.map(Number).filter(Boolean).slice(-50) : [],
        favorites: Array.isArray(saved.favorites) ? saved.favorites.map(Number).filter(Boolean).slice(-100) : [],
        avoidedIds: Array.isArray(saved.avoidedIds) ? saved.avoidedIds.map(Number).filter(Boolean).slice(-100) : [],
        avoidedLanguages: Array.isArray(saved.avoidedLanguages)
          ? saved.avoidedLanguages.map((item) => String(item || "").slice(0, 24)).filter(Boolean).slice(-20) : [],
        discoveries: Math.max(0, Number(saved.discoveries) || 0),
        unlocked: Array.isArray(saved.unlocked)
          ? saved.unlocked.filter((item) => BLIND_BOX_DECOR.includes(item)) : [],
      };
    }
  } catch {}
  let companionRoomMode = "room";
  let companionBreakTimer = null;
  let blindBoxRevealTimer = null;
  let usageMode = "stats";
  let usageNetMode = false;
  try {
    usageMode = window.localStorage?.getItem(USAGE_MODE_KEY) === "native" ? "native" : "stats";
    usageNetMode = window.localStorage?.getItem(USAGE_NET_MODE_KEY) === "true";
  } catch {}
  let retroShellParts = null;
  let retroProfileParts = null;
  let observedShellMain = null;
  let resizeObserver = null;

  const pinnedSummaryLabel = /(toggle pinned summary|pinned summary|置顶摘要|固定摘要|釘選概要|釘選摘要|概要.*釘選|摘要.*固定)/i;
  const showSidebarLabel = /^(show sidebar|显示边栏|显示侧边栏|顯示邊欄|顯示側邊欄|サイドバーを表示|사이드바 표시)$/i;
  const hideSidebarLabel = /^(hide sidebar|隐藏边栏|隐藏侧边栏|隱藏邊欄|隱藏側邊欄|サイドバーを非表示|사이드바 숨기기)$/i;

  /* Completion uses the bundled QQ cough recording; other alerts use Web Audio. */
  const createSoundMonitor = () => {
    const storageKey = "codex-qq-skin-sound-enabled";
    const configuredVolume = typeof SOUND.volume === "number"
      ? clamp(SOUND.volume, 0, 1) : 0.48;
    const completionStyle = SOUND.completed === "didi" ? "didi" : "cough";
    const approvalStyle = SOUND.approval === "didi" ? "didi" : "alert";
    const onlineStyle = SOUND.online === "didi" ? "didi" : "knock";
    let enabled = SOUND.enabled !== false;
    try {
      const saved = window.localStorage?.getItem(storageKey);
      if (saved === "true" || saved === "false") enabled = saved === "true";
    } catch {}

    let audioContext = null;
    let initialized = false;
    let previousRunning = false;
    let activeApproval = null;
    let routeKey = "";
    let cancelledUntil = 0;
    let completionTimer = null;
    let statusTimer = null;
    let statusListener = null;
    let currentStatus = "idle";
    let boundButton = null;
    let activeCoughAudio = null;
    let startupCuePending = false;
    try {
      startupCuePending = window.sessionStorage?.getItem("codex-qq-skin-online-cue-played") !== "true";
    } catch { startupCuePending = true; }

    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const buttonLabel = (button) => normalize(
      button.getAttribute?.("aria-label") || button.getAttribute?.("title") || button.textContent,
    );
    const stopPattern = /^(stop|stop generating|stop task|cancel generation|停止|停止生成|停止任务|终止任务|中止任务)$/i;
    const approvalActionPattern = /^(allow once|approve)(\b.*)?$|^yes,? (allow|proceed)$|^run( command)?$|^continue$|^允许(一次|本次|此操作)?$|^批准(一次|本次)?$|^同意$|^授权$|^运行(命令)?$|^继续执行$/i;
    const approvalContextPattern = /(permission|approval|approve|authorize|authorization|command|权限|授权|批准|审批|命令|沙盒)/i;

    const setStatus = (next, { transient = false } = {}) => {
      if (statusTimer && !transient) {
        clearTimeout(statusTimer);
        statusTimer = null;
      }
      currentStatus = next;
      statusListener?.(currentStatus);
      if (transient) {
        if (statusTimer) clearTimeout(statusTimer);
        statusTimer = setTimeout(() => {
          statusTimer = null;
          setStatus(window.navigator?.onLine === false ? "offline" : "idle");
        }, 4200);
      }
    };

    const visibleButtons = () => [...document.querySelectorAll('button, [role="button"]')]
      .filter((button) => !button.disabled && button.getAttribute?.("aria-disabled") !== "true" &&
        button.getAttribute?.("aria-hidden") !== "true");
    const isStopButton = (button) => stopPattern.test(buttonLabel(button));
    const findRunning = () => document.documentElement.dataset.qodexManager !== "true" && visibleButtons().some(isStopButton);
    const findApproval = () => {
      const action = visibleButtons().find((button) => {
        const label = buttonLabel(button);
        if (!approvalActionPattern.test(label)) return false;
        const turn = button.closest?.('[data-turn-key], [data-testid*="approval" i]');
        if (!turn) return false;
        if (!/^(run( command)?|continue|运行(命令)?|继续执行)$/i.test(label)) return true;
        return approvalContextPattern.test(normalize(turn.textContent));
      });
      if (!action) return null;
      const host = action.closest?.('[data-turn-key], [data-testid*="approval" i]') || action.parentElement;
      const hostText = normalize(host?.textContent).slice(0, 320);
      const turnKey = host?.getAttribute?.("data-turn-key") || "";
      return `${turnKey}|${buttonLabel(action)}|${hostText}`;
    };

    const ensureAudioContext = () => {
      if (audioContext && audioContext.state !== "closed") return audioContext;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (typeof AudioContextClass !== "function") return null;
      try { audioContext = new AudioContextClass(); } catch { audioContext = null; }
      return audioContext;
    };

    const playNotes = (notes) => {
      const context = ensureAudioContext();
      if (!context) return;
      const start = context.currentTime + 0.025;
      for (const [frequency, offset, duration] of notes) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start + offset);
        gain.gain.setValueAtTime(0.0001, start + offset);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, configuredVolume * 0.24), start + offset + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start + offset);
        oscillator.stop(start + offset + duration + 0.02);
      }
    };

    const playSynthesizedCough = () => {
      const context = ensureAudioContext();
      if (!context) return;
      const sampleRate = context.sampleRate;
      for (const [offset, duration, frequency, strength] of [
        [0.02, 0.19, 620, 1],
        [0.28, 0.26, 470, 0.82],
      ]) {
        const frameCount = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = context.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);
        let randomState = 0x51f15e + Math.floor(offset * 1000);
        for (let index = 0; index < frameCount; index += 1) {
          randomState = (randomState * 1664525 + 1013904223) >>> 0;
          const noise = randomState / 0xffffffff * 2 - 1;
          const phase = index / frameCount;
          const envelope = Math.sin(Math.PI * phase) * Math.exp(-phase * 2.1);
          data[index] = noise * envelope;
        }
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        source.buffer = buffer;
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(frequency, context.currentTime + offset);
        filter.Q.value = 0.85;
        gain.gain.value = configuredVolume * 0.7 * strength;
        source.connect(filter).connect(gain).connect(context.destination);
        source.start(context.currentTime + offset);
      }
    };

    const playCough = () => {
      if (typeof window.Audio !== "function") {
        playSynthesizedCough();
        return;
      }
      try {
        activeCoughAudio?.pause?.();
        const audio = new window.Audio(coughAudioUrl);
        activeCoughAudio = audio;
        audio.volume = configuredVolume;
        audio.onended = () => { if (activeCoughAudio === audio) activeCoughAudio = null; };
        const playback = audio.play();
        playback?.catch?.(() => {
          if (activeCoughAudio === audio) activeCoughAudio = null;
          playSynthesizedCough();
        });
      } catch {
        activeCoughAudio = null;
        playSynthesizedCough();
      }
    };

    const playKnock = () => {
      const context = ensureAudioContext();
      if (!context) return;
      const start = context.currentTime + 0.025;
      for (const [offset, frequency, strength] of [
        [0.00, 165, 1], [0.19, 138, 0.84],
      ]) {
        const oscillator = context.createOscillator();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, start + offset);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.55, start + offset + 0.115);
        filter.type = "lowpass";
        filter.frequency.value = 720;
        gain.gain.setValueAtTime(Math.max(0.0002, configuredVolume * 0.52 * strength), start + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.14);
        oscillator.connect(filter).connect(gain).connect(context.destination);
        oscillator.start(start + offset);
        oscillator.stop(start + offset + 0.16);
      }
    };

    const synthesize = (style) => {
      if (style === "cough") playCough();
      else if (style === "knock") playKnock();
      else if (style === "didi") playNotes([
        [880, 0.00, 0.075], [1175, 0.105, 0.075], [1320, 0.21, 0.095],
      ]);
      else playNotes([
        [740, 0.00, 0.075], [1047, 0.11, 0.085], [740, 0.23, 0.075], [1319, 0.34, 0.13],
      ]);
    };

    const play = (eventName) => {
      if (!enabled || configuredVolume <= 0) return false;
      const style = eventName === "approval" ? approvalStyle
        : eventName === "online" ? onlineStyle : completionStyle;
      // HTML audio does not require the synthesized-alert AudioContext to resume.
      if (style === "cough") { playCough(); return true; }
      const context = ensureAudioContext();
      if (!context) return false;
      const perform = () => synthesize(style);
      if (context.state === "suspended" && typeof context.resume === "function") {
        context.resume().then(perform).catch(() => {});
      } else {
        perform();
      }
      return true;
    };

    const updateButton = () => {
      if (!boundButton) return;
      boundButton.textContent = enabled ? "🔊 提示音" : "🔇 已静音";
      boundButton.setAttribute?.("aria-label", enabled ? "关闭 Codex QQ 提示音" : "开启 Codex QQ 提示音");
      boundButton.setAttribute?.("aria-pressed", enabled ? "true" : "false");
    };
    const setEnabled = (next, { preview = false } = {}) => {
      enabled = Boolean(next);
      try { window.localStorage?.setItem(storageKey, String(enabled)); } catch {}
      updateButton();
      if (enabled && preview) play("approval");
      return enabled;
    };
    const bindButton = (button) => {
      if (boundButton === button) return;
      boundButton = button;
      if (button?.dataset && button.dataset.qqSoundBound !== "true" && typeof button.addEventListener === "function") {
        button.dataset.qqSoundBound = "true";
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setEnabled(!enabled, { preview: !enabled });
        });
      }
      updateButton();
    };

    const scan = () => {
      const nextRoute = `${window.location?.pathname || ""}${window.location?.search || ""}`;
      const running = findRunning();
      const approval = findApproval();
      if (!initialized || nextRoute !== routeKey) {
        initialized = true;
        routeKey = nextRoute;
        previousRunning = running;
        activeApproval = approval;
        if (completionTimer) clearTimeout(completionTimer);
        completionTimer = null;
        setStatus(window.navigator?.onLine === false ? "offline" : approval ? "approval" : running ? "running" : "idle");
        return;
      }
      if (approval && approval !== activeApproval) play("approval");
      activeApproval = approval;
      if (running && completionTimer) {
        clearTimeout(completionTimer);
        completionTimer = null;
      }
      if (previousRunning && !running && !approval && Date.now() >= cancelledUntil) {
        if (completionTimer) clearTimeout(completionTimer);
        completionTimer = setTimeout(() => {
          completionTimer = null;
          if (!findRunning() && !findApproval() && Date.now() >= cancelledUntil) {
            play("completed");
            setStatus("completed", { transient: true });
          }
        }, 520);
      }
      previousRunning = running;
      if (window.navigator?.onLine === false) setStatus("offline");
      else if (approval) setStatus("approval");
      else if (running) setStatus("running");
      else if (!statusTimer) setStatus("idle");
    };

    const unlock = () => {
      if (!enabled) return;
      const context = ensureAudioContext();
      const playStartupCue = () => {
        if (!startupCuePending) return;
        startupCuePending = false;
        try { window.sessionStorage?.setItem("codex-qq-skin-online-cue-played", "true"); } catch {}
        play("online");
      };
      if (context?.state === "suspended") context.resume().then(playStartupCue).catch(() => {});
      else if (context) playStartupCue();
    };
    const handleOnline = () => {
      play("online");
      setStatus(findApproval() ? "approval" : findRunning() ? "running" : "idle");
    };
    const handleOffline = () => setStatus("offline");
    const clickGuard = (event) => {
      const button = event.target?.closest?.('button, [role="button"]');
      if (button && isStopButton(button)) cancelledUntil = Date.now() + 3000;
      unlock();
    };
    document.addEventListener?.("pointerdown", unlock, true);
    document.addEventListener?.("keydown", unlock, true);
    document.addEventListener?.("click", clickGuard, true);
    window.addEventListener?.("online", handleOnline);
    window.addEventListener?.("offline", handleOffline);

    return {
      bindButton,
      bindStatus(listener) {
        statusListener = typeof listener === "function" ? listener : null;
        statusListener?.(currentStatus);
      },
      cleanup() {
        if (completionTimer) clearTimeout(completionTimer);
        if (statusTimer) clearTimeout(statusTimer);
        document.removeEventListener?.("pointerdown", unlock, true);
        document.removeEventListener?.("keydown", unlock, true);
        document.removeEventListener?.("click", clickGuard, true);
        window.removeEventListener?.("online", handleOnline);
        window.removeEventListener?.("offline", handleOffline);
        try { activeCoughAudio?.pause?.(); } catch {}
        activeCoughAudio = null;
        try { audioContext?.close?.(); } catch {}
        audioContext = null;
      },
      get enabled() { return enabled; },
      get status() { return currentStatus; },
      play,
      preview: play,
      scan,
      setEnabled,
    };
  };
  const soundMonitor = createSoundMonitor();

  /* Neon Storm weather layer — adapted from 粒子星球 neonRain + lightning.
     Performance-tuned: DPR 1, capped particle counts, ~24–36 FPS, no mix-blend,
     batched strokes, auto wind only. Active only for neon-storm in custom mode. */
  const createWeatherController = () => {
    const TAU = Math.PI * 2;
    const rand = (a, b) => a + Math.random() * (b - a);
    const MODE_SCALE = { drizzle: 0.16, rain: 0.28, storm: 0.22, calm: 0.08 };
    const MODE_FPS = { drizzle: 24, rain: 30, storm: 36, calm: 8 };
    const DROP_BASE = 420;

    let host = null;
    let canvas = null;
    let ctx = null;
    let raf = 0;
    let running = false;
    let last = 0;
    let acc = 0;
    let t = 0;
    let mode = "drizzle";
    let targetMode = "drizzle";
    let fade = 1;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let flash = 0;
    let stormTimer = 0;
    let boltTimer = 0;
    let wind = 0;
    let reduced = false;
    let visible = true;
    let currentStatus = "idle";
    let drops = [];
    let spl = [];
    let rips = [];
    let bolts = [];
    let rain = [];
    let io = null;
    let mq = null;
    let resizeTimer = null;
    let weatherAudio = null;
    let rainGainNode = null;
    let rainSource = null;
    let rainFilter = null;
    let lastThunderAt = 0;
    let audioTick = 0;
    let weatherSoundEnabled = true;
    try {
      const savedWeatherSound = window.localStorage?.getItem("codex-qq-skin-weather-sound-enabled");
      if (savedWeatherSound === "true" || savedWeatherSound === "false") {
        weatherSoundEnabled = savedWeatherSound === "true";
      }
    } catch {}

    const isActive = () =>
      skinMode === "custom" && NEON_STORM_THEME_IDS.has(String(THEME?.id || CUSTOM_THEME?.id || ""));
    const settingsOpen = () =>
      document.documentElement?.getAttribute?.("data-qq-settings") === "true";

    const densFor = (key) => MODE_SCALE[key] ?? MODE_SCALE.drizzle;
    const fpsFor = (key) => MODE_FPS[key] ?? 24;
    const weatherVolume = () => {
      const configured = typeof SOUND.volume === "number" ? clamp(SOUND.volume, 0, 1) : 0.48;
      return configured * 0.55;
    };
    const rainLevelFor = (key) => ({ drizzle: 0.22, rain: 0.48, storm: 0.36, calm: 0 }[key] ?? 0);
    const weatherAudioAllowed = () => weatherSoundEnabled && !reduced && !settingsOpen()
      && document.visibilityState !== "hidden";

    const ensureWeatherAudio = () => {
      if (weatherAudio && weatherAudio.state !== "closed") return weatherAudio;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (typeof AudioContextClass !== "function") return null;
      try { weatherAudio = new AudioContextClass(); } catch { weatherAudio = null; }
      return weatherAudio;
    };

    const stopRainAudio = () => {
      try { rainSource?.stop?.(); } catch {}
      try { rainSource?.disconnect?.(); } catch {}
      try { rainFilter?.disconnect?.(); } catch {}
      try { rainGainNode?.disconnect?.(); } catch {}
      rainSource = null;
      rainFilter = null;
      rainGainNode = null;
    };

    const syncWeatherAudioButton = () => {
      const button = document.getElementById(WEATHER_AUDIO_ID);
      if (!button) return;
      button.textContent = weatherSoundEnabled ? "🌧 雨声" : "🌧 静音";
      button.setAttribute("aria-pressed", weatherSoundEnabled ? "true" : "false");
      button.setAttribute("aria-label", weatherSoundEnabled ? "关闭雨夜音效" : "打开雨夜音效");
      button.title = weatherSoundEnabled ? "关闭下雨 / 打雷音效" : "打开下雨 / 打雷音效";
      button.style.background = weatherSoundEnabled ? "rgba(48,118,196,.92)" : "transparent";
      button.style.color = weatherSoundEnabled ? "#fff" : "#3b3f45";
      setAttribute(document.documentElement, "data-qq-weather-audio", weatherSoundEnabled ? "on" : "off");
    };

    const ensureWeatherAudioButton = () => {
      if (!isActive()) {
        document.getElementById(WEATHER_AUDIO_ID)?.remove();
        return;
      }
      // Keep the control visible even on settings (user looks for it next to skin switch).
      const host = typeof ensureToggleButton === "function" ? ensureToggleButton() : document.getElementById(TOGGLE_ID);
      if (!host) return;
      let button = document.getElementById(WEATHER_AUDIO_ID);
      if (!button || button.parentElement !== host) {
        button?.remove();
        button = document.createElement("button");
        button.id = WEATHER_AUDIO_ID;
        button.type = "button";
        button.style.cssText = [
          "height:22px", "padding:0 8px", "border:0", "border-radius:7px", "white-space:nowrap",
          "font:650 11px/22px -apple-system,BlinkMacSystemFont,\"PingFang SC\",sans-serif",
          "cursor:pointer", "user-select:none", "transition:background .16s ease,color .16s ease",
        ].join(";");
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          weatherSoundEnabled = !weatherSoundEnabled;
          try {
            window.localStorage?.setItem("codex-qq-skin-weather-sound-enabled", String(weatherSoundEnabled));
          } catch {}
          syncWeatherAudioButton();
          if (weatherSoundEnabled) startRainAudio();
          else stopRainAudio();
        });
        // Sit beside 原生 / QQ / 自定义 in the top-right skin switcher.
        host.appendChild(button);
      }
      syncWeatherAudioButton();
    };

    const styleOpenMenus = () => {
      if (!isActive() || settingsOpen()) return;
      const roots = [
        ...document.querySelectorAll('[role="menu"], [role="listbox"], [data-radix-menu-content], [data-radix-dropdown-menu-content]'),
        ...document.querySelectorAll("[data-radix-popper-content-wrapper] > div"),
      ];
      for (const root of roots) {
        if (!(root instanceof HTMLElement)) continue;
        const text = String(root.textContent || "");
        const looksLikeAccount = /(剩余用量|退出登录|显示宠物|Log out|Settings|设置)/i.test(text);
        const hasItems = root.querySelector?.('[role="menuitem"]');
        if (!looksLikeAccount && !hasItems) continue;
        root.style.setProperty("background", "rgb(16 22 36 / 0.98)", "important");
        root.style.setProperty("background-color", "rgb(16 22 36 / 0.98)", "important");
        root.style.setProperty("color", "#eaf3ff", "important");
        root.style.setProperty("border-color", "rgb(78 195 255 / 0.28)", "important");
        root.style.setProperty("backdrop-filter", "none", "important");
        root.style.setProperty("-webkit-backdrop-filter", "none", "important");
        for (const node of root.querySelectorAll("*")) {
          if (!(node instanceof HTMLElement)) continue;
          node.style.setProperty("color", "#eaf3ff", "important");
          if (node.matches?.('[role="menuitem"], button, a')) {
            node.style.setProperty("background-color", "transparent", "important");
          }
        }
      }
    };

    const startRainAudio = () => {
      if (!weatherAudioAllowed()) {
        stopRainAudio();
        return;
      }
      const level = rainLevelFor(targetMode === "storm" || mode === "storm" ? "storm" : targetMode);
      if (level <= 0.01) {
        if (rainGainNode) {
          try {
            const now = weatherAudio?.currentTime || 0;
            rainGainNode.gain.cancelScheduledValues(now);
            rainGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.35);
          } catch {}
        }
        return;
      }
      const context = ensureWeatherAudio();
      if (!context) return;
      const applyGain = () => {
        if (!rainGainNode) return;
        const now = context.currentTime;
        const target = Math.max(0.0001, weatherVolume() * level);
        try {
          rainGainNode.gain.cancelScheduledValues(now);
          rainGainNode.gain.linearRampToValueAtTime(target, now + 0.45);
        } catch {
          rainGainNode.gain.value = target;
        }
      };
      if (rainSource && rainGainNode) {
        applyGain();
        if (context.state === "suspended") context.resume?.().catch?.(() => {});
        return;
      }
      // Looping filtered noise ≈ soft rain bed (no bundled sample needed).
      const seconds = 2.4;
      const frames = Math.max(1, Math.floor(context.sampleRate * seconds));
      const buffer = context.createBuffer(1, frames, context.sampleRate);
      const data = buffer.getChannelData(0);
      let state = 0xC0FFEE ^ Math.floor(Math.random() * 1e9);
      for (let i = 0; i < frames; i += 1) {
        state = (state * 1664525 + 1013904223) >>> 0;
        const white = state / 0xffffffff * 2 - 1;
        // Mild pink-ish tilt so it is less hissy.
        data[i] = i ? data[i - 1] * 0.97 + white * 0.03 : white * 0.03;
      }
      rainSource = context.createBufferSource();
      rainFilter = context.createBiquadFilter();
      rainGainNode = context.createGain();
      rainSource.buffer = buffer;
      rainSource.loop = true;
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 1800;
      rainFilter.Q.value = 0.55;
      rainGainNode.gain.value = 0.0001;
      rainSource.connect(rainFilter).connect(rainGainNode).connect(context.destination);
      try { rainSource.start(); } catch {}
      applyGain();
      if (context.state === "suspended") context.resume?.().catch?.(() => {});
    };

    const playThunder = (big = false) => {
      if (!weatherAudioAllowed()) return;
      const nowMs = Date.now();
      if (nowMs - lastThunderAt < (big ? 420 : 900)) return;
      lastThunderAt = nowMs;
      const context = ensureWeatherAudio();
      if (!context) return;
      const fire = () => {
        const start = context.currentTime + 0.03;
        const vol = weatherVolume() * (big ? 1.05 : 0.62);
        const duration = big ? 2.8 : 1.7;
        // Brown-ish noise bed → rolling “轰隆隆” rumble, not a sharp crack.
        const frames = Math.max(1, Math.floor(context.sampleRate * duration));
        const buffer = context.createBuffer(1, frames, context.sampleRate);
        const data = buffer.getChannelData(0);
        let state = 0x51f15e ^ nowMs;
        let brown = 0;
        for (let i = 0; i < frames; i += 1) {
          state = (state * 1664525 + 1013904223) >>> 0;
          const white = state / 0xffffffff * 2 - 1;
          brown = (brown + white * 0.02) * 0.98;
          const phase = i / frames;
          const envelope = Math.sin(Math.PI * Math.min(1, phase * 1.15))
            * Math.exp(-phase * (big ? 1.35 : 1.9));
          // Soft swell then long decay — feels like distant thunder rolling.
          data[i] = brown * 3.2 * envelope;
        }
        const source = context.createBufferSource();
        const low = context.createBiquadFilter();
        const mid = context.createBiquadFilter();
        const gain = context.createGain();
        source.buffer = buffer;
        low.type = "lowpass";
        low.frequency.value = big ? 160 : 190;
        low.Q.value = 0.7;
        mid.type = "peaking";
        mid.frequency.value = 85;
        mid.Q.value = 0.8;
        mid.gain.value = 5.5;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * 0.9), start + 0.12);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * 0.55), start + duration * 0.45);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.connect(low).connect(mid).connect(gain).connect(context.destination);
        source.start(start);
        source.stop(start + duration + 0.05);
        // Extra sub oscillators for the “隆隆” body.
        for (const [freq, strength, len] of [
          [big ? 42 : 55, 0.7, duration * 0.9],
          [big ? 28 : 36, 0.55, duration],
        ]) {
          const osc = context.createOscillator();
          const oscFilter = context.createBiquadFilter();
          const oscGain = context.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, start);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.62, start + len);
          oscFilter.type = "lowpass";
          oscFilter.frequency.value = 140;
          oscGain.gain.setValueAtTime(0.0001, start);
          oscGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * strength * 0.55), start + 0.18);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, start + len);
          osc.connect(oscFilter).connect(oscGain).connect(context.destination);
          osc.start(start);
          osc.stop(start + len + 0.05);
        }
      };
      if (context.state === "suspended") context.resume().then(fire).catch(() => {});
      else fire();
    };

    const destroy = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = null;
      io?.disconnect();
      io = null;
      if (mq && mq._handler) {
        try { mq.removeEventListener("change", mq._handler); } catch {}
      }
      mq = null;
      stopRainAudio();
      try { weatherAudio?.close?.(); } catch {}
      weatherAudio = null;
      document.getElementById(WEATHER_ID)?.remove();
      document.getElementById(WEATHER_HUD_ID)?.remove();
      document.getElementById(WEATHER_AUDIO_ID)?.remove();
      host = null;
      canvas = null;
      ctx = null;
      drops = [];
      spl = [];
      rips = [];
      bolts = [];
      rain = [];
      document.documentElement?.removeAttribute("data-qq-weather");
    };

    const seedRain = (scale) => {
      const n = Math.max(36, Math.round(DROP_BASE * scale));
      drops = new Array(n);
      for (let i = 0; i < n; i += 1) {
        drops[i] = {
          x: rand(-40, w + 40),
          y: rand(-h, h),
          v: rand(780, 1280),
          len: rand(18, 40),
          a: rand(0.34, 0.72),
        };
      }
      spl = [];
      rips = [];
    };

    const seedStormRain = (scale) => {
      const n = Math.max(28, Math.round(120 * scale));
      rain = new Array(n);
      for (let i = 0; i < n; i += 1) {
        rain[i] = { x: rand(0, w), y: rand(0, h), v: rand(620, 980) };
      }
      bolts = [];
      flash = 0;
      boltTimer = 0.4;
    };

    const makeBolt = (x0, big) => {
      if (!w || !h) return;
      const segs = [];
      let x = x0;
      let y = -10;
      const pts = [{ x, y }];
      while (y < h * rand(0.74, 0.92)) {
        y += rand(18, 30);
        x += rand(-28, 28);
        pts.push({ x, y });
        if (Math.random() < 0.16) {
          let bx = x;
          let by = y;
          const bang = rand(0.4, 1.1) * (Math.random() < 0.5 ? -1 : 1);
          const bpts = [{ x: bx, y: by }];
          const bl = Math.floor(rand(3, 6));
          for (let i = 0; i < bl; i += 1) {
            bx += Math.sin(bang) * rand(10, 18);
            by += Math.cos(Math.abs(bang)) * rand(8, 16);
            bpts.push({ x: bx, y: by });
          }
          segs.push({ pts: bpts, ww: 0.75 });
        }
      }
      segs.push({ pts, ww: 2 });
      bolts.push({ segs, life: 1, dec: rand(1.5, 2.4), big: !!big });
      if (bolts.length > 5) bolts.shift();
      flash = Math.max(flash, big ? 0.34 : 0.18);
      playThunder(!!big);
    };

    const resize = () => {
      if (!canvas || !host) return;
      const box = host.getBoundingClientRect?.() || { width: window.innerWidth, height: window.innerHeight };
      w = Math.max(2, Math.round(box.width || window.innerWidth || 2));
      h = Math.max(2, Math.round(box.height || window.innerHeight || 2));
      // Cap at 1× — Retina 2× roughly quadruples fill cost for little rain benefit.
      dpr = 1;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      const dens = densFor(mode === "calm" ? "calm" : mode);
      const target = Math.round(DROP_BASE * dens);
      if (!drops.length || Math.abs(drops.length - target) > 28) seedRain(dens);
      if (mode === "storm" && !rain.length) seedStormRain(0.45);
    };

    const scheduleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        resize();
      }, 120);
    };

    const groundY = () => Math.max(2, h - 2);

    const renderRain = (alpha) => {
      if (!ctx || alpha < 0.02) return;
      const gy = groundY();
      const wx = wind * 0.03;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = "rgba(180,215,255,0.55)";
      ctx.beginPath();
      for (let i = 0; i < drops.length; i += 1) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - wx * d.len * 0.12, d.y - d.len);
      }
      ctx.stroke();
      if (spl.length) {
        ctx.fillStyle = "rgba(220,235,255,0.7)";
        ctx.beginPath();
        for (let i = 0; i < spl.length; i += 1) {
          const s = spl[i];
          ctx.moveTo(s.x + 1.2, s.y);
          ctx.arc(s.x, s.y, 1.2, 0, TAU);
        }
        ctx.fill();
      }
      if (rips.length) {
        ctx.strokeStyle = "rgba(170,210,255,0.35)";
        ctx.lineWidth = 1;
        for (let i = 0; i < rips.length; i += 1) {
          const r = rips[i];
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.r, r.r * 0.28, 0, 0, TAU);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const renderStorm = (alpha) => {
      if (!ctx || alpha < 0.02) return;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(150,180,230,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < rain.length; i += 1) {
        const r = rain[i];
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + r.v * 0.008, r.y - r.v * 0.04);
      }
      ctx.stroke();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let bi = 0; bi < bolts.length; bi += 1) {
        const b = bolts[bi];
        const L = Math.max(0, Math.min(1, b.life));
        for (let si = 0; si < b.segs.length; si += 1) {
          const s = b.segs[si];
          // Two passes instead of three: soft glow + core.
          for (const pass of [{ ww: 6, a: 0.18, c: "205,220,255" }, { ww: 1.4, a: 0.92, c: "255,255,255" }]) {
            ctx.strokeStyle = `rgba(${pass.c},${pass.a * L})`;
            ctx.lineWidth = pass.ww * s.ww;
            ctx.beginPath();
            for (let i = 0; i < s.pts.length; i += 1) {
              const p = s.pts[i];
              if (i) ctx.lineTo(p.x, p.y);
              else ctx.moveTo(p.x, p.y);
            }
            ctx.stroke();
          }
        }
      }
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(225,235,255,${flash * 0.28})`;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
      ctx.lineCap = "butt";
    };

    const update = (dt) => {
      if (mode !== targetMode) {
        fade = Math.max(0, fade - dt * 1.15);
        if (fade <= 0.02) {
          mode = targetMode;
          fade = 0;
          seedRain(densFor(mode));
          if (mode === "storm") seedStormRain(0.45);
          else rain = [];
        }
      } else if (fade < 1) fade = Math.min(1, fade + dt * 1.2);

      // Cheap auto wind — no pointer listeners.
      wind = Math.sin(t * 0.35) * 70;
      const spd = mode === "drizzle" ? 0.7 : 1;
      const gy = groundY();
      if (mode !== "calm" && mode !== "storm") {
        for (let i = 0; i < drops.length; i += 1) {
          const d = drops[i];
          d.y += d.v * spd * dt;
          d.x += wind * dt;
          if (d.y > gy) {
            if (spl.length < 36 && Math.random() < 0.35) {
              spl.push({
                x: d.x, y: gy,
                vx: rand(-40, 40) + wind * 0.2, vy: -rand(28, 90),
                life: 1,
              });
            }
            if (rips.length < 16 && Math.random() < 0.22) {
              rips.push({ x: d.x, y: gy, r: 2, life: 1 });
            }
            d.y = rand(-70, -8);
            d.x = rand(-40, w + 40);
          }
        }
      }
      for (let i = spl.length - 1; i >= 0; i -= 1) {
        const s = spl[i];
        s.vy += 600 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt * 2.6;
        if (s.life <= 0 || s.y > gy + 4) spl.splice(i, 1);
      }
      for (let i = rips.length - 1; i >= 0; i -= 1) {
        const r = rips[i];
        r.r += 80 * dt;
        r.life -= dt * 2;
        if (r.life <= 0) rips.splice(i, 1);
      }

      if (mode === "storm" || targetMode === "storm") {
        boltTimer -= dt;
        if (boltTimer <= 0) {
          boltTimer = rand(0.5, 1.3);
          makeBolt(rand(w * 0.12, w * 0.88), Math.random() < 0.4);
        }
        for (let i = 0; i < rain.length; i += 1) {
          const r = rain[i];
          r.y += r.v * dt;
          r.x -= r.v * 0.16 * dt;
          if (r.y > h) {
            r.y = -20;
            r.x = rand(0, w * 1.15);
          }
        }
        for (let i = bolts.length - 1; i >= 0; i -= 1) {
          bolts[i].life -= bolts[i].dec * dt;
          if (bolts[i].life <= 0) bolts.splice(i, 1);
        }
        flash = Math.max(0, flash - dt * 1.9);
        if (stormTimer > 0) {
          stormTimer -= dt;
          if (stormTimer <= 0 && currentStatus !== "completed") {
            setMode(statusToMode(currentStatus === "offline" ? "offline" : "idle"), { hard: false });
          }
        }
      }
    };

    const paint = () => {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (mode === "calm" && targetMode === "calm") return;
      if (mode === "storm" || targetMode === "storm") {
        if (mode === "storm") renderStorm(Math.max(fade, 0.4));
        else {
          renderRain(1 - fade);
          renderStorm(fade);
        }
      } else {
        renderRain(mode === targetMode ? Math.max(0.45, fade) : Math.max(fade, 0.25));
      }
    };

    const loop = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      t += dt;
      acc += dt;
      const frame = 1 / fpsFor(targetMode === "storm" || mode === "storm" ? "storm" : targetMode);
      if (acc < frame) return;
      // Consume whole budget so we don't cascade catch-up frames.
      acc = 0;
      if (!reduced) update(dt > frame ? dt : frame);
      paint();
      audioTick += 1;
      if (audioTick % 18 === 0) startRainAudio();
    };

    const start = () => {
      if (running || !canvas || reduced) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(loop);
      startRainAudio();
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      stopRainAudio();
    };

    const statusToMode = (status) => {
      if (status === "running" || status === "approval") return "rain";
      if (status === "completed") return "storm";
      if (status === "offline") return "calm";
      return "drizzle";
    };

    const setMode = (next, { hard = false } = {}) => {
      if (next === targetMode && !hard) return;
      targetMode = next;
      if (hard) {
        mode = next;
        fade = 1;
        seedRain(densFor(mode));
        if (mode === "storm") seedStormRain(0.45);
        else rain = [];
      } else fade = Math.min(fade, 0.85);
      if (host) host.dataset.weatherMode = targetMode;
      if (targetMode === "calm" && mode === "calm") {
        paint();
        startRainAudio();
      } else if (!running && !reduced) start();
      else startRainAudio();
    };

    const setStatus = (status) => {
      currentStatus = status || "idle";
      if (status === "completed") {
        setMode("storm");
        stormTimer = 3.6;
        makeBolt(rand(w * 0.2, w * 0.8), true);
        makeBolt(rand(w * 0.2, w * 0.8), Math.random() < 0.6);
      } else {
        setMode(statusToMode(status));
        if (status !== "completed") stormTimer = 0;
      }
    };

    const mount = () => {
      if (!document.body) return;
      document.getElementById(WEATHER_HUD_ID)?.remove();
      host = document.getElementById(WEATHER_ID);
      if (!host) {
        host = document.createElement("div");
        host.id = WEATHER_ID;
        host.setAttribute("aria-hidden", "true");
        canvas = document.createElement("canvas");
        host.appendChild(canvas);
        document.body.appendChild(host);
      } else {
        canvas = host.querySelector("canvas") || document.createElement("canvas");
        if (!canvas.parentElement) host.appendChild(canvas);
      }
      // alpha:true + no desync fill — rain drawn on transparent buffer over black body.
      ctx = canvas.getContext("2d", { alpha: true, desynchronized: true }) || canvas.getContext("2d");

      try {
        mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reduced = Boolean(mq.matches);
        mq._handler = () => {
          reduced = Boolean(mq.matches);
          if (reduced) {
            stop();
            paint();
          } else if (visible && document.visibilityState !== "hidden") start();
        };
        mq.addEventListener("change", mq._handler);
      } catch { reduced = false; }

      if (typeof IntersectionObserver === "function") {
        io?.disconnect();
        io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting !== false;
          if (visible && document.visibilityState !== "hidden" && !reduced) start();
          else stop();
        });
        io.observe(host);
      }

      if (host.dataset.qqWeatherBound !== "true") {
        host.dataset.qqWeatherBound = "true";
        window.addEventListener("resize", scheduleResize, { passive: true });
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") stop();
          else if (visible && !reduced) start();
        });
      }

      // Settings uses Codex native chrome: drop the weather attribute so neon
      // CSS overrides do not fight the official settings tokens.
      if (settingsOpen()) {
        document.documentElement?.removeAttribute("data-qq-weather");
        if (host) host.style.display = "none";
        // Also clear deep-theme wallpaper vars that paint through settings.
        try {
          document.documentElement.style.removeProperty("--dream-skin-art");
          document.documentElement.style.removeProperty("--dream-deep-right");
          document.documentElement.style.removeProperty("--dream-deep-sidebar");
        } catch {}
      } else {
        setAttribute(document.documentElement, "data-qq-weather", "neon-storm");
        if (host) host.style.display = "";
      }
      resize();
      setStatus(soundMonitor.status || "idle");
      paint();
      ensureWeatherAudioButton();
      styleOpenMenus();
      if (!reduced && !settingsOpen()) start();
      else {
        stop();
        paint();
      }
      if (settingsOpen()) stopRainAudio();
      else startRainAudio();
    };

    return {
      ensure() {
        if (!isActive()) {
          destroy();
          return;
        }
        mount();
      },
      setStatus(status) {
        if (!isActive()) return;
        if (!host) mount();
        setStatus(status);
      },
      destroy,
      get active() { return isActive() && Boolean(host); },
      syncAudioUi() {
        if (!isActive()) {
          document.getElementById(WEATHER_AUDIO_ID)?.remove();
          return;
        }
        ensureWeatherAudioButton();
        styleOpenMenus();
        if (settingsOpen()) {
          document.documentElement?.removeAttribute("data-qq-weather");
          if (host) host.style.display = "none";
          stop();
          stopRainAudio();
          paint();
        } else {
          setAttribute(document.documentElement, "data-qq-weather", "neon-storm");
          if (host) host.style.display = "";
          if (!running && !reduced && visible) start();
          else startRainAudio();
        }
      },
    };
  };

  const weatherMonitor = createWeatherController();

  const findPinnedSummaryToggle = () => {
    for (const button of document.querySelectorAll('button[aria-label]')) {
      if (pinnedSummaryLabel.test(button.getAttribute("aria-label") || "")) return button;
    }
    // Newer Codex builds renamed the pinned-summary control to the generic
    // “显示/隐藏侧边栏”. Distinguish it from the left navigation toggle by its
    // real top-right viewport position and ignore our cloned retro control.
    const genericSummaryLabel = /^(show\/hide sidebar|toggle sidebar visibility|显示\/隐藏侧边栏|顯示\/隱藏側邊欄)$/i;
    const candidates = [...document.querySelectorAll('button[aria-label]')].filter((button) => {
      if (!genericSummaryLabel.test(button.getAttribute("aria-label") || "")) return false;
      if (button.closest?.(`#${RETRO_SHELL_ID}`)) return false;
      const box = button.getBoundingClientRect?.();
      return box && box.width >= 20 && box.height >= 20 &&
        box.left > window.innerWidth * .65 && box.top >= 0 && box.top < 48;
    });
    return candidates.sort((left, right) =>
      right.getBoundingClientRect().left - left.getBoundingClientRect().left)[0] || null;
  };

  const findLeftSidebarToggle = () => {
    for (const button of document.querySelectorAll('button[aria-label]')) {
      const label = button.getAttribute("aria-label") || "";
      if (showSidebarLabel.test(label) || hideSidebarLabel.test(label)) return button;
    }
    return null;
  };

  const statusLabels = {
    idle: "在线 · 随时待命",
    running: "正在工作…",
    approval: "需要你的确认",
    completed: "任务已完成",
    offline: "连接已断开",
  };
  const weeklyUsageStorageKey = "codex-qq-skin-weekly-remaining";
  const profileActionPattern = /^(open profile menu|open account menu|打开个人资料菜单|打开账户菜单|開啟個人資料選單|開啟帳戶選單|プロフィールメニューを開く|프로필 메뉴 열기)$/i;
  const weeklyPattern = /(本周|每周|每週|一周|一週|week|weekly)/i;
  const remainingPattern = /(?:剩余|剩餘)\s*(\d+(?:\.\d+)?)\s*%|(?:remaining|left)\s*:?\s*(\d+(?:\.\d+)?)\s*%/i;

  const findReactWeeklyUsage = () => {
    const firstFiber = window.__codexRoot?._internalRoot?.current;
    if (!firstFiber || typeof firstFiber !== "object") return null;
    const visited = new WeakSet();
    const pending = [firstFiber];
    let scanned = 0;
    while (pending.length && scanned < 20000) {
      const fiber = pending.pop();
      if (!fiber || typeof fiber !== "object" || visited.has(fiber)) continue;
      visited.add(fiber);
      scanned += 1;
      for (const props of [fiber.memoizedProps, fiber.alternate?.memoizedProps]) {
        const rateLimit = props?.rateLimit;
        const windowData = rateLimit?.rate_limit?.primary_window;
        const windowSeconds = Number(windowData?.limit_window_seconds);
        const usedPercent = Number(windowData?.used_percent);
        if (
          Number.isFinite(windowSeconds) && windowSeconds >= 6 * 86400 && windowSeconds <= 8 * 86400 &&
          Number.isFinite(usedPercent)
        ) {
          const accountIdentity = String(rateLimit.account_id || rateLimit.user_id || "").trim();
          return {
            accountIdentity,
            remaining: clamp(Math.round(100 - usedPercent), 0, 100),
          };
        }
      }
      if (fiber.sibling) pending.push(fiber.sibling);
      if (fiber.child) pending.push(fiber.child);
    }
    return null;
  };

  const findWeeklyRemaining = () => {
    for (const node of document.querySelectorAll('[role="status"], [role="alert"]')) {
      const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (!weeklyPattern.test(text)) continue;
      const match = remainingPattern.exec(text);
      const value = Number(match?.[1] ?? match?.[2]);
      if (Number.isFinite(value)) return clamp(Math.round(value), 0, 100);
    }
    for (const progress of document.querySelectorAll("progress")) {
      let host = progress;
      let text = "";
      for (let depth = 0; host && depth < 6; depth += 1, host = host.parentElement) {
        text = String(host.textContent || "").replace(/\s+/g, " ").trim();
        if (weeklyPattern.test(text)) break;
      }
      if (!weeklyPattern.test(text)) continue;
      const match = remainingPattern.exec(text);
      const parsed = Number(match?.[1] ?? match?.[2]);
      if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 0, 100);
      const maximum = Number(progress.max || progress.getAttribute?.("max") || 100);
      const used = Number(progress.value ?? progress.getAttribute?.("value"));
      if (Number.isFinite(maximum) && maximum > 0 && Number.isFinite(used)) {
        return clamp(Math.round(100 - used / maximum * 100), 0, 100);
      }
    }
    return null;
  };

  const findCurrentAccountIdentity = () => {
    const profileButton = [...document.querySelectorAll("button[aria-label]")].find((button) =>
      profileActionPattern.test(String(button.getAttribute?.("aria-label") || "").trim()) &&
      String(button.textContent || "").trim());
    const visibleName = String(profileButton?.textContent || retroProfileParts?.name?.textContent || "")
      .replace(/\s+/g, " ").trim();
    return visibleName.slice(0, 120);
  };

  const weeklyUsageCacheKey = (accountIdentity) => accountIdentity
    ? `${weeklyUsageStorageKey}:${encodeURIComponent(accountIdentity.toLocaleLowerCase())}`
    : "";

  const syncWeeklyUsage = (node) => {
    if (!node) return;
    const reactUsage = findReactWeeklyUsage();
    const accountIdentity = reactUsage?.accountIdentity || findCurrentAccountIdentity();
    const accountCacheKey = weeklyUsageCacheKey(accountIdentity);
    let remaining = reactUsage?.remaining ?? findWeeklyRemaining();
    if (remaining != null) {
      if (accountCacheKey) {
        try { window.localStorage?.setItem(accountCacheKey, String(remaining)); } catch {}
      }
    } else if (accountCacheKey) {
      try {
        const saved = window.localStorage?.getItem(accountCacheKey);
        const cached = Number(saved);
        if (saved != null && Number.isFinite(cached)) remaining = clamp(Math.round(cached), 0, 100);
      } catch {}
    }
    // Version 1.6.1 stored one global value. It cannot safely be associated
    // with the account currently signed in, so never use it after migration.
    try { window.localStorage?.removeItem(weeklyUsageStorageKey); } catch {}
    node.textContent = remaining == null ? "本周剩余 --" : `本周剩余 ${remaining}%`;
    if (node.dataset) {
      node.dataset.level = remaining == null ? "unknown" : remaining <= 5 ? "critical" : remaining <= 20 ? "low" : "normal";
      node.dataset.account = accountIdentity;
    }
  };

  const openAvatarOverlay = () => {
    try {
      const result = window.electronBridge?.sendMessageFromView?.({ type: "avatar-overlay-open" });
      result?.catch?.(() => {});
      return Boolean(result !== undefined || window.electronBridge?.sendMessageFromView);
    } catch { return false; }
  };

  const toggleNativeTerminal = () => {
    const labelPattern = /(打开终端|显示或隐藏终端|切换底部面板显示|open terminal|show or hide terminal|toggle bottom panel visibility)/i;
    const candidates = [...document.querySelectorAll('button[aria-label], [role="button"][aria-label]')]
      .filter((button) => !button.closest?.(`#${COMPANION_ID}`) && labelPattern.test(button.getAttribute?.("aria-label") || ""));
    const visible = candidates.filter((button) => {
      const box = button.getBoundingClientRect?.();
      return !box || (box.width > 0 && box.height > 0 && box.left > 0 && box.top >= 0);
    }).sort((a, b) => Number(/打开终端|显示或隐藏终端|open terminal|show or hide terminal/i.test(b.ariaLabel || b.getAttribute?.("aria-label") || ""))
      - Number(/打开终端|显示或隐藏终端|open terminal|show or hide terminal/i.test(a.ariaLabel || a.getAttribute?.("aria-label") || "")));
    const target = visible[0] || candidates[0];
    target?.click?.();
    if (objectLiveParts?.stage && target) objectLiveParts.stage.classList.toggle("is-terminal-open");
    return Boolean(target);
  };

  const syncCompanionStatus = (status) => {
    const companion = companionParts?.companion;
    if (!companion) return;
    if (companion.dataset) companion.dataset.status = status;
    setTextContent(companionParts.statusText, statusLabels[status] || statusLabels.idle);
  };

  const companionRoomPhase = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "day";
    if (hour >= 18 && hour < 22) return "evening";
    return "night";
  };

  const roomEscape = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);

  const safeRoomUrl = (value, githubOnly = false) => {
    try {
      const url = new URL(String(value || ""));
      if (!["http:", "https:"].includes(url.protocol)) return "";
      if (githubOnly && url.hostname !== "github.com") return "";
      return url.href;
    } catch { return ""; }
  };

  const roomToast = (message) => {
    const toast = companionParts?.toast;
    if (!toast) return;
    setTextContent(toast, message);
    toast.classList?.add("is-visible");
    setTimeout(() => toast.classList?.remove("is-visible"), 2200);
  };

  const openRoomExternal = (value, githubOnly = false) => {
    const url = safeRoomUrl(value, githubOnly);
    if (!url) {
      roomToast("这个链接暂时不可用。");
      return false;
    }
    try {
      window.open(url, "_blank", "noopener,noreferrer");
      roomToast("已在浏览器中打开。");
      return true;
    } catch {
      roomToast("无法打开浏览器，请稍后重试。");
      return false;
    }
  };

  const bindBlindBoxButtons = (content) => {
    content?.querySelectorAll?.(".qq-skin-blind-box-actions [data-room-action]").forEach((button) => {
      if (button.dataset.qqBlindBoxBound === "true") return;
      button.dataset.qqBlindBoxBound = "true";
      let pointerHandledAt = 0;
      const run = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        handleCompanionRoomAction(button.dataset.roomAction);
      };
      button.addEventListener?.("pointerup", (event) => {
        if (typeof event.button === "number" && event.button !== 0) return;
        pointerHandledAt = Date.now();
        run(event);
      });
      button.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (Date.now() - pointerHandledAt < 600) return;
        run(event);
      });
    });
  };

  const persistBlindBox = () => {
    try { window.localStorage?.setItem(BLIND_BOX_STORAGE_KEY, JSON.stringify(companionBlindBox)); } catch {}
  };

  const currentBlindBoxProject = () => (Array.isArray(companionSnapshot?.github) ? companionSnapshot.github : [])
    .find((repo) => Number(repo.id) === Number(companionBlindBox.currentId)) || null;

  const syncBlindBoxDecor = () => {
    const companion = companionParts?.companion;
    if (!companion) return;
    companion.dataset.roomUnlocks = String(companionBlindBox.unlocked.length);
    companion.querySelectorAll("[data-room-decor]").forEach((decor) => {
      decor.classList?.toggle("is-unlocked", companionBlindBox.unlocked.includes(decor.dataset.roomDecor));
    });
  };

  const discoverBlindBoxProject = () => {
    const repos = Array.isArray(companionSnapshot?.github) ? companionSnapshot.github : [];
    if (!repos.length) return null;
    const currentId = Number(companionBlindBox.currentId) || 0;
    const recent = new Set(companionBlindBox.history.slice(-Math.max(1, repos.length - 2)));
    const avoided = new Set(companionBlindBox.avoidedIds);
    const avoidedLanguages = new Set(companionBlindBox.avoidedLanguages);
    let candidates = repos.filter((repo) => Number(repo.id) !== currentId && !recent.has(Number(repo.id)) &&
      !avoided.has(Number(repo.id)) && !avoidedLanguages.has(String(repo.language || "")));
    if (!candidates.length) {
      candidates = repos.filter((repo) => Number(repo.id) !== currentId && !avoided.has(Number(repo.id)));
    }
    if (!candidates.length) candidates = repos.filter((repo) => Number(repo.id) !== currentId);
    if (!candidates.length) candidates = repos;
    const project = candidates[Math.floor(Math.random() * candidates.length)];
    companionBlindBox.currentId = Number(project.id);
    companionBlindBox.history.push(Number(project.id));
    companionBlindBox.history = companionBlindBox.history.slice(-50);
    companionBlindBox.discoveries += 1;
    if (companionBlindBox.discoveries % 5 === 0) {
      const nextDecor = BLIND_BOX_DECOR.find((item) => !companionBlindBox.unlocked.includes(item));
      if (nextDecor) {
        companionBlindBox.unlocked.push(nextDecor);
        roomToast("连续发现 5 个项目：新摆件已解锁！");
      }
    }
    persistBlindBox();
    syncBlindBoxDecor();
    const companion = companionParts?.companion;
    if (companion?.dataset) {
      companion.dataset.roomMood = "reading";
      companion.dataset.roomDrawing = "true";
      setTimeout(() => {
        if (companion.dataset) {
          companion.dataset.roomMood = "";
          companion.dataset.roomDrawing = "false";
        }
      }, 900);
    }
    return project;
  };

  const renderCompanionRoomPanel = () => {
    const panel = companionParts?.panel;
    const title = companionParts?.panelTitle;
    const content = companionParts?.panelContent;
    if (!panel || !title || !content) return;
    panel.classList?.toggle("is-visible", companionRoomMode !== "room");
    if (companionRoomMode === "room") return;
    const empty = (message) => `<div class="qq-skin-room-empty">${roomEscape(message)}</div>`;

    if (companionRoomMode === "blindbox") {
      setTextContent(title, `GitHub 热门项目盲盒 · 已发现 ${companionBlindBox.discoveries}`);
      const project = currentBlindBoxProject();
      if (!project) {
        content.innerHTML = empty("机器人正在找一本合适的项目书……");
        return;
      }
      const favorite = companionBlindBox.favorites.includes(Number(project.id));
      content.innerHTML = `<article class="qq-skin-blind-box-card">
        <div class="qq-skin-blind-box-project">
          <h3>${roomEscape(project.name)}</h3>
          <p>${roomEscape(project.descriptionZh || "这是一个近期受到关注的开源项目，帮助开发者改善开发流程与自动化体验。")}</p>
        </div>
        <div class="qq-skin-blind-box-actions">
          <button type="button" data-room-action="favorite">${favorite ? "★ 已收藏" : "☆ 收藏"}</button>
          <button type="button" data-room-action="open-project">打开 GitHub</button>
          <button type="button" data-room-action="next-project">换一本</button>
          <button type="button" data-room-action="less-like-this">以后少推荐这种</button>
        </div>
        <small>再发现 ${5 - (companionBlindBox.discoveries % 5)} 个项目解锁下一件房间摆件</small>
      </article>`;
      bindBlindBoxButtons(content);
      return;
    }

    setTextContent(title, "伙伴房间设置");
    const motion = companionParts.companion.dataset.roomMotion !== "off";
    content.innerHTML = `<div class="qq-skin-room-settings">
      <button type="button" data-room-action="motion"><b>房间动态效果</b><span>${motion ? "已开启" : "已关闭"}</span></button>
      <p>收藏、减少同类推荐和摆件解锁进度只保存在本机。</p>
    </div>`;
  };

  const setCompanionRoomMode = (mode) => {
    companionRoomMode = ["room", "blindbox", "settings"].includes(mode) ? mode : "room";
    if (companionParts?.companion?.dataset) companionParts.companion.dataset.roomMode = companionRoomMode;
    renderCompanionRoomPanel();
  };

  const drawAndRevealBlindBox = () => {
    if (blindBoxRevealTimer) clearTimeout(blindBoxRevealTimer);
    setCompanionRoomMode("room");
    discoverBlindBoxProject();
    blindBoxRevealTimer = setTimeout(() => {
      blindBoxRevealTimer = null;
      setCompanionRoomMode("blindbox");
    }, 720);
  };

  const handleCompanionRoomAction = (action) => {
    if (action === "blindbox") {
      drawAndRevealBlindBox();
      return;
    }
    if (action === "settings") return setCompanionRoomMode("settings");
    if (action === "back") return setCompanionRoomMode("room");
    const companion = companionParts?.companion;
    if (!companion?.dataset) return;
    if (action === "favorite") {
      const project = currentBlindBoxProject();
      if (!project) return;
      const id = Number(project.id);
      if (companionBlindBox.favorites.includes(id)) {
        companionBlindBox.favorites = companionBlindBox.favorites.filter((item) => item !== id);
        roomToast("已取消收藏。");
      } else {
        companionBlindBox.favorites.push(id);
        roomToast("已收藏到本机。");
      }
      persistBlindBox();
      renderCompanionRoomPanel();
    } else if (action === "open-project") {
      const project = currentBlindBoxProject();
      if (project) openRoomExternal(project.url, true);
    } else if (action === "next-project") {
      drawAndRevealBlindBox();
    } else if (action === "less-like-this") {
      const project = currentBlindBoxProject();
      if (!project) return;
      companionBlindBox.avoidedIds.push(Number(project.id));
      if (project.language && project.language !== "Other") companionBlindBox.avoidedLanguages.push(String(project.language));
      companionBlindBox.avoidedIds = [...new Set(companionBlindBox.avoidedIds)].slice(-100);
      companionBlindBox.avoidedLanguages = [...new Set(companionBlindBox.avoidedLanguages)].slice(-20);
      roomToast("记住了，以后会少推荐这一类。");
      drawAndRevealBlindBox();
    } else if (action === "motion") {
      companion.dataset.roomMotion = companion.dataset.roomMotion === "off" ? "on" : "off";
      try { window.localStorage?.setItem("codex-qq-skin-room-motion", companion.dataset.roomMotion); } catch {}
      renderCompanionRoomPanel();
    } else if (action === "robot") {
      const moods = ["happy", "curious", "sleepy", "excited"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      companion.dataset.roomMood = mood;
      roomToast({ happy: "今天也一起把 Bug 清空！", curious: "这个项目看起来很有意思。", sleepy: "唔……让我眯三秒。", excited: "出发！下一个任务！" }[mood]);
      setTimeout(() => { companion.dataset.roomMood = ""; }, 2600);
    } else if (action === "window") {
      const phases = ["morning", "day", "evening", "night"];
      companion.dataset.roomPhase = phases[(phases.indexOf(companion.dataset.roomPhase) + 1) % phases.length];
      roomToast("窗外的时间变了。");
    } else if (action === "break") {
      if (companionBreakTimer) clearTimeout(companionBreakTimer);
      companion.dataset.roomMood = "break";
      roomToast("咖啡休息开始：5 分钟。");
      companionBreakTimer = setTimeout(() => {
        companionBreakTimer = null;
        companion.dataset.roomMood = "";
        roomToast("休息结束，回来继续创造吧。");
      }, 5 * 60 * 1000);
    } else if (action === "terminal") toggleNativeTerminal();
  };

  const ensureCompanion = () => {
    let companion = document.getElementById(COMPANION_ID);
    if (!companion || companion.parentElement !== document.body) {
      companion?.remove();
      companion = document.createElement("section");
      companion.id = COMPANION_ID;
      companion.setAttribute("aria-label", "Codex 伙伴");
      companion.innerHTML = `
        <div class="qq-skin-companion-title">
          <span>Codex 伙伴</span><button type="button" data-room-action="settings" aria-label="伙伴房间设置">⚙</button><i></i>
        </div>
        <div class="qq-skin-companion-stage">
          <div class="qq-skin-room-window" data-room-action="window" role="button" tabindex="0" aria-label="切换窗外时间">
            <span class="qq-skin-room-sky"></span>
            <span class="qq-skin-room-moon"></span>
            <span class="qq-skin-room-cloud qq-skin-room-cloud-a"></span>
            <span class="qq-skin-room-cloud qq-skin-room-cloud-b"></span>
          </div>
          <div class="qq-skin-room-wall-note" aria-hidden="true"><b>CODEX</b><span>BUILD · TEST · SHIP</span></div>
          <div class="qq-skin-room-shelf" data-room-action="blindbox" role="button" tabindex="0" aria-label="抽一个项目盲盒">
            <i></i><i></i><i></i><b></b>
          </div>
          <div class="qq-skin-room-lamp" data-room-action="blindbox" role="button" tabindex="0" aria-label="抽一个项目盲盒"><i></i><b></b></div>
          <div class="qq-skin-room-character" data-room-action="robot" role="button" tabindex="0" aria-label="和 Codex 伙伴互动">
            <img class="qq-skin-pet-image" alt="" draggable="false">
            <span class="qq-skin-room-approval-sign">需要确认</span>
          </div>
          <div class="qq-skin-room-drawn-book" aria-hidden="true"><i></i><b>?</b></div>
          <div class="qq-skin-room-monitor" data-room-action="blindbox" role="button" tabindex="0" aria-label="抽一个项目盲盒">
            <i class="qq-skin-room-screen"><b>&gt;_</b><span></span></i>
            <i class="qq-skin-room-monitor-stand"></i>
          </div>
          <div class="qq-skin-room-desk" aria-hidden="true">
            <span class="qq-skin-room-keyboard" data-room-action="terminal" role="button" tabindex="0" aria-label="打开终端"></span>
            <span class="qq-skin-room-mug" data-room-action="break" role="button" tabindex="0" aria-label="开始五分钟休息"></span>
          </div>
          <div class="qq-skin-room-plant" data-room-action="blindbox" role="button" tabindex="0" aria-label="抽一个项目盲盒"><i></i><i></i><i></i><b></b></div>
          <div class="qq-skin-room-decor qq-skin-room-decor-globe" data-room-decor="globe" aria-hidden="true">◉</div>
          <div class="qq-skin-room-decor qq-skin-room-decor-rocket" data-room-decor="rocket" aria-hidden="true">▲</div>
          <div class="qq-skin-room-decor qq-skin-room-decor-trophy" data-room-decor="trophy" aria-hidden="true">★</div>
          <div class="qq-skin-room-decor qq-skin-room-decor-cat" data-room-decor="cat" aria-hidden="true">ฅ</div>
          <div class="qq-skin-room-confetti" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="qq-skin-room-offline" aria-hidden="true">Z z z</div>
          <div class="qq-skin-room-toast" aria-live="polite"></div>
          <div class="qq-skin-room-panel">
            <div class="qq-skin-room-panel-head"><button type="button" data-room-action="back">‹</button><b></b></div>
            <div class="qq-skin-room-panel-content"></div>
          </div>
        </div>
        <div class="qq-skin-companion-actions">
          <button type="button" data-companion-action="pet">🐾 打开宠物</button>
          <button type="button" data-companion-action="terminal">⌨ 终端</button>
          <button type="button" data-companion-action="sound"></button>
        </div>
        <div class="qq-skin-pet-status"><i></i><span>在线 · 随时待命</span><b class="qq-skin-weekly-usage">本周剩余 --</b></div>`;
      document.body.appendChild(companion);
      companionParts = null;
    }
    if (companion.dataset) {
      companion.dataset.roomPhase = companionRoomPhase();
      companion.dataset.roomMode = companionRoomMode;
      try { companion.dataset.roomMotion = window.localStorage?.getItem("codex-qq-skin-room-motion") === "off" ? "off" : "on"; }
      catch { companion.dataset.roomMotion = "on"; }
    }
    if (!companionParts || companionParts.companion !== companion) {
      companionParts = {
        companion,
        image: companion.querySelector(".qq-skin-pet-image"),
        petButton: companion.querySelector('[data-companion-action="pet"]'),
        terminalButton: companion.querySelector('[data-companion-action="terminal"]'),
        soundButton: companion.querySelector('[data-companion-action="sound"]'),
        statusText: companion.querySelector(".qq-skin-pet-status span"),
        weeklyUsage: companion.querySelector(".qq-skin-weekly-usage"),
        panel: companion.querySelector(".qq-skin-room-panel"),
        panelTitle: companion.querySelector(".qq-skin-room-panel-head b"),
        panelContent: companion.querySelector(".qq-skin-room-panel-content"),
        toast: companion.querySelector(".qq-skin-room-toast"),
      };
      const bindAction = (button, action, label) => {
        if (!button?.dataset || button.dataset.qqCompanionBound === "true" || typeof button.addEventListener !== "function") return;
        button.dataset.qqCompanionBound = "true";
        button.setAttribute?.("aria-label", label);
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          action();
        });
      };
      bindAction(companionParts.petButton, openAvatarOverlay, "打开 Codex 宠物");
      bindAction(companionParts.terminalButton, toggleNativeTerminal, "显示或隐藏终端");
      if (companion.dataset.qqRoomBound !== "true" && typeof companion.addEventListener === "function") {
        companion.dataset.qqRoomBound = "true";
        companion.addEventListener("click", (event) => {
          const target = event.target?.closest?.("[data-room-action]");
          if (!target) return;
          event.preventDefault();
          event.stopPropagation();
          handleCompanionRoomAction(target.dataset.roomAction);
        });
        companion.addEventListener("keydown", (event) => {
          if (!["Enter", " "].includes(event.key)) return;
          const target = event.target?.closest?.("[data-room-action]");
          if (!target) return;
          event.preventDefault();
          handleCompanionRoomAction(target.dataset.roomAction);
        });
      }
    }
    if (companionParts.image && companionParts.image.src !== petUrl) companionParts.image.src = petUrl;
    soundMonitor.bindButton(companionParts.soundButton);
    soundMonitor.bindStatus(syncCompanionStatus);
    syncCompanionStatus(soundMonitor.status);
    syncWeeklyUsage(companionParts.weeklyUsage);
    syncBlindBoxDecor();
    renderCompanionRoomPanel();
    return companion;
  };

  const ensureRightTray = () => {
    let tray = document.getElementById(RIGHT_TRAY_ID);
    if (!tray || tray.parentElement !== document.body) {
      tray?.remove();
      tray = document.createElement("div");
      tray.id = RIGHT_TRAY_ID;
      tray.setAttribute("aria-hidden", "true");
      document.body.appendChild(tray);
    }
    return tray;
  };

  const formatTokenCount = (value) => {
    const number = Math.max(0, Number(value) || 0);
    if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(number >= 10_000_000_000 ? 0 : 1)}B`;
    if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(number >= 100_000_000 ? 0 : 1)}M`;
    if (number >= 1_000) return `${(number / 1_000).toFixed(number >= 100_000 ? 0 : 1)}K`;
    return String(Math.round(number));
  };

  const setUsageMode = (mode) => {
    usageMode = mode === "native" ? "native" : "stats";
    try { window.localStorage?.setItem(USAGE_MODE_KEY, usageMode); } catch {}
    const root = document.documentElement;
    setAttribute(root, "data-qq-usage-mode", usageMode);
    document.getElementById(USAGE_PANEL_ID)?.classList?.toggle("is-visible", usageMode === "stats");
    document.getElementById(USAGE_TOGGLE_ID)?.classList?.toggle("is-visible", usageMode === "native");
  };

  const visibleUsageTokens = (value) => {
    const effective = Math.max(0, Number(value?.effectiveTokens) || 0);
    if (usageNetMode) return effective;
    const total = Number(value?.totalTokens);
    return Number.isFinite(total) && total >= 0
      ? total
      : effective + Math.max(0, Number(value?.cachedInputTokens) || 0);
  };

  const setUsageNetMode = (enabled) => {
    usageNetMode = Boolean(enabled);
    try { window.localStorage?.setItem(USAGE_NET_MODE_KEY, String(usageNetMode)); } catch {}
    renderUsageSnapshot();
  };

  const renderUsageSnapshot = () => {
    const parts = usageParts;
    if (!parts?.panel) return;
    const snapshot = usageSnapshot && typeof usageSnapshot === "object" ? usageSnapshot : { status: "error" };
    const status = ["loading", "indexing", "empty", "ready", "error"].includes(snapshot.status)
      ? snapshot.status : "error";
    if (parts.panel.dataset) parts.panel.dataset.usageStatus = status;
    setAttribute(document.documentElement, "data-qq-usage-state", status);

    const totals = snapshot.totals || {};
    const lifetime = totals.lifetime || {};
    const growth = snapshot.growth || {};
    setTextContent(parts.today, formatTokenCount(visibleUsageTokens(totals.today)));
    setTextContent(parts.week, formatTokenCount(visibleUsageTokens(totals.week)));
    setTextContent(parts.lifetime, formatTokenCount(visibleUsageTokens(lifetime)));
    setTextContent(parts.level, `Lv.${Math.max(0, Math.round(Number(growth.level) || 0))}`);
    if (parts.icons) {
      const icons = Array.isArray(growth.icons) && growth.icons.length
        ? growth.icons.slice(0, 12)
        : [{ kind: "empty", symbol: "☆" }];
      parts.icons.innerHTML = icons.map((item) =>
        `<i data-kind="${["crown", "sun", "moon", "star"].includes(item.kind) ? item.kind : "empty"}">${item.symbol || "☆"}</i>`
      ).join("");
    }
    const remaining = Math.max(0, Number(growth.remaining) || 0);
    setTextContent(parts.progressText, growth.level == null
      ? "正在计算成长值"
      : `距离 Lv.${Math.max(0, Math.round(Number(growth.level) || 0)) + 1} 还差 ${remaining.toFixed(remaining % 1 ? 2 : 0)} 成长值`);
    parts.progressFill?.style?.setProperty?.("width", `${clamp(Math.round(Number(growth.percent) || 0), 0, 100)}%`);
    setTextContent(parts.activity,
      `活跃 ${Math.max(0, Number(snapshot.activity?.activeDays) || 0)} 天 · 连续 ${Math.max(0, Number(snapshot.activity?.streakDays) || 0)} 天`);
    setTextContent(parts.breakdown,
      `输入 ${formatTokenCount(lifetime.inputTokens)} · 输出 ${formatTokenCount(lifetime.outputTokens)} · 推理 ${formatTokenCount(lifetime.reasoningOutputTokens)} · 缓存 ${formatTokenCount(lifetime.cachedInputTokens)}`);
    if (parts.netToggle) {
      setAttribute(parts.netToggle, "aria-checked", usageNetMode ? "true" : "false");
      setAttribute(parts.netToggle, "title", usageNetMode
        ? "当前已排除缓存 Token，点击切换为总用量"
        : "当前包含缓存 Token，开启后只看净用量");
      parts.netToggle.classList?.toggle?.("is-on", usageNetMode);
    }

    if (parts.chart) {
      const chart = Array.isArray(snapshot.chart) ? snapshot.chart.slice(-7) : [];
      const maximum = Math.max(1, ...chart.map(visibleUsageTokens));
      parts.chart.innerHTML = chart.length
        ? chart.map((item) => {
          const value = visibleUsageTokens(item);
          const height = value > 0 ? Math.max(9, Math.round(value / maximum * 100)) : 4;
          const day = String(item?.date || "").slice(5);
          return `<i style="--usage-bar:${height}%" title="${day} · ${formatTokenCount(value)} token"><span></span></i>`;
        }).join("")
        : "<i style=\"--usage-bar:4%\"><span></span></i>".repeat(7);
    }

    let message = "";
    if (status === "loading") message = "正在读取本地 Codex 统计…";
    else if (status === "indexing") {
      const completed = Number(snapshot.indexing?.completed) || 0;
      const total = Number(snapshot.indexing?.total) || 0;
      message = total ? `正在建立本地索引 ${completed}/${total}…` : "正在建立本地统计索引…";
    } else if (status === "empty") message = "完成一次 Codex 任务后，这里会出现 token 统计。";
    else if (status === "error") message = snapshot.totals
      ? "本次更新失败，正在显示上次的本地数据。"
      : "暂时无法读取本地统计，皮肤其他功能不受影响。";
    setTextContent(parts.message, message);
    parts.message?.classList?.toggle?.("is-visible", Boolean(message));
    const generated = snapshot.generatedAt ? new Date(snapshot.generatedAt) : null;
    const timeText = generated && !Number.isNaN(generated.getTime())
      ? generated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";
    setTextContent(parts.updated, `本机统计 · 更新于 ${timeText}`);
    if (parts.refreshButton) {
      parts.refreshButton.disabled = status === "loading" || status === "indexing";
      parts.refreshButton.textContent = status === "indexing" ? "索引中" : "刷新";
    }
  };

  const setUsageSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== "object" || Number(snapshot.schemaVersion) !== 1) return false;
    usageSnapshot = snapshot;
    window.__CODEX_QQ_SKIN_USAGE_SNAPSHOT__ = snapshot;
    renderUsageSnapshot();
    return true;
  };

  const setCompanionSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== "object" || Number(snapshot.schemaVersion) !== 1) return false;
    companionSnapshot = snapshot;
    window.__CODEX_QQ_SKIN_COMPANION_SNAPSHOT__ = snapshot;
    renderCompanionRoomPanel();
    return true;
  };

  const ensureUsagePanel = () => {
    let panel = document.getElementById(USAGE_PANEL_ID);
    if (!panel || panel.parentElement !== document.body) {
      panel?.remove();
      panel = document.createElement("section");
      panel.id = USAGE_PANEL_ID;
      panel.setAttribute("aria-label", "Codex 成长中心");
      panel.innerHTML = `
        <div class="qq-skin-usage-title"><span>Codex 成长中心 <small>本机</small></span><button type="button" data-usage-action="native">资料</button></div>
        <div class="qq-skin-usage-level">
          <img alt="" draggable="false">
          <div class="qq-skin-usage-level-main"><b></b><span class="qq-skin-level-icons"></span><small></small></div>
          <button class="qq-skin-usage-net-toggle" type="button" role="switch" aria-checked="false" data-usage-action="net"><span>净用量</span><i></i></button>
        </div>
        <div class="qq-skin-level-progress"><i></i></div>
        <div class="qq-skin-usage-metrics">
          <div><b data-usage-metric="today">0</b><span>今日 Token</span></div>
          <div><b data-usage-metric="week">0</b><span>近 7 天</span></div>
          <div><b data-usage-metric="lifetime">0</b><span>历史累计</span></div>
        </div>
        <div class="qq-skin-usage-chart" aria-label="近七天 token 趋势"></div>
        <div class="qq-skin-usage-activity"></div>
        <div class="qq-skin-usage-breakdown"></div>
        <div class="qq-skin-usage-message"></div>
        <div class="qq-skin-usage-footer"><span></span><button type="button" data-usage-action="refresh">刷新</button></div>`;
      document.body.appendChild(panel);
      usageParts = null;
    }
    if (!usageParts || usageParts.panel !== panel) {
      usageParts = {
        panel,
        image: panel.querySelector(".qq-skin-usage-level img"),
        level: panel.querySelector(".qq-skin-usage-level-main b"),
        icons: panel.querySelector(".qq-skin-level-icons"),
        progressText: panel.querySelector(".qq-skin-usage-level-main small"),
        progressFill: panel.querySelector(".qq-skin-level-progress i"),
        today: panel.querySelector('[data-usage-metric="today"]'),
        week: panel.querySelector('[data-usage-metric="week"]'),
        lifetime: panel.querySelector('[data-usage-metric="lifetime"]'),
        chart: panel.querySelector(".qq-skin-usage-chart"),
        activity: panel.querySelector(".qq-skin-usage-activity"),
        breakdown: panel.querySelector(".qq-skin-usage-breakdown"),
        message: panel.querySelector(".qq-skin-usage-message"),
        updated: panel.querySelector(".qq-skin-usage-footer span"),
        nativeButton: panel.querySelector('[data-usage-action="native"]'),
        refreshButton: panel.querySelector('[data-usage-action="refresh"]'),
        netToggle: panel.querySelector('[data-usage-action="net"]'),
      };
      usageParts.nativeButton?.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUsageMode("native");
      });
      usageParts.refreshButton?.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        try { window.localStorage?.setItem(USAGE_REFRESH_KEY, String(Date.now())); } catch {}
        if (usageParts.refreshButton) {
          usageParts.refreshButton.disabled = true;
          usageParts.refreshButton.textContent = "刷新中";
        }
      });
      usageParts.netToggle?.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUsageNetMode(!usageNetMode);
      });
    }
    if (usageParts.image && usageParts.image.src !== qqAvatarUrl) usageParts.image.src = qqAvatarUrl;
    renderUsageSnapshot();

    let toggle = document.getElementById(USAGE_TOGGLE_ID);
    if (!toggle || toggle.parentElement !== document.body) {
      toggle?.remove();
      toggle = document.createElement("button");
      toggle.id = USAGE_TOGGLE_ID;
      toggle.type = "button";
      toggle.textContent = "成长统计";
      toggle.setAttribute("aria-label", "返回 Codex 成长统计");
      toggle.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUsageMode("stats");
      });
      document.body.appendChild(toggle);
    }
    setUsageMode(usageMode);
    return { panel, toggle };
  };

  const ensureHomePet = (home) => {
    let pet = document.getElementById(HOME_PET_ID);
    if (!home) {
      pet?.remove();
      return null;
    }
    // Prefer the marked stack (legacy first-child or Codex 26.721+ content column).
    const stack = home.querySelector(":scope > .qq-skin-home-stack, :scope > .dream-skin-home-stack") ||
      resolveHomeStack(home);
    const hero = stack?.querySelector(":scope > div:first-child > div:first-child");
    if (!hero) {
      pet?.remove();
      return null;
    }
    if (!pet || pet.parentElement !== hero) {
      pet?.remove();
      pet = document.createElement("img");
      pet.id = HOME_PET_ID;
      pet.className = "qq-skin-home-pet";
      pet.alt = "";
      pet.draggable = false;
      pet.setAttribute("aria-hidden", "true");
      hero.appendChild(pet);
    }
    if (pet.src !== petUrl) pet.src = petUrl;
    return pet;
  };

  /* Mark the shared nav-section-title row (toggle + …/+) so 置顶/项目/任务 bars
     all paint at the same width. The toggle itself sits in a narrower flex-1. */
  const ensureSidebarSectionBars = () => {
    const aside = document.querySelector("aside.app-shell-left-panel");
    const live = new Set();
    if (!aside) {
      document.querySelectorAll(".qq-skin-section-bar").forEach((node) =>
        node.classList.remove("qq-skin-section-bar"));
      return;
    }
    const asideWidth = typeof aside.getBoundingClientRect === "function"
      ? aside.getBoundingClientRect().width : 0;
    for (const toggle of aside.querySelectorAll("[data-app-action-sidebar-section-toggle]")) {
      const titled = toggle.closest('[class*="nav-section-title"]');
      let row = titled || toggle.parentElement;
      let best = row;
      while (row && aside.contains(row) && row !== aside) {
        const width = typeof row.getBoundingClientRect === "function"
          ? row.getBoundingClientRect().width : 0;
        if (width >= Math.max(asideWidth - 2, 0)) {
          // Prefer the titled row over the outer px-row-x padding wrapper when
          // both are full-bleed; painting px-row-x would cover the list below.
          if (!titled || row === titled || width < asideWidth) best = row;
          else best = titled;
          break;
        }
        if (
          width > 0 &&
          width >= (typeof best?.getBoundingClientRect === "function"
            ? best.getBoundingClientRect().width : 0)
        ) {
          best = row;
        }
        row = row.parentElement;
      }
      best = titled || best;
      if (!best || best === aside) continue;
      best.classList.add("qq-skin-section-bar");
      live.add(best);
    }
    for (const node of aside.querySelectorAll(".qq-skin-section-bar")) {
      if (!live.has(node)) node.classList.remove("qq-skin-section-bar");
    }
  };

  const findRetroTitle = () => {
    const header = document.querySelector("main.main-surface > header.app-header-tint");
    const preferred = header
      ? [...header.querySelectorAll("h1, h2, [data-testid*='title'], [class*='truncate']")]
      : [];
    for (const node of preferred) {
      const value = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (value.length >= 2 && value.length <= 80) return value;
    }
    return THEME.name || "经典 Codex 三栏";
  };

  const ensureRetroShell = () => {
    let retroShell = document.getElementById(RETRO_SHELL_ID);
    if (
      !retroShell || retroShell.parentElement !== document.body ||
      !retroShell.querySelector(".dream-retro-toolbar") ||
      !retroShell.querySelector('.dream-retro-toolbar button[data-retro-action="new-task"]') ||
      !retroShell.querySelector(".dream-retro-native-controls")
    ) {
      retroShell?.remove();
      retroShell = document.createElement("div");
      retroShell.id = RETRO_SHELL_ID;
      retroShell.innerHTML = `
        <div class="dream-retro-titlebar">
          <img class="dream-retro-title-penguin" alt="" draggable="false">
          <strong></strong>
        </div>
        <div class="dream-retro-toolbar" role="toolbar" aria-label="Codex 快捷导航">
          <button type="button" data-retro-action="new-task">📝 新建任务</button>
          <button type="button" data-retro-action="scheduled">🗓 已安排</button><i></i>
          <button type="button" data-retro-action="plugins">🧩 插件</button>
          <button type="button" data-retro-action="skills">🛠 技能</button>
          <button type="button" data-retro-action="sites">🌐 站点</button>
          <button type="button" data-retro-action="pull-requests">↗ 拉取请求</button>
          <button type="button" data-retro-action="chat">💬 聊天</button>
          <span class="dream-retro-native-controls"></span>
        </div>
        <div class="dream-retro-body-frame"></div>`;
      document.body.appendChild(retroShell);
      retroShellParts = null;
    }
    if (!retroShellParts || retroShellParts.retroShell !== retroShell) {
      retroShellParts = {
        retroShell,
        title: retroShell.querySelector(".dream-retro-titlebar strong"),
        penguin: retroShell.querySelector(".dream-retro-title-penguin"),
        controls: retroShell.querySelector(".dream-retro-native-controls"),
      };
    }
    if (retroShellParts.penguin && retroShellParts.penguin.src !== qqAvatarUrl) {
      retroShellParts.penguin.src = qqAvatarUrl;
    }
    setTextContent(retroShellParts.title, `Qodex 2007`);
    return retroShell;
  };

  const retroActionMatchers = {
    "new-task": { text: /^(新建任务|new task)$/i },
    scheduled: { text: /^(已安排|scheduled)$/i },
    plugins: { text: /^(插件|plugins?)$/i },
    skills: { text: /^(技能|skills?)$/i },
    sites: { text: /^(站点|sites?)$/i },
    "pull-requests": { text: /^(拉取请求|pull requests?)$/i },
    chat: { text: /^(聊天|chat)$/i, aria: /^(quick chat|快速聊天|快捷聊天)$/i },
  };

  const findNativeRetroAction = (action) => {
    const matcher = retroActionMatchers[action];
    const isPluginTab = action === "plugins" || action === "skills";
    if (isPluginTab && matcher) {
      const tabs = [...document.querySelectorAll('div[role="group"] button')];
      const nativeTab = tabs.find((candidate) => {
        if (candidate.disabled || candidate.closest?.(`#${RETRO_SHELL_ID}`)) return false;
        const groupText = String(candidate.parentElement?.textContent || "").replace(/\s+/g, "").toLowerCase();
        const text = String(candidate.textContent || "").replace(/\s+/g, " ").trim();
        const box = candidate.getBoundingClientRect?.();
        return Boolean(
          box && box.width >= 8 && box.height >= 8 &&
          /插件|plugins?/.test(groupText) && /技能|skills?/.test(groupText) &&
          matcher.text?.test(text)
        );
      });
      if (nativeTab) return nativeTab;
      if (action === "skills") return null;
    }
    const root = document.querySelector("aside.app-shell-left-panel");
    if (!matcher || !root) return null;
    const candidates = [...root.querySelectorAll("button, a")];
    return candidates.find((candidate) => {
      if (candidate.disabled || candidate.closest?.(`#${RETRO_SHELL_ID}`)) return false;
      const text = String(candidate.textContent || "").replace(/\s+/g, " ").trim();
      const aria = String(candidate.getAttribute?.("aria-label") || "").trim();
      const box = candidate.getBoundingClientRect?.();
      if (!box || box.width < 8 || box.height < 8) return false;
      return Boolean(matcher.text?.test(text) || matcher.aria?.test(aria));
    }) || null;
  };

  const syncRetroToolbarActions = () => {
    const toolbar = document.querySelector(`#${RETRO_SHELL_ID} .dream-retro-toolbar`);
    if (!toolbar) return;
    for (const button of toolbar.querySelectorAll("button[data-retro-action]")) {
      const action = button.dataset.retroAction;
      const target = findNativeRetroAction(action);
      const fallback = action === "skills" ? findNativeRetroAction("plugins") : null;
      button.disabled = !(target || fallback);
      button.setAttribute("aria-disabled", target || fallback ? "false" : "true");
      if (button.dataset.retroActionBound === "true") continue;
      button.dataset.retroActionBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = findNativeRetroAction(action);
        if (current) {
          current.click();
          return;
        }
        if (action !== "skills") return;
        findNativeRetroAction("plugins")?.click();
        let attempts = 0;
        const openSkills = () => {
          const skills = findNativeRetroAction("skills");
          if (skills) {
            skills.click();
            return;
          }
          attempts += 1;
          if (attempts < 20) setTimeout(openSkills, 50);
        };
        setTimeout(openSkills, 50);
      });
    }
  };

  const syncRetroWindowControls = () => {
    for (const button of document.querySelectorAll(".dream-retro-window-control")) {
      button.classList.remove(
        "dream-retro-window-control", "dream-retro-control-summary",
        "dream-retro-control-bottom", "dream-retro-control-sidebar",
      );
    }
    const labels = [
      pinnedSummaryLabel,
      /^(toggle bottom panel visibility|切换底部面板显示|顯示\/隱藏底部面板)$/i,
      /^(toggle sidebar visibility|显示\/隐藏侧边栏|顯示\/隱藏側邊欄)$/i,
    ];
    const selected = [];
    for (const button of document.querySelectorAll('button[aria-label]')) {
      if (typeof button.closest === "function" && button.closest(`#${RETRO_SHELL_ID}`)) continue;
      if (typeof button.getBoundingClientRect !== "function") continue;
      const box = button.getBoundingClientRect();
      const label = button.getAttribute("aria-label") || "";
      if (
        box.width >= 20 && box.height >= 20 && box.x > window.innerWidth * .65 && box.y < 48 &&
        labels.some((pattern) => pattern.test(label))
      ) selected.push(button);
    }
    selected.sort((left, right) => left.getBoundingClientRect().x - right.getBoundingClientRect().x);
    const host = retroShellParts?.controls;
    if (!host?.dataset || typeof host.replaceChildren !== "function") return;
    const signature = selected.map((button) => button.getAttribute("aria-label") || "").join("|");
    if (host.dataset.controlSignature === signature) return;
    host.replaceChildren();
    host.dataset.controlSignature = signature;
    for (const original of selected) {
      const clone = original.cloneNode(true);
      clone.removeAttribute("id");
      clone.classList.add("dream-retro-cloned-control");
      clone.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        original.click();
      });
      host.appendChild(clone);
    }
  };

  const ensureRetroProfile = () => {
    document.getElementById(RETRO_PROFILE_ID)?.remove();
    document.querySelectorAll('.dream-retro-profile-host').forEach(node => node.classList.remove('dream-retro-profile-host'));
    return null;
  };

  const ensureStyle = (root) => {
    let style = document.getElementById(STYLE_ID);
    // Include the active product stylesheet only. Keeping custom-skin.css out of
    // QQ mode prevents leftover/ungated wallpaper rules from painting the upload.
    const modeRevision = `${STYLE_REVISION}:${skinMode}`;
    const nextText = skinMode === "custom"
      ? `${cssText}\n${customCssText}`
      : skinMode === "object-live"
        ? objectLiveCssText
      : skinMode === "qq"
        ? cssText
        : "";
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || root).appendChild(style);
    }
    if (style.dataset.dreamSkinStyleRevision !== modeRevision) {
      style.textContent = nextText;
    }
    style.dataset.dreamSkinVersion = VERSION;
    style.dataset.dreamSkinStyleRevision = modeRevision;
    return style;
  };

  const applyRootState = (root) => {
    metrics.rootPasses += 1;
    if (skinMode === "qq") forceNativeLightForQQ();
    else restoreNativeAppearance();
    ensureStyle(root);
    const shell = resolvedShell();
    setAttribute(root, SHELL_ATTR, shell);
    setAttribute(root, "data-dream-platform", /Win/i.test(window.navigator?.platform || window.navigator?.userAgent || "") ? "windows" : "other");
    // Hard-isolate art variables: never leave the other mode's wallpaper URL on :root.
    if (skinMode === "qq") {
      setStyleProperty(root, "--qq-skin-art", `url("${qqArtUrl}")`);
      setStyleProperty(root, "--dream-retro-frame", `url("${retroFrameUrl}")`);
      root.style.removeProperty("--dream-skin-art");
      setAttribute(root, "data-dream-deep-theme", "");
      root.style.removeProperty("--dream-deep-right");
      root.style.removeProperty("--dream-deep-sidebar");
      root.style.removeProperty("--dream-deep-watermark");
      root.style.removeProperty("--dream-deep-brand");
      root.style.removeProperty("--dream-deep-avatar");
      for (const name of THEME_VARIABLES.filter((value) => value.startsWith("--dream-deep-") && ![
        "--dream-deep-right", "--dream-deep-sidebar", "--dream-deep-watermark", "--dream-deep-brand", "--dream-deep-avatar",
      ].includes(value))) root.style.removeProperty(name);
    } else if (skinMode === "custom") {
      setStyleProperty(root, "--dream-skin-art", `url("${artUrl}")`);
      const deepActive = THEME.schemaVersion === 2 && THEME.kind === "deep-custom";
      setAttribute(root, "data-dream-deep-theme", deepActive ? "true" : "");
      if (deepActive) {
        const asset = (key, fallback = "") => deepThemeUrls[key] || (fallback ? deepThemeUrls[fallback] : "");
        const setAsset = (name, value) => value
          ? setStyleProperty(root, name, `url("${value}")`)
          : root.style.removeProperty(name);
        setAsset("--dream-deep-right", asset("foregroundRight"));
        setAsset("--dream-deep-sidebar", asset("sidebarCharacter"));
        setAsset("--dream-deep-watermark", asset("watermark", "brandEmblem"));
        setAsset("--dream-deep-brand", asset("brandEmblem", "watermark"));
        setAsset("--dream-deep-avatar", asset("avatar", "brandEmblem"));
        const foreground = THEME.layout?.foregroundRight || {};
        const sidebar = THEME.layout?.sidebarCharacter || {};
        const watermark = THEME.layout?.watermark || {};
        setStyleProperty(root, "--dream-deep-right-width", `${foreground.width ?? 520}px`);
        setStyleProperty(root, "--dream-deep-right-right", `${foreground.right ?? -24}px`);
        setStyleProperty(root, "--dream-deep-right-bottom", `${foreground.bottom ?? -120}px`);
        setStyleProperty(root, "--dream-deep-right-opacity", `${foreground.opacity ?? 1}`);
        setStyleProperty(root, "--dream-deep-sidebar-size", `${sidebar.size ?? 138}%`);
        setStyleProperty(root, "--dream-deep-sidebar-y", `${sidebar.positionY ?? 22}%`);
        setStyleProperty(root, "--dream-deep-sidebar-opacity", `${sidebar.opacity ?? .075}`);
        setStyleProperty(root, "--dream-deep-watermark-width", `${watermark.width ?? 170}px`);
        setStyleProperty(root, "--dream-deep-watermark-x", `${watermark.positionX ?? 56}%`);
        setStyleProperty(root, "--dream-deep-watermark-y", `${watermark.positionY ?? 8}%`);
        setStyleProperty(root, "--dream-deep-watermark-opacity", `${watermark.opacity ?? .1}`);
        setStyleProperty(root, "--dream-deep-brand-title", cssString(THEME.brand?.title || "CODEX"));
        setStyleProperty(root, "--dream-deep-brand-subtitle", cssString(THEME.brand?.subtitle || "MORE THAN CODE"));
      } else {
        for (const name of THEME_VARIABLES.filter((value) => value.startsWith("--dream-deep-"))) {
          root.style.removeProperty(name);
        }
      }
      root.style.removeProperty("--qq-skin-art");
      root.style.removeProperty("--dream-retro-frame");
    } else {
      setAttribute(root, "data-dream-deep-theme", "");
      root.style.removeProperty("--qq-skin-art");
      root.style.removeProperty("--dream-skin-art");
      root.style.removeProperty("--dream-retro-frame");
      for (const name of THEME_VARIABLES.filter((value) => value.startsWith("--dream-deep-"))) {
        root.style.removeProperty(name);
      }
    }
    applyTheme(root, shell);
    applyArtMetadata(root);
    root.classList.toggle("codex-qq-skin", skinMode === "qq");
    root.classList.toggle("codex-dream-skin", skinMode === "custom");
    const objectLivePainted = skinMode === "object-live" &&
      root.getAttribute("data-qq-settings") !== "true";
    root.classList.toggle("codex-object-live", objectLivePainted);
    // Belt-and-suspenders: never allow both product skins on the same document.
    if (skinMode === "qq") root.classList.remove("codex-dream-skin");
    if (skinMode === "custom") root.classList.remove("codex-qq-skin");
    if (skinMode === "object-live") root.classList.remove("codex-qq-skin", "codex-dream-skin");
    return shell;
  };

  const removeQQDecorations = () => {
    document.getElementById(CHROME_ID)?.remove();
    document.getElementById(COMPANION_ID)?.remove();
    document.getElementById(USAGE_PANEL_ID)?.remove();
    document.getElementById(USAGE_TOGGLE_ID)?.remove();
    document.getElementById(HOME_PET_ID)?.remove();
    document.getElementById(RIGHT_TRAY_ID)?.remove();
    document.getElementById(RETRO_SHELL_ID)?.remove();
    document.getElementById(RETRO_PROFILE_ID)?.remove();
    document.querySelectorAll(".qq-skin-section-bar").forEach((node) => node.classList.remove("qq-skin-section-bar"));
    document.querySelectorAll(".dream-retro-profile-host").forEach((node) => node.classList.remove("dream-retro-profile-host"));
    document.querySelectorAll(".dream-retro-window-control").forEach((button) => button.classList.remove(
      "dream-retro-window-control", "dream-retro-control-summary",
      "dream-retro-control-bottom", "dream-retro-control-sidebar",
    ));
    companionParts = null;
    usageParts = null;
    chromeParts = null;
    retroProfileParts = null;
  };

  const syncRouteState = (shell, { layout = false } = {}) => {
    metrics.routePasses += 1;
    const root = document.documentElement;
    if (!root) return;
    shell ||= root.getAttribute(SHELL_ATTR) || resolvedShell();
    const shellMain = document.querySelector("main.main-surface") || document.querySelector("main");
    // The empty/new-task home renders progressively. In recent Codex builds
    // the suggestions row arrives after the composer, so requiring both made
    // Object Live look like a task page until the first message was sent.
    const homeSignals = [...document.querySelectorAll('[data-testid="home-icon"], [data-feature="game-source"], .home-banners')];
    const home = homeSignals.map(signal => signal.closest('[role="main"]')).find(visibleSurface) || null;
    for (const candidate of document.querySelectorAll('[role="main"].qq-skin-home')) {
      if (candidate !== home) candidate.classList.remove("qq-skin-home");
    }
    for (const candidate of document.querySelectorAll('[role="main"].dream-skin-home')) {
      if (candidate !== home) candidate.classList.remove("dream-skin-home");
    }
    if (home) {
      home.classList.toggle("qq-skin-home", skinMode === "qq");
      home.classList.toggle("dream-skin-home", skinMode === "custom");
    }
    setAttribute(root, "data-object-live-home",
      skinMode === "object-live" && Boolean(home) ? "true" : "false");
    syncObjectLiveVoiceRoute();
    syncHomeLayoutMarks(home);
    const homeUtilityBars = new Set(home
      ? home.querySelectorAll('[class*="_homeUtilityBar_"]')
      : []);
    for (const candidate of document.querySelectorAll(".qq-skin-home-utility")) {
      if (!homeUtilityBars.has(candidate)) candidate.classList.remove("qq-skin-home-utility");
    }
    for (const candidate of document.querySelectorAll(".dream-skin-home-utility")) {
      if (!homeUtilityBars.has(candidate)) candidate.classList.remove("dream-skin-home-utility");
    }
    for (const candidate of homeUtilityBars) {
      candidate.classList.toggle("qq-skin-home-utility", skinMode === "qq");
      candidate.classList.toggle("dream-skin-home-utility", skinMode === "custom");
    }

    // Detect settings before any early-return so neon-storm can fall back to
    // native Codex chrome even when the settings shell has no main.main-surface.
    const settingsRoute = (() => {
      const byPlaceholder = [...document.querySelectorAll("input[placeholder], input[type='search']")].some((input) => {
        const placeholder = input.getAttribute("placeholder") || "";
        const aria = input.getAttribute("aria-label") || "";
        if (!/(settings|设置|設定|搜索)/i.test(`${placeholder} ${aria}`)) return false;
        // Settings search is typically in the left rail.
        const box = typeof input.getBoundingClientRect === "function" ? input.getBoundingClientRect() : null;
        return !box || (box.width > 40 && box.height > 10 && box.left < 420);
      });
      if (byPlaceholder && document.body?.innerText && /(个人资料|Profile).{0,40}(外观|Appearance)/i.test(document.body.innerText.slice(0, 2500))) {
        return true;
      }
      if (/settings/i.test(`${window.location?.pathname || ""}${window.location?.hash || ""}${window.location?.search || ""}`)) {
        return true;
      }
      const nav = document.querySelector("aside.app-shell-left-panel") || document.querySelector("aside");
      const navText = String(nav?.innerText || "").replace(/\s+/g, " ");
      if (/(常规|General).{0,120}(个人资料|Profile).{0,120}(外观|Appearance)/i.test(navText)) return true;
      if (/(常规|General).{0,80}(外观|Appearance).{0,160}(语音|Voice|声音|通知)/i.test(navText)) return true;
      // Visible settings section titles in the main pane.
      const headings = [...document.querySelectorAll("h1,h2,h3")].map((el) => (el.textContent || "").trim());
      if (headings.includes("常规") || headings.includes("General")) {
        if (/(权限|Permissions|默认文件打开目标)/i.test(document.body?.innerText || "")) return true;
      }
      return false;
    })();
    setAttribute(root, "data-qq-settings", settingsRoute ? "true" : "");
    root.classList.toggle(
      "codex-object-live",
      skinMode === "object-live" && !settingsRoute,
    );
    if (settingsRoute) {
      // Force Codex-native settings chrome: drop neon weather + deep wallpaper attrs.
      root.removeAttribute("data-qq-weather");
      if (root.getAttribute("data-dream-deep-theme") === "true") {
        root.setAttribute("data-dream-deep-theme-paused", "true");
        root.removeAttribute("data-dream-deep-theme");
      }
      try {
        root.style.removeProperty("--dream-skin-art");
        root.style.removeProperty("--dream-deep-right");
        root.style.removeProperty("--dream-deep-sidebar");
      } catch {}
    } else if (root.getAttribute("data-dream-deep-theme-paused") === "true") {
      root.setAttribute("data-dream-deep-theme", "true");
      root.removeAttribute("data-dream-deep-theme-paused");
    }

    // Object Live owns only the wallpaper stage and the native title-bar
    // selector. Falling through to the QQ route below used to construct the
    // complete QQ chrome, companion and ResizeObserver target, only for
    // ensure() to remove them again in the same pass. That create/remove loop
    // kept layout and style recalculation running near frame rate.
    if (skinMode === "object-live") {
      removeQQDecorations();
      if (observedShellMain) {
        resizeObserver?.disconnect();
        observedShellMain = null;
      }
      ensureToggleButton();
      return;
    }

    if (!shellMain || !document.body) {
      if (skinMode === "custom") {
        // Toggle first — recreating it would wipe the rain-audio sibling button.
        ensureToggleButton();
        weatherMonitor.ensure();
        weatherMonitor.syncAudioUi?.();
      }
      return;
    }
    shellMain.classList.toggle("qq-skin-home-shell", Boolean(home) && skinMode === "qq");
    shellMain.classList.toggle("dream-skin-home-shell", Boolean(home) && skinMode === "custom");

    if (skinMode === "custom") {
      removeQQDecorations();
      setAttribute(root, "data-dream-three-pane", "false");
      setAttribute(root, "data-dream-summary-state", "unavailable");
      ensureToggleButton();
      weatherMonitor.ensure();
      weatherMonitor.syncAudioUi?.();
      return;
    }
    weatherMonitor.destroy();
    ensureRetroShell();
    syncRetroToolbarActions();
    syncRetroWindowControls();
    ensureRetroProfile();
    ensureToggleButton();
    if (observedShellMain !== shellMain) {
      resizeObserver?.disconnect();
      resizeObserver?.observe(shellMain);
      observedShellMain = shellMain;
      layout = true;
    }
    ensureHomePet(home);
    ensureSidebarSectionBars();
    const companion = ensureCompanion();
    const usageUi = ensureUsagePanel();
    const leftSidebarToggle = findLeftSidebarToggle();
    const leftSidebarLabel = leftSidebarToggle?.getAttribute("aria-label") || "";
    let leftSidebarOpen = hideSidebarLabel.test(leftSidebarLabel) ||
      (!leftSidebarToggle && Boolean(document.querySelector("aside.app-shell-left-panel")));
    const summaryToggle = findPinnedSummaryToggle();
    // LAYOUT changes when the segmented control switches modes. Derive these
    // values on every route pass instead of freezing the startup theme's
    // custom `off` layout for the lifetime of the renderer.
    const layoutMode = LAYOUT.mode === "off" ? "off" : "classic-three-pane";
    const layoutMinWidth = typeof LAYOUT.minWidth === "number"
      ? clamp(Math.round(LAYOUT.minWidth), 1080, 2400) : 1180;
    const layoutRightWidth = typeof LAYOUT.rightWidth === "number"
      ? clamp(Math.round(LAYOUT.rightWidth), 272, 360) : 300;
    const shouldAutoOpenSummary = LAYOUT.rightPanel !== "remember";
    const wideEnough = window.innerWidth >= layoutMinWidth;
    const taskRoute = !home && !settingsRoute && Boolean(shellMain);
    setAttribute(root, "data-dream-task-route", taskRoute ? "true" : "false");
    const visibleThreadFooters = [...document.querySelectorAll(
      'main.main-surface [data-pip-obstacle="thread-footer"]',
    )].filter((footer) => {
      const box = footer.getBoundingClientRect?.();
      return box && box.width > 8 && box.height > 8;
    });
    setAttribute(root, "data-dream-side-task", visibleThreadFooters.length >= 2 ? "open" : "closed");
    const layoutBaseEligible = layoutMode === "classic-three-pane" &&
      !home && taskRoute && wideEnough;
    if (
      layoutBaseEligible && showSidebarLabel.test(leftSidebarLabel) &&
      !autoOpenedSidebarToggles.has(leftSidebarToggle) && typeof leftSidebarToggle.click === "function"
    ) {
      autoOpenedSidebarToggles.add(leftSidebarToggle);
      leftSidebarToggle.click();
      leftSidebarOpen = true;
    }
    const layoutEligible = layoutBaseEligible && leftSidebarOpen && Boolean(summaryToggle);
    let autoOpening = false;
    if (
      layoutEligible && shouldAutoOpenSummary && summaryToggle.getAttribute("aria-pressed") !== "true" &&
      !autoOpenedSummaryToggles.has(summaryToggle) && typeof summaryToggle.click === "function"
    ) {
      autoOpenedSummaryToggles.add(summaryToggle);
      autoOpening = true;
      summaryToggle.click();
    }
    const summaryOpen = layoutEligible &&
      (autoOpening || summaryToggle?.getAttribute("aria-pressed") === "true");
    setAttribute(root, "data-dream-three-pane", summaryOpen ? "true" : "false");
    setAttribute(root, "data-dream-left-sidebar", leftSidebarOpen ? "open" : "closed");
    setAttribute(root, "data-dream-summary-state", summaryOpen ? "open" : (layoutEligible ? "closed" : "unavailable"));
    setStyleProperty(root, "--dream-three-pane-min-width", `${layoutMinWidth}px`);
    setStyleProperty(root, "--dream-right-panel-width", `${layoutRightWidth}px`);
    const summaryCandidates = summaryOpen ? [...document.querySelectorAll(
      '[data-codexgf-role="summary-panel"], [data-slot="thread-summary-panel"], ' +
      '[data-pip-obstacle="thread-summary-panel"], [data-testid="thread-summary-panel"]',
    )] : [];
    if (summaryOpen && summaryCandidates.length === 0) {
      const legacySummary = document.querySelector('[data-pip-obstacle="thread-summary-panel"]');
      if (legacySummary) summaryCandidates.push(legacySummary);
    }
    const environmentHeading = [...document.querySelectorAll("header,h1,h2,h3,[role='heading']")].find((node) =>
      /^(环境信息|Environment)$/i.test(String(node.textContent || "").trim()) && (() => {
        const box = node.getBoundingClientRect?.();
        return box && box.width > 8 && box.height > 8;
      })());
    let summarySurface = environmentHeading?.closest?.("[class*='rounded-3xl']") || null;
    if (!summarySurface && environmentHeading) {
      summarySurface = [environmentHeading, ...(() => {
        const ancestors = [];
        let node = environmentHeading.parentElement;
        while (node && ancestors.length < 7) { ancestors.push(node); node = node.parentElement; }
        return ancestors;
      })()].find((candidate) => {
        const box = candidate.getBoundingClientRect?.();
        return box && box.width >= 272 && box.width <= 420 && box.height > 120;
      }) || null;
    }
    if (summarySurface && !summaryCandidates.includes(summarySurface)) summaryCandidates.push(summarySurface);
    const visibleSummaryPanels = summaryCandidates.map((candidate) => ({
      candidate,
      box: candidate.getBoundingClientRect?.(),
    })).filter(({ candidate, box }) => {
      const style = typeof getComputedStyle === "function" ? getComputedStyle(candidate) : null;
      return box && box.width > 8 && box.height > 8 && style?.display !== "none";
    }).sort((left, right) => {
      if (left.candidate === summarySurface) return -1;
      if (right.candidate === summarySurface) return 1;
      return right.box.right - left.box.right;
    });
    const summaryPanel = visibleSummaryPanels[0]?.candidate || null;
    const summaryPanelBox = visibleSummaryPanels[0]?.box || null;
    for (const candidate of summaryCandidates) {
      candidate.toggleAttribute?.("data-codexgf-active-summary", candidate === summaryPanel);
      candidate.querySelectorAll?.("[data-codexgf-source-section]").forEach((node) =>
        node.removeAttribute("data-codexgf-source-section"));
    }
    if (summaryPanel) {
      summaryPanel.setAttribute?.("data-codexgf-role", "summary-panel");
      const sourceLabels = typeof summaryPanel.querySelectorAll === "function"
        ? [...summaryPanel.querySelectorAll("h1,h2,h3,h4,[role='heading']")]
        : [];
      const sourceLabel = sourceLabels.find((node) =>
        /^(来源|Sources?)$/i.test(String(node.textContent || "").trim()));
      const sourceSection = sourceLabel?.closest("section") || sourceLabel?.parentElement;
      sourceSection?.setAttribute?.("data-codexgf-source-section", "true");
    }
    const rightTray = ensureRightTray();
    if (summaryPanel && typeof summaryPanel.getBoundingClientRect === "function") {
      const summaryBox = summaryPanelBox;
      const summaryWidth = layoutRightWidth;
      if (summaryWidth >= 272 && summaryWidth <= 420) {
        setStyleProperty(root, "--dream-summary-panel-width", `${summaryWidth}px`);
      }
      // Paint a wider blue tray behind Output/Source + companion, inset from the
      // window chrome and extending from the title bar down to the bottom edge.
      const trayPad = 14;
      const panelRight = Math.max(8, Math.round(window.innerWidth - summaryBox.right));
      const panelLeft = Math.max(0, Math.round(window.innerWidth - panelRight - summaryWidth));
      const trayLeft = Math.max(0, panelLeft - trayPad);
      const trayRight = Math.max(6, panelRight - trayPad);
      const trayWidth = Math.max(summaryWidth + trayPad * 2, Math.round(window.innerWidth - trayLeft - trayRight));
      setStyleProperty(rightTray, "left", `${trayLeft}px`);
      setStyleProperty(rightTray, "right", `${trayRight}px`);
      setStyleProperty(rightTray, "width", `${trayWidth}px`);
      setStyleProperty(root, "--dream-right-tray-inset", `${trayPad}px`);
      setStyleProperty(root, "--dream-right-panel-right", `${panelRight}px`);
      setStyleProperty(usageUi.panel, "left", `${panelLeft}px`);
      setStyleProperty(usageUi.panel, "top", `${Math.round(summaryBox.top)}px`);
      setStyleProperty(usageUi.panel, "width", `${summaryWidth}px`);
      setStyleProperty(usageUi.panel, "height", `${Math.round(summaryBox.height)}px`);
      setStyleProperty(companion, "right", `${panelRight}px`);
      setStyleProperty(companion, "width", `${summaryWidth}px`);
      setStyleProperty(usageUi.toggle, "right", `${panelRight + 10}px`);
      setStyleProperty(usageUi.toggle, "top", `${Math.round(summaryBox.top) + 8}px`);
      rightTray.classList.add("is-visible");
    } else {
      rightTray.classList.remove("is-visible");
      root.style.removeProperty("--dream-right-panel-right");
      companion.style.removeProperty("right");
      companion.style.removeProperty("width");
    }
    // The summary and generic sidebar controls can briefly report the same
    // pressed state. Show the companion only while the summary is visible.
    companion.classList.toggle("is-visible", Boolean(summaryPanel));
    usageUi.panel.classList.toggle("is-available", Boolean(summaryPanel));
    usageUi.toggle.classList.toggle("is-available", Boolean(summaryPanel));
    setUsageMode(usageMode);
    let chrome = document.getElementById(CHROME_ID);
    let created = false;
    if (!chrome || chrome.parentElement !== document.body) {
      chrome?.remove();
      chrome = document.createElement("div");
      chrome.id = CHROME_ID;
      chrome.setAttribute("aria-hidden", "true");
      chrome.innerHTML = `
        <div class="qq-skin-brand">
          <span class="qq-skin-portal-mark">◉</span>
          <span><b></b><small></small></span>
        </div>
        <div class="qq-skin-status"><i></i><span></span></div>
        <div class="qq-skin-quote"></div>
        <div class="qq-skin-particles"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="qq-skin-orbit"></div>`;
      document.body.appendChild(chrome);
      created = true;
      chromeParts = null;
    }
    if (!chromeParts || chromeParts.chrome !== chrome) {
      chromeParts = {
        chrome,
        name: chrome.querySelector(".qq-skin-brand b"),
        subtitle: chrome.querySelector(".qq-skin-brand small"),
        status: chrome.querySelector(".qq-skin-status span"),
        quote: chrome.querySelector(".qq-skin-quote"),
      };
    }
    setTextContent(chromeParts.name, THEME.name || "Codex QQ Skin");
    setTextContent(chromeParts.subtitle, THEME.brandSubtitle || "CODEX QQ SKIN");
    setTextContent(chromeParts.status, THEME.statusText || "QQ SKIN ONLINE");
    setTextContent(chromeParts.quote, THEME.quote || "MAKE SOMETHING WONDERFUL");
    if (layout || created) {
      metrics.layoutReads += 1;
      const shellBox = shellMain.getBoundingClientRect();
      setStyleProperty(chrome, "left", `${Math.round(shellBox.left)}px`);
      setStyleProperty(chrome, "top", `${Math.round(shellBox.top)}px`);
      setStyleProperty(chrome, "width", `${Math.round(shellBox.width)}px`);
      setStyleProperty(chrome, "height", `${Math.round(shellBox.height)}px`);
    }
    chrome.classList.toggle("qq-skin-home-shell", Boolean(home));
    if (chrome.dataset.dreamShell !== shell) {
      chrome.dataset.dreamShell = shell;
      metrics.attributeWrites += 1;
    }
  };

  let objectLiveParts = null;
  let objectLiveStatus = "idle";
  let objectLiveTaskLayout = "corner";
  try {
    const savedObjectLiveLayout = window.localStorage?.getItem(OBJECT_LIVE_LAYOUT_KEY);
    if (savedObjectLiveLayout === "immersive" || savedObjectLiveLayout === "corner") {
      objectLiveTaskLayout = savedObjectLiveLayout;
    }
  } catch {}
  let objectLiveCharacterState = "";
  let objectLiveCharacterVariant = "";
  const objectLiveVideoHistory = new Map();
  let objectLiveCharacterSwapTimer = null;
  let objectLiveLaunchTimer = null;
  let objectLiveSpeechTimer = null;
  let objectLiveTranscriptTimer = null;
  let objectLiveLastNativeCopy = "";
  let objectLiveNativeLiveActive = false;
  let objectLiveNativePresence = null;
  let objectLiveNativePresenceLastSeenAt = 0;
  let objectLiveNativePresenceLastStatus = null;
  let objectLiveNativeAbsenceSince = 0;
  let objectLiveVoiceSurfaceLastSeenAt = 0;
  let objectLiveNativeLaunchPendingUntil = 0;
  const OBJECT_LIVE_PRESENCE_GRACE_MS = 1800;
  const OBJECT_LIVE_ROUTE_GRACE_MS = 1200;
  const OBJECT_LIVE_LAUNCH_TIMEOUT_MS = 10000;
  let objectLiveVoiceAudioMonitor = null;
  const titlebarAttach = { timer: null };

  const objectLiveCopy = {
    idle: {
      eyebrow: "随时待命",
      title: "面对她，说出你想完成的开发任务。",
      detail: "左侧保留 Codex 导航；角色负责沟通，Codex 负责真正的代码工作。",
      subtitle: "晚上好。直接告诉我，你想把哪个想法变成现实。",
      core: "开始对话",
      progress: "7%",
    },
    listening: {
      eyebrow: "正在聆听",
      title: "我在听。你可以像对同事一样自然地说。",
      detail: "再次点击结束，识别结果会在发送前让你确认。",
      subtitle: "我在听。",
      core: "结束聆听",
      progress: "14%",
    },
    thinking: {
      eyebrow: "正在思考",
      title: "我正在把你的话整理成可执行的开发任务。",
      detail: "Codex Live 正在建立实时会话，角色状态会随任务继续变化。",
      subtitle: "稍等，我正在理解上下文。",
      core: "正在连接",
      progress: "20%",
    },
    speaking: {
      eyebrow: "准备任务",
      title: "先确认你的原话，再把任务交给 Codex。",
      detail: "语音不会绕过 Codex 的权限和审批机制。",
      subtitle: "确认无误后，我会把这条指令交给当前 Codex 任务。",
      core: "继续说",
      progress: "24%",
    },
    running: {
      eyebrow: "Codex 正在执行",
      title: "角色退到背景，真实开发任务正在进行。",
      detail: "你仍然可以使用左侧任务列表切换上下文。",
      subtitle: "我正在跟进文件、命令和测试状态。",
      core: "查看任务",
      progress: "58%",
    },
    approval: {
      eyebrow: "等待授权",
      title: "执行已暂停，需要由你决定是否继续。",
      detail: "Object Live 只代理你明确点击的原生审批按钮。",
      subtitle: "这里需要你的确认。我不会替你自动授权。",
      core: "需要确认",
      progress: "68%",
    },
    completed: {
      eyebrow: "任务完成",
      title: "Codex 已经结束本轮执行。",
      detail: "打开工作镜头查看结果，或继续通过语音提出调整。",
      subtitle: "本轮任务已经完成。你可以继续让我调整。",
      core: "继续对话",
      progress: "100%",
    },
    offline: {
      eyebrow: "连接中断",
      title: "当前处于离线状态。",
      detail: "项目和历史仍在本机，恢复连接后可以继续。",
      subtitle: "网络连接中断了。我会保留当前上下文。",
      core: "离线",
      progress: "18%",
    },
  };

  const setObjectLiveTaskLayout = (layout, { persist = true } = {}) => {
    objectLiveTaskLayout = layout === "immersive" ? "immersive" : "corner";
    const root = document.documentElement;
    if (root) setAttribute(root, "data-object-live-layout", objectLiveTaskLayout);
    if (persist) {
      try { window.localStorage?.setItem(OBJECT_LIVE_LAYOUT_KEY, objectLiveTaskLayout); } catch {}
    }
    for (const button of objectLiveParts?.layoutButtons || []) {
      const selected = button.dataset.objectLiveLayout === objectLiveTaskLayout;
      button.setAttribute?.("aria-pressed", selected ? "true" : "false");
    }
  };

  const findNativeApprovalAction = (intent = "approve") => {
    const approvePattern = /^(allow once|approve)(\b.*)?$|^yes,? (allow|proceed)$|^run( command)?$|^continue$|^允许(一次|本次|此操作)?$|^批准(一次|本次)?$|^同意$|^授权$|^运行(命令)?$|^继续执行$/i;
    const rejectPattern = /^(deny|reject|cancel|not now|no)$|^拒绝$|^取消$|^先不要$|^暂不$/i;
    const pattern = intent === "approve" ? approvePattern : rejectPattern;
    return [...document.querySelectorAll('button, [role="button"]')].find((button) => {
      if (button.closest?.(`#${OBJECT_LIVE_ID}`) || button.disabled) return false;
      const turn = button.closest?.('[data-turn-key], [data-testid*="approval" i]');
      if (!turn) return false;
      const label = String(
        button.getAttribute?.("aria-label") || button.getAttribute?.("title") || button.textContent || "",
      ).replace(/\s+/g, " ").trim();
      return pattern.test(label);
    }) || null;
  };

  const findNativeComposer = () => {
    const candidates = [...document.querySelectorAll(
      '[contenteditable="true"], textarea, [role="textbox"]',
    )].filter((node) => !node.closest?.(`#${OBJECT_LIVE_ID}`));
    return candidates.find((node) => node.closest?.("main.main-surface")) || candidates.at(-1) || null;
  };

  const writeNativeComposer = (text) => {
    const composer = findNativeComposer();
    if (!composer || !text.trim()) return false;
    composer.focus?.();
    if ("value" in composer) {
      composer.value = text.trim();
      composer.dispatchEvent?.(new window.Event("input", { bubbles: true }));
      composer.dispatchEvent?.(new window.Event("change", { bubbles: true }));
    } else {
      composer.textContent = text.trim();
      composer.dispatchEvent?.(new window.InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: text.trim(),
      }));
    }
    return true;
  };

  const findNativeSendButton = () => [...document.querySelectorAll('button, [role="button"]')]
    .find((button) => {
      if (button.closest?.(`#${OBJECT_LIVE_ID}`) || button.disabled) return false;
      const label = String(button.getAttribute?.("aria-label") || button.getAttribute?.("title") || "")
        .replace(/\s+/g, " ").trim();
      return /^(send|submit|发送|提交)( message| prompt|消息|提示)?$/i.test(label);
    }) || null;

  const findNativeVoiceButton = () => [...document.querySelectorAll('button, [role="button"]')]
    .find((button) => {
      if (button.closest?.(`#${OBJECT_LIVE_ID}`) || button.disabled) return false;
      const label = String(
        button.getAttribute?.("aria-label") || button.getAttribute?.("title") || button.textContent || "",
      ).replace(/\s+/g, " ").trim();
      return /^(start new voice chat|start voice chat|toggle voice chat|开始新的语音聊天|开始语音聊天|切换语音聊天)$/i
        .test(label);
    }) || null;

  const objectLiveVideoStateFor = (status) => ({
    idle: "idle",
    listening: "listening",
    thinking: "thinking",
    speaking: "speaking",
    running: "acting",
    approval: "approval",
    completed: "done",
    offline: "idle",
  })[status] || "idle";

  const bundledObjectLiveVideoPools = {
    idle: [
      { key: "idle", weight: 1 },
      { key: "speaking-confident", weight: 1 },
      { key: "speaking-curious", weight: 1 },
      { key: "speaking-happy", weight: 1 },
      { key: "speaking-playful", weight: 1 },
      { key: "speaking-surprised", weight: 1 },
      { key: "speaking-warm", weight: 1 },
    ],
    listening: [
      { key: "listening-focus", weight: 45 },
      { key: "listening-nod", weight: 35 },
      { key: "listening", weight: 20 },
    ],
    thinking: [{ key: "thinking", weight: 1 }],
    // The current generated speaking variants start from different resting
    // poses. Rotating them during one reply makes continuous speech visibly
    // jump through preparation gestures. Keep one stable clip looping until
    // the replacement set shares a common speaking anchor pose.
    speaking: [{ key: "speaking-neutral", weight: 1 }],
    acting: [
      { key: "speaking-confident", weight: 1 },
      { key: "speaking-curious", weight: 1 },
      { key: "speaking-happy", weight: 1 },
      { key: "speaking-playful", weight: 1 },
      { key: "speaking-surprised", weight: 1 },
      { key: "speaking-warm", weight: 1 },
    ],
    approval: [{ key: "approval", weight: 1 }],
    done: [
      { key: "done-soft", weight: 48 },
      { key: "done-confirm", weight: 42 },
      { key: "done", weight: 10 },
    ],
  };
  const objectLiveVideoPools = OBJECT_LIVE_CHARACTER_CONFIG.builtin ? bundledObjectLiveVideoPools
    : Object.fromEntries(["idle", "listening", "thinking", "speaking", "acting", "approval", "done"]
      .map((state) => [state, [{ key: state, weight: 1 }]]));

  const pickObjectLiveVideo = (state) => {
    const available = (objectLiveVideoPools[state] || [{ key: state, weight: 1 }])
      .filter(({ key }) => objectLiveStateVideoUrls[key]);
    if (!available.length) {
      return { key: state, url: objectLiveStateVideoUrls[state] || objectLiveCharacterUrl, poolSize: 1 };
    }
    const history = objectLiveVideoHistory.get(state) || [];
    const recent = new Set(history.slice(-2));
    let candidates = available.filter(({ key }) => !recent.has(key));
    if (!candidates.length) candidates = available.filter(({ key }) => key !== objectLiveCharacterVariant);
    if (!candidates.length) candidates = available;
    const total = candidates.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * total;
    const selected = candidates.find((item) => ((cursor -= item.weight) <= 0)) || candidates.at(-1);
    objectLiveVideoHistory.set(state, [...history, selected.key].slice(-4));
    return { key: selected.key, url: objectLiveStateVideoUrls[selected.key], poolSize: available.length };
  };

  const setObjectLiveCharacterState = (status, { immediate = false, rotate = false } = {}) => {
    const state = objectLiveVideoStateFor(status);
    const videos = objectLiveParts?.characterVideos || [];
    if (!videos.length) return;
    if (OBJECT_LIVE_CHARACTER_CONFIG.mode === "static") {
      objectLiveCharacterState = state;
      objectLiveCharacterVariant = "poster";
      objectLiveParts?.stage?.classList.remove("has-ready-video");
      for (const video of videos) {
        video.pause?.();
        video.removeAttribute?.("src");
        video.classList.remove("is-active", "is-current", "is-next", "is-ready");
      }
      return;
    }
    if (state === objectLiveCharacterState && !immediate && !rotate) {
      const current = videos.find((video) => video.classList.contains("is-current"))
        || videos.find((video) => video.classList.contains("is-active"))
        || videos[0];
      // Electron can suspend a muted background video during a route/window
      // transition. A stable task state used to return here forever, leaving
      // the character frozen on one frame until the next status change.
      if (current.paused || current.ended) {
        if (current.ended || current.currentTime >= current.duration - .08) current.currentTime = .02;
        current.play?.().catch?.(() => {});
      }
      return;
    }
    const selected = pickObjectLiveVideo(state);
    const nextUrl = selected.url;
    objectLiveCharacterState = state;
    objectLiveCharacterVariant = selected.key;
    const current = videos.find((video) => video.classList.contains("is-current"))
      || videos.find((video) => video.classList.contains("is-active"))
      || videos[0];
    const next = immediate ? current : (videos.find((video) => video !== current) || current);
    if (objectLiveCharacterSwapTimer) clearTimeout(objectLiveCharacterSwapTimer);
    next.classList.remove("is-ready");
    next.classList.add("is-active", immediate ? "is-current" : "is-next");
    next.muted = true;
    next.loop = selected.poolSize <= 1;
    next.playsInline = true;
    next.onended = null;
    if (next.src !== nextUrl) {
      next.src = nextUrl;
      next.load?.();
    }
    const revealDecodedFrame = () => {
      next.play?.().catch?.(() => {});
      objectLiveParts?.stage?.classList.add("has-ready-video");
      next.onended = () => {
        if (objectLiveCharacterState === state) {
          setObjectLiveCharacterState(objectLiveStatus, { rotate: true });
        }
      };
      if (immediate || next === current) {
        next.classList.add("is-ready", "is-current");
        return;
      }
      next.classList.add("is-ready");
      objectLiveCharacterSwapTimer = setTimeout(() => {
        current.classList.remove("is-active", "is-current", "is-next", "is-ready");
        current.pause?.();
        next.classList.remove("is-next");
        next.classList.add("is-current");
        objectLiveCharacterSwapTimer = null;
      }, 420);
    };
    const waitForFrame = () => {
      if (next.currentTime < .01) next.currentTime = .02;
      next.play?.().catch?.(() => {});
      if (typeof next.requestVideoFrameCallback === "function") {
        next.requestVideoFrameCallback(revealDecodedFrame);
      } else {
        setTimeout(revealDecodedFrame, 100);
      }
    };
    if (next.readyState >= 2) waitForFrame();
    else next.addEventListener("loadeddata", waitForFrame, { once: true });
    if (objectLiveParts?.stage?.dataset) {
      objectLiveParts.stage.dataset.videoState = state;
      objectLiveParts.stage.dataset.videoVariant = selected.key;
    }
  };

  const syncObjectLiveTranscript = (rawText) => {
    const text = String(rawText || "")
      .replace(/\b(stop voice chat|end voice chat|mute|unmute|thinking|speaking|listening)\b/gi, " ")
      .replace(/(结束语音聊天|停止语音聊天|静音|取消静音|正在思考|正在聆听)/g, " ")
      .replace(/\s+/g, " ").trim();
    const useful = text.length > 2 ? text.slice(-520) : "";
    if (!useful) return;
    objectLiveLastNativeCopy = useful;
  };

  const isNativeLivePresence = (value) =>
    value && typeof value === "object" &&
    typeof value.phase === "string" && typeof value.activity === "string" &&
    ("sessionId" in value || "preferredPresentationSurface" in value);

  const findNativeLivePresence = () => {
    const orb = document.querySelector(
      '[data-testid="realtime-voice-stage-orb"], [data-realtime-voice-orb="true"]',
    );
    if (!orb) return null;
    const fiberKey = Object.keys(orb).find((key) => key.startsWith("__reactFiber$"));
    let fiber = fiberKey ? orb[fiberKey] : null;
    for (let depth = 0; fiber && depth < 40; depth += 1, fiber = fiber.return) {
      const props = fiber.memoizedProps;
      const candidates = [
        props,
        props?.presence,
        props?.snapshot,
        props?.children?.props?.presence,
        props?.children?.props?.snapshot,
      ];
      if (Array.isArray(props?.children)) {
        for (const child of props.children) {
          candidates.push(child?.props?.presence, child?.props?.snapshot);
        }
      }
      const presence = candidates.find(isNativeLivePresence);
      if (presence) {
        return {
          activity: String(presence.activity),
          microphoneMuted: Boolean(presence.microphoneMuted),
          outputMuted: Boolean(presence.outputMuted),
          phase: String(presence.phase),
          preferredPresentationSurface: presence.preferredPresentationSurface == null
            ? null : String(presence.preferredPresentationSurface),
          sessionActive: Boolean(presence.sessionId),
        };
      }
    }
    return null;
  };

  const objectLiveStatusForNativePresence = (presence) => {
    if (!presence) return null;
    if (presence.phase === "failed") return "offline";
    if (presence.phase === "starting") return "thinking";
    if (presence.phase === "stopping" || presence.phase === "inactive") return "idle";
    if (presence.phase !== "active") return null;
    return presence.activity === "speaking" ? "speaking" : "listening";
  };

  const nativeLiveSurface = () => {
    const orb = document.querySelector(
      '[data-testid="realtime-voice-stage-orb"], [data-realtime-voice-orb="true"]',
    );
    if (orb) return { active: true, node: orb };
    const controls = [...document.querySelectorAll('button, [role="button"]')]
      .filter((button) => !button.closest?.(`#${OBJECT_LIVE_ID}`));
    const active = controls.find((button) =>
      /^(stop voice chat|end voice chat|leave voice chat|停止实时语音|结束语音聊天|停止语音聊天|结束对话|退出语音|关闭实时语音)$/i.test(
        String(button.getAttribute?.("aria-label") || button.getAttribute?.("title") || button.textContent || "").trim(),
      ));
    if (active) return { active: true, node: active };
    const launch = controls.find((button) =>
      /^(start voice chat|start realtime voice|启动实时语音|开始实时语音|开始语音聊天)$/i.test(
        String(button.getAttribute?.("aria-label") || button.getAttribute?.("title") || button.textContent || "").trim(),
      ));
    return launch ? { active: false, node: launch } : null;
  };

  const markNativeLiveSurface = (surface) => {
    for (const node of document.querySelectorAll("[data-object-live-native-surface]")) {
      node.removeAttribute("data-object-live-native-surface");
    }
    if (!surface?.active || !surface.node) return;
    let node = surface.node;
    for (let depth = 0; node && depth < 18; depth += 1, node = node.parentElement) {
      if (node === document.body || node.id === "root") break;
      node.setAttribute?.("data-object-live-native-surface", "true");
      if (node.matches?.("main.main-surface")) break;
    }
  };

  const syncObjectLiveVoiceRoute = (surface = nativeLiveSurface()) => {
    const now = Date.now();
    if (surface) objectLiveVoiceSurfaceLastSeenAt = now;
    const visible = skinMode === "object-live" && (
      Boolean(surface) || now - objectLiveVoiceSurfaceLastSeenAt < OBJECT_LIVE_ROUTE_GRACE_MS
    );
    const root = document.documentElement;
    if (root) setAttribute(root, "data-object-live-voice", visible ? "true" : "false");
    markNativeLiveSurface(surface);
    return surface;
  };

  const setObjectLiveSignalDiagnostics = (source, presence = null) => {
    const stage = objectLiveParts?.stage;
    if (!stage?.dataset) return;
    setAttribute(stage, "data-live-signal-source", source);
    if (presence) {
      setAttribute(stage, "data-native-live-phase", presence.phase);
      setAttribute(stage, "data-native-live-activity", presence.activity);
    } else {
      if (stage.hasAttribute("data-native-live-phase")) stage.removeAttribute("data-native-live-phase");
      if (stage.hasAttribute("data-native-live-activity")) stage.removeAttribute("data-native-live-activity");
    }
  };

  const scanNativeLiveSurface = () => {
    if (skinMode !== "object-live" || !objectLiveParts?.stage) return;
    const now = Date.now();
    const surface = syncObjectLiveVoiceRoute();
    const presence = findNativeLivePresence();
    const preciseStatus = objectLiveStatusForNativePresence(presence);
    if (presence && preciseStatus) {
      objectLiveNativePresence = presence;
      objectLiveNativePresenceLastSeenAt = now;
      objectLiveNativePresenceLastStatus = preciseStatus;
      objectLiveNativeAbsenceSince = 0;
      objectLiveNativeLaunchPendingUntil = 0;
      objectLiveNativeLiveActive = !["idle", "offline"].includes(preciseStatus);
      setObjectLiveSignalDiagnostics("react-presence", presence);
      syncObjectLiveStatus(preciseStatus);
      return;
    }
    if (!objectLiveNativeAbsenceSince) objectLiveNativeAbsenceSince = now;
    const withinPresenceGrace = Boolean(objectLiveNativePresence && objectLiveNativePresenceLastStatus) &&
      now - objectLiveNativePresenceLastSeenAt < OBJECT_LIVE_PRESENCE_GRACE_MS;
    if (withinPresenceGrace) {
      objectLiveNativeLiveActive = !["idle", "offline"].includes(objectLiveNativePresenceLastStatus);
      setObjectLiveSignalDiagnostics("react-presence-grace", objectLiveNativePresence);
      syncObjectLiveStatus(objectLiveNativePresenceLastStatus);
      return;
    }
    if (now < objectLiveNativeLaunchPendingUntil) {
      objectLiveNativeLiveActive = true;
      setObjectLiveSignalDiagnostics("launch-pending");
      syncObjectLiveStatus("thinking");
      return;
    }
    objectLiveNativePresence = null;
    objectLiveNativePresenceLastStatus = null;
    if (surface?.active) {
      objectLiveNativeLiveActive = true;
      setObjectLiveSignalDiagnostics("dom-fallback");
      if (!["speaking", "thinking"].includes(objectLiveStatus)) syncObjectLiveStatus("listening");
      return;
    }
    if (surface) {
      objectLiveNativeLiveActive = false;
      setObjectLiveSignalDiagnostics("voice-page-idle");
      if (objectLiveStatus !== "idle") syncObjectLiveStatus("idle");
      return;
    }
    objectLiveNativeLiveActive = false;
    setObjectLiveSignalDiagnostics("task-fallback");
    if (["listening", "thinking", "speaking"].includes(objectLiveStatus)) {
      syncObjectLiveStatus(soundMonitor.status || "idle");
    }
  };

  const syncObjectLiveStatus = (status) => {
    if (skinMode !== "object-live") return;
    const nextStatus = objectLiveCopy[status] ? status : "idle";
    const stage = objectLiveParts?.stage;
    const stable = objectLiveStatus === nextStatus && stage?.dataset?.status === nextStatus;
    objectLiveStatus = nextStatus;
    if (["listening", "thinking", "speaking"].includes(objectLiveStatus)) {
      objectLiveNativeLiveActive = true;
    } else if (objectLiveStatus === "idle") {
      objectLiveNativeLiveActive = false;
    }
    if (!stage) return;
    // Keep the current video alive, but do not rewrite stable DOM state. A
    // same-value dataset assignment still produces a mutation record in
    // Chromium and used to feed the full renderer ensure loop.
    if (stable) {
      setObjectLiveCharacterState(objectLiveStatus);
      return;
    }
    setAttribute(stage, "data-status", objectLiveStatus);
    setObjectLiveCharacterState(objectLiveStatus);
    const hint = ({
      idle: "Codex Live", listening: "正在聆听", thinking: "正在连接",
      speaking: "正在说话", running: "正在执行", approval: "等待确认",
      completed: "已完成", offline: "连接失败 · 点击重试",
    })[objectLiveStatus] || "Codex Live";
    setTextContent(objectLiveParts.statusLabel, hint);
  };

  const handleObjectLiveMonitoredStatus = (status) => {
    if (status === "idle" && ["listening", "thinking", "speaking"].includes(objectLiveStatus)) return;
    if (
      document.documentElement?.getAttribute("data-object-live-voice") === "true" &&
      !objectLiveNativeLiveActive
    ) {
      if (objectLiveStatus !== "idle") syncObjectLiveStatus("idle");
      return;
    }
    syncObjectLiveStatus(status);
  };

  const scheduleObjectLiveSurfaceScan = ({ immediate = false } = {}) => {
    if (objectLiveTranscriptTimer) clearTimeout(objectLiveTranscriptTimer);
    const run = () => {
      objectLiveTranscriptTimer = null;
      if (skinMode !== "object-live" || !objectLiveParts?.stage) return;
      scanNativeLiveSurface();
      const voiceRoute = document.documentElement?.getAttribute("data-object-live-voice") === "true";
      objectLiveTranscriptTimer = setTimeout(run, voiceRoute ? 120 : 1000);
    };
    objectLiveTranscriptTimer = setTimeout(run, immediate ? 0 : 1000);
  };

  const installObjectLiveVoiceAudioMonitor = () => {
    if (objectLiveVoiceAudioMonitor) return objectLiveVoiceAudioMonitor;
    const monitoredTracks = new Map();
    const mediaPlaying = new Set();
    let silenceTimer = null;
    let rtcPrototype = null;
    let originalSetRemoteDescription = null;

    const enterSpeaking = () => {
      if (skinMode !== "object-live" || objectLiveNativePresence?.phase === "active") return;
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      objectLiveNativeLiveActive = true;
      setObjectLiveSignalDiagnostics("audio-fallback");
      syncObjectLiveStatus("speaking");
    };
    const returnToListening = () => {
      if (
        skinMode !== "object-live" || !objectLiveNativeLiveActive ||
        objectLiveNativePresence?.phase === "active"
      ) return;
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        silenceTimer = null;
        if (![...monitoredTracks.values()].some((entry) => entry.audible) && !mediaPlaying.size) {
          syncObjectLiveStatus("listening");
        }
      }, 320);
    };
    const monitorRemoteTrack = (track) => {
      if (!track || track.kind !== "audio" || monitoredTracks.has(track)) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (typeof AudioContextClass !== "function" || typeof window.MediaStream !== "function") return;
      let context;
      try {
        context = new AudioContextClass();
        const source = context.createMediaStreamSource(new window.MediaStream([track]));
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = .35;
        source.connect(analyser);
        const samples = new Float32Array(analyser.fftSize);
        const entry = { context, source, analyser, interval: null, audible: false, hot: 0, quiet: 0 };
        entry.interval = setInterval(() => {
          if (track.readyState === "ended") {
            clearInterval(entry.interval);
            entry.interval = null;
            entry.audible = false;
            returnToListening();
            return;
          }
          analyser.getFloatTimeDomainData(samples);
          let energy = 0;
          for (const sample of samples) energy += sample * sample;
          const rms = Math.sqrt(energy / samples.length);
          if (rms >= .011) {
            entry.hot += 1;
            entry.quiet = 0;
            if (!entry.audible && entry.hot >= 2) {
              entry.audible = true;
              enterSpeaking();
            }
          } else if (rms <= .0065) {
            entry.hot = 0;
            entry.quiet += 1;
            if (entry.audible && entry.quiet >= 5) {
              entry.audible = false;
              returnToListening();
            }
          }
        }, 64);
        track.addEventListener?.("ended", () => {
          entry.audible = false;
          returnToListening();
        }, { once: true });
        context.resume?.().catch?.(() => {});
        monitoredTracks.set(track, entry);
      } catch {
        try { context?.close?.(); } catch {}
      }
    };
    const bindPeer = (peer) => {
      if (!peer || peer.__codexObjectLiveAudioBound) return;
      try { peer.__codexObjectLiveAudioBound = true; } catch {}
      peer.addEventListener?.("track", (event) => monitorRemoteTrack(event.track));
      for (const receiver of peer.getReceivers?.() || []) monitorRemoteTrack(receiver.track);
    };
    const PeerConnectionClass = window.RTCPeerConnection;
    if (PeerConnectionClass?.prototype?.setRemoteDescription) {
      rtcPrototype = PeerConnectionClass.prototype;
      originalSetRemoteDescription = rtcPrototype.setRemoteDescription;
      rtcPrototype.setRemoteDescription = function (...args) {
        bindPeer(this);
        return originalSetRemoteDescription.apply(this, args);
      };
    }
    const isNativeReplyMedia = (media) =>
      media instanceof window.HTMLMediaElement &&
      !media.closest?.(`#${OBJECT_LIVE_ID}, #${WEATHER_ID}`) &&
      !media.muted && media.volume > 0;
    const onMediaPlay = (event) => {
      if (!objectLiveNativeLiveActive || !isNativeReplyMedia(event.target)) return;
      mediaPlaying.add(event.target);
      enterSpeaking();
    };
    const onMediaStop = (event) => {
      if (!isNativeReplyMedia(event.target)) return;
      mediaPlaying.delete(event.target);
      returnToListening();
    };
    document.addEventListener?.("playing", onMediaPlay, true);
    document.addEventListener?.("pause", onMediaStop, true);
    document.addEventListener?.("ended", onMediaStop, true);
    document.addEventListener?.("emptied", onMediaStop, true);

    objectLiveVoiceAudioMonitor = {
      cleanup() {
        if (silenceTimer) clearTimeout(silenceTimer);
        document.removeEventListener?.("playing", onMediaPlay, true);
        document.removeEventListener?.("pause", onMediaStop, true);
        document.removeEventListener?.("ended", onMediaStop, true);
        document.removeEventListener?.("emptied", onMediaStop, true);
        if (rtcPrototype && rtcPrototype.setRemoteDescription !== originalSetRemoteDescription) {
          rtcPrototype.setRemoteDescription = originalSetRemoteDescription;
        }
        for (const entry of monitoredTracks.values()) {
          if (entry.interval) clearInterval(entry.interval);
          try { entry.source?.disconnect?.(); } catch {}
          try { entry.context?.close?.(); } catch {}
        }
        monitoredTracks.clear();
        mediaPlaying.clear();
        objectLiveVoiceAudioMonitor = null;
      },
    };
    return objectLiveVoiceAudioMonitor;
  };

  const requestNativeLive = () => {
    if (objectLiveStatus === "listening") {
      try {
        window.localStorage?.setItem(NATIVE_LIVE_REQUEST_KEY, JSON.stringify({
          action: "toggle",
          requestedAt: Date.now(),
        }));
      } catch {}
      syncObjectLiveStatus("idle");
      return true;
    }
    objectLiveNativeLiveActive = true;
    objectLiveNativeLaunchPendingUntil = Date.now() + OBJECT_LIVE_LAUNCH_TIMEOUT_MS;
    syncObjectLiveStatus("thinking");
    try {
      window.localStorage?.setItem(NATIVE_LIVE_REQUEST_KEY, JSON.stringify({
        action: "toggle",
        requestedAt: Date.now(),
      }));
    } catch {
      syncObjectLiveStatus("offline");
      return false;
    }
    if (objectLiveLaunchTimer) clearTimeout(objectLiveLaunchTimer);
    objectLiveLaunchTimer = setTimeout(() => {
      objectLiveNativeLaunchPendingUntil = 0;
      if (objectLiveStatus === "thinking") {
        const surface = nativeLiveSurface();
        syncObjectLiveStatus(surface?.active ? "listening" : "offline");
      }
      objectLiveLaunchTimer = null;
    }, OBJECT_LIVE_LAUNCH_TIMEOUT_MS);
    return true;
  };

  const handleNativeLiveBridgeResult = (result) => {
    if (result === "dispatched") {
      objectLiveNativeLiveActive = true;
      objectLiveNativeLaunchPendingUntil = Date.now() + OBJECT_LIVE_LAUNCH_TIMEOUT_MS;
      syncObjectLiveStatus("thinking");
      return true;
    }
    syncObjectLiveStatus("offline");
    return false;
  };

  const reflectObjectLiveAppearance = (appearance) => {
    objectLiveAppearance = appearance === "light" ? "light" : "dark";
    const root = document.documentElement;
    if (root) setAttribute(root, "data-object-live-appearance", objectLiveAppearance);
    if (objectLiveParts?.stage?.dataset) objectLiveParts.stage.dataset.appearance = objectLiveAppearance;
    if (objectLiveParts?.control?.dataset) objectLiveParts.control.dataset.appearance = objectLiveAppearance;
    const skinToggle = document.getElementById(TOGGLE_ID);
    if (skinToggle && typeof syncToggleButton === "function") syncToggleButton(skinToggle);
    return objectLiveAppearance;
  };

  const requestObjectLiveCharacter = (id, preference = "selected") => {
    if (!/^builtin-(?:cyber|warm-white)-girlfriend$/.test(id || "")) return;
    try {
      window.localStorage?.setItem(CHARACTER_PREFERENCE_KEY, preference);
      window.localStorage?.setItem(CHARACTER_SWITCH_KEY, JSON.stringify({ id, requestedAt: Date.now() }));
      window.localStorage?.setItem(MODE_STORAGE_KEY, "object-live");
      window.localStorage?.setItem(ENABLED_STORAGE_KEY, "true");
    } catch {}
  };

  const followObjectLiveCharacterForShell = () => {
    if (objectLiveCharacterPreference !== "follow") return null;
    const shell = detectShellMode();
    reflectObjectLiveAppearance(shell);
    const desired = shell === "light" ? "builtin-warm-white-girlfriend" : "builtin-cyber-girlfriend";
    if (desired !== OBJECT_LIVE_CHARACTER_CONFIG.id && objectLiveFollowRequest !== desired) {
      objectLiveFollowRequest = desired;
      requestObjectLiveCharacter(desired, "follow");
    }
    return shell;
  };

  const detectObjectLivePosterAppearance = (image) => {
    const followed = followObjectLiveCharacterForShell();
    if (followed) return followed;
    if (requestedObjectLiveAppearance !== "auto") {
      return reflectObjectLiveAppearance(requestedObjectLiveAppearance);
    }
    if (!image?.naturalWidth || !image?.naturalHeight) return reflectObjectLiveAppearance(objectLiveAppearance);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 48;
      canvas.height = 27;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return reflectObjectLiveAppearance(objectLiveAppearance);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let opaquePixels = 0;
      let lumaTotal = 0;
      let brightPixels = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] < 32) continue;
        const luma = (pixels[index] * .2126 + pixels[index + 1] * .7152 + pixels[index + 2] * .0722) / 255;
        opaquePixels += 1;
        lumaTotal += luma;
        if (luma >= .72) brightPixels += 1;
      }
      if (!opaquePixels) return reflectObjectLiveAppearance("dark");
      const averageLuma = lumaTotal / opaquePixels;
      const brightRatio = brightPixels / opaquePixels;
      return reflectObjectLiveAppearance(averageLuma >= .62 || brightRatio >= .58 ? "light" : "dark");
    } catch {
      return reflectObjectLiveAppearance(objectLiveAppearance);
    }
  };

  const destroyObjectLiveStage = () => {
    if (objectLiveCharacterSwapTimer) clearTimeout(objectLiveCharacterSwapTimer);
    objectLiveCharacterSwapTimer = null;
    if (objectLiveLaunchTimer) clearTimeout(objectLiveLaunchTimer);
    objectLiveLaunchTimer = null;
    if (objectLiveSpeechTimer) clearTimeout(objectLiveSpeechTimer);
    objectLiveSpeechTimer = null;
    if (objectLiveTranscriptTimer) clearTimeout(objectLiveTranscriptTimer);
    objectLiveTranscriptTimer = null;
    objectLiveVoiceAudioMonitor?.cleanup?.();
    objectLiveLastNativeCopy = "";
    objectLiveNativeLiveActive = false;
    objectLiveNativePresence = null;
    objectLiveNativePresenceLastSeenAt = 0;
    objectLiveNativePresenceLastStatus = null;
    objectLiveNativeAbsenceSince = 0;
    objectLiveVoiceSurfaceLastSeenAt = 0;
    objectLiveNativeLaunchPendingUntil = 0;
    document.documentElement?.removeAttribute("data-object-live-voice");
    document.documentElement?.removeAttribute("data-object-live-layout");
    document.documentElement?.removeAttribute("data-object-live-appearance");
    for (const node of document.querySelectorAll("[data-object-live-native-surface]")) {
      node.removeAttribute("data-object-live-native-surface");
    }
    document.getElementById(OBJECT_LIVE_ID)?.remove();
    document.getElementById(OBJECT_LIVE_CONTROL_ID)?.remove();
    objectLiveParts = null;
    objectLiveCharacterState = "";
    objectLiveCharacterVariant = "";
    objectLiveVideoHistory.clear();
  };

  const ensureObjectLiveStage = ({ layout = true } = {}) => {
    const settingsRoute = document.documentElement?.getAttribute("data-qq-settings") === "true";
    if (skinMode !== "object-live" || settingsRoute) {
      destroyObjectLiveStage();
      return null;
    }
    reflectObjectLiveAppearance(objectLiveAppearance);
    followObjectLiveCharacterForShell();
    let stage = document.getElementById(OBJECT_LIVE_ID);
    if (!stage || stage.parentElement !== document.body) {
      stage?.remove();
      stage = document.createElement("section");
      stage.id = OBJECT_LIVE_ID;
      stage.setAttribute("aria-label", "Objective Live 动态任务壁纸");
      stage.innerHTML = `
        <div class="object-live-character-stack">
          <img class="object-live-character-poster" alt="" draggable="false">
          <video class="object-live-character is-active" autoplay muted loop playsinline preload="auto"></video>
          <video class="object-live-character" autoplay muted loop playsinline preload="auto"></video>
        </div>
        <div class="object-live-light"></div>
        <div class="object-live-vignette"></div>`;
      document.body.appendChild(stage);
      objectLiveParts = null;
    }
    let control = document.getElementById(OBJECT_LIVE_CONTROL_ID);
    if (!control || control.parentElement !== document.body) {
      control?.remove();
      control = document.createElement("div");
      control.id = OBJECT_LIVE_CONTROL_ID;
      control.className = "object-live-status-chip";
      control.innerHTML = `
          <span class="object-live-status"><i></i><span>Codex Live</span></span>
          <span class="object-live-layout-switch" role="group" aria-label="任务详情角色显示方式">
            <button type="button" data-object-live-layout="corner">角落</button>
            <button type="button" data-object-live-layout="immersive">沉浸</button>
          </span>`;
      document.body.appendChild(control);
      objectLiveParts = null;
    }
    if (!objectLiveParts || objectLiveParts.stage !== stage) {
      objectLiveParts = {
        stage,
        control,
        characterPoster: stage.querySelector(".object-live-character-poster"),
        characterVideos: [...stage.querySelectorAll(".object-live-character")],
        statusLabel: control.querySelector(".object-live-status > span"),
        layoutButtons: [...control.querySelectorAll("[data-object-live-layout]")],
      };
      if (objectLiveParts.characterPoster) {
        objectLiveParts.characterPoster.addEventListener?.("load", () => {
          detectObjectLivePosterAppearance(objectLiveParts?.characterPoster);
        });
        objectLiveParts.characterPoster.src = objectLiveCharacterUrl;
        if (objectLiveParts.characterPoster.complete) {
          detectObjectLivePosterAppearance(objectLiveParts.characterPoster);
        }
      }
      for (const button of objectLiveParts.layoutButtons) {
        button.addEventListener?.("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setObjectLiveTaskLayout(button.dataset.objectLiveLayout);
        });
      }
      scheduleObjectLiveSurfaceScan({ immediate: true });
      soundMonitor.bindStatus(handleObjectLiveMonitoredStatus);
    }
    setObjectLiveTaskLayout(objectLiveTaskLayout, { persist: false });
    installObjectLiveVoiceAudioMonitor();
    setObjectLiveCharacterState(objectLiveStatus, { immediate: !objectLiveCharacterState });
    if (layout) {
      const sidebar = document.querySelector("aside.app-shell-left-panel");
      const box = sidebar?.getBoundingClientRect?.();
      const left = box && box.width > 0 ? Math.max(0, Math.round(box.right)) : 0;
      stage.style.setProperty("--object-live-left", `${left}px`);
    }
    const monitoredStatus = soundMonitor.status || "idle";
    if (!objectLiveNativeLiveActive) syncObjectLiveStatus(monitoredStatus);
    return stage;
  };

  const visibleSurface = (node) => { const b = node?.getBoundingClientRect?.(); return b && b.width > 8 && b.height > 8 && getComputedStyle(node).visibility !== "hidden"; };
  let qodexLastSidebarOpen=0;
  const qodexEnhance = () => {
    const root=document.documentElement;
    const enabled=skinMode==='qq';
    document.querySelector('aside[class*="_LeftPanel_"]')?.classList.add('app-shell-left-panel');
    const pageTitle=document.querySelector('[class*="_ApplicationMenuPageHeader_"]')?.textContent?.trim()||'';
    const settings=/^(设置|Settings)(?:\s*[—·-].*)?$/.test(pageTitle)||[...document.querySelectorAll('h1')].some(n=>/^(设置|Settings)$/.test(n.textContent.trim()))||!!document.querySelector('[data-settings-page],[data-settings-section]');
    setAttribute(root,'data-qodex-settings',settings?'true':'false');
    const manager=enabled && !settings && sessionStorage.getItem('qodex-window-role')==='manager' && localStorage.getItem('qodex-manager-enabled')==='true';
    setAttribute(root,'data-qodex-manager',manager?'true':'false');
    setAttribute(root,'data-qodex-chat',enabled&&!manager&&!settings&&!location.search.includes('avatar-overlay')?'true':'false');
    setAttribute(root,'data-qodex-new-chat-pending',enabled&&!manager&&!settings&&!location.search.includes('initialRoute')&&sessionStorage.getItem('qodex-global-chat-ready')!=='true'?'true':'false');
    if(manager && Date.now()-qodexLastSidebarOpen>700){const reopen=document.querySelector('button[aria-label="显示侧边栏"]');if(reopen){qodexLastSidebarOpen=Date.now();reopen.click();}}

    const header=[...document.querySelectorAll('main > header.draggable')].find(n=>n.getBoundingClientRect().width>0);
    if(enabled){let brand=document.querySelector('.qodex-brand');if(!brand){brand=document.createElement('div');brand.className='qodex-brand';const img=document.createElement('img');img.src=qqAvatarUrl;img.alt='QQ';brand.appendChild(img);const text=document.createElement('span');text.textContent='Qodex 2007';brand.appendChild(text);document.body.appendChild(brand);}if(header)header.dataset.qodexTitle='true';}
    const menuBar=document.querySelector('[class*="_ApplicationMenuTopBar_"]');
    if(enabled&&menuBar){
      menuBar.dataset.qodexApplicationBar='true';
      const originalMenu=menuBar.querySelector('#application-menu-trigger-file-menu')?.parentElement;
      if(originalMenu){originalMenu.dataset.qodexNativeMenu='true';for(const button of originalMenu.querySelectorAll('button')){button.title=button.getAttribute('aria-label')||button.textContent;}}
      const brand=document.querySelector('.qodex-brand');if(brand){const text=brand.querySelector('span');const title=manager?'Qodex 2007':(!document.title||/^(ChatGPT|Codex)$/.test(document.title)?'新聊天':document.title);if(text&&text.textContent!==title)text.textContent=title;}
      for(const footer of document.querySelectorAll('[data-composer-footer-responsive]:has([data-codex-composer])')){
        let parent=footer.parentElement;for(let depth=0;parent&&depth<12;depth++,parent=parent.parentElement){parent.dataset.qodexComposerFrame='true';if(parent.hasAttribute('data-pip-obstacle'))break;}
        for(const button of footer.querySelectorAll('button')){const label=button.getAttribute('aria-label')||button.getAttribute('data-composer-navigation-target');if(label)button.title=label;
          if(button.getAttribute('aria-haspopup')==='menu'&&!button.dataset.qodexHover){button.dataset.qodexHover='true';button.addEventListener('pointerenter',()=>{clearTimeout(button.__qodexHoverTimer);button.__qodexHoverTimer=setTimeout(()=>{if(skinMode==='qq'&&button.matches(':hover')&&!button.disabled&&button.getAttribute('aria-disabled')!=='true'&&button.getAttribute('aria-expanded')!=='true'){button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,pointerType:'mouse'}));}},350);});button.addEventListener('pointerleave',()=>clearTimeout(button.__qodexHoverTimer));}}
      }
      let more=document.getElementById('qodex-application-menu');
      if(!more){more=document.createElement('button');more.id='qodex-application-menu';more.type='button';more.textContent='⋯';more.setAttribute('aria-label','应用菜单');more.addEventListener('click',event=>{event.stopPropagation();const open=root.getAttribute('data-qodex-menu-open')==='true';setAttribute(root,'data-qodex-menu-open',open?'false':'true');more.setAttribute('aria-expanded',open?'false':'true');});document.body.appendChild(more);}
    }
    if(!enabled){document.querySelectorAll('.qodex-brand,.qodex-message-heading,#qodex-application-menu,.qodex-send-empty').forEach(n=>n.remove());root.removeAttribute('data-qodex-menu-open');}
    if(enabled&&!manager&&!settings&&!document.querySelector('[data-response-annotation-conversation]')){
      const welcome=document.querySelector('[data-qodex-welcome]')||[...document.querySelectorAll('main h1,main h2,span.group\\/title')].find(n=>/我们要构建什么|你想让我们在.*构建什么/.test(n.textContent));
      if(welcome){welcome.dataset.qodexWelcome='true';const title=qqThemeConfig.quote||'搞么子';if(welcome.textContent!==title)welcome.textContent=title;
        let subtitle=document.getElementById('qodex-welcome-subtitle');if(!subtitle){subtitle=document.createElement('p');subtitle.id='qodex-welcome-subtitle';welcome.insertAdjacentElement('afterend',subtitle);}const text=qqThemeConfig.tagline||'';if(subtitle.textContent!==text)subtitle.textContent=text;
      }
    }
    if(enabled){
      for(const button of document.querySelectorAll('button[aria-label="发送"],button[aria-label="停止"]')){if(button.closest('[data-composer-footer-responsive]'))button.dataset.qodexAction='true';}
      for(const config of document.querySelectorAll('[data-composer-footer-responsive]:not(:has([data-codex-composer]))')){
        config.querySelectorAll('.qodex-send-empty').forEach(n=>n.remove());
        if(config.closest('[data-composer-rail-item]'))config.dataset.qodexContextFooter='true';
      }
      for(const footer of document.querySelectorAll('[data-composer-footer-responsive]:has([data-codex-composer])')){
        const composerRoot=footer.closest('[data-codex-composer-root]');
        const count=[...footer.querySelectorAll('button')].filter(b=>!['发送','停止'].includes(b.getAttribute('aria-label'))&&!b.classList.contains('qodex-send-empty')&&b.getBoundingClientRect().width>0).length;
        if(composerRoot){const f=footer.getBoundingClientRect(),r=composerRoot.getBoundingClientRect();composerRoot.style.setProperty('--qodex-context-left',(Math.max(f.left+6,...[...footer.querySelectorAll('button')].filter(b=>!b.dataset.qodexAction&&!b.classList.contains('qodex-send-empty')&&b.getBoundingClientRect().width>0).map(b=>b.getBoundingClientRect().right+10))-r.left)+'px');composerRoot.style.setProperty('--qodex-context-top',(f.top-r.top+parseFloat(getComputedStyle(footer).borderTopWidth||'0'))+'px');}
        const action=footer.querySelector('button[aria-label="发送"],button[aria-label="停止"]');let empty=footer.querySelector('.qodex-send-empty');
        if(action){empty?.remove();}else if(!empty){empty=document.createElement('button');empty.type='button';empty.className='qodex-send-empty';empty.textContent='发送';empty.disabled=true;empty.setAttribute('aria-label','发送（请输入消息）');footer.appendChild(empty);}
      }
      for(const node of document.querySelectorAll('[class~="group/user-message"],[data-response-annotation-target]')){
        const user=node.matches('[class~="group/user-message"]');
        let fiber=node[Object.keys(node).find(key=>key.startsWith('__reactFiber'))],stamp=null;
        for(let depth=0;fiber&&depth<18;depth++,fiber=fiber.return){
          const props=fiber.memoizedProps||{};
          if(Number.isFinite(props.sentAtMs)){stamp=props.sentAtMs;break;}
          if(Number.isFinite(props.item?.sentAtMs)){stamp=props.item.sentAtMs;break;}
          const turn=props.mcpTurn||props.turn;
          if(!user && turn){const messageId=node.getAttribute('data-response-annotation-target');const value=turn.aeonAssistantMessageStartedAtMsById?.[messageId]||turn.finalAssistantStartedAtMs;if(Number.isFinite(value)){stamp=value;break;}}
        }
        const time=stamp?new Date(stamp).toLocaleTimeString('zh-CN', {timeZone:'Australia/Adelaide',hour:'2-digit',minute:'2-digit',hour12:false}):'';
        setAttribute(node,'data-qodex-sender',(user?'我':'Qdex')+(time?'  '+time:''));
      }
    }
  };
  const qodexDoubleClickHandler = async (event) => {
    if(document.documentElement.getAttribute('data-qodex-manager')!=='true')return;
    const row=event.target.closest?.('[data-app-action-sidebar-thread-row]');
    if(!row){const project=event.target.closest?.('[data-app-action-sidebar-project-row]');if(project&&project.getAttribute('aria-expanded')==='false'){event.preventDefault();event.stopPropagation();project.click();}return;}
    event.preventDefault();event.stopImmediatePropagation();
    const threadId=row.getAttribute('data-app-action-sidebar-thread-id')?.split(':').at(-1);
    const live=JSON.parse(localStorage.getItem('qodex-live-chat-ids')||'[]');
    if(live.includes(threadId)){
      const token=Date.now()+':'+Math.random();localStorage.setItem('qodex-focus-request',JSON.stringify({threadId,token}));
      let missing=false;for(let retry=0;retry<40;retry++){await new Promise(resolve=>setTimeout(resolve,80));const ack=JSON.parse(localStorage.getItem('qodex-focus-ack')||'null');if(ack?.token===token){if(ack.ok)return;missing=true;break;}}
      if(!missing){console.warn('Qodex: existing window focus did not acknowledge; keeping the existing window.');return;}
    }
    let fiber=row[Object.keys(row).find(key=>key.startsWith('__reactFiber'))];
    for(let depth=0;fiber&&depth<24;depth++,fiber=fiber.return){
      const props=fiber.memoizedProps;
      if(typeof props?.getItems==='function'){
        const items=await props.getItems();
        const action=items.find(item=>item.id==='open-in-new-window');
        if(typeof action?.onSelect==='function'){action.onSelect();return;}
      }
    }
    console.warn('Qodex: native new-window action unavailable; use the row context menu.');
  };
  if(window.__QODEX_DOUBLECLICK_HANDLER__)document.removeEventListener('dblclick',window.__QODEX_DOUBLECLICK_HANDLER__,true);
  window.__QODEX_DOUBLECLICK_HANDLER__=qodexDoubleClickHandler;
  document.addEventListener('dblclick',qodexDoubleClickHandler,true);
  const qodexNewChatHandler = event => {
    if(document.documentElement.getAttribute('data-qodex-manager')!=='true')return;
    const button=event.target.closest?.('button');if(!button||button.textContent.trim()!=='新聊天')return;
    event.preventDefault();event.stopImmediatePropagation();
    localStorage.removeItem('qodex-new-chat-request');
    window.electronBridge?.sendMessageFromView?.({type:'open-in-new-window',path:'/'});
  };
  if(window.__QODEX_NEW_CHAT_HANDLER__)document.removeEventListener('click',window.__QODEX_NEW_CHAT_HANDLER__,true);
  window.__QODEX_NEW_CHAT_HANDLER__=qodexNewChatHandler;document.addEventListener('click',qodexNewChatHandler,true);
  const qodexMenuDismiss=event=>{if(!event.target.closest?.('#qodex-application-menu,[data-qodex-native-menu],[role="menu"],[role="menubar"],[data-radix-popper-content-wrapper]'))document.documentElement.removeAttribute('data-qodex-menu-open');};
  if(window.__QODEX_MENU_DISMISS__)document.removeEventListener('pointerdown',window.__QODEX_MENU_DISMISS__,true);
  window.__QODEX_MENU_DISMISS__=qodexMenuDismiss;document.addEventListener('pointerdown',qodexMenuDismiss,true);
  const ensure = ({ root: rootPass = true, route = true, layout = true } = {}) => {
    if (window[DISABLED_KEY]) return;
    const root = document.documentElement;
    if (!root) return;
    for (const role of Object.values(COMPATIBILITY_RULES.roles || {})) {
      for (const previous of document.querySelectorAll(`[data-codexgf-role="${role.dataRole}"]`)) { if (!visibleSurface(previous)) { previous.removeAttribute("data-codexgf-role"); if (role.addClass) previous.classList.remove(role.addClass); } }
      let node = null;
      for (const selector of role?.selectors || []) {
        try {
          const candidates = [...document.querySelectorAll(selector)];
          node = candidates.filter(candidate => role.dataRole !== "main-surface" || candidate.matches('main[class*="_MainContentSurface_"], main.main-surface')).find((candidate) => {
            const box = candidate.getBoundingClientRect?.();
            const style = typeof getComputedStyle === "function" ? getComputedStyle(candidate) : null;
            return (!box || (box.width > 8 && box.height > 8)) &&
              style?.display !== "none" && style?.visibility !== "hidden";
          }) || null;
        } catch {}
        if (node) break;
      }
      if (!node) continue;
      if (role.addClass) node.classList?.add?.(role.addClass);
      if (role.dataRole) node.setAttribute?.("data-codexgf-role", role.dataRole);
    }
    metrics.ensureCalls += 1;
    const shell = rootPass ? applyRootState(root) : null;
    soundMonitor.scan();
    // Route first so data-qq-settings / native settings chrome is decided
    // before the weather layer mounts or paints neon tokens.
    if (route) syncRouteState(shell, { layout });
    else {
      ensureToggleButton();
      weatherMonitor.ensure();
    }
    if (skinMode === "object-live") {
      weatherMonitor.destroy();
      removeQQDecorations();
      document.getElementById(USAGE_PANEL_ID)?.remove();
      document.getElementById(USAGE_TOGGLE_ID)?.remove();
      document.getElementById(RIGHT_TRAY_ID)?.remove();
      document.getElementById(CHROME_ID)?.remove();
      companionParts = null;
      usageParts = null;
      chromeParts = null;
    }
    if (weatherMonitor.active) weatherMonitor.setStatus(soundMonitor.status);
    ensureObjectLiveStage({ layout });
    qodexEnhance();
  };

  const removeSkinVisuals = () => {
    document.querySelectorAll(".qodex-brand,.qodex-message-heading,#qodex-application-menu").forEach(n=>n.remove());
    for(const name of ["data-qodex-manager","data-qodex-chat","data-qodex-menu-open"])document.documentElement.removeAttribute(name);
    weatherMonitor.destroy();
    const root = document.documentElement;
    root?.classList.remove("codex-qq-skin", "codex-dream-skin", "codex-object-live");
    root?.removeAttribute(SHELL_ATTR);
    for (const name of ART_ATTRS) root?.removeAttribute(name);
    root?.style.removeProperty("--qq-skin-art");
    root?.style.removeProperty("--dream-skin-art");
    for (const name of THEME_VARIABLES) root?.style.removeProperty(name);
    document.querySelectorAll(".qq-skin-home").forEach((node) => node.classList.remove("qq-skin-home"));
    document.querySelectorAll(".qq-skin-home-shell").forEach((node) => node.classList.remove("qq-skin-home-shell"));
    document.querySelectorAll(".qq-skin-home-utility").forEach((node) => node.classList.remove("qq-skin-home-utility"));
    document.querySelectorAll(".dream-skin-home").forEach((node) => node.classList.remove("dream-skin-home"));
    document.querySelectorAll(".dream-skin-home-shell").forEach((node) => node.classList.remove("dream-skin-home-shell"));
    document.querySelectorAll(".dream-skin-home-utility").forEach((node) => node.classList.remove("dream-skin-home-utility"));
    document.querySelectorAll(".qq-skin-home-stack, .dream-skin-home-stack").forEach((node) =>
      node.classList.remove("qq-skin-home-stack", "dream-skin-home-stack"));
    document.querySelectorAll(".qq-skin-section-bar").forEach((node) => node.classList.remove("qq-skin-section-bar"));
    root?.removeAttribute("data-qq-home-layout");
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(CHROME_ID)?.remove();
    document.getElementById(COMPANION_ID)?.remove();
    document.getElementById(USAGE_PANEL_ID)?.remove();
    document.getElementById(USAGE_TOGGLE_ID)?.remove();
    document.getElementById(HOME_PET_ID)?.remove();
    document.getElementById(RIGHT_TRAY_ID)?.remove();
    document.getElementById(RETRO_SHELL_ID)?.remove();
    document.getElementById(RETRO_PROFILE_ID)?.remove();
    document.getElementById(WEATHER_ID)?.remove();
    document.getElementById(WEATHER_HUD_ID)?.remove();
    destroyObjectLiveStage();
    document.querySelectorAll(".dream-retro-profile-host").forEach((node) =>
      node.classList.remove("dream-retro-profile-host"));
    document.querySelectorAll(".dream-retro-window-control").forEach((button) =>
      button.classList.remove(
        "dream-retro-window-control", "dream-retro-control-summary",
        "dream-retro-control-bottom", "dream-retro-control-sidebar",
      ));
    companionParts = null;
    usageParts = null;
    chromeParts = null;
    retroProfileParts = null;
  };

  const syncToggleButton = (control) => {
    const lightObjectLive = skinMode === "object-live" && objectLiveAppearance === "light";
    if (control?.style) {
      control.style.background = skinMode === "object-live"
        ? (lightObjectLive ? "rgba(248,248,249,.91)" : "rgba(7,10,15,.82)")
        : "rgba(248,248,249,.91)";
      control.style.borderColor = skinMode === "object-live"
        ? (lightObjectLive ? "rgba(82,88,98,.18)" : "rgba(211,229,245,.18)")
        : "rgba(82,88,98,.18)";
    }
    for (const button of control.querySelectorAll("button[data-skin-mode]")) {
      const selected = button.dataset.skinMode === skinMode;
      const unavailable = false;
      button.disabled = unavailable;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.style.opacity = unavailable ? ".45" : "1";
      button.style.color = selected
        ? "#fff"
        : skinMode === "object-live" && !lightObjectLive ? "rgba(239,244,249,.72)" : "#3b3f45";
      button.style.background = selected
        ? "linear-gradient(180deg,#4ba9f0 0%,#166fc8 100%)"
        : "transparent";
      button.style.boxShadow = selected ? "inset 0 1px rgba(255,255,255,.42),0 1px 2px rgba(0,54,112,.22)" : "none";
    }
    const characterButton = control.querySelector("button[data-character-library]");
    if (characterButton) {
      characterButton.style.color = lightObjectLive ? "#3b3f45" : "rgba(239,244,249,.78)";
    }
    const libraryButton = control.querySelector("button[data-skin-library]");
    if (libraryButton) {
      libraryButton.disabled = false;
      libraryButton.style.opacity = "1";
      libraryButton.style.color = skinMode === "custom" ? "#fff" : "#3b3f45";
      libraryButton.style.background = skinMode === "custom"
        ? "linear-gradient(180deg,#4ba9f0 0%,#166fc8 100%)"
        : "transparent";
    }
  };

  const closeLibraryMenu = () => {
    document.getElementById(LIBRARY_MENU_ID)?.remove();
    document.getElementById(CHARACTER_MENU_ID)?.remove();
    document.getElementById(CHARACTER_MENU_ID)?.remove();
  };

  const openCharacterMenu = (anchor) => {
    closeLibraryMenu();
    const light = (objectLiveCharacterPreference === "follow" ? detectShellMode() : objectLiveAppearance) === "light";
    const menu = document.createElement("div");
    menu.id = CHARACTER_MENU_ID;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "GF Live 内置角色");
    const rect = anchor.getBoundingClientRect?.() || { bottom: 36, right: 210 };
    menu.style.cssText = [
      "position:fixed", `top:${Math.round(rect.bottom + 6)}px`, `right:${Math.max(12, Math.round(window.innerWidth - rect.right))}px`,
      "z-index:2147483001", "min-width:190px", "padding:5px", "border-radius:10px",
      `border:1px solid ${light ? "rgba(82,88,98,.18)" : "rgba(211,229,245,.18)"}`,
      `background:${light ? "rgba(248,248,249,.97)" : "rgba(18,21,26,.97)"}`,
      "box-shadow:0 8px 24px rgba(0,0,0,.16)", "backdrop-filter:blur(14px) saturate(110%)",
      "-webkit-app-region:no-drag", "pointer-events:auto",
    ].join(";");
    for (const [kind, label, id] of [
      ["follow", "跟随主题外观", null],
      ["dark", "深色赛博女友", "builtin-cyber-girlfriend"],
      ["light", "暖白女友", "builtin-warm-white-girlfriend"],
    ]) {
      const option = document.createElement("button");
      option.type = "button";
      option.setAttribute("role", "menuitemradio");
      const selected = kind === "follow"
        ? objectLiveCharacterPreference === "follow"
        : objectLiveCharacterPreference !== "follow" && OBJECT_LIVE_CHARACTER_CONFIG.id === id;
      option.setAttribute("aria-checked", selected ? "true" : "false");
      option.textContent = `${selected ? "✓ " : ""}${label}`;
      option.style.cssText = [
        "display:block", "width:100%", "height:32px", "padding:0 10px", "border:0", "border-radius:7px",
        "text-align:left", "background:transparent", `color:${light ? "#2f3338" : "#edf3f9"}`,
        "font:600 12px/32px -apple-system,BlinkMacSystemFont,\"PingFang SC\",sans-serif", "cursor:pointer",
      ].join(";");
      option.addEventListener?.("mouseenter", () => { option.style.background = light ? "rgba(22,111,200,.12)" : "rgba(92,181,244,.16)"; });
      option.addEventListener?.("mouseleave", () => { option.style.background = "transparent"; });
      option.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeLibraryMenu();
        if (kind === "follow") {
          objectLiveCharacterPreference = "follow";
          const shell = detectShellMode();
          requestObjectLiveCharacter(shell === "light" ? "builtin-warm-white-girlfriend" : "builtin-cyber-girlfriend", "follow");
        } else {
          objectLiveCharacterPreference = "selected";
          requestObjectLiveCharacter(id, "selected");
        }
      });
      menu.appendChild(option);
    }
    document.body.appendChild(menu);
  };

  const requestLibrarySwitch = (themeId) => {
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(themeId || "")) return;
    closeLibraryMenu();
    try {
      // Injector watches this key, runs switch-theme --no-apply, then reinjects.
      window.localStorage?.setItem(LIBRARY_SWITCH_KEY, JSON.stringify({
        id: themeId,
        requestedAt: Date.now(),
      }));
      window.localStorage?.setItem(MODE_STORAGE_KEY, "custom");
      window.localStorage?.setItem(ENABLED_STORAGE_KEY, "true");
    } catch {}
  };

  const openLibraryMenu = (anchor) => {
    closeLibraryMenu();
    const menu = document.createElement("div");
    menu.id = LIBRARY_MENU_ID;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "自定义皮肤");
    const rect = typeof anchor.getBoundingClientRect === "function"
      ? anchor.getBoundingClientRect()
      : { bottom: 36, right: 210 };
    menu.style.cssText = [
      "position:fixed", `top:${Math.round(rect.bottom + 6)}px`, `right:${Math.max(12, Math.round(window.innerWidth - rect.right))}px`,
      "z-index:2147483001", "min-width:168px", "max-width:240px", "max-height:260px", "overflow:auto",
      "padding:4px", "border:1px solid rgba(82,88,98,.18)", "border-radius:10px",
      "background:rgba(248,248,249,.97)", "box-shadow:0 8px 24px rgba(0,0,0,.14)",
      "backdrop-filter:blur(14px) saturate(110%)", "-webkit-app-region:no-drag",
    ].join(";");
    const featuredOptionStyle = [
      "display:block", "width:100%", "text-align:left", "height:32px", "padding:0 10px",
      "border:0", "border-radius:7px", "background:transparent", "cursor:pointer",
      "font:650 12px/32px -apple-system,BlinkMacSystemFont,\"PingFang SC\",sans-serif",
      "color:#2f3338", "white-space:nowrap",
    ].join(";");
    const neonStormOption = document.createElement("button");
    neonStormOption.type = "button";
    neonStormOption.setAttribute("role", "menuitem");
    neonStormOption.dataset.themeId = "preset-neon-storm";
    neonStormOption.dataset.skinVariant = "dynamic";
    const neonStormActive = skinMode === "custom"
      && LIBRARY_THEMES.some((item) => item.id === "preset-neon-storm" && item.active);
    neonStormOption.textContent = `${neonStormActive ? "✓ " : ""}霓虹雨夜 Storm•动态`;
    neonStormOption.title = "preset-neon-storm";
    neonStormOption.style.cssText = featuredOptionStyle;
    neonStormOption.addEventListener?.("mouseenter", () => {
      neonStormOption.style.background = "rgba(22,111,200,.12)";
    });
    neonStormOption.addEventListener?.("mouseleave", () => {
      neonStormOption.style.background = "transparent";
    });
    neonStormOption.addEventListener?.("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      requestLibrarySwitch("preset-neon-storm");
    });
    menu.appendChild(neonStormOption);
    const staticThemes = LIBRARY_THEMES.filter((item) => item.id !== "preset-neon-storm");
    if (staticThemes.length) {
      const divider = document.createElement("div");
      divider.style.cssText = "height:1px;margin:4px 6px;background:rgba(82,88,98,.14)";
      menu.appendChild(divider);
    }
    for (const item of staticThemes.slice(0, 8)) {
      const option = document.createElement("button");
      option.type = "button";
      option.setAttribute("role", "menuitem");
      option.dataset.themeId = item.id;
      const label = typeof item.name === "string" && item.name.trim() ? item.name.trim() : item.id;
      option.textContent = skinMode === "custom" && item.active ? `✓ ${label}` : label;
      option.title = item.id;
      option.style.cssText = [
        "display:block", "width:100%", "text-align:left", "height:28px", "padding:0 10px",
        "border:0", "border-radius:7px", "background:transparent", "cursor:pointer",
        "font:500 12px/28px -apple-system,BlinkMacSystemFont,\"PingFang SC\",sans-serif",
        "color:#2f3338", "white-space:nowrap", "overflow:hidden", "text-overflow:ellipsis",
      ].join(";");
      option.addEventListener?.("mouseenter", () => { option.style.background = "rgba(22,111,200,.12)"; });
      option.addEventListener?.("mouseleave", () => { option.style.background = "transparent"; });
      option.addEventListener?.("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        requestLibrarySwitch(item.id);
      });
      menu.appendChild(option);
    }
    const hint = document.createElement("div");
    hint.textContent = "完整管理请打开 App";
    hint.style.cssText = [
      "margin:4px 6px 2px", "font:400 10px/14px -apple-system,BlinkMacSystemFont,\"PingFang SC\",sans-serif",
      "color:#8a9098",
    ].join(";");
    menu.appendChild(hint);
    document.body.appendChild(menu);
    const dismiss = (event) => {
      if (menu.contains(event?.target) || anchor.contains?.(event?.target)) return;
      closeLibraryMenu();
      document.removeEventListener?.("mousedown", dismiss, true);
    };
    document.addEventListener?.("mousedown", dismiss, true);
  };

  const selectSkinMode = (mode) => {
    if (!["native", "qq"].includes(mode)) return;
    if (mode === "custom" && !CUSTOM_THEME_KINDS.has(CUSTOM_THEME.kind)) return;
    skinMode = mode;
    if (skinMode === "qq") forceNativeLightForQQ();
    else restoreNativeAppearance();
    THEME = skinMode === "qq" ? QQ_THEME : CUSTOM_THEME;
    ART = THEME.art && typeof THEME.art === "object" ? THEME.art : {};
    LAYOUT = THEME.layout && typeof THEME.layout === "object" ? THEME.layout : {};
    SOUND = THEME.sound && typeof THEME.sound === "object" ? THEME.sound : {};
    // Keep cached custom analysis for later, but never let it tint QQ after a switch.
    if (skinMode === "custom" && !artAnalysis && typeof CUSTOM_THEME.artKey === "string") {
      artAnalysis = analysisCache.get(CUSTOM_THEME.artKey) ?? null;
    }
    window[DISABLED_KEY] = skinMode === "native";
    try {
      window.localStorage?.setItem(MODE_STORAGE_KEY, skinMode);
      window.localStorage?.setItem(ENABLED_STORAGE_KEY, skinMode === "native" ? "false" : "true");
    } catch {}
    const state = window[STATE_KEY];
    if (state?.installToken === installToken) {
      state.skinMode = skinMode;
      state.themeId = skinMode === "object-live"
        ? "object-live"
        : THEME.id || (skinMode === "qq" ? "qq-stable" : "custom");
    }
    removeSkinVisuals();
    if (skinMode !== "native") ensure({ root: true, route: true, layout: true });
    // Reparent the same switcher into the active title bar's native no-drag
    // controls host. This preserves real macOS pointer hit-testing.
    ensureToggleButton();
    if (typeof window.dispatchEvent === "function" && typeof window.Event === "function") {
      window.dispatchEvent(new window.Event("resize"));
    }
  };

  const findNativeTitlebarControlsHost = () => {
    const buttons = [...document.querySelectorAll('button, [role="button"]')];
    const anchor = buttons.find((button) => {
      if (button.closest?.(`#${TOGGLE_ID}, #${RETRO_SHELL_ID}`)) return false;
      const label = String(button.getAttribute?.("aria-label") || button.getAttribute?.("title") || "")
        .replace(/\s+/g, " ").trim();
      const rect = button.getBoundingClientRect?.();
      return /^(打开位置|open location|reveal in finder|在 finder 中显示)$/i.test(label)
        && rect && rect.top >= 0 && rect.top < 42 && rect.width > 0;
    });
    if (!anchor) return null;
    let host = anchor.parentElement;
    while (host && host !== document.body) {
      const style = typeof getComputedStyle === "function" ? getComputedStyle(host) : null;
      if (
        style?.webkitAppRegion === "no-drag"
        && style?.pointerEvents === "auto"
        && host.querySelectorAll?.("button").length >= 1
      ) return host;
      host = host.parentElement;
    }
    return anchor.parentElement;
  };

  const ensureToggleButton = () => {
    let control = document.getElementById(TOGGLE_ID);
    if (!control?.querySelector('[data-qodex-mode]')) {
      control?.remove(); control = document.createElement('div'); control.id = TOGGLE_ID;
      control.style.cssText = 'position:fixed;top:8px;right:150px;z-index:2147483000;pointer-events:auto;-webkit-app-region:no-drag;app-region:no-drag;';
      const select = document.createElement('select');select.dataset.qodexMode = 'true'; select.setAttribute('aria-label','皮肤模式');
      select.style.cssText='height:28px;min-width:88px;padding:0 10px;border:1px solid #76b8ee;border-radius:6px;background:#eef6f9;color:#17395f;font:12px system-ui;cursor:pointer;pointer-events:auto;-webkit-app-region:no-drag;';
      for (const [value,label] of [['native','原生'],['qq','QQ']]) { const option=document.createElement('option');option.value=value;option.textContent=label;if(value==='custom'&&!CUSTOM_THEME_KINDS.has(CUSTOM_THEME.kind)){option.disabled=true;option.textContent='自定义（未配置）';}select.appendChild(option); }
      select.addEventListener('change',event=>{event.stopPropagation();const mode=select.value;if(mode==='themes'){openLibraryMenu(select);select.value=skinMode;}else if(mode==='characters'){openCharacterMenu(select);select.value=skinMode;}else selectSkinMode(mode);});
      control.appendChild(select);document.body.appendChild(control);
    }
    const select=control.querySelector('[data-qodex-mode]');if(select.value!==skinMode) select.value=skinMode;
    return control;
  };

  const cleanup = () => {
    const state = window[STATE_KEY];
    if (state?.installToken !== installToken) return false;
    window[DISABLED_KEY] = true;
    restoreNativeAppearance();
    removeSkinVisuals();
    document.getElementById(TOGGLE_ID)?.remove();
    document.getElementById(LIBRARY_MENU_ID)?.remove();
    document.getElementById(CHARACTER_MENU_ID)?.remove();
    document.getElementById(WEATHER_AUDIO_ID)?.remove();
    state?.observer?.disconnect();
    state?.rootObserver?.disconnect();
    state?.resizeObserver?.disconnect();
    if (state?.timer) clearInterval(state.timer);
    if (state?.startupTimer) clearInterval(state.startupTimer);
    if (state?.scheduler?.timeout) clearTimeout(state.scheduler.timeout);
    if (state?.scheduler?.observerDebounceTimer) clearTimeout(state.scheduler.observerDebounceTimer);
    if (state?.scheduler?.frame != null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(state.scheduler.frame);
    }
    if (analysisTimer) clearTimeout(analysisTimer);
    if (titlebarAttach.timer) clearTimeout(titlebarAttach.timer);
    if (routeSettleTimer) clearTimeout(routeSettleTimer);
    if (companionBreakTimer) {
      clearTimeout(companionBreakTimer);
      companionBreakTimer = null;
    }
    if (blindBoxRevealTimer) {
      clearTimeout(blindBoxRevealTimer);
      blindBoxRevealTimer = null;
    }
    if (state?.resizeHandler) window.removeEventListener("resize", state.resizeHandler);
    if (state?.routeInteractionHandler && typeof document.removeEventListener === "function") {
      document.removeEventListener("click", state.routeInteractionHandler, true);
    }
    state?.soundMonitor?.cleanup?.();
    state?.weatherMonitor?.destroy?.();
    if (state?.mediaHandler && state?.mediaQuery) {
      try { state.mediaQuery.removeEventListener("change", state.mediaHandler); } catch {}
    }
    if (state?.artUrl) URL.revokeObjectURL(state.artUrl);
    if (state?.qqArtUrl) URL.revokeObjectURL(state.qqArtUrl);
    if (state?.petUrl) URL.revokeObjectURL(state.petUrl);
    if (state?.retroFrameUrl) URL.revokeObjectURL(state.retroFrameUrl);
    if (state?.qqAvatarUrl) URL.revokeObjectURL(state.qqAvatarUrl);
    if (state?.coughAudioUrl) URL.revokeObjectURL(state.coughAudioUrl);
    if (state?.objectLiveCharacterUrl) URL.revokeObjectURL(state.objectLiveCharacterUrl);
    for (const url of Object.values(state?.objectLiveStateVideoUrls || {})) URL.revokeObjectURL(url);
    for (const url of Object.values(state?.deepThemeUrls || {})) URL.revokeObjectURL(url);
    delete window[STATE_KEY];
    return true;
  };

  const scheduler = {
    timeout: null,
    frame: null,
    observerDebounceTimer: null,
    root: false,
    route: false,
    layout: false,
  };
  const flushScheduledEnsure = () => {
    if (scheduler.frame !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(scheduler.frame);
    }
    if (scheduler.timeout) clearTimeout(scheduler.timeout);
    scheduler.frame = null;
    scheduler.timeout = null;
    const pending = { root: scheduler.root, route: scheduler.route, layout: scheduler.layout };
    scheduler.root = false;
    scheduler.route = false;
    scheduler.layout = false;
    ensure(pending);
  };
  const scheduleEnsure = ({ root = false, route = true, layout = false } = {}) => {
    scheduler.root ||= root;
    scheduler.route ||= route;
    scheduler.layout ||= layout;
    if (scheduler.timeout || scheduler.frame !== null) return;
    if (typeof requestAnimationFrame === "function") {
      scheduler.frame = requestAnimationFrame(flushScheduledEnsure);
      scheduler.timeout = setTimeout(flushScheduledEnsure, 96);
    } else {
      scheduler.timeout = setTimeout(flushScheduledEnsure, 64);
    }
  };
  const observer = new MutationObserver((records) => {
    const skinOwned = records.length > 0 && records.every((record) => {
      const target = record.target?.nodeType === 1 ? record.target : record.target?.parentElement;
      return Boolean(target?.closest?.(
        `#${OBJECT_LIVE_ID}, #${TOGGLE_ID}, #${LIBRARY_MENU_ID}, #${CHARACTER_MENU_ID}, #${CHROME_ID}, #${WEATHER_ID}, #${RIGHT_TRAY_ID}`,
      ));
    });
    if (skinOwned || scheduler.observerDebounceTimer) return;
    // React often commits a streamed turn through many child-list mutations.
    // One delayed route pass is sufficient; scheduling on every animation
    // frame multiplied otherwise harmless transcript updates into full scans.
    scheduler.observerDebounceTimer = setTimeout(() => {
      scheduler.observerDebounceTimer = null;
      scheduleEnsure({ route: true });
    }, 160);
  });
  rootObserver = new MutationObserver(() => {
    if (samplingNativeShell) return;
    scheduleEnsure({ root: true, route: true });
  });
  const resizeHandler = () => scheduleEnsure({ route: true, layout: true });
  const routeInteractionHandler = (event) => {
    // Profile menus open on click — restyle quickly before the slower route settle.
    try { weatherMonitor.syncAudioUi?.(); } catch {}
    const control = event?.target?.closest?.('button, [role="button"]');
    const label = String(
      control?.getAttribute?.("aria-label") || control?.getAttribute?.("title") || control?.textContent || "",
    ).replace(/\s+/g, " ").trim();
    if (/^(切换置顶摘要|toggle pinned summary)$/i.test(label)) {
      if (control) autoOpenedSummaryToggles.add(control);
      const nativeSummaryToggle = findPinnedSummaryToggle();
      if (nativeSummaryToggle) autoOpenedSummaryToggles.add(nativeSummaryToggle);
    }
    if (
      skinMode === "object-live" &&
      /^(start voice chat|start realtime voice|启动实时语音|开始实时语音|开始语音聊天|开始新的语音聊天)$/i.test(label)
    ) {
      objectLiveNativeLiveActive = true;
      objectLiveNativeLaunchPendingUntil = Date.now() + OBJECT_LIVE_LAUNCH_TIMEOUT_MS;
      objectLiveVoiceSurfaceLastSeenAt = Date.now();
      setObjectLiveSignalDiagnostics("launch-pending");
      syncObjectLiveStatus("thinking");
    }
    if (routeSettleTimer) clearTimeout(routeSettleTimer);
    routeSettleTimer = setTimeout(() => {
      routeSettleTimer = null;
      scheduleEnsure({ route: true, layout: true });
    }, 500);
  };
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(() => scheduleEnsure({ route: true, layout: true }));
  }

  let mediaQuery = null;
  let mediaHandler = null;
  try {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaHandler = () => scheduleEnsure({ root: true, route: true });
  } catch {}

  window[STATE_KEY] = {
    ensure,
    cleanup,
    ensureToggleButton,
    setUsageSnapshot,
    setCompanionSnapshot,
    observer,
    rootObserver,
    resizeObserver,
    timer: null,
    startupTimer: null,
    scheduler,
    resizeHandler,
    routeInteractionHandler,
    soundMonitor,
    weatherMonitor,
    mediaQuery,
    mediaHandler,
    artUrl,
    qqArtUrl,
    petUrl,
    retroFrameUrl,
    qqAvatarUrl,
    coughAudioUrl,
    objectLiveCharacterUrl,
    objectLiveStateVideoUrls,
    objectLiveCharacterConfig: OBJECT_LIVE_CHARACTER_CONFIG,
    titlebarAttach,
    deepThemeUrls,
    objectLiveCleanup: destroyObjectLiveStage,
    setObjectLiveStatus: syncObjectLiveStatus,
    setObjectLiveTranscript: syncObjectLiveTranscript,
    setObjectLiveCharacterState,
    getNativeLivePresence: () => objectLiveNativePresence
      ? { ...objectLiveNativePresence } : null,
    handleNativeLiveBridgeResult,
    installToken,
    analysis: artAnalysis,
    artMetadata: CUSTOM_ART_METADATA,
    metrics,
    version: VERSION,
    themeId: skinMode === "object-live" ? "object-live" : THEME.id || "custom",
    skinMode,
    customThemeKind: CUSTOM_THEME.kind || null,
    customThemeId: CUSTOM_THEME.id || null,
    qqThemeId: QQ_THEME.id || null,
    detectShellMode,
    selectSkinMode,
  };
  ensureToggleButton();
  const firstEnsureStartedAt = now();
  ensure({ layout: !previous || !document.getElementById(CHROME_ID) });
  metrics.firstEnsureMs = Number((now() - firstEnsureStartedAt).toFixed(3));
  if (previous?.artUrl && previous.artUrl !== artUrl) URL.revokeObjectURL(previous.artUrl);
  if (previous?.qqArtUrl && previous.qqArtUrl !== qqArtUrl) URL.revokeObjectURL(previous.qqArtUrl);
  if (previous?.petUrl && previous.petUrl !== petUrl) URL.revokeObjectURL(previous.petUrl);
  if (previous?.retroFrameUrl && previous.retroFrameUrl !== retroFrameUrl) {
    URL.revokeObjectURL(previous.retroFrameUrl);
  }
  if (previous?.qqAvatarUrl && previous.qqAvatarUrl !== qqAvatarUrl) {
    URL.revokeObjectURL(previous.qqAvatarUrl);
  }
  if (previous?.coughAudioUrl && previous.coughAudioUrl !== coughAudioUrl) {
    URL.revokeObjectURL(previous.coughAudioUrl);
  }
  if (previous?.objectLiveCharacterUrl && previous.objectLiveCharacterUrl !== objectLiveCharacterUrl) {
    URL.revokeObjectURL(previous.objectLiveCharacterUrl);
  }
  for (const url of Object.values(previous?.objectLiveStateVideoUrls || {})) {
    if (!Object.values(objectLiveStateVideoUrls).includes(url)) URL.revokeObjectURL(url);
  }
  for (const url of Object.values(previous?.deepThemeUrls || {})) URL.revokeObjectURL(url);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  rootObserver.observe(document.documentElement, {
    attributes: true,
    // Inline styles on <html> are owned by applyRootState. Observing them
    // feeds our own CSS-variable writes back into another full root pass.
    attributeFilter: ["class", "data-theme", "data-appearance", "data-color-mode"],
  });
  if (document.body) {
    rootObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-appearance", "data-color-mode"],
    });
  }
  const timer = setInterval(() => ensure({ root: false, route: true, layout: false }), 4000);
  window[STATE_KEY].timer = timer;
  window.addEventListener("resize", resizeHandler, { passive: true });
  if (typeof document.addEventListener === "function") {
    document.addEventListener("click", routeInteractionHandler, true);
  }
  if (mediaHandler && mediaQuery) {
    mediaQuery.addEventListener("change", mediaHandler);
  }
  // Codex mounts its fixed shell, composer and account footer across several
  // React commits. Refresh their cached geometry during that bounded startup
  // window, reproducing the useful layout effect of toggling a native panel.
  const startupResizePasses = new Set([1, 2, 4, 8, 12, 16]);
  let startupPass = 0;
  const startupTimer = setInterval(() => {
    const state = window[STATE_KEY];
    if (state?.installToken !== installToken || window[DISABLED_KEY]) {
      clearInterval(startupTimer);
      return;
    }
    startupPass += 1;
    metrics.startupPasses = startupPass;
    scheduleEnsure({ route: true, layout: true });
    if (
      startupResizePasses.has(startupPass) &&
      typeof window.dispatchEvent === "function" && typeof window.Event === "function"
    ) {
      window.dispatchEvent(new window.Event("resize"));
    }
    if (startupPass >= 16) {
      clearInterval(startupTimer);
      if (state.startupTimer === startupTimer) state.startupTimer = null;
    }
  }, 250);
  window[STATE_KEY].startupTimer = startupTimer;
  // Only analyze the uploaded custom image while custom mode is active. QQ must
  // never adopt that analysis after a mode switch or a late analysis callback.
  const analysisPromise = (skinMode === "custom" && !artAnalysis)
    ? analyzeArt()
    : Promise.resolve(null);
  window[STATE_KEY].analysisTimer = analysisTimer;
  analysisPromise.then((analysis) => {
    const state = window[STATE_KEY];
    if (!analysis || state?.installToken !== installToken || window[DISABLED_KEY]) return;
    if (skinMode !== "custom") return;
    artAnalysis = analysis;
    state.analysis = analysis;
    if (typeof CUSTOM_THEME.artKey === "string") {
      analysisCache.set(CUSTOM_THEME.artKey, analysis);
      while (analysisCache.size > 8) analysisCache.delete(analysisCache.keys().next().value);
    }
    ensure({ root: true, route: false, layout: false });
  }).catch(() => {});
  return {
    installed: true,
    version: VERSION,
    themeId: skinMode === "object-live" ? "object-live" : THEME.id || "custom",
    shell: resolvedShell(),
    analysis: artAnalysis,
  };
})(
  __QQ_SKIN_CSS_JSON__,
  __CUSTOM_SKIN_CSS_JSON__,
  __OBJECT_LIVE_CSS_JSON__,
  __QQ_SKIN_ART_JSON__,
  __QQ_STABLE_ART_JSON__,
  __QQ_SKIN_PET_JSON__,
  __QQ_SKIN_RETRO_FRAME_JSON__,
  __QQ_SKIN_QQ_AVATAR_JSON__,
  __QQ_SKIN_COUGH_AUDIO_JSON__,
  __OBJECT_LIVE_CHARACTER_JSON__,
  __OBJECT_LIVE_STATE_VIDEOS_JSON__,
  __OBJECT_LIVE_CHARACTER_CONFIG_JSON__,
  __CODEX_COMPATIBILITY_RULES_JSON__,
  __QQ_SKIN_DEEP_ASSETS_JSON__,
  __QQ_SKIN_THEME_JSON__,
  __QQ_STABLE_THEME_JSON__,
  __QQ_SKIN_LIBRARY_JSON__
)

