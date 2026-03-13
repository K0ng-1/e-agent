import { ThemeMode } from "@common/constants";
import { SunIcon, MoonIcon, TvIcon } from "@heroicons/react/24/solid";
const iconMap = new Map([
  [ThemeMode.SYSTEM, TvIcon],
  [ThemeMode.LIGHT, SunIcon],
  [ThemeMode.DARK, MoonIcon],
]);
export function useThemeMode() {
  const [themeMode, updateThemeMode] = useState<ThemeMode>(ThemeMode.DARK);
  const themeChangeCallbacks: Array<(mode: ThemeMode) => void> = [];
  const themeModeRef = useRef(themeMode);

  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

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
    themeChangeCallbacks.push(callback);
  };

  useEffect(() => {
    (async () => {
      window.api.onSystemThemeChange(async () => {
        const mode = await window.api.getThemeMode();
        if (themeModeRef.current === ThemeMode.SYSTEM) {
          updateThemeMode(mode);
        }
        themeChangeCallbacks.forEach((cb) => cb(mode));
      });
      updateThemeMode(await window.api.getThemeMode());
    })();
  }, []);

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
