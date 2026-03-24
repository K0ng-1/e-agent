import { Button, HeroUIProvider } from "@heroui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@renderer/components/ErrorBoundary";
import { logger } from "@renderer/utils";
import { useConfig, useDialog } from "@renderer/hooks";
import TitleBar from "@renderer/components/Layout/TitleBar";
import DragRegion from "@renderer/components/DragRegion";

export default function App() {
  const { t } = useTranslation();
  useConfig();
  const { params, confirmDialog, cancelDialog } = useDialog();
  const { title, content, confirmText, cancelText } = params;

  useEffect(() => {
    logger.info("Dialog App Mounted");
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full flex flex-col">
          <TitleBar isMinimizable={false} isMaximizable={false}>
            <DragRegion className="text-sm flex items-center w-full h-full font-bold text-tx-primary pl-3">
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
