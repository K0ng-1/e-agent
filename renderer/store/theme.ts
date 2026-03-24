import { ThemeMode } from "@common/constants";
import { create } from "zustand";

type State = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (themeMode: ThemeMode) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
};

const useThemeStore = create<State>()((set) => {
  return {
    themeMode: ThemeMode.DARK,
    isDarkMode: false,
    setThemeMode: (themeMode: ThemeMode) => set({ themeMode }),
    setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  };
});

export default useThemeStore;
