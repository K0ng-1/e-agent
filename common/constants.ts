export enum IPC_EVENTS {
  // renderer to main
  CLOSE_WINDOW = "close-window",
  MINIMIZE_WINDOW = "minimize-window",
  MAXIMIZE_WINDOW = "maximize-window",
  IS_WINDOW_MAXIMIZED = "is-window-maximized",
  SET_THEME_MODE = "set-theme-mode",
  GET_THEME_MODE = "get-theme-mode",
  IS_DARK_MODE = "is-dark-mode",

  LOG_DEBUG = "log-debug",
  LOG_INFO = "log-info",
  LOG_WARN = "log-warn",
  LOG_ERROR = "log-error",
  LOG_FATAL = "log-fatal",

  // main to renderer
  THEME_MODE_UPDATED = "theme-mode-updated",
}

export enum WINDOW_NAMES {
  MAIN = "main",
  SETTING = "setting",
  DIALOG = "dialog",
}

export const MAIN_WIN_SIZE = {
  width: 800,
  height: 500,
  minWidth: 800,
  minHeight: 500,
} as const;

export enum ThemeMode {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}
