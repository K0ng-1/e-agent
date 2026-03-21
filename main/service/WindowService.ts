import { IPC_EVENTS, WINDOW_NAMES } from "@common/constants";
import { WindowNames } from "@common/types";
import { debounce } from "@common/utils";
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  WebContentsView,
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
  show: false,
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
    setting: { instance: void 0, isHidden: false, onCreate: [], onClosed: [] },
    dialog: { instance: void 0, isHidden: false, onCreate: [], onClosed: [] },
  };
  private constructor() {
    this._setupIpcEvents();
    logManager.info("WindowService initialized successfully.");
  }

  private _isReallyClose(name: WindowNames | void) {
    if (name === WINDOW_NAMES.MAIN) return true;
    if (name === WINDOW_NAMES.SETTING) return false;

    return true;
  }

  private _setupIpcEvents() {
    const handleCloseWindow = (e: IpcMainEvent) => {
      const window = BrowserWindow.fromWebContents(e.sender);
      const name = this.getName(window);
      this.close(window, this._isReallyClose(name));
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

  public create(
    name: WindowNames,
    size: SizeOptions,
    moreOpts?: BrowserWindowConstructorOptions,
  ) {
    if (this.get(name)) return;

    const isHiddenWin = this._isHiddenWin(name);
    let window = this._createWinInstance(name, { ...size, ...moreOpts });

    this._listenWinReady({
      win: window,
      isHiddenWin,
      size,
    });
    if (!isHiddenWin) {
      this._setupWinLifeCircle(window, name)._loadWindowTemplate(window, name);
      this._winStates[name].instance = window;
      this._winStates[name].onCreate.forEach((callback) => callback(window));
    }
    if (isHiddenWin) {
      this._winStates[name].isHidden = false;
      logManager.info(`Hidden Window show: ${name}`);
    }

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
      this._winStates[name].instance = void 0;
      this._winStates[name].isHidden = false;
      logManager.info(`Window closed: ${name}`);
    });
    return this;
  }

  private _listenWinReady(params: {
    win: BrowserWindow;
    isHiddenWin: boolean;
    size: SizeOptions;
  }) {
    const onReady = () => {
      params.win?.once("show", () =>
        setTimeout(() => {
          this._applySizeConstrains(params.win, params.size);
        }, 2),
      );

      params.win?.show();
    };

    if (!params.isHiddenWin) {
      const loadingHandler = this._addLoadingView(params.win, params.size);
      loadingHandler(onReady);
    } else {
      onReady();
    }
  }

  private _addLoadingView(window: BrowserWindow, size: SizeOptions) {
    let loadingView: WebContentsView | void = new WebContentsView();
    let rendererIsReady = false;

    window.contentView?.addChildView(loadingView);

    loadingView.setBounds({
      x: 0,
      y: 0,
      width: size.width ?? 0,
      height: size.height ?? 0,
    });

    loadingView.webContents.loadFile(
      path.join(__dirname, "../../public/loading.html"),
    );

    const onRendererIsReady = (e: IpcMainEvent) => {
      if (e.sender !== window?.webContents || rendererIsReady) return;

      rendererIsReady = true;

      window.contentView.removeChildView(loadingView as WebContentsView);

      ipcMain.removeListener(IPC_EVENTS.RENDERER_IS_READY, onRendererIsReady);
      loadingView = void 0;
    };

    ipcMain.on(IPC_EVENTS.RENDERER_IS_READY, onRendererIsReady);

    return (cb: () => void) => {
      loadingView?.webContents.once("dom-ready", () => {
        loadingView?.webContents.insertCSS(`body {
          background-color: ${themeManager.isDark ? "#2C2C2C" : "#FFFFFF"} !important; 
          --stop-color-start: ${themeManager.isDark ? "#A0A0A0" : "#7F7F7F"} !important;
          --stop-color-end: ${themeManager.isDark ? "#A0A0A0" : "#7F7F7F"} !important;
        }`);
        cb();
      });
    };
  }

  private _applySizeConstrains(win: BrowserWindow, size: SizeOptions) {
    if (size.maxWidth && size.maxHeight) {
      win.setMaximumSize(size.maxWidth ?? 0, size.minWidth ?? 0);
    }
    if (size.minWidth && size.minHeight) {
      win.setMinimumSize(size.minWidth ?? 0, size.minHeight ?? 0);
    }
    if (size.width && size.height) {
      win.setSize(size.width, size.height);
    }
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

  private _handleCloseWindowState(window: BrowserWindow, really: boolean) {
    const name = this.getName(window);
    if (name) {
      if (!really) {
        this._winStates[name].isHidden = true;
      } else {
        this._winStates[name].instance = void 0;
      }
    }

    setTimeout(() => {
      window[really ? "close" : "hide"]?.();
      this._checkAndCloseAllWindows();
    }, 210);
  }

  private _checkAndCloseAllWindows() {
    if (
      !this._winStates[WINDOW_NAMES.MAIN].instance ||
      this._winStates[WINDOW_NAMES.MAIN].instance?.isDestroyed()
    ) {
      return Object.values(this._winStates).forEach((win) =>
        win?.instance?.close(),
      );
    }

    const minimizeToTray = false;

    if (!minimizeToTray && !this.get(WINDOW_NAMES.MAIN)?.isVisible()) {
      return Object.values(this._winStates).forEach(
        (win) => !win?.instance?.isVisible() && win?.instance?.close(),
      );
    }
  }

  private _isHiddenWin(name: WindowNames) {
    return this._winStates[name] && this._winStates[name].isHidden;
  }

  private _createWinInstance(
    name: WindowNames,
    opts?: BrowserWindowConstructorOptions,
  ) {
    return this._isHiddenWin(name)
      ? (this._winStates[name].instance as BrowserWindow)
      : new BrowserWindow({
          ...SHARED_WINDOW_OPTIONS,
          ...opts,
        });
  }

  public close(window: BrowserWindow | null | void, really: boolean = true) {
    if (!window) return;
    const name = this.getName(window);

    this._handleCloseWindowState(window, really);
    logManager.info(`Close window: ${name}, really: ${really}`);
  }

  public toggleMax(window: BrowserWindow | null | void) {
    if (!window) return;
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }

  public getName(window: BrowserWindow | null | void): WindowNames | void {
    if (!window) return;
    for (const [name, win] of Object.entries(this._winStates)) {
      if (win.instance === window) return name as WindowNames;
    }
  }

  public get(name: WindowNames) {
    if (this._winStates[name].isHidden) return void 0;
    return this._winStates[name].instance;
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
