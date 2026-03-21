import { Button, Select, SelectItem, SelectSection } from "@heroui/react";
import useProvidersStore from "@renderer/store/providers";
import { useTranslation } from "react-i18next";

type ProviderSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProviderSelect(props: ProviderSelectProps) {
  const { value, onChange } = props;
  const { t } = useTranslation();

  const providers = useProvidersStore((s) => s.providers);
  const providerOptions = providers
    .filter((it) => it.visible)
    .map((it) => ({
      key: it.id,
      label: it.title || it.name,
      type: "group",
      children: it.models.map((model) => ({
        label: model,
        value: `${it.id}:${model}`,
      })),
    }));
  const handleSettingWindow = () => {};

  const SelectChildren = providerOptions.map((provider) => {
    const { key, label, children } = provider;
    if (children) {
      return (
        <SelectSection showDivider key={key} title={label}>
          {children.map((child) => (
            <SelectItem key={child.value}>{child.label}</SelectItem>
          ))}
        </SelectSection>
      );
    }
    return <SelectItem key={key}>{label}</SelectItem>;
  });

  return (
    <>
      {/* <span className="text-tx-primary text-[0.7rem]">
        {t("main.conversation.goSettings")}
        <Button
          className="go-setting-btn px-1 font-bold"
          size="sm"
          onPress={handleSettingWindow}
        >
          {t("main.conversation.settings")}
        </Button>
        {t("main.conversation.addModel")}
      </span> */}
      <Select
        placeholder={t("main.conversation.selectModel")}
        size="sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t("main.conversation.selectModel")}
      >
        {SelectChildren}
      </Select>
    </>
  );
}
