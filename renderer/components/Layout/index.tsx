import { Outlet } from "react-router";
import Aside from "./Aside";

export default function Layout() {
  return (
    <div>
      <Aside />
      <Outlet />
    </div>
  );
}
