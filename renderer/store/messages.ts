import { Message } from "@common/types";
import { cloneDeep, uniqueByKey } from "@common/utils";
import { dataBase } from "@renderer/dataBase";
import { create } from "zustand";
import useConversationStore from "./Conversations";

type State = {
  messages: Message[];
};

type Actions = {
  initialize: (conversationId: number) => void;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => Promise<number>;
  sendMessage: (message: Omit<Message, "id" | "createdAt">) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  updateMessage: (id: number, updates: Partial<Message>) => Promise<void>;
};

type Store = State & Actions;

export const useMessagesStore = create<Store>((set, get) => {
  const initialize = async (conversationId: number) => {
    if (!conversationId) return;
    const isLoaded = get().messages.some(
      (message) => message.conversationId === conversationId,
    );
    if (isLoaded) return;

    const saved = await dataBase.messages.where({ conversationId }).toArray();
    set({ messages: uniqueByKey([...get().messages, ...saved], "id") });
  };

  const _updateConversation = async (conversationId: number) => {
    const { updateConversation } = useConversationStore();
    const conversation = await dataBase.conversations.get(conversationId);
    conversation && updateConversation(conversation);
  };

  const addMessage = async (message: Omit<Message, "id" | "createdAt">) => {
    const newMessage = {
      ...message,
      createdAt: Date.now(),
    };
    const id = await dataBase.messages.add(newMessage);
    _updateConversation(newMessage.conversationId);
    set({
      messages: [...get().messages, { ...newMessage, id }],
    });
    return id;
  };

  const sendMessage = async (message: Omit<Message, "id" | "createdAt">) => {
    await addMessage(message);
    const loadingMsgId = await addMessage({
      conversationId: message.conversationId,
      type: "answer",
      content: "",
      status: "loading",
    });

    // TODO: 调用大模型
  };

  const updateMessage = async (id: number, updates: Partial<Message>) => {
    let currentMsg = cloneDeep(
      get().messages.find((message) => message.id === id),
    );
    if (!currentMsg) return;
    await dataBase.messages.update(id, { ...currentMsg, ...updates });
    set({
      messages: get().messages.map((message) =>
        message.id === id ? { ...currentMsg, ...updates } : message,
      ),
    });
    // currentMsg = void 0;
  };

  const deleteMessage = async (id: number) => {
    let currentMsg = get().messages.find((message) => message.id === id);
    if (!currentMsg) return;
    // TODO: stopMessage(id, false);
    await dataBase.messages.delete(id);
    _updateConversation(currentMsg.conversationId);
    set({
      messages: get().messages.filter((message) => message.id !== id),
    });
    currentMsg = void 0;
  };

  return {
    messages: [],
    initialize,
    addMessage,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
});

export default useMessagesStore;
