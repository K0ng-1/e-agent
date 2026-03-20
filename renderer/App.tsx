import { HeroUIProvider } from "@heroui/react";
import router from "./router";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
import { initProviders } from "./dataBase";
import useProvidersStore from "./store/providers";
import useConversationStore from "./store/Conversations";
import { logger } from "./utils";
import { useThemeMode } from "./hooks";

export default function App() {
  const { t } = useTranslation();
  const { themeMode } = useThemeMode();
  const initializeProviders = useProvidersStore((s) => s.initialize);
  const initializeConversations = useConversationStore((s) => s.initialize);
  useEffect(() => {
    document.querySelector("title")!.textContent = t("app.title");
    (async () => {
      await initProviders();
      await initializeProviders();
      await initializeConversations();
    })();
    logger.info("App Mounted");
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light", "system");
    document.documentElement.className = themeMode;
  }, [themeMode]);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full">
          <RouterProvider router={router} />
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
