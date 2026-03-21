import React, { useCallback, useMemo } from "react";
import ListItem from "./ListItem";
import { createContextMenu } from "@renderer/utils/contextMenu";
import {
  CONVERSATION_ITEM_MENU_IDS,
  DialogFeedback,
  MENU_IDS,
} from "@common/constants";
import { Conversation } from "@common/types";
import { useConversation, useDialog } from "@renderer/hooks";
import { useNavigate, useSearchParams } from "react-router";

export default function List() {
  const {
    filteredConversations,
    editId,
    delConversation,
    pinConversation,
    setEditId,
  } = useConversation();
  const { createDialog } = useDialog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentId = useMemo(
    () => Number(searchParams.get("id")),
    [searchParams],
  );

  const conversationItemActionPolicy = new Map([
    [
      CONVERSATION_ITEM_MENU_IDS.DEL,
      async (item: Conversation) => {
        const res = await createDialog({
          title: "main.conversation.dialog.title",
          content: "main.conversation.dialog.content",
        });
        if (res === DialogFeedback.CONFIRM) {
          await delConversation(item.id);
          item.id === currentId && navigate("/conversation");
        }
      },
    ],
    [
      CONVERSATION_ITEM_MENU_IDS.RENAME,
      async (item: Conversation) => {
        setEditId(item.id);
      },
    ],
    [
      CONVERSATION_ITEM_MENU_IDS.PIN,
      async (item: Conversation) => {
        await pinConversation(item.id, !item.pinned);
      },
    ],
  ]);

  const handleItemContextMenu = useCallback(
    async (e: React.MouseEvent, item: Conversation) => {
      e.preventDefault();
      e.stopPropagation();
      const opts = item.pinned
        ? [
            {
              label: "menu.conversation.unpinConversation",
              id: CONVERSATION_ITEM_MENU_IDS.PIN,
            },
          ]
        : void 0;
      const clickItem = (await createContextMenu(
        MENU_IDS.CONVERSATION_ITEM,
        void 0,
        opts,
      )) as CONVERSATION_ITEM_MENU_IDS;
      const action = conversationItemActionPolicy.get(clickItem);
      action && (await action(item));
    },
    [conversationItemActionPolicy],
  );

  return (
    <ul className="w-full overflow-y-auto flex-auto">
      {filteredConversations.map((conversation) => {
        if (conversation.type === "divider") {
          return (
            <li
              className="divider my-2 h-px bg-input"
              key={conversation.id}
            ></li>
          );
        }
        return (
          <ListItem
            key={conversation.id}
            {...conversation}
            isTitleEditable={editId === conversation.id}
            onContextMenu={(e) => handleItemContextMenu(e, conversation)}
          />
        );
      })}
    </ul>
  );
}
