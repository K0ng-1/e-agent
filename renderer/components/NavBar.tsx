import React from "react";
import DragRegion from "./DragRegion";
import { Tooltip } from "@heroui/react";
import {
  ChatBubbleBottomCenterTextIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "./ThemeSwitcher";
export default function NavBar() {
  const openSettingWindow = () => {};
  const { t } = useTranslation();

  const route = {
    name: "conversation",
  };
  return (
    <DragRegion>
      <nav className="h-[calc(100%-1.4rem)] flex flex-col px-4 py-2 mt-[.7rem] mb-[.7rem] border-r border-r-input text-tx-secondary">
        <ul className="flex-auto">
          <li
            className={clsx(
              { active: route.name === "conversation" },
              "sidebar-item no-drag cursor-pointer hover:text-primary-hover text-tx-primary",
            )}
          >
            <Tooltip content={t("main.sidebar.conversations")}>
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
            </Tooltip>
          </li>
        </ul>
        <ul>
          <li className="sidebar-item mt-3 no-drag cursor-pointer hover:text-primary-subtle">
            <ThemeSwitcher />
          </li>
          <li
            className="sidebar-item mt-3 no-drag cursor-pointer hover:text-primary-subtle"
            onClick={openSettingWindow}
          >
            <Tooltip content={t("main.sidebar.settings")}>
              <Cog8ToothIcon className="w-5 h-5" />
            </Tooltip>
          </li>
        </ul>
      </nav>
    </DragRegion>
  );
}
