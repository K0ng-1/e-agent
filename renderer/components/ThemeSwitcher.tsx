import { ThemeMode } from "@common/constants";
import { useThemeMode } from "@renderer/hooks";
import TooltipTheme from "./TooltipTheme";
export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { LIGHT, DARK, SYSTEM } = ThemeMode;
  const { ThemeIcon, setThemeMode, isDarkMode, themeMode } = useThemeMode();

  const toggleThemeMode = () => {
    const mode = isDarkMode ? LIGHT : themeMode === LIGHT ? SYSTEM : DARK;
    setThemeMode(mode);
  };
  return (
    <TooltipTheme content={t(`settings.theme.${themeMode}`)} placement="right">
      <ThemeIcon onClick={toggleThemeMode} className="w-5 h-5" />
    </TooltipTheme>
  );
}
