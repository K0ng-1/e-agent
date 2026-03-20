import { ThemeMode } from "@common/constants";
import { create } from "zustand";

type State = {
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
};

const useThemeStore = create<State>()((set) => {
  return {
    themeMode: ThemeMode.DARK,
    setThemeMode: (themeMode: ThemeMode) => set({ themeMode }),
  };
});

export default useThemeStore;
