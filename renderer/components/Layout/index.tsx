import { Outlet } from "react-router";
import Aside from "./Aside";
import TitleBar from "./TitleBar";
import DragRegion from "@renderer/components/DragRegion";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen flex">
      <aside className="w-[200px] h-full flex flex-col shrink-0 bg-gray-800">
        <Aside />
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
