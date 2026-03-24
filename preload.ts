import {
  CONFIG_KEYS,
  DialogFeedback,
  IPC_EVENTS,
  SHORTCUT_KEYS,
  ThemeMode,
  WINDOW_NAMES,
} from "@common/constants";
import { IConfig } from "@common/types";
import { contextBridge, ipcRenderer } from "electron";

const api: WindowApi = {
  openWindow: (name: WINDOW_NAMES) =>
    ipcRenderer.send(`${IPC_EVENTS.OPEN_WINDOW}:${name}`),
  closeWindow: () => ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW),
  minimizeWindow: () => ipcRenderer.send(IPC_EVENTS.MINIMIZE_WINDOW),
  maximizeWindow: () => ipcRenderer.send(IPC_EVENTS.MAXIMIZE_WINDOW),
  onWindowMaximized: (callback: (isMaximized: boolean) => void) =>
    ipcRenderer.on(`${IPC_EVENTS.MAXIMIZE_WINDOW}back`, (_, isMaximized) =>
      callback(isMaximized),
    ),
  isWindowMaximized: () => ipcRenderer.invoke(IPC_EVENTS.IS_WINDOW_MAXIMIZED),

  setThemeMode: (mode: ThemeMode) =>
    ipcRenderer.send(IPC_EVENTS.SET_THEME_MODE, mode),
  getThemeMode: () => ipcRenderer.invoke(IPC_EVENTS.GET_THEME_MODE),
  isDarkMode: () => ipcRenderer.invoke(IPC_EVENTS.IS_DARK_MODE),
  onSystemThemeChange: (callback: (theme: ThemeMode) => void) => {
    const handler = (_: Electron.IpcRendererEvent, theme: ThemeMode) =>
      callback(theme);
    ipcRenderer.on(IPC_EVENTS.THEME_MODE_UPDATED, handler);
    return () => {
      ipcRenderer.off(IPC_EVENTS.THEME_MODE_UPDATED, handler);
    };
  },
  showContextMenu: (menuId: string, dynamicOptions?: string) =>
    ipcRenderer.invoke(IPC_EVENTS.SHOW_CONTEXT_MENU, menuId, dynamicOptions),
  contextMenuItemClick: (menuId: string, cb: (id: string) => void) =>
    ipcRenderer.on(`${IPC_EVENTS.SHOW_CONTEXT_MENU}:${menuId}`, (_, id) =>
      cb(id),
    ),
  removeContextMenuListener: (menuId: string) =>
    ipcRenderer.removeAllListeners(`${IPC_EVENTS.SHOW_CONTEXT_MENU}:${menuId}`),

  viewIsReady: () => ipcRenderer.send(IPC_EVENTS.RENDERER_IS_READY),

  getConfig: (key: CONFIG_KEYS) =>
    ipcRenderer.invoke(IPC_EVENTS.GET_CONFIG, key),
  setConfig: (key: CONFIG_KEYS, value: IConfig[CONFIG_KEYS]) =>
    ipcRenderer.send(IPC_EVENTS.SET_CONFIG, key, value),
  updateConfig: (config: IConfig) =>
    ipcRenderer.send(IPC_EVENTS.UPDATE_CONFIG, config),
  onConfigChange: (callback: (config: IConfig) => void) => {
    const handleCallback = (_: Electron.IpcRendererEvent, config: IConfig) =>
      callback(config);
    ipcRenderer.on(IPC_EVENTS.CONFIG_UPDATED, handleCallback);
    return () => {
      ipcRenderer.off(IPC_EVENTS.CONFIG_UPDATED, handleCallback);
    };
  },
  removeConfigChangeListener: (callback: (config: IConfig) => void) => {
    ipcRenderer.removeListener(IPC_EVENTS.CONFIG_UPDATED, (_, config) =>
      callback(config),
    );
  },

  createDialog: (params: CreateDialogProps) => {
    return new Promise(async (resolve) => {
      const feedback = (await ipcRenderer.invoke(
        `${IPC_EVENTS.OPEN_WINDOW}:${WINDOW_NAMES.DIALOG}`,
        {
          title: params.title ?? "",
          content: params.content ?? "",
          confirmText: params.confirmText ?? "",
          cancelText: params.cancelText ?? "",
        },
      )) as DialogFeedback;
      if (feedback === DialogFeedback.CONFIRM) {
        params.onConfirm?.();
      }
      if (feedback === DialogFeedback.CANCEL) {
        params.onCancel?.();
      }
      resolve(feedback);
    });
  },
  _dialogFeedback: (val: DialogFeedback, winId: number) =>
    ipcRenderer.send(`${WINDOW_NAMES.DIALOG}${val}`, winId),
  _dialogGetParams: () =>
    ipcRenderer.invoke(`${WINDOW_NAMES.DIALOG}get-params`),

  startADialogue: (params: CreateDialogueProps) =>
    ipcRenderer.send(IPC_EVENTS.START_A_DIALOGUE, params),
  onDialogueBack: (
    cb: (data: DialogueBackStream) => void,
    messageId: number,
  ) => {
    const callback = (
      _event: Electron.IpcRendererEvent,
      data: DialogueBackStream,
    ) => cb(data);
    ipcRenderer.on(`${IPC_EVENTS.START_A_DIALOGUE}back${messageId}`, callback);
    return () =>
      ipcRenderer.removeListener(
        `${IPC_EVENTS.START_A_DIALOGUE}back${messageId}`,
        callback,
      );
  },
  onShortcutCalled: (key: SHORTCUT_KEYS, callback: () => void) => {
    ipcRenderer.on(`${IPC_EVENTS.SHORTCUT_CALLED}${key}`, callback);
    return () =>
      ipcRenderer.removeListener(
        `${IPC_EVENTS.SHORTCUT_CALLED}${key}`,
        callback,
      );
  },

  logger: {
    debug: (message: string, ...meta: any[]) =>
      ipcRenderer.send(IPC_EVENTS.LOG_DEBUG, message, ...meta),
    info: (message: string, ...meta: any[]) =>
      ipcRenderer.send(IPC_EVENTS.LOG_INFO, message, ...meta),
    warn: (message: string, ...meta: any[]) =>
      ipcRenderer.send(IPC_EVENTS.LOG_WARN, message, ...meta),
    error: (message: string, ...meta: any[]) =>
      ipcRenderer.send(IPC_EVENTS.LOG_ERROR, message, ...meta),
  },
};
contextBridge.exposeInMainWorld("api", api);
