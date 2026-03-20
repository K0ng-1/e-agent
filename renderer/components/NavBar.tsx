import { useTranslation } from "react-i18next";
import clsx from "clsx";
import DragRegion from "./DragRegion";
import {
  ChatBubbleBottomCenterTextIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "./ThemeSwitcher";
import { Tooltip } from "@heroui/react";
export default function NavBar() {
  const openSettingWindow = () => {};
  const { t } = useTranslation();

  return (
    <DragRegion>
      <ul className="h-full flex flex-col px-3 py-4 border-r border-r-input text-tx-secondary">
        <li
          className={clsx(
            { active: location.pathname === "/conversation" },
            "sidebar-item no-drag cursor-pointer hover:text-primary-hover text-tx-primary",
          )}
        >
          <Tooltip content={t("main.sidebar.conversations")} placement="right">
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
          </Tooltip>
        </li>
        <li className="flex-1"></li>
        <li className="sidebar-item mt-3 no-drag cursor-pointer hover:text-primary-subtle">
          <ThemeSwitcher />
        </li>
        <li
          className="sidebar-item mt-3 no-drag cursor-pointer hover:text-primary-subtle"
          onClick={openSettingWindow}
        >
          <Tooltip content={t("main.sidebar.settings")} placement="right">
            <Cog8ToothIcon className="w-5 h-5" />
          </Tooltip>
        </li>
      </ul>
    </DragRegion>
  );
}
