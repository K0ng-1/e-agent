import { IPC_EVENTS } from "@common/constants";
import { app, ipcMain } from "electron";
import log from "electron-log";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);
class LogService {
  private static _instance: LogService;
  // 日志保留天数
  private LOG_RETENTION_DAYS = 7;
  // 清理间隔毫秒数
  private readonly CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

  private constructor() {
    const logPath = path.join(app.getPath("userData"), "logs");

    try {
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
      }
    } catch (error) {
      this.error("Failed to create log directory", error);
    }

    log.transports.file.resolvePathFn = () => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      return path.join(logPath, `${formattedDate}.log`);
    };

    log.transports.file.format =
      "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] [{text}]";

    log.transports.file.maxSize = 10 * 1024 * 1024;

    log.transports.console.level =
      process.env.NODE_ENV === "development" ? "debug" : "info";

    log.transports.file.level = "debug";

    this._setupIpcEvents();
    this._rewriteConsole();
    this.info("LogService initialized successfully.");

    this._cleanupOldLogs();

    setInterval(() => this._cleanupOldLogs(), this.CLEANUP_INTERVAL_MS);
  }

  private _setupIpcEvents() {
    ipcMain.on(IPC_EVENTS.LOG_DEBUG, (_, message: string, ...meta: any[]) =>
      this.debug(message, ...meta),
    );
    ipcMain.on(IPC_EVENTS.LOG_INFO, (_, message: string, ...meta: any[]) =>
      this.info(message, ...meta),
    );
    ipcMain.on(IPC_EVENTS.LOG_WARN, (_, message: string, ...meta: any[]) =>
      this.warn(message, ...meta),
    );
    ipcMain.on(IPC_EVENTS.LOG_ERROR, (_, message: string, ...meta: any[]) =>
      this.error(message, ...meta),
    );
  }

  private _rewriteConsole() {
    console.debug = log.debug;
    console.info = log.info;
    console.log = log.info;
    console.warn = log.warn;
    console.error = log.error;
  }

  private async _cleanupOldLogs() {
    const logPath = path.join(app.getPath("userData"), "logs");

    try {
      if (!fs.existsSync(logPath)) return;
      const now = new Date();
      const expiretionDate = new Date(
        now.getTime() - this.LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000,
      );

      const files = await readdirAsync(logPath);

      let deleteCount = 0;
      for (const file of files) {
        if (!file.endsWith(".log")) continue;
        const filePath = path.join(logPath, file);
        try {
          const stat = await statAsync(filePath);
          if (stat.isFile() && stat.birthtime < expiretionDate) {
            await unlinkAsync(filePath);
            deleteCount++;
          }
        } catch (error) {
          this.error(`Failed to delete log file: ${filePath}`, error);
        }
      }
      if (deleteCount > 0) {
        this.info(`Successfully cleaned up ${deleteCount} old log files.`);
      }
    } catch (error) {
      this.error("Failed to cleanup old logs", error);
    }
  }
  public static getInstance(): LogService {
    if (!this._instance) {
      this._instance = new LogService();
    }
    return this._instance;
  }

  /**
   * 调试日志
   * @param {string} message - 日志消息
   * @param {any[]} meta - 附加的元数据
   */
  public debug(message: string, ...meta: any[]): void {
    log.debug(message, ...meta);
  }

  /**
   * 信息日志
   * @param {string} message - 日志消息
   * @param {any[]} meta - 附加的元数据
   */
  public info(message: string, ...meta: any[]): void {
    log.info(message, ...meta);
  }

  /**
   * 警告日志
   * @param {string} message - 日志消息
   * @param {any[]} meta - 附加的元数据
   */
  public warn(message: string, ...meta: any[]): void {
    log.warn(message, ...meta);
  }

  /**
   * 错误日志
   * @param {string} message - 日志消息
   * @param {any[]} meta - 附加的元数据
   */
  public error(message: string, ...meta: any[]): void {
    log.error(message, ...meta);
  }
}

export const logManager = LogService.getInstance();
export default logManager;
