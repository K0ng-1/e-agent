import { app, BrowserWindow, ipcMain } from "electron";
import path, { join } from "node:path";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { CONFIG_KEYS, IPC_EVENTS, ThemeMode } from "@common/constants";
import { ConfigKeys, IConfig } from "@common/types";
import { logManager } from "./LogService";
import { cloneDeep, debounce } from "@common/utils";

const DEFAULT_CONFIG: IConfig = {
  [CONFIG_KEYS.THEME_MODE]: ThemeMode.SYSTEM,
  [CONFIG_KEYS.PRIMARY_COLOR]: "#BB5BE7",
  [CONFIG_KEYS.LANGUAGE]: "zh",
  [CONFIG_KEYS.FONT_SIZE]: 14,
  [CONFIG_KEYS.MINIMIZE_TO_TRAY]: false,
  [CONFIG_KEYS.PROVIDER]: "",
  [CONFIG_KEYS.DEFAULT_MODEL]: null,
};

class ConfigService {
  private static _instance: ConfigService;
  private _config: IConfig;
  private _configPath: string;
  private _defaultConfig: IConfig = DEFAULT_CONFIG;

  private _listeners: Array<(config: IConfig) => void> = [];

  private constructor() {
    this._configPath = join(app.getPath("userData"), "config.json");
    this._config = this._loadConfig();

    this._setupIpcEvents();
    logManager.info("ConfigService initialized successfully.");
  }

  private _setupIpcEvents(): void {
    const handleUpdate = debounce((val) => this.update(val), 200);
    ipcMain.handle(IPC_EVENTS.GET_CONFIG, (_, key) => this.get(key));
    ipcMain.on(IPC_EVENTS.SET_CONFIG, (_, key, val) => this.set(key, val));
    ipcMain.on(IPC_EVENTS.UPDATE_CONFIG, (_, config) => handleUpdate(config));
  }

  private _loadConfig(): IConfig {
    try {
      const path = this._configPath;
      if (existsSync(path)) {
        const configString = readFileSync(path, "utf-8");
        const config = { ...this._defaultConfig, ...JSON.parse(configString) };
        logManager.info("Config loaded successfully from:", path);
        return config;
      }
    } catch (error) {
      logManager.error("Failed to load config:", error);
    }
    return { ...this._defaultConfig };
  }

  private _saveConfig(): void {
    try {
      mkdirSync(path.dirname(this._configPath), { recursive: true });
      writeFileSync(
        this._configPath,
        JSON.stringify(this._config, null, 2),
        "utf-8",
      );

      this._notifyListeners();

      logManager.info("Config saved successfully to:", this._configPath);
    } catch (error) {
      logManager.error("Failed to save config:", error);
    }
  }

  private _notifyListeners(): void {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(IPC_EVENTS.CONFIG_UPDATED, this._config);
    });
    this._listeners.forEach((listen) => listen({ ...this._config }));
  }

  public getConfig(): IConfig {
    return cloneDeep(this._config);
  }

  public get<T = any>(key: ConfigKeys): T {
    return this._config[key] as T;
  }

  public set(key: ConfigKeys, val: unknown, autoSave: boolean = true): void {
    if (!(key in this._config)) return;

    const oldValue = this._config[key];
    if (oldValue === val) return;

    this._config[key] = val as never;

    logManager.debug(`Config set: ${key} = ${val}`);

    if (autoSave) this._saveConfig();
  }

  public update(config: Partial<IConfig>, autoSave: boolean = true): void {
    this._config = { ...this._config, ...config };
    if (autoSave) this._saveConfig();
  }

  public resetToDefault(): void {
    this._config = { ...this._defaultConfig };
    logManager.info("Config reset to default.");
    this._saveConfig();
  }

  public onConfigChange(listener: (config: IConfig) => void): () => void {
    this._listeners.push(listener);

    return () =>
      (this._listeners = this._listeners.filter((l) => l !== listener));
  }

  public static getInstance(): ConfigService {
    if (!this._instance) {
      this._instance = new ConfigService();
    }
    return this._instance;
  }
}

export const configManager = ConfigService.getInstance();

export default configManager;
