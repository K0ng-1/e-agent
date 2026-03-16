import List from "./List";
import SearchBar from "./SearchBar";
import { useContextMenu } from "./useContextMenu";

export default function ConversationWrapper() {
  const { handle: hanleListContextMenu } = useContextMenu();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hanleListContextMenu();
  };

  return (
    <div
      className="px-2 py-4 flex-auto"
      style={{ width: "calc(100% - 57px)" }}
      onContextMenu={handleContextMenu}
    >
      <SearchBar />
      <List />
    </div>
  );
}
