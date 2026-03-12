import Layout from "@renderer/components/Layout";
import HomePage from "@renderer/pages/HomePage";
import StorePage from "@renderer/pages/StorePage";
import { createMemoryRouter } from "react-router";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <div>Login</div>,
  },
]);

export default router;
