import { StateCreator } from "zustand";
import type { Store } from "./";
export interface InputSlice {
  messagesInputValue: Map<number, string>;
  getMessageInputValueById(conversationId: number): string;
  setMessageInputValueById(conversationId: number, value: string): void;
}

export const createInputSlice: StateCreator<
  Store & InputSlice,
  [],
  [],
  InputSlice
> = (set, get) => {
  function getMessageInputValueById(conversationId: number) {
    return get().messagesInputValue.get(conversationId) ?? "";
  }

  function setMessageInputValueById(conversationId: number, value: string) {
    set((state) => {
      const newMap = new Map(state.messagesInputValue);
      newMap.set(conversationId, value);
      return { messagesInputValue: newMap };
    });
  }

  return {
    messagesInputValue: new Map<number, string>(),
    getMessageInputValueById,
    setMessageInputValueById,
  };
};
