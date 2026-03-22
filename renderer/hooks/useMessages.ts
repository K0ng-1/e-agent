import { useMessagesStore } from "@renderer/store/Message";

export const useMessages = () => {
  const messages = useMessagesStore((state) => state.messages);
  const initialize = useMessagesStore((state) => state.initialize);
  const addMessage = useMessagesStore((state) => state.addMessage);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const stopMessage = useMessagesStore((state) => state.stopMessage);
  const updateMessage = useMessagesStore((state) => state.updateMessage);
  const deleteMessage = useMessagesStore((state) => state.deleteMessage);
  const getMessagesByConversationId = useMessagesStore(
    (state) => state.getMessagesByConversationId,
  );
  const getMessageInputValueById = useMessagesStore(
    (state) => state.getMessageInputValueById,
  );
  const setMessageInputValueById = useMessagesStore(
    (state) => state.setMessageInputValueById,
  );

  return {
    messages,
    initialize,
    getMessagesByConversationId,
    addMessage,
    sendMessage,
    stopMessage,
    updateMessage,
    deleteMessage,
    getMessageInputValueById,
    setMessageInputValueById,
  };
};
