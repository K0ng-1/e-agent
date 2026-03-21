import setupDialogWindow from "./dialog";
import { setupMainWindow } from "./main";

export function setupWindows() {
  const window = setupMainWindow();
  setupDialogWindow();
  window?.webContents.openDevTools();
  return window;
}
