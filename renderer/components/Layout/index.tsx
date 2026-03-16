import { Outlet } from "react-router";
import Aside from "./Aside";
import TitleBar from "./TitleBar";
import DragRegion from "@renderer/components/DragRegion";
import NavBar from "../NavBar";
import ResizeDivider from "../ResizeDivider";
export const ConversitionContext = createContext<{ width: number }>({
  width: 0,
});
export default function Layout() {
  const { t } = useTranslation();
  const [asideWidth, setAsideWidth] = useState(320);
  const handleOnResize = (size: number) => {
    setAsideWidth(size);
  };
  return (
    <div className="flex w-full h-full">
      <aside
        className="flex bg-main shadow-[-3px_-2px_10px_rgba(101,101,101,0.2)]"
        style={{ width: asideWidth }}
      >
        <NavBar />
        <ConversitionContext.Provider value={{ width: asideWidth }}>
          <Aside />
        </ConversitionContext.Provider>
      </aside>
      <ResizeDivider
        direction="vertical"
        size={asideWidth}
        maxSize={800}
        minSize={200}
        onResize={handleOnResize}
      />
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
