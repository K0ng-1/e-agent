import { Input } from "@heroui/react";
import {
  MagnifyingGlassIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline";
import useConversationStore from "@renderer/store/useConversationStore";
import { useContextMenu } from "./useContextMenu";

export default function SearchBar() {
  const { t } = useTranslation();
  const searchKey = useConversationStore((s) => s.searchKey);
  const setSearchKey = useConversationStore((s) => s.setSearchKey);

  const { handle: handleListContextMenu } = useContextMenu();

  return (
    <div
      className="flex"
      onContextMenu={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        placeholder={t("main.conversation.searchPlaceholder")}
        isClearable
        startContent={
          <MagnifyingGlassIcon className="w-5 h-5 text-tx-secondary" />
        }
        type="text"
        radius="none"
        size="sm"
        classNames={{
          input: [
            "text-tx-secondary",
            "group-data-[has-value=true]:text-tx-secondary",
          ],
          inputWrapper: [
            "bg-secondary",
            "group-data-[focus=true]:bg-secondary",
            "group-data-[focus=true]:border-primary",
            "border border-input hover:border-primary/50",
            "data-[hover=true]:bg-secondary",
          ],
        }}
        value={searchKey}
        onValueChange={setSearchKey}
      />
      <button
        className="cursor-pointer bg-secondary size-8 flex items-center justify-center"
        onClick={handleListContextMenu}
      >
        <Bars3BottomRightIcon className="w-4 h-4 text-tx-secondary" />
      </button>
    </div>
  );
}
