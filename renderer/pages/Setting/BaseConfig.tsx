import { CONFIG_KEYS, ThemeMode } from "@common/constants";
import { debounce } from "@common/utils";
import { Select, SelectItem, Switch } from "@heroui/react";
import { useConfig } from "@renderer/hooks";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const languageOptions = [
  { label: "中文", value: "zh" },
  { label: "English", value: "en" },
];

export default function BaseConfig() {
  const { t } = useTranslation();
  const { config, setConfig } = useConfig();
  console.dir("baseConfig: ");
  const themeModeOptions = useMemo(
    () => [
      { label: t("settings.theme.dark"), value: ThemeMode.DARK },
      { label: t("settings.theme.light"), value: ThemeMode.LIGHT },
      { label: t("settings.theme.system"), value: ThemeMode.SYSTEM },
    ],
    [t],
  );

  const fontSizeOptions = useMemo(
    () => [
      { label: t("settings.appearance.fontSizeOptions.10"), value: 10 },
      { label: t("settings.appearance.fontSizeOptions.12"), value: 12 },
      { label: t("settings.appearance.fontSizeOptions.14"), value: 14 },
      { label: t("settings.appearance.fontSizeOptions.16"), value: 16 },
      { label: t("settings.appearance.fontSizeOptions.18"), value: 18 },
      { label: t("settings.appearance.fontSizeOptions.20"), value: 20 },
      { label: t("settings.appearance.fontSizeOptions.24"), value: 24 },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-5 px-3">
      <Select
        variant="faded"
        label={t("settings.theme.label")}
        labelPlacement="outside-top"
        selectedKeys={[config.themeMode]}
        onChange={(e) => setConfig(CONFIG_KEYS.THEME_MODE, e.target.value)}
      >
        {themeModeOptions.map((item) => (
          <SelectItem key={item.value}>{item.label}</SelectItem>
        ))}
      </Select>
      <div>
        <label className="block z-10 shrink-0 subpixel-antialiased text-small group-data-[has-label-outside=true]:pointer-events-auto relative text-foreground pb-2 pointer-events-auto will-change-auto origin-top-left rtl:origin-top-right duration-200! ease-out! transition-[transform,color,left,opacity,translate,scale] motion-reduce:transition-none">{`${t("settings.theme.primaryColor")}-${config.primaryColor}`}</label>
        <input
          type="color"
          defaultValue={config.primaryColor}
          onChange={debounce(
            (e) => setConfig(CONFIG_KEYS.PRIMARY_COLOR, e.target.value),
            300,
          )}
        />
      </div>
      <Select
        variant="faded"
        label={t("settings.language.label")}
        labelPlacement="outside-top"
        selectedKeys={[config.language]}
        onChange={(e) => setConfig(CONFIG_KEYS.LANGUAGE, e.target.value)}
      >
        {languageOptions.map((item) => (
          <SelectItem key={item.value}>{item.label}</SelectItem>
        ))}
      </Select>
      <Select
        variant="faded"
        label={t("settings.appearance.fontSize")}
        labelPlacement="outside-top"
        selectedKeys={[String(config.fontSize)]}
        onChange={(e) => setConfig(CONFIG_KEYS.FONT_SIZE, e.target.value)}
      >
        {fontSizeOptions.map((item) => (
          <SelectItem key={item.value}>{item.label}</SelectItem>
        ))}
      </Select>
      <div>
        <label className="block z-10 shrink-0 subpixel-antialiased text-small group-data-[has-label-outside=true]:pointer-events-auto relative text-foreground pb-2 pointer-events-auto will-change-auto origin-top-left rtl:origin-top-right duration-200! ease-out! transition-[transform,color,left,opacity,translate,scale] motion-reduce:transition-none">
          {t("settings.behavior.minimizeToTray")}
        </label>
        <Switch
          isSelected={config.minimizeToTray}
          onValueChange={(value) =>
            setConfig(CONFIG_KEYS.MINIMIZE_TO_TRAY, value)
          }
        />
      </div>
    </div>
  );
}
