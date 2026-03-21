import { MENU_IDS, MESSAGE_ITEM_MENU_IDS } from "@common/constants";
import { Message } from "@common/types";
import { Button, Checkbox, ScrollShadow } from "@heroui/react";
import { createContextMenu } from "@renderer/utils/contextMenu";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MessageRender from "./MessageRender";
interface Props {
  messages: Message[];
}

export default function MessageList(props: Props) {
  const { messages } = props;
  const { t } = useTranslation();
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const itemChecked = useMemo(() => {
    return (msgId: number) => !checkedIds.includes(msgId);
  }, [checkedIds]);

  function handleCheckItem(id: number, val: boolean) {
    if (val && !checkedIds.includes(id)) {
      setCheckedIds([...checkedIds, id]);
    } else {
      setCheckedIds(checkedIds.filter((_id) => _id !== id));
    }
  }

  const messageActionPolicy = new Map<
    MESSAGE_ITEM_MENU_IDS,
    (msgId: number) => Promise<void>
  >([
    [
      MESSAGE_ITEM_MENU_IDS.COPY,
      async (msgId) => {
        const msg = props.messages.find((msg) => msg.id === msgId);
        if (!msg) return;
        navigator.clipboard.writeText(msg.content).then(() => {
          message.success(t("main.message.dialog.copySuccess"));
        });
      },
    ],
    [
      MESSAGE_ITEM_MENU_IDS.DELETE,
      async (msgId) => {
        const res = await createDialog({
          title: "main.message.dialog.title",
          content: "main.message.dialog.messageDelete",
        });
        if (res === "confirm") deleteMessage(msgId);
      },
    ],
    [
      MESSAGE_ITEM_MENU_IDS.SELECT,
      async (msgId) => {
        setCheckedIds([...checkedIds, msgId]);
        setIsBatchMode(true);
      },
    ],
  ]);
  async function handleContextMenu(msgId: number) {
    const clickItem = await createContextMenu(MENU_IDS.MESSAGE_ITEM);
    const action = messageActionPolicy.get(clickItem as MESSAGE_ITEM_MENU_IDS);
    action && (await action(msgId));
  }

  async function handleBatchDelete() {
    const res = await createDialog({
      title: "main.message.dialog.title",
      content: "main.message.dialog.batchDelete",
    });
    if (res === "confirm") {
      checkedIds.forEach((id) => deleteMessage(id));
      quitBatchMode();
    }
  }
  function quitBatchMode() {
    setIsBatchMode(false);
    setCheckedIds([]);
  }
  return (
    <div className="flex flex-col h-full">
      <ScrollShadow className="message-list px-5 pt-6">
        {messages.map((message) => {
          return (
            <div
              className="message-list-item mt-3 pb-5 flex items-center"
              key={message.id}
            >
              <div
                className="pr-5"
                style={{ display: isBatchMode ? "block" : "none" }}
              >
                <Checkbox
                  isSelected={itemChecked(message.id)}
                  onValueChange={(value) => handleCheckItem(message.id, value)}
                />
              </div>
              <div
                className={clsx("flex flex-auto", {
                  "justify-end": message.type === "question",
                  "justify-start": message.type === "answer",
                })}
              >
                <span>
                  <div
                    className="text-sm text-gray-500 mb-2"
                    style={{
                      textAlign: message.type === "question" ? "end" : "start",
                    }}
                  >
                    {message.createdAt}
                    {/* {formatTimeAgo(message.createdAt)} */}
                  </div>
                  {message.type === "question" ? (
                    <div
                      className="msg-shadow p-2 rounded-md bg-bubble-self text-white"
                      onContextMenu={() => handleContextMenu(message.id)}
                    >
                      <MessageRender
                        msgId={message.id}
                        content={message.content}
                        isStreaming={message.status === "streaming"}
                      />
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        "msg-shadow p-2 px-6 rounded-md bg-bubble-others",
                        {
                          "bg-bubble-others text-tx-primary":
                            message.status !== "error",
                          "text-red-300 font-bold": message.status === "error",
                        },
                      )}
                      onContextMenu={() => handleContextMenu(message.id)}
                    >
                      {message.status === "loading" ? (
                        <span>...</span>
                      ) : (
                        <MessageRender
                          msgId={message.id}
                          content={message.content}
                          isStreaming={message.status === "streaming"}
                        />
                      )}
                    </div>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </ScrollShadow>

      <div
        className="justify-between p-2 border-t-3 border-input"
        style={{ display: isBatchMode ? "flex" : "none" }}
      >
        <Button color="danger" size="sm" onPress={handleBatchDelete}>
          {t("main.message.batchActions.deleteSelected")}
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="ghost"
          onPress={quitBatchMode}
        >
          {t("dialog.cancel")}
        </Button>
      </div>
    </div>
  );
}
