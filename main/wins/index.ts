import { setupMainWindow } from "./main";

export function setupWindows() {
  const window = setupMainWindow();
  window.webContents.openDevTools();
  return window;
}
