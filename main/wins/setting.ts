import { BrowserWindow, ipcMain } from "electron";
import { IPC_EVENTS, WINDOW_NAMES } from "@common/constants";
import windowManager from "@main/service/WindowService";

function setupSettingWindow() {
  ipcMain.on(`${IPC_EVENTS.OPEN_WINDOW}:${WINDOW_NAMES.SETTING}`, () => {
    const window = windowManager.get(WINDOW_NAMES.SETTING);
    if (window && !window.isDestroyed()) return windowManager.focus(window);

    windowManager.create(WINDOW_NAMES.SETTING, {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
    });
  });
}
export default setupSettingWindow;
