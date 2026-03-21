import { Button, HeroUIProvider } from "@heroui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@renderer/components/ErrorBoundary";
import { logger } from "@renderer/utils";
import { useDialog, useThemeMode } from "@renderer/hooks";
import TitleBar from "@renderer/components/Layout/TitleBar";
import DragRegion from "@renderer/components/DragRegion";

export default function App() {
  const { t } = useTranslation();
  const { themeMode } = useThemeMode();
  const { params, confirmDialog, cancelDialog } = useDialog();
  const { title, content, confirmText, cancelText } = params;

  useEffect(() => {
    logger.info("Dialog App Mounted");
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light", "system");
    document.documentElement.className = themeMode;
  }, [themeMode]);

  console.dir("themeMode, " + themeMode);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full flex flex-col">
          <TitleBar isMinimizable={false} isMaximizable={false}>
            <DragRegion className="p-3 text-sm font-bold text-tx-primary">
              {t(title ?? "")}
            </DragRegion>
          </TitleBar>
          <div className="flex flex-col flex-auto p-5">
            <p className="flex-auto text-sm text-tx-primary">
              {t(content ?? "")}
            </p>
            <div className="text-right">
              <Button
                size="sm"
                variant="flat"
                className="mr-3"
                onPress={cancelDialog}
              >
                {t(cancelText || "dialog.cancel")}
              </Button>
              <Button
                size="sm"
                className="hover:bg-danger-300!"
                onPress={confirmDialog}
              >
                {t(confirmText || "dialog.confirm")}
              </Button>
            </div>
          </div>
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
