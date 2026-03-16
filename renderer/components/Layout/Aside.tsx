import ConversationWrapper from "../Conversation";

export default function Aside() {
  return (
    <div className="px-2 py-4 flex-auto" style={{ width: "calc(100% - 57px)" }}>
      <ConversationWrapper />
    </div>
  );
}
