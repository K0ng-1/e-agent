import { CONFIG_KEYS, IPC_EVENTS, ThemeMode } from "@common/constants";
import { BrowserWindow, ipcMain, nativeTheme } from "electron";
import { logManager } from "./LogService";
import { configManager } from "./ConfigService";

class ThemeService {
  private static _instance: ThemeService;
  constructor() {
    const themeMode = configManager.get(CONFIG_KEYS.THEME_MODE);

    if (themeMode) {
      nativeTheme.themeSource = themeMode;
    }
    this._setupIpcEvent();
    logManager.info("ThemeService initialized successfully.");
  }

  private _setupIpcEvent() {
    ipcMain.on(IPC_EVENTS.SET_THEME_MODE, (_, mode: ThemeMode) => {
      nativeTheme.themeSource = mode;
      configManager.set(CONFIG_KEYS.THEME_MODE, mode);
    });

    ipcMain.handle(IPC_EVENTS.GET_THEME_MODE, () => {
      return nativeTheme.themeSource;
    });

    nativeTheme.on("updated", () => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send(
          IPC_EVENTS.THEME_MODE_UPDATED,
          nativeTheme.themeSource,
        );
      });
    });
  }
  public static getInstance() {
    if (!this._instance) {
      this._instance = new ThemeService();
    }
    return this._instance;
  }

  public get isDark() {
    return nativeTheme.shouldUseDarkColors;
  }

  public get themeMode() {
    return nativeTheme.themeSource;
  }
}

export const themeManager = ThemeService.getInstance();
export default themeManager;
