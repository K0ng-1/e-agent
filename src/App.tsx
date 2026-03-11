import React from "react";
import { RouterProvider } from "react-router/dom";
import { HeroUIProvider } from "@heroui/react";
import router from "@/router";
import StorePage from "@/StorePage";
import { Button } from "@heroui/button";
export default function App() {
  return (
    <React.StrictMode>
      <HeroUIProvider>
        <div className="container">
          <h1 className="text-3xl font-bold underline text-center w-full">
            Hello, World!
          </h1>
          <div className="border-b-2 border-solid border-gray-300">
            <Button color="primary">Button</Button>
          </div>
          <StorePage />
          <RouterProvider router={router} />
        </div>
      </HeroUIProvider>
    </React.StrictMode>
  );
}
