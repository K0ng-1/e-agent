export enum IPC_EVENTS {
  // renderer to main
  CLOSE_WINDOW = "close-window",
  MINIMIZE_WINDOW = "minimize-window",
  MAXIMIZE_WINDOW = "maximize-window",
  IS_WINDOW_MAXIMIZED = "is-window-maximized",
  SET_THEME_MODE = "set-theme-mode",
  GET_THEME_MODE = "get-theme-mode",
  IS_DARK_MODE = "is-dark-mode",
  SHOW_CONTEXT_MENU = "show-context-menu",

  LOG_DEBUG = "log-debug",
  LOG_INFO = "log-info",
  LOG_WARN = "log-warn",
  LOG_ERROR = "log-error",
  LOG_FATAL = "log-fatal",

  // main to renderer
  THEME_MODE_UPDATED = "theme-mode-updated",
}

export enum SHORTCUT_KEYS {
  CLOSE_WINDOW = 'CmdOrCtrl+W',
  SEND_MESSAGE = 'CmdOrCtrl+Enter',
}

export enum WINDOW_NAMES {
  MAIN = "main",
  SETTING = "setting",
  DIALOG = "dialog",
}

export enum CONFIG_KEYS {
  THEME_MODE = 'themeMode',
  PRIMARY_COLOR = 'primaryColor',
  LANGUAGE = 'language',
  FONT_SIZE = 'fontSize',
  MINIMIZE_TO_TRAY = 'minimizeToTray',
  PROVIDER = 'provider',
  DEFAULT_MODEL = 'defaultModel',
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

export enum MENU_IDS {
  CONVERSATION_ITEM = "conversation-item",
  CONVERSATION_LIST = "conversation-list",
  MESSAGE_ITEM = "message-item",
}

export enum CONVERSATION_ITEM_MENU_IDS {
  PIN = "pin",
  RENAME = "rename",
  DEL = "del",
}

export enum CONVERSATION_LIST_MENU_IDS {
  NEW_CONVERSATION = "newConversation",
  SORT_BY = "sortBy",
  SORT_BY_CREATE_TIME = "sortByCreateTime",
  SORT_BY_UPDATE_TIME = "sortByUpdateTime",
  SORT_BY_NAME = "sortByName",
  SORT_BY_MODEL = "sortByModel",
  SORT_ASCENDING = "sortAscending",
  SORT_DESCENDING = "sortDescending",
  BATCH_OPERATIONS = "batchOperations",
}

export enum MESSAGE_ITEM_MENU_IDS {
  COPY = "copy",
  DELETE = "delete",
  SELECT = "select",
}
