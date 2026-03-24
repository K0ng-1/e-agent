import { SHORTCUT_KEYS } from "@common/constants";

export function listenShortcut(shortcut: SHORTCUT_KEYS, callback: () => void) {
  return window.api.onShortcutCalled(shortcut, callback);
}
