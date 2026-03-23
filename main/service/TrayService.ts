import { Tray, Menu, ipcMain, app } from "electron";
import { createLogo, createTranslator } from "@main/utils";
import logManager from "./LogService";
import windowManager from "./WindowService";
import configManager from "./ConfigService";
import {
  CONFIG_KEYS,
  IPC_EVENTS,
  MAIN_WIN_SIZE,
  WINDOW_NAMES,
} from "@common/constants";

let t: ReturnType<typeof createTranslator> = createTranslator();

class TrayService {
  private static _instance: TrayService;
  private _tray: Tray | null = null;
  private _removeLanguageListrener?: () => void;
  private _setupLanguageChangeListener() {
    this._removeLanguageListrener = configManager.onConfigChange((config) => {
      if (!config[CONFIG_KEYS.LANGUAGE]) return;

      t = createTranslator();

      this._tray && this._updateTray();
    });
  }

  private _updateTray() {
    if (!this._tray) {
      this._tray = new Tray(createLogo());
    }

    function showWindow() {
      const mainWindow = windowManager.get(WINDOW_NAMES.MAIN);
      if (!mainWindow) return;

      if (
        !mainWindow.isDestroyed() &&
        mainWindow.isVisible() &&
        !mainWindow.isFocused()
      ) {
        return mainWindow.focus();
      }

      if (mainWindow.isMinimized()) return mainWindow.restore();

      if (mainWindow.isVisible() && mainWindow.isFocused()) return;

      windowManager.create(WINDOW_NAMES.MAIN, MAIN_WIN_SIZE);
    }
    this._tray.setToolTip(t("tray.tooltip") ?? "e-agent");

    // TODO: shortcuts
    this._tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: t("tray.showWindow"),
          accelerator: "CmdOrCtrl+N",
          click: showWindow,
        },
        { type: "separator" },
        {
          label: t("settings.title"),
          click: () => {
            ipcMain.emit(`${IPC_EVENTS.OPEN_WINDOW}:$${WINDOW_NAMES.SETTING}`);
          },
        },
        { role: "quit", label: t("tray.exit") },
      ]),
    );

    this._tray.removeAllListeners("click");
    this._tray.on("click", showWindow);
  }

  constructor() {
    this._setupLanguageChangeListener();
    logManager.info("TrayService initialized successfully.");
  }
  public static getInstance(): TrayService {
    if (!this._instance) {
      this._instance = new TrayService();
    }
    return this._instance;
  }

  public create() {
    if (this._tray) return;

    this._updateTray();

    app.on("quit", () => {
      this.destroy();
    });
  }

  public destroy() {
    this._tray?.destroy();
    this._tray = null;
    if (this._removeLanguageListrener) {
      this._removeLanguageListrener();
      this._removeLanguageListrener = void 0;
    }
  }
}

export const trayManager = TrayService.getInstance();

export default trayManager;
