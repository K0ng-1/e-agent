import { app, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";
import { setupWindows } from "./wins";

if (started) {
  app.quit();
}

app.on("ready", setupWindows);

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
