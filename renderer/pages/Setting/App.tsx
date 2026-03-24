import React, { useEffect, useState } from "react";
import { HeroUIProvider, Tabs, Tab } from "@heroui/react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@renderer/components/ErrorBoundary";
import { logger } from "@renderer/utils";
import TitleBar from "@renderer/components/Layout/TitleBar";
import DragRegion from "@renderer/components/DragRegion";
import BaseConfig from "./BaseConfig";
import ModelConfig from "./ModelConfig";

export default function App() {
  console.dir("app render");
  const { t } = useTranslation();
  const [selected, setSelected] = useState<"base" | "model">("base");
  const pages = [
    {
      key: "base",
      title: t("settings.base"),
      component: BaseConfig,
    },
    {
      key: "model",
      title: t("settings.provider.modelConfig"),
      component: ModelConfig,
    },
  ];

  useEffect(() => {
    logger.info("Dialog App Mounted");
  }, []);

  function onWindowClose() {
    setTimeout(() => setSelected("base"), 300);
  }

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full flex flex-col">
          <TitleBar isMaximizable={false} onClose={onWindowClose}>
            <DragRegion className="text-sm h-full w-full flex items-center font-bold text-tx-primary pl-3">
              {t("settings.title")}
            </DragRegion>
          </TitleBar>
          <div className="overflow-auto">
            <Tabs
              aria-label="Options"
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as "base" | "model")}
              variant="underlined"
              color="primary"
              classNames={{
                tabList: "gap-6 w-full overflow-hidden",
              }}
            >
              {pages.map((page) => (
                <Tab key={page.key} title={page.title}>
                  <page.component />
                </Tab>
              ))}
            </Tabs>
          </div>
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
