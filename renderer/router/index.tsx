import Layout from "@renderer/components/Layout";
import HomePage from "@renderer/pages/HomePage";
import { createMemoryRouter } from "react-router";

const router = createMemoryRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        id: "home",
        path: "/",
        element: <HomePage />,
      },
      {
        index: true,
        id: "conversation",
        path: "/conversation/:id?",
        lazy: {
          Component: async () =>
            (await import("@renderer/pages/Conversation/index")).default,
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
