import { useEffect, useState } from "react";
import { CONFIG_KEYS, ThemeMode } from "@common/constants";
import { updateLanguage } from "@renderer/i18n";
import { IConfig } from "@common/types";
import useThemeMode from "./useThemeMode";
import useFontSize from "./useFontSize";
import usePrimaryColor from "./usePrimaryColor";

const conifgKeys: (keyof IConfig)[] = [
  CONFIG_KEYS.THEME_MODE,
  CONFIG_KEYS.PRIMARY_COLOR,
  CONFIG_KEYS.LANGUAGE,
  CONFIG_KEYS.FONT_SIZE,
  CONFIG_KEYS.MINIMIZE_TO_TRAY,
  CONFIG_KEYS.PROVIDER,
  CONFIG_KEYS.DEFAULT_MODEL,
];

const defaultConfig: IConfig = {
  [CONFIG_KEYS.THEME_MODE]: ThemeMode.SYSTEM,
  [CONFIG_KEYS.PRIMARY_COLOR]: "#BB5BE7",
  [CONFIG_KEYS.LANGUAGE]: "zh",
  [CONFIG_KEYS.FONT_SIZE]: 14,
  [CONFIG_KEYS.MINIMIZE_TO_TRAY]: false,
  [CONFIG_KEYS.PROVIDER]: "",
  [CONFIG_KEYS.DEFAULT_MODEL]: null,
};

// 初始化配置
conifgKeys.forEach((key) =>
  window.api.getConfig(key).then((val) => {
    defaultConfig[key] = val as never;
    updateLanguage(key, val);
  }),
);

export function useConfig() {
  const [config, updateConfig] = useState<IConfig>(defaultConfig);
  const { updateThemeMode } = useThemeMode();
  const { setFontSize } = useFontSize(config[CONFIG_KEYS.FONT_SIZE]);
  const { setPrimaryColor } = usePrimaryColor(config[CONFIG_KEYS.PRIMARY_COLOR]);
  console.dir(config);

  function setConfig(key: keyof IConfig, value: IConfig[keyof IConfig]) {
    console.dir({ key, value });
    updateConfig({ ...config, [key]: value });

    (async () => {
      if (config[key] !== (await window.api.getConfig(key))) return;
      window.api.setConfig(key, value);
    })();
  }

  useEffect(() => {
    const removeListener = window.api.onConfigChange((_config) => {
      conifgKeys.forEach((key) => {
        // 更新语言
        updateLanguage(key, _config[key]);

        // 更新主题模式
        if (key === CONFIG_KEYS.THEME_MODE) updateThemeMode(_config[key]);

        // 更新字体大小
        if (key === CONFIG_KEYS.FONT_SIZE) setFontSize(_config[key]);

        // 更新主颜色
        if (key === CONFIG_KEYS.PRIMARY_COLOR) setPrimaryColor(_config[key]);

        if (config[key] === _config[key]) return;

        setConfig(key, _config[key]);
      });
    });
    return removeListener;
  }, [config, setConfig]);

  return { config, setConfig };
}
