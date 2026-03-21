import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import ProviderSelect from "@renderer/components/ProviderSelect";
import { Button, Textarea, Tooltip } from "@heroui/react";
import { ArrowUpCircleIcon, PauseIcon } from "@heroicons/react/24/solid";
import { MessageInputStatus } from "@renderer/types/enum";
import { useConversation } from "@renderer/hooks";
export default function MessageInput() {
  const { t } = useTranslation();
  const { createConversation } = useConversation();
  const [status, setStatus] = useState<MessageInputStatus>(
    MessageInputStatus.NORMAL,
  );
  const [provider, setProvider] = useState("");
  const [message, setMessage] = useState("");
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
    normal: <ArrowUpCircleIcon className="size-5" />,
    streaming: <PauseIcon className="size-5" />,
    loading: null,
  };

  const handelSend = async () => {
    if (status === MessageInputStatus.STREAMING) return;
    if (isBtnDisabled) return;
    const id = await createConversation({ provider, message });

    console.dir(id);
    if (id) {
      setMessage("");
    }
  };

  return (
    <>
      <div className="message-input">
        <Textarea
          className="input-area border-0 resize-none p-1 pt-4 px-2 text-tx-primary placeholder:text-tx-secondary focus:outline-0"
          disableAnimation
          disableAutosize
          placeholder={t("main.conversation.placeholder")}
          value={message}
          onValueChange={setMessage}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <div className="bottom-bar h-[40px] flex justify-between items-center p-2 mb-2">
          <div className="selecter-container w-[200px]">
            <ProviderSelect value={provider} onChange={setProvider} />
          </div>
          <Tooltip content={btnTipContent}>
            <Button
              isLoading={isLoading}
              radius="full"
              color="primary"
              size="sm"
              disabled={isBtnDisabled}
              onPress={handelSend}
              isIconOnly
            >
              {BtnIconMap[status]}
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
