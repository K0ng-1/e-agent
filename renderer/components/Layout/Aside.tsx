import ConversationWrapper from "../Conversation";

export const ConversitionContext = createContext<{ width: number }>({
  width: 0,
});

export default function Aside({ width }: { width: number }) {
  return (
    <ConversitionContext.Provider value={{ width }}>
      <ConversationWrapper />
    </ConversitionContext.Provider>
  );
}
