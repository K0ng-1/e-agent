import { WINDOW_NAMES } from "@common/constants";

export function openWindow(name: WINDOW_NAMES) {
  window.api.openWindow(name);
}
