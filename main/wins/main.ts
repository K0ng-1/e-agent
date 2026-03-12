import { WINDOW_NAMES, MAIN_WIN_SIZE } from "@common/constants";
import windowManager from "@main/service/WindowService";

export function setupMainWindow() {
  return windowManager.create(WINDOW_NAMES.MAIN, MAIN_WIN_SIZE);
}
