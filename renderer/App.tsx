import { HeroUIProvider } from "@heroui/react";
import router from "./router";
import React from "react";
import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
export default function App() {
  const { t } = useTranslation();
  document.querySelector("title")!.textContent = t("app.title");
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider className="w-full h-full text-tx-primary">
          <RouterProvider router={router} />
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
