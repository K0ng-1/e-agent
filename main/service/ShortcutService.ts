import { app, globalShortcut, type BrowserWindow } from "electron";
import logManager from "./LogService";

class ShortcutService {
  private static _instance: ShortcutService;
  private _registeredShortcuts: Map<string, Electron.Accelerator> = new Map();

  private _registerDefaultShortcuts() {
    app.whenReady().then(() => {});
  } 
  private _setupAppEvents(): void {
    app.on("will-quit", () => {
      this.unregisterAll();
    });

    app.on("browser-window-blur", () => {});
    app.on("browser-window-focus", () => {});
  }

  private constructor() {
    this._registerDefaultShortcuts();
    this._setupAppEvents();

    logManager.info("ShortcutService initialized successfully.");
  }

  public static getInstance(): ShortcutService {
    if (!this._instance) {
      this._instance = new ShortcutService();
    }
    return this._instance;
  }

  public register(
    accelerator: Electron.Accelerator,
    id: string,
    callback: () => void,
  ): boolean {
    try {
      if (this._registeredShortcuts.has(id)) {
        this.unregister(id);
      }
      const result = globalShortcut.register(accelerator, callback);
      if (result) {
        this._registeredShortcuts.set(id, accelerator);
        logManager.info(
          `Registered shortcut ${id} with accelerator ${accelerator}`,
        );
      } else {
        logManager.error(
          `Failed to register shortcut ${id} with accelerator ${accelerator}`,
        );
      }
      return result;
    } catch (error) {
      logManager.error(`Failed to register shortcut ${id}: ${error}`);
      return false;
    }
  }

  public unregister(id: string): boolean {
    try {
      const accelerator = this._registeredShortcuts.get(id);
      if (accelerator) {
        globalShortcut.unregister(accelerator);
        this._registeredShortcuts.delete(id);
        logManager.info(
          `Unregistered shortcut ${id} with accelerator ${accelerator}`,
        );
        return true;
      }
      return false;
    } catch (error) {
      logManager.error(`Failed to unregister shortcut ${id}: ${error}`);
      return false;
    }
  }

  public unregisterAll(): void {
    try {
      globalShortcut.unregisterAll();
      this._registeredShortcuts.clear();
      logManager.info("Unregistered all shortcuts.");
    } catch (error) {
      logManager.error(`Failed to unregister all shortcuts: ${error}`);
    }
  }

  public isRegistered(accelerator: Electron.Accelerator): boolean {
    try {
      return globalShortcut.isRegistered(accelerator);
    } catch (error) {
      logManager.error(`Failed to check if shortcut is registered: ${error}`);
      return false;
    }
  }

  public getRegisteredShortcuts(): Map<string, Electron.Accelerator> {
    return new Map(this._registeredShortcuts);
  }

  public registerForWindow(
    window: BrowserWindow,
    callback: (input: Electron.Input) => boolean | void,
  ) {
    window.webContents.on("before-input-event", (e, input) => {
      if (!window.isFocused()) return;
      if ((input.type === "keyDown" && callback(input)) === true) {
        e.preventDefault();
      }
    });
  }
}

export const shortcutManager = ShortcutService.getInstance();

export default shortcutManager;
