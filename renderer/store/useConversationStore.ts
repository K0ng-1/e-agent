import { Conversation } from "@common/types";
import { create } from "zustand";
import { dataBase } from "@renderer/dataBase";
import { debounce } from "@common/utils";

type SortBy = "updatedAt" | "createAt" | "name" | "model"; // 排序字段类型
type SortOrder = "asc" | "desc"; // 排序顺序类型

const SORT_BY_KEY = "conversation:sortBy";
const SORT_ORDER_KEY = "conversation:sortOrder";

const saveSortMode = debounce(
  ({ sortBy, sortOrder }: { sortBy: SortBy; sortOrder: SortOrder }) => {
    localStorage.setItem(SORT_BY_KEY, sortBy);
    localStorage.setItem(SORT_ORDER_KEY, sortOrder);
  },
  300,
);
type State = {
  searchKey: string;
  conversations: Conversation[];
  sortOrder: string;
  sortBy: string;
};
type Action = {
  setSearchKey: (searchKey: string) => void;
  setSortMode: (name: string, sortMode: string) => void;
  initialize: () => Promise<void>;
};
type Store = State & Action;

const useConversationStore = create<Store>()((set) => {
  let conversations: Conversation[] = [];

  const saveSortBy = localStorage.getItem(SORT_BY_KEY) as SortBy;
  const saveSortOrder = localStorage.getItem(SORT_ORDER_KEY) as SortOrder;

  async function initialize() {
    const lists = await dataBase.conversations.toArray();
    set({ conversations: lists });

    const ids = lists.map((it) => it.id);
    const msgs = await dataBase.messages.toArray();
    const invalidId = msgs
      .filter((it) => !ids.includes(it.conversationId))
      .map((it) => it.id);

    invalidId.length && dataBase.messages.where("id").anyOf(invalidId).delete();
  }

  return {
    // state
    searchKey: "",
    conversations,
    sortBy: saveSortBy ?? "createAt",
    sortOrder: saveSortOrder ?? "desc",

    // action
    setSearchKey: (searchKey) => set({ searchKey }),
    setSortMode: (name, sortMode) => {
      const [sortBy, sortOrder] = sortMode.split("-");
      set({ sortBy, sortOrder });
    },
    initialize,
  };
});

export default useConversationStore;
