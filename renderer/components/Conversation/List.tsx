import React from "react";
import useConversationStore from "@renderer/store/useConversationStore";
import ListItem from "./ListItem";

export default function List() {
  const conversations = useConversationStore((s) => s.conversations);
  return (
    <ul className="w-full">
      {conversations.map((conversation) => {
        if (conversation.type === "divider") {
          return <li className="divider my-2 h-px bg-input"></li>;
        }
        return <ListItem key={conversation.id} {...conversation} />;
      })}
    </ul>
  );
}
