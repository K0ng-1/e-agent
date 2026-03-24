import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import router from "./router";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
import { initProviders } from "./dataBase";
import useProvidersStore from "./store/providers";
import useConversationStore from "./store/Conversations";
import { logger } from "./utils";
import { useConfig } from "./hooks";

export default function App() {
  const { t } = useTranslation();
  const initializeProviders = useProvidersStore((s) => s.initialize);
  const initializeConversations = useConversationStore((s) => s.initialize);
  useConfig();
  useEffect(() => {
    document.querySelector("title")!.textContent = t("app.title");
    (async () => {
      await initProviders();
      await initializeProviders();
      await initializeConversations();
    })();
    logger.info("App Mounted");
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full">
          <ToastProvider placement="top-center" toastOffset={25} />
          <RouterProvider router={router} />
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
