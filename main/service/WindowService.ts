import { IPC_EVENTS } from "@common/constants";
import { WindowNames } from "@common/types";
import { debounce } from "@common/utils";
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
} from "electron";
import path from "node:path";

interface SizeOptions {
  width: number;
  height: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

const SHARED_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  titleBarStyle: "hidden", // 隐藏标题栏
  title: "Electron Agent",
  webPreferences: {
    nodeIntegration: false, // 禁用 Node.js 集成
    contextIsolation: true, // 启用上下文隔离
    sandbox: true, // 启用沙箱
    backgroundThrottling: false, // 禁用后台节流
    preload: path.join(__dirname, "preload.js"),
  },
};

class WindowService {
  private static _instance: WindowService;
  private constructor() {
    this._setupIpcEvents();
  }

  private _setupIpcEvents() {
    const handleCloseWindow = (e: IpcMainEvent) => {
      this.close(BrowserWindow.fromWebContents(e.sender));
    };

    const handleMinimizeWindow = (e: IpcMainEvent) => {
      BrowserWindow.fromWebContents(e.sender)?.minimize();
    };

    const handleMaximizeWindow = (e: IpcMainEvent) => {
      this.toggleMax(BrowserWindow.fromWebContents(e.sender));
    };

    const handleIsWindowMaximized = (e: IpcMainInvokeEvent) => {
      return BrowserWindow.fromWebContents(e.sender)?.isMaximized() ?? false;
    };

    ipcMain.on(IPC_EVENTS.CLOSE_WINDOW, handleCloseWindow);
    ipcMain.on(IPC_EVENTS.MINIMIZE_WINDOW, handleMinimizeWindow);
    ipcMain.on(IPC_EVENTS.MAXIMIZE_WINDOW, handleMaximizeWindow);
    ipcMain.handle(IPC_EVENTS.IS_WINDOW_MAXIMIZED, handleIsWindowMaximized);
  }

  public static getInstance(): WindowService {
    if (!this._instance) {
      this._instance = new WindowService();
    }
    return this._instance;
  }

  public create(name: WindowNames, size: SizeOptions) {
    const window = new BrowserWindow({
      ...SHARED_WINDOW_OPTIONS,
      ...size,
    });

    this._setupWinLifeCircle(window, name);
    this._loadWindowTemplate(window, name);
    return window;
  }
  private _setupWinLifeCircle(window: BrowserWindow, _name: WindowNames) {
    const updateWinStatus = debounce(() => {
      !window?.isDestroyed() &&
        window.webContents?.send(
          `${IPC_EVENTS.MAXIMIZE_WINDOW}back`,
          window?.isMaximized(),
        );
    }, 80);
    window.on("resize", updateWinStatus);
    window.once("closed", () => {
      window?.destroy();
      window.removeListener("resize", updateWinStatus);
    });
  }

  private _loadWindowTemplate(window: BrowserWindow, name: WindowNames) {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      window.loadURL(
        `${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/${name === "main" ? "" : name}`,
      );
    } else {
      window.loadFile(
        path.join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}/html/${name === "main" ? "index" : name}.html`,
        ),
      );
    }
  }

  public close(window: BrowserWindow | null | void) {
    if (!window) return;
    window.close();
  }

  public toggleMax(window: BrowserWindow | null | void) {
    if (!window) return;
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
}

export const windowManager = WindowService.getInstance();
export default windowManager;
