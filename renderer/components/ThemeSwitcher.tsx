import { ThemeMode } from "@common/constants";
import { useThemeMode } from "@renderer/hooks";
export default function ThemeSwitcher() {
  const { LIGHT, DARK, SYSTEM } = ThemeMode;
  const { ThemeIcon, setThemeMode, isDarkMode, themeMode } = useThemeMode();

  const toggleThemeMode = () => {
    const mode = isDarkMode ? LIGHT : themeMode === LIGHT ? SYSTEM : DARK;
    setThemeMode(mode);
  };
  return <ThemeIcon onClick={toggleThemeMode} className="w-5 h-5" />;
}
