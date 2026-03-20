import { Button, Input } from "@heroui/react";
import {
  MagnifyingGlassIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline";
import { useContextMenu } from "./useContextMenu";
import useConversation from "@renderer/hooks/useConversation";
import { useTranslation } from "react-i18next";

export default function SearchBar() {
  const { t } = useTranslation();
  const { searchKey, setSearchKey } = useConversation();
  const { handle: handleListContextMenu } = useContextMenu();

  return (
    <div
      className="flex shadow"
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
        value={searchKey}
        onValueChange={setSearchKey}
      />
      <Button
        radius="none"
        size="sm"
        variant="flat"
        isIconOnly
        onPress={handleListContextMenu}
      >
        <Bars3BottomRightIcon className="w-4 h-4 text-tx-secondary" />
      </Button>
    </div>
  );
}
