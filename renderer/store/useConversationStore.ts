import { Conversation } from "@common/types";
import { create } from "zustand";
import { conversations } from "./testData";

type Store = {
  searchKey: string;
  setSearchKey: (searchKey: string) => void;
  conversations: Conversation[];
};

const useConversationStore = create<Store>()((set) => ({
  searchKey: "",
  setSearchKey: (searchKey) => set({ searchKey }),
  conversations: conversations,
}));

export default useConversationStore;
