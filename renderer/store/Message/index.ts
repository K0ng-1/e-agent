import { Message, MessageStatus } from "@common/types";
import { cloneDeep, uniqueByKey } from "@common/utils";
import { dataBase } from "@renderer/dataBase";
import { create } from "zustand";
import useConversationStore from "../Conversations";
import useProvidersStore from "../providers";
import { listenDialogueBack } from "@renderer/utils/dialogue";
import { createInputSlice, InputSlice } from "./inputSlice";
import { messages } from "../testData";
import i18next from "i18next";

type State = {
  messages: Message[];
};

type Actions = {
  initialize: (conversationId: number) => void;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => Promise<number>;
  sendMessage: (message: Omit<Message, "id" | "createdAt">) => Promise<number>;
  stopMessage: (id: number, update: boolean) => void;
  deleteMessage: (id: number) => Promise<void>;
  updateMessage: (id: number, updates: Partial<Message>) => Promise<void>;
  getMessagesByConversationId: (conversationId: number) => Message[];
};

export type Store = State & Actions & InputSlice;

const msgContentMap = new Map<number, string>();
export const stopMethods = new Map<number, () => void>();

export const useMessagesStore = create<Store>()((set, get, ...args) => {
  const initialize = async (conversationId: number) => {
    if (!conversationId) return;
    const isLoaded = get().messages.some(
      (message) => message.conversationId === conversationId,
    );
    if (isLoaded) return;

    const saved = await dataBase.messages.where({ conversationId }).toArray();
    set({ messages: uniqueByKey(saved, "id") });
  };

  const getMessagesByConversationId = (id: number) => {
    return get()
      .messages.filter((message) => message.conversationId === id)
      .sort((a, b) => a.createdAt - b.createdAt);
  };

  const _updateConversation = async (conversationId: number) => {
    const { updateConversation } = useConversationStore.getState();
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

    const { getConversationById } = useConversationStore.getState();
    const conversation = getConversationById(message.conversationId);
    if (!conversation) return loadingMsgId;

    const { providers } = useProvidersStore.getState();

    const provider = providers.find((p) => p.id === conversation.providerId);

    if (!provider) return loadingMsgId;

    msgContentMap.set(loadingMsgId, "");

    let streamCallback:
      | ((stream: DialogueBackStream) => Promise<void>)
      | void = async (stream) => {
      const { data, messageId } = stream;
      const getStatus = (data: DialogueBackStream["data"]): MessageStatus => {
        if (data.isError) return "error";
        if (data.isEnd) return "success";
        return "streaming";
      };

      msgContentMap.set(messageId, msgContentMap.get(messageId) + data.result);

      const _update = {
        content: msgContentMap.get(messageId) || "",
        status: getStatus(data),
        updatedAt: Date.now(),
      } as Message;
      updateMessage(messageId, _update);

      if (data.isEnd) {
        msgContentMap.delete(messageId);
        streamCallback = void 0;
      }
    };

    stopMethods.set(
      loadingMsgId,
      listenDialogueBack(streamCallback, loadingMsgId),
    );

    const messages = getMessagesByConversationId(message.conversationId)
      .filter((it) => it.status !== "loading")
      .map((item) => ({
        role:
          item.type === "question"
            ? "user"
            : ("assistant" as DialogueMessageRole),
        content: item.content,
      }));

    await window.api.startADialogue({
      messageId: loadingMsgId,
      providerName: provider.name,
      selectedModel: conversation.selectedModel,
      conversationId: message.conversationId,
      messages,
    });
    return loadingMsgId;
  };

  const stopMessage = async (id: number, update: boolean = true) => {
    const { t } = i18next;
    const stop = stopMethods.get(id);
     
    stop && stop?.();
    if (update) {
      const msgContent = messages.find((msg) => msg.id === id)?.content ?? "";
      await updateMessage(id, {
        status: "success",
        updatedAt: Date.now(),
        content: msgContent
          ? `${msgContent}${t("main.message.stoppedGeneration")}`
          : void 0,
      });
    }
  };

  const updateMessage = async (id: number, updates: Partial<Message>) => {
    const currentMsg = cloneDeep(
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
    stopMessage(id, false);
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
    stopMessage,
    updateMessage,
    deleteMessage,
    getMessagesByConversationId,

    ...createInputSlice(set, get, ...args),
  };
});

export default useMessagesStore;
