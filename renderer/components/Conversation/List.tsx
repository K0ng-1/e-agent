import React, { useCallback } from "react";
import ListItem from "./ListItem";
import { createContextMenu } from "@renderer/utils/contextMenu";
import { CONVERSATION_ITEM_MENU_IDS, MENU_IDS } from "@common/constants";
import { Conversation } from "@common/types";
import useConversation from "@renderer/hooks/useConversation";

export default function List() {
  const { filteredConversations, editId, delConversation, pinConversation, setEditId } =
    useConversation();

  const conversationItemActionPolicy = new Map([
    [
      CONVERSATION_ITEM_MENU_IDS.DEL,
      async (item: Conversation) => {
        await delConversation(item.id);
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
      const clickItem = (await createContextMenu(
        MENU_IDS.CONVERSATION_ITEM,
        void 0,
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
