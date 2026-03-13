import Layout from "@renderer/components/Layout";
import HomePage from "@renderer/pages/HomePage";
import { createMemoryRouter } from "react-router";

const router = createMemoryRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        id: "home",
        Component: HomePage,
      },
      {
        id: "store",
        path: "/store",
        lazy: {
          Component: async () =>
            (await import("@renderer/pages/StorePage")).default,
        },
      },
      {
        id: "conversation",
        path: "/conversation",
        lazy: {
          Component: async () =>
            (await import("@renderer/pages/StorePage")).default,
        },
      },
    ],
  },
  {
    id: "login",
    path: "/login",
    element: <div>Login</div>,
  },
]);

export default router;
