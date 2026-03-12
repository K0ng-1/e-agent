import { useWinManager } from "@renderer/hooks";
import { Tooltip } from "@heroui/tooltip";
import styles from "@renderer/styles/titleBar.module.css";

import {
  MinusIcon,
  XMarkIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
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
            <button
              className={clsx(
                styles.titleBarButton,
                "cursor-pointer hover:bg-input",
              )}
              onClick={minimizeWindow}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
          )}
        </Tooltip>
        <Tooltip content={t("window.maximize")}>
          {isMaximizable && (
            <button
              className={clsx(
                styles.titleBarButton,
                "cursor-pointer hover:bg-input",
              )}
              onClick={maximizeWindow}
            >
              {isMaximized}
              {!isMaximized && <ArrowsPointingOutIcon className="w-4 h-4" />}
              {isMaximized && <ArrowsPointingInIcon className="w-4 h-4" />}
            </button>
          )}
        </Tooltip>
        <Tooltip content={t("window.close")}>
          {isClosable && (
            <button
              className={clsx(
                styles.titleBarButton,
                "close-button cursor-pointer hover:bg-red-300",
              )}
              onClick={handleClose}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </Tooltip>
      </div>
    </header>
  );
}
