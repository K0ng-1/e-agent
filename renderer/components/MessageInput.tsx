import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Textarea, Tooltip } from "@heroui/react";
import ProviderSelect from "@renderer/components/ProviderSelect";
import { ArrowUpIcon, PauseIcon } from "@heroicons/react/24/outline";
import { MessageInputStatus } from "@renderer/types/enum";
import { listenShortcut } from "@renderer/utils/shortcut";
import { SHORTCUT_KEYS } from "@common/constants";

interface Props {
  message: string;
  setMessage: (message: string) => void;
  provider: string;
  setProvider: (provider: string) => void;
  placeholder?: string;
  className?: string;
  onSend?: () => void;
  rows?: number;
}

export default function MessageInput(props: Props) {
  const {
    message,
    setMessage,
    provider,
    setProvider,
    placeholder,
    className,
    onSend,
    rows = 3,
  } = props;
  const { t } = useTranslation();
  const [status, setStatus] = useState<MessageInputStatus>(
    MessageInputStatus.NORMAL,
  );
  const [focused, setFocused] = useState(false);

  const isBtnDisabled = useMemo(() => {
    if (status === MessageInputStatus.LOADING) return true;
    if (status === MessageInputStatus.STREAMING) return false;

    if (!provider) return true;
    return message.length === 0;
  }, [status, provider, message]);

  const btnTipContent = useMemo(() => {
    if (status === MessageInputStatus.LOADING) {
      return t("main.message.sending");
    }

    if (status === MessageInputStatus.STREAMING) {
      return t("main.message.stopGeneration");
    }
    return t("main.message.send");
  }, [status]);

  const isLoading = status === MessageInputStatus.LOADING;

  const BtnIconMap = {
    [MessageInputStatus.NORMAL]: <ArrowUpIcon className="size-4" />,
    [MessageInputStatus.STREAMING]: <PauseIcon className="size-4" />,
    [MessageInputStatus.LOADING]: null,
  };

  const handelSend = async () => {
    if (status === MessageInputStatus.STREAMING) return;
    if (isBtnDisabled) return;
    onSend?.();
  };

  useEffect(() => {
    const unlisten = listenShortcut(SHORTCUT_KEYS.SEND_MESSAGE, () => {
      if (
        status === MessageInputStatus.STREAMING ||
        isBtnDisabled ||
        !focused
      ) {
        return;
      }
      handelSend();
    });
    return unlisten;
  }, []);

  return (
    <div className={clsx("flex flex-col h-full", className)}>
      <Textarea
        value={message}
        onValueChange={setMessage}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disableAnimation
        disableAutosize
        placeholder={placeholder}
        rows={rows}
        className="flex-1"
        classNames={{
          inputWrapper: "flex-1",
          input: "h-full",
        }}
      />
      <div className="flex justify-between items-center mt-3">
        <div className="w-[200px]">
          <ProviderSelect value={provider} onChange={setProvider} />
        </div>
        <Tooltip content={btnTipContent}>
          <Button
            isLoading={isLoading}
            radius="full"
            color="primary"
            size="sm"
            isDisabled={isBtnDisabled}
            onPress={handelSend}
            isIconOnly
          >
            {BtnIconMap[status]}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
