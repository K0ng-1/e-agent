import { ThemeMode } from "@common/constants";
import { SunIcon, MoonIcon, TvIcon } from "@heroicons/react/24/solid";
import useThemeStore from "@renderer/store/theme";
import { useEffect, useMemo } from "react";
const iconMap = new Map([
  [ThemeMode.SYSTEM, TvIcon],
  [ThemeMode.LIGHT, SunIcon],
  [ThemeMode.DARK, MoonIcon],
]);
export function useThemeMode() {
  const themeMode = useThemeStore((s) => s.themeMode);
  const updateThemeMode = useThemeStore((s) => s.setThemeMode);
  const themeChangeCallbacks: Set<(mode: ThemeMode) => void> = new Set();

  const setThemeMode = (mode: ThemeMode) => {
    updateThemeMode(mode);
    window.api.setThemeMode(mode);
    if (mode === ThemeMode.SYSTEM) {
      window.api.getThemeMode().then((systemMode) => {
        updateThemeMode(systemMode);
      });
    }
  };

  const getThemeMode = () => themeMode;

  const onThemeChange = (callback: (mode: ThemeMode) => void) => {
    themeChangeCallbacks.add(callback);
  };

  useEffect(() => {
    const cancel = window.api.onSystemThemeChange(async () => {
      const mode = await window.api.getThemeMode();
      updateThemeMode(mode);
      themeChangeCallbacks.forEach((cb) => cb(mode));
    });
    (async () => {
      updateThemeMode(await window.api.getThemeMode());
    })();

    return cancel;
  }, [themeMode, updateThemeMode]);
  const isDarkMode = useMemo(() => {
    if (themeMode === ThemeMode.SYSTEM) {
      return !!window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return themeMode === ThemeMode.DARK;
  }, [themeMode]);

  const ThemeIcon = useMemo(
    () => iconMap.get(themeMode) || SunIcon,
    [themeMode],
  );
  return {
    themeMode,
    isDarkMode,
    ThemeIcon,
    setThemeMode,
    getThemeMode,
    onThemeChange,
  };
}

export default useThemeMode;
