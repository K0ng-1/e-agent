import { useMessagesStore } from "@renderer/store/messages";
import { useMemo } from "react";

export const useMessages = () => {
  const messages = useMessagesStore((state) => state.messages);
  const initialize = useMessagesStore((state) => state.initialize);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const updateMessage = useMessagesStore((state) => state.updateMessage);
  const deleteMessage = useMessagesStore((state) => state.deleteMessage);

  const getMessagesByConversationId = useMemo(
    () => (id: number) => {
      return messages
        .filter((message) => message.conversationId === id)
        .sort((a, b) => a.createdAt - b.createdAt);
    },
    [messages],
  );

  return {
    messages,
    initialize,
    getMessagesByConversationId,
    addMessage,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
};
