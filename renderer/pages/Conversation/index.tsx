import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { MAIN_WIN_SIZE } from "@common/constants";
import { throttle } from "@common/utils";
import MessageInput from "@renderer/components/MessageInput";
import MessageList from "@renderer/components/MessageList";
import ResizeDivider from "@renderer/components/ResizeDivider";
import { useMessages } from "@renderer/hooks/useMessages";
import { useConversation } from "@renderer/hooks";

export default function Conversation() {
  const props = useParams<{ id: string }>();
  const { t } = useTranslation();
  const id = Number(props.id);
  if (!id) return null;
  const {
    initialize: initializeMessages,
    messages,
    getMessageInputValueById,
    setMessageInputValueById,
    sendMessage,
  } = useMessages();
  const { getConversationById } = useConversation();

  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState("");
  const [listHeight, setListHeight] = useState(0);
  const [listScale, setListScale] = useState(0.7);
  const [maxListHeight, setMaxListHeight] = useState(window.innerHeight * 0.7);

  useEffect(() => {
    initializeMessages(id);
    setMessage(getMessageInputValueById(id));

    const conversation = getConversationById(id);
    if (conversation) {
      setProvider(`${conversation.providerId}:${conversation.selectedModel}`);
    }
  }, [
    id,
    initializeMessages,
    setMessage,
    getMessageInputValueById,
    getConversationById,
    setProvider,
  ]);

  function handleSetMessage(value: string) {
    setMessage(value);
    setMessageInputValueById(id, value);
  }

  const handleSend = async () => {
    const content = getMessageInputValueById(id);
    if (!content.trim()) return;
    await sendMessage({
      type: "question",
      content,
      conversationId: id,
    });
    setMessageInputValueById(id, "");
    setMessage("");
  };

  useEffect(() => {
    const handle = throttle(async () => {
      if (window.innerHeight < MAIN_WIN_SIZE.minHeight) return;
      setListHeight(window.innerHeight * listScale);
      setMaxListHeight(window.innerHeight * 0.7);
      if (listHeight > maxListHeight) setListHeight(maxListHeight);
    }, 40);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [listHeight, listScale, maxListHeight]);

  useEffect(() => {
    setListScale(listHeight / window.innerHeight);
  }, [listHeight]);

  useEffect(() => {
    setListHeight(window.innerHeight * listScale);
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        height: "calc(100% - 70px)",
      }}
    >
      <div className="w-full min-h-0" style={{ height: `${listHeight}px` }}>
        <MessageList messages={messages} />
      </div>
      <div className="input-container flex-auto w-full">
        <ResizeDivider
          direction="horizontal"
          size={listHeight}
          maxSize={maxListHeight}
          minSize={200}
          onResize={(size) => setListHeight(size)}
        />

        <MessageInput
          className="pr-4"
          message={message}
          setMessage={handleSetMessage}
          provider={provider}
          setProvider={setProvider}
          placeholder={t("main.conversation.placeholder")}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
