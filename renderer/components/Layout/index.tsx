import { Outlet } from "react-router";
import Aside from "./Aside";
import TitleBar from "./TitleBar";
import DragRegion from "@renderer/components/DragRegion";
import NavBar from "../NavBar";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full h-full">
      <aside className="w-[320px] flex shrink-0 bg-main shadow-[-3px_-2px_10px_rgba(101,101,101,0.2)]">
        <div className="flex flex-auto">
          <NavBar />
          <div className="flex-auto">
            <Aside />
          </div>
        </div>
      </aside>
      <main className="flex-auto">
        <TitleBar
          title={t("app.title")}
          onClose={() => {
            console.log("close");
          }}
        >
          <DragRegion className="h-full" />
        </TitleBar>
        <Outlet />
      </main>
    </div>
  );
}
