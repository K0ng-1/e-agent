import { HeroUIProvider } from "@heroui/react";
import router from "./router";
import React from "react";
import { RouterProvider } from "react-router";

export default function App() {
  const { t } = useTranslation();
  document.querySelector("title")!.textContent = t("app.title");
  return (
    <React.StrictMode>
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </React.StrictMode>
  );
}
