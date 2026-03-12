import React from "react";
import { RouterProvider } from "react-router/dom";
import { HeroUIProvider } from "@heroui/react";
import router from "./router";

export default function App() {
  return (
    <React.StrictMode>
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </React.StrictMode>
  );
}
