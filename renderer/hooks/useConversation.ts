import { Conversation } from "@common/types";
import { debounce } from "@common/utils";
import useConversationStore from "@renderer/store/Conversations";
import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useDialog from "./useDialog";
import { DialogFeedback } from "@common/constants";
import { useNavigate } from "react-router";

interface Props {
  provider: string;
  message: string;
}
export function useConversation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createDialog } = useDialog();
  const conversations = useConversationStore((s) => s.conversations);
  const searchKey = useConversationStore((s) => s.searchKey);
  const sortBy = useConversationStore((s) => s.sortBy);
  const sortOrder = useConversationStore((s) => s.sortOrder);
  const editId = useConversationStore((s) => s.editId);
  const selectIds = useConversationStore((s) => s.selectIds);
  const isBatchOperate = useConversationStore((s) => s.isBatchOperate);
  const setSearchKey = useConversationStore((s) => s.setSearchKey);
  const saveSortMode = useConversationStore((s) => s.saveSortMode);
  const addConversation = useConversationStore((s) => s.addConversation);
  const updateConversation = useConversationStore((s) => s.updateConversation);
  const getConversationById = useConversationStore(
    (s) => s.getConversationById,
  );
  const delConversation = useConversationStore((s) => s.delConversation);
  const pinConversation = useConversationStore((s) => s.pinConversation);
  const setEditId = useConversationStore((s) => s.setEditId);
  const setSelectIds = useConversationStore((s) => s.setSelectIds);
  const toggleBatchOperate = useConversationStore((s) => s.toggleBatchOperate);

  const [_searchKey, _setSearchKey] = useState(searchKey);

  function sortConversations() {
    const divider = Object.freeze({
      type: "divider",
      id: -1,
    }) as Conversation;

    const pinned: Conversation[] = conversations
      .filter((it) => it.pinned)
      .map((it) => ({ type: "conversation", ...it }));

    if (pinned.length) {
      pinned.push(divider);
    }
    const unPinned: Conversation[] = conversations
      .filter((it) => !it.pinned)
      .map((it) => ({ type: "conversation", ...it }));

    const handleSortOrder = <T = number | string>(a?: T, b?: T) => {
      if (typeof a === "number" && typeof b === "number") {
        return sortOrder === "desc" ? b - a : a - b;
      }
      if (typeof a === "string" && typeof b === "string") {
        return sortOrder === "desc" ? b.localeCompare(a) : a.localeCompare(b);
      }
      return 0;
    };

    if (sortBy === "createAt") {
      return [
        ...pinned.sort((a, b) => handleSortOrder(a.createdAt, b.createdAt)),
        ...unPinned.sort((a, b) => handleSortOrder(a.createdAt, b.createdAt)),
      ];
    }

    if (sortBy === "updatedAt") {
      return [
        ...pinned.sort((a, b) => handleSortOrder(a.updatedAt, b.updatedAt)),
        ...unPinned.sort((a, b) => handleSortOrder(a.updatedAt, b.updatedAt)),
      ];
    }

    if (sortBy === "name") {
      return [
        ...pinned.sort((a, b) => handleSortOrder(a.title, b.title)),
        ...unPinned.sort((a, b) => handleSortOrder(a.title, b.title)),
      ];
    }

    if (sortBy === "model") {
      return [
        ...pinned.sort((a, b) =>
          handleSortOrder(a.selectedModel, b.selectedModel),
        ),
        ...unPinned.sort((a, b) =>
          handleSortOrder(a.selectedModel, b.selectedModel),
        ),
      ];
    }
    return conversations;
  }

  useEffect(() => {
    const unsubscribe = useConversationStore.subscribe(
      debounce((state) => {
        saveSortMode(state.sortBy, state.sortOrder);
      }, 300),
    );
    return unsubscribe;
  }, []);

  useEffect(
    debounce(() => {
      _setSearchKey(searchKey);
    }, 200),
    [searchKey],
  );

  const filteredConversations = useMemo(() => {
    const sortList = sortConversations();
    if (!_searchKey) {
      return sortList;
    }
    return sortList.filter((it) => it.title?.includes(_searchKey));
  }, [conversations, _searchKey, sortBy, sortOrder]);

  async function createConversation(props: Props) {
    const { provider, message } = props;
    const splitProvider = provider.split(":");
    const providerId = Number(splitProvider[0]);
    const selectedModel = splitProvider[1] ?? "";
    if (!providerId || !selectedModel) return;

    const conversationId = await addConversation({
      title: message ?? t("main.conversation.newConversation"),
      providerId,
      selectedModel,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      pinned: false,
    });
    return conversationId;
  }

  const isAllSelected = useMemo(() => {
    return (
      selectIds.length > 0 &&
      selectIds.length ===
        filteredConversations.filter((it) => it.id !== -1).length
    );
  }, [selectIds, filteredConversations]);

  const setAllSelected = (checked: boolean) => {
    const ids = filteredConversations
      .filter((it) => it.id !== -1)
      .map((it) => it.id);
    setSelectIds(checked ? ids : []);
  };

  const delSelectedConversations = async () => {
    if (!selectIds.length) {
      return;
    }
    const res = await createDialog({
      title: "main.conversation.dialog.title",
      content: "main.conversation.dialog.content_1",
    });
    if (res === DialogFeedback.CONFIRM) {
      selectIds.forEach((id) => delConversation(id));
      setSelectIds([]);
      if (!conversations.length) {
        navigate("/");
      }
    }
  };

  const pinSelectedConversations = () => {
    if (!selectIds.length) {
      return;
    }
    selectIds.forEach((id) => pinConversation(id, true));
    setSelectIds([]);
  };

  return {
    searchKey,
    filteredConversations,
    editId,
    selectIds,
    isAllSelected,
    isBatchOperate,
    setSearchKey,
    createConversation,
    getConversationById,
    updateConversation,
    delConversation,
    delSelectedConversations,
    pinConversation,
    pinSelectedConversations,
    setEditId,
    setSelectIds,
    setAllSelected,
    toggleBatchOperate,
  };
}

export default useConversation;
