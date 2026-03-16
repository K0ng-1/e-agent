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
import logManager from "./LogService";
import themeManager from "./ThemeService";

interface WindowState {
  instance: BrowserWindow | void;
  isHidden: boolean;
  onCreate: ((window: BrowserWindow) => void)[];
  onClosed: ((window: BrowserWindow) => void)[];
}

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
  title: "Eagent",
  darkTheme: themeManager.isDark,
  backgroundColor: themeManager.isDark ? "#2C2C2C" : "#ffffff",
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
  private _winStates: Record<WindowNames | string, WindowState> = {
    main: { instance: void 0, isHidden: false, onCreate: [], onClosed: [] },
  };
  private constructor() {
    this._setupIpcEvents();
    logManager.info("WindowService initialized successfully.");
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

    this._setupWinLifeCircle(window, name)._loadWindowTemplate(window, name);
    this._winStates[name].onCreate.forEach((callback) => callback(window));

    return window;
  }
  private _setupWinLifeCircle(window: BrowserWindow, name: WindowNames) {
    const updateWinStatus = debounce(() => {
      !window?.isDestroyed() &&
        window.webContents?.send(
          `${IPC_EVENTS.MAXIMIZE_WINDOW}back`,
          window?.isMaximized(),
        );
    }, 80);
    window.on("resize", updateWinStatus);
    window.once("closed", () => {
      this._winStates[name].onClosed.forEach((callback) => callback(window));

      window?.destroy();
      window.removeListener("resize", updateWinStatus);

      logManager.info(`Window closed: ${name}`);
    });
    return this;
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
    return this;
  }

  public close(window: BrowserWindow | null | void) {
    if (!window) return;
    window.close();
  }

  public toggleMax(window: BrowserWindow | null | void) {
    if (!window) return;
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }

  public onWindowCreate(
    name: WindowNames,
    callback: (window: BrowserWindow) => void,
  ) {
    this._winStates[name].onCreate.push(callback);
  }

  public onWindowClosed(
    name: WindowNames,
    callback: (window: BrowserWindow) => void,
  ) {
    this._winStates[name].onClosed.push(callback);
  }
}

export const windowManager = WindowService.getInstance();
export default windowManager;
