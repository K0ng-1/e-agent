import { app, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";
import { setupWindows } from "./wins";
import logManager from "./service/LogService";
import loadExtension from "./loadExtensions";

if (started) {
  app.quit();
}

app.on("ready", async () => {
  await loadExtension(app);
  setupWindows();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    setupWindows();
  }
});

process.on("uncaughtException", (err) => {
  logManager.error("process uncaughtException:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  logManager.error("process unhandledRejection:", reason, promise);
});
