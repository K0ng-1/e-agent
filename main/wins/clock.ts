import { BrowserWindow, ipcMain } from "electron";
import { IPC_EVENTS, WINDOW_NAMES } from "@common/constants";
import windowManager from "@main/service/WindowService";
import { debounce } from "@common/utils";
function setupClockWindow() {
  ipcMain.on(`${IPC_EVENTS.OPEN_WINDOW}:${WINDOW_NAMES.CLOCK}`, () => {
    const window = windowManager.get(WINDOW_NAMES.CLOCK);
    if (window && !window.isDestroyed()) return windowManager.focus(window);

    const win = windowManager.create(
      WINDOW_NAMES.CLOCK,
      {
        width: 350,
        height: 350,
        minWidth: 350,
        minHeight: 350,
        maxWidth: 350,
        maxHeight: 350,
      },
      {
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: "#00000000",
      },
    );

    win?.setAlwaysOnTop(true, "pop-up-menu");
  });

  ipcMain.on(IPC_EVENTS.SET_WINDOW_POSITION, (e, x, y) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win) return;
    debounce(() => win.setPosition(Math.floor(x), Math.floor(y), false), 100)();
  });

  ipcMain.on(IPC_EVENTS.IGNORE_MOUSE_EVENT, (e, ignore) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win) return;
    win?.setIgnoreMouseEvents(ignore, { forward: true });
  });
}
export default setupClockWindow;
