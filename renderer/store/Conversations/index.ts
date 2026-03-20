import { Conversation } from "@common/types";
import { create } from "zustand";
import { dataBase } from "@renderer/dataBase";

type SortBy = "updatedAt" | "createAt" | "name" | "model"; // 排序字段类型
type SortOrder = "asc" | "desc"; // 排序顺序类型

const SORT_BY_KEY = "conversation:sortBy";
const SORT_ORDER_KEY = "conversation:sortOrder";

type State = {
  searchKey: string;
  conversations: Conversation[];
  sortOrder: SortOrder;
  sortBy: SortBy;
  editId: number | null;
  selectIds: number[];
  isBatchOperate: boolean;
};

type Action = {
  setSearchKey: (searchKey: string) => void;
  setSortMode: (_sortBy: SortBy, _sortOrder: SortOrder) => void;
  saveSortMode: (sortBy: SortBy, sortOrder: SortOrder) => void;
  initialize: () => Promise<void>;
  getConversationById: (id: number) => Conversation | void;
  addConversation: (conversation: Omit<Conversation, "id">) => Promise<number>;
  delConversation: (id: number) => Promise<void>;
  updateConversation: (
    conversation: Conversation,
    updateTime?: boolean,
  ) => Promise<void>;
  pinConversation: (id: number, pinner: boolean) => Promise<void>;
  setEditId: (id: number | null) => void;
  setSelectIds: (ids: number[]) => void;
  toggleBatchOperate: () => void;
};

type Store = State & Action;

const useConversationStore = create<Store>()((set, get) => {
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

  function setSortMode(_sortBy: SortBy, _sortOrder: SortOrder) {
    if (get().sortBy !== _sortBy) {
      set({ sortBy: _sortBy });
    }
    if (get().sortOrder !== _sortOrder) {
      set({ sortOrder: _sortOrder });
    }
  }

  function getConversationById(id: number) {
    return get().conversations.find((it) => it.id === id);
  }

  async function addConversation(conversation: Omit<Conversation, "id">) {
    const conversationWithPin = {
      ...conversation,
      pinned: conversation.pinned ?? false,
    };
    const id = await dataBase.conversations.add(conversationWithPin);
    set({
      conversations: [...get().conversations, { ...conversationWithPin, id }],
    });
    return id;
  }

  async function delConversation(id: number) {
    await dataBase.messages.where("conversationId").equals(id).delete();
    await dataBase.conversations.delete(id);
    set({
      conversations: get().conversations.filter((it) => it.id !== id),
    });
  }

  async function updateConversation(
    conversation: Conversation,
    updateTime: boolean = true,
  ) {
    const newConversation: Conversation = {
      ...conversation,
      updatedAt: updateTime ? Date.now() : conversation.updatedAt,
    };
    await dataBase.conversations.update(conversation.id, newConversation);
    set({
      conversations: get().conversations.map((it) =>
        it.id === conversation.id ? newConversation : it,
      ),
    });
  }

  async function pinConversation(id: number, pinned: boolean) {
    const conversation = getConversationById(id);
    if (!conversation) {
      return;
    }
    await updateConversation(
      {
        ...conversation,
        pinned,
      },
      false,
    );
  }

  function setEditId(id: number | null) {
    set({ editId: id });
  }

  function setSelectIds(ids: number[]) {
    set({ selectIds: ids });
  }

  function toggleBatchOperate() {
    if(!get().isBatchOperate) {
      setSelectIds([]);
    }
    set({ isBatchOperate: !get().isBatchOperate });
  }

  const saveSortMode = (sortBy: SortBy, sortOrder: SortOrder) => {
    localStorage.setItem(SORT_BY_KEY, sortBy);
    localStorage.setItem(SORT_ORDER_KEY, sortOrder);
  };
  return {
    // state
    searchKey: "",
    conversations: [],
    sortBy: saveSortBy ?? "createAt",
    sortOrder: saveSortOrder ?? "desc",
    editId: null,
    selectIds: [],
    isBatchOperate: false,

    // action
    setSearchKey: (searchKey) => set({ searchKey }),
    setSortMode,
    saveSortMode,
    initialize,
    getConversationById,
    addConversation,
    delConversation,
    updateConversation,
    pinConversation,
    setEditId,
    setSelectIds,
    toggleBatchOperate,
  };
});

export default useConversationStore;
