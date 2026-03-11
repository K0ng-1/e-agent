import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
    children: [
      {
        path: "/home",
        element: <div>Home</div>,
      }
    ]
  },
  {
    path: "/login",
    element: <div>Login</div>,
  }
]);

export default router