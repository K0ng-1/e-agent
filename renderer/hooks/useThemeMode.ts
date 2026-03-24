import { useEffect, useMemo } from "react";
import { SunIcon, MoonIcon, TvIcon } from "@heroicons/react/24/solid";
import { ThemeMode } from "@common/constants";
import useThemeStore from "@renderer/store/theme";
const iconMap = new Map([
  [ThemeMode.SYSTEM, TvIcon],
  [ThemeMode.LIGHT, SunIcon],
  [ThemeMode.DARK, MoonIcon],
]);
export function useThemeMode() {
  const themeMode = useThemeStore((s) => s.themeMode);
  const _updateThemeMode = useThemeStore((s) => s.setThemeMode);
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const setIsDarkMode = useThemeStore((s) => s.setIsDarkMode);
  const themeChangeCallbacks: Set<(mode: ThemeMode) => void> = new Set();

  const setThemeMode = (mode: ThemeMode) => {
    _updateThemeMode(mode);
    window.api.setThemeMode(mode);
    if (mode === ThemeMode.SYSTEM) {
      window.api.getThemeMode().then((systemMode) => {
        _updateThemeMode(systemMode);
      });
    }
  };

  const getThemeMode = () => themeMode;

  const onThemeChange = (callback: (mode: ThemeMode) => void) => {
    themeChangeCallbacks.add(callback);
  };

  function updateThemeMode(mode: ThemeMode) {
    if (getThemeMode() !== mode) {
      setThemeMode(mode);
    }
  }

  useEffect(() => {
    console.dir("themeMode Change:" + themeMode);
    const cancel = window.api.onSystemThemeChange(async () => {
      setIsDarkMode(await window.api.isDarkMode());
      const mode = await window.api.getThemeMode();
      _updateThemeMode(mode);
      themeChangeCallbacks.forEach((cb) => cb(mode));
    });
    (async () => {
      setIsDarkMode(await window.api.isDarkMode());
      _updateThemeMode(await window.api.getThemeMode());
    })();

    return cancel;
  }, [themeMode, _updateThemeMode]);

  const ThemeIcon = useMemo(
    () => iconMap.get(themeMode) || SunIcon,
    [themeMode],
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light", "system");
    document.documentElement.classList.add(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return {
    themeMode,
    isDarkMode,
    ThemeIcon,
    setThemeMode,
    updateThemeMode,
    getThemeMode,
    onThemeChange,
  };
}

export default useThemeMode;
