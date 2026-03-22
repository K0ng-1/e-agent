import MessageInput from "@renderer/components/MessageInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConversation } from "@renderer/hooks";
import { useNavigate } from "react-router";
import { useMessages } from "@renderer/hooks/useMessages";

export default function HomePage() {
  const { t } = useTranslation();
  const { createConversation } = useConversation();
  const { sendMessage } = useMessages();
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState("");
  const navigate = useNavigate();
  const handleSend = async () => {
    const id = await createConversation({ provider, message });
    if (!id) return;
    sendMessage({
      type: "question",
      content: message,
      conversationId: id,
    });
    navigate(`/conversation/${id}`);
    setMessage("");
  };
  return (
    <div className="h-full flex-col flex-center pr-4">
      <div className="text-3xl font-bold text-primary-subtle text-center">
        {t("main.welcome.helloMessage")}
      </div>
      <div className="bg-bubble-others w-full mt-6 max-w-[800px] h-[200px] rounded-md">
        <MessageInput
          className="p-2"
          message={message}
          setMessage={setMessage}
          provider={provider}
          setProvider={setProvider}
          placeholder={t("main.conversation.placeholder")}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
