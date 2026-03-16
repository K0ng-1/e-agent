import { IPC_EVENTS, ThemeMode } from "@common/constants";
import { contextBridge, ipcRenderer } from "electron";

const api: WindowApi = {
  closeWindow: () => ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW),
  minimizeWindow: () => ipcRenderer.send(IPC_EVENTS.MINIMIZE_WINDOW),
  maximizeWindow: () => ipcRenderer.send(IPC_EVENTS.MAXIMIZE_WINDOW),
  onWindowMaximized: (callback: (isMaximized: boolean) => void) =>
    ipcRenderer.on(`${IPC_EVENTS.MAXIMIZE_WINDOW}back`, (_, isMaximized) =>
      callback(isMaximized),
    ),
  isWindowMaximized: () => ipcRenderer.invoke(IPC_EVENTS.IS_WINDOW_MAXIMIZED),

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

  setThemeMode: (mode: ThemeMode) =>
    ipcRenderer.send(IPC_EVENTS.SET_THEME_MODE, mode),
  getThemeMode: () => ipcRenderer.invoke(IPC_EVENTS.GET_THEME_MODE),
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
};
contextBridge.exposeInMainWorld("api", api);
