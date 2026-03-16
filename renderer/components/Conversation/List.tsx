import React from "react";
import useConversationStore from "@renderer/store/useConversationStore";
import ListItem from "./ListItem";
import { createContextMenu } from "@renderer/utils/contextMenu";
import { CONVERSATION_ITEM_MENU_IDS, MENU_IDS } from "@common/constants";

const conversationItemActionPolicy = new Map([
  [
    CONVERSATION_ITEM_MENU_IDS.DEL,
    () => {
      console.dir("delete");
    },
  ],
  [
    CONVERSATION_ITEM_MENU_IDS.RENAME,
    () => {
      console.dir("rename");
    },
  ],
  [
    CONVERSATION_ITEM_MENU_IDS.PIN,
    () => {
      console.dir("pin");
    },
  ],
]);

export default function List() {
  const conversations = useConversationStore((s) => s.conversations);

  const handleItemContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const clickItem = (await createContextMenu(
      MENU_IDS.CONVERSATION_ITEM,
      void 0,
    )) as CONVERSATION_ITEM_MENU_IDS;
    const action = conversationItemActionPolicy.get(clickItem);
    action && (await action());
  };
  return (
    <ul className="w-full">
      {conversations.map((conversation) => {
        if (conversation.type === "divider") {
          return <li className="divider my-2 h-px bg-input"></li>;
        }

        return (
          <ListItem
            key={conversation.id}
            {...conversation}
            onContextMenu={handleItemContextMenu}
          />
        );
      })}
    </ul>
  );
}
