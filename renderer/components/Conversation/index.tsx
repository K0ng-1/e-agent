import List from "./List";
import OperationsBar from "./OperationsBar";
import SearchBar from "./SearchBar";
import { useContextMenu } from "./useContextMenu";

export default function ConversationWrapper() {
  const { handle } = useContextMenu();
  console.dir("index.tsx rendered!!!");
  return (
    <div
      className="px-2 py-4 flex flex-col flex-1"
      style={{ width: "calc(100% - 57px)" }}
      onContextMenu={handle}
    >
      <SearchBar />
      <List />
      <OperationsBar />
    </div>
  );
}
