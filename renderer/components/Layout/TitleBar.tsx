import { useWinManager } from "@renderer/hooks";
import { Button, Tooltip } from "@heroui/react";

import {
  MinusIcon,
  XMarkIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
interface TitleBarProps {
  title?: string;
  isMaximizable?: boolean;
  isMinimizable?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
export default function TitleBar(props: TitleBarProps) {
  const { t } = useTranslation();
  const {
    title,
    isMaximizable = true,
    isMinimizable = true,
    isClosable = true,
    onClose,
    children,
  } = props;

  const { closeWindow, minimizeWindow, maximizeWindow, isMaximized } =
    useWinManager();

  const handleClose = () => {
    onClose?.();
    closeWindow();
  };
  return (
    <header className="title-bar flex items-start justify-between h-[30px]">
      <div className="title-bar-main h-full flex-auto">
        {children ?? title ?? ""}
      </div>
      <div className="title-bar-controls w-[80px] flex items-center justify-end text-tx-secondary">
        <Tooltip content={t("window.minimize")}>
          {isMinimizable && (
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={minimizeWindow}
            >
              <MinusIcon className="w-4 h-4" />
            </Button>
          )}
        </Tooltip>
        <Tooltip content={t("window.maximize")}>
          {isMaximizable && (
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={maximizeWindow}
            >
              {isMaximized}
              {!isMaximized && <ArrowsPointingOutIcon className="w-4 h-4" />}
              {isMaximized && <ArrowsPointingInIcon className="w-4 h-4" />}
            </Button>
          )}
        </Tooltip>
        <Tooltip content={t("window.close")}>
          {isClosable && (
            <Button
              size="sm"
              variant="light"
              isIconOnly
              className="hover:!bg-danger-100"
              onPress={handleClose}
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          )}
        </Tooltip>
      </div>
    </header>
  );
}
