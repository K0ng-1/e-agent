import { Button, ButtonGroup, Checkbox } from "@heroui/react";
import useConversation from "@renderer/hooks/useConversation";
import { useTranslation } from "react-i18next";
export default function OperationsBar() {
  const { isBatchOperate, toggleBatchOperate } = useConversation();
  const {
    isAllSelected,
    setAllSelected,
    delSelectedConversations,
    pinSelectedConversations,
  } = useConversation();
  const { t } = useTranslation();
  return (
    isBatchOperate && (
      <div onContextMenu={(e) => e.stopPropagation()}>
        <p className="divider my-2 h-px bg-input"></p>
        <div className="flex justify-between items-center pt-1">
          <Checkbox
            isSelected={isAllSelected}
            onValueChange={setAllSelected}
            size="sm"
            radius="none"
            classNames={{
              label: ["text-tx-secondary", "text-sm"],
            }}
          >
            {t("main.conversation.operations.selectAll")}
          </Checkbox>
          <Button
            size="sm"
            radius="none"
            variant="light"
            className="text-tx-secondary"
            onPress={toggleBatchOperate}
          >
            {t("main.conversation.operations.cancel")}
          </Button>
        </div>
        <ButtonGroup
          radius="none"
          size="sm"
          fullWidth
          variant="solid"
          className="py-4 w-full"
        >
          <Button className="mr-1" onPress={pinSelectedConversations}>
            {t("main.conversation.operations.pin")}
          </Button>
          <Button onPress={delSelectedConversations}>
            {t("main.conversation.operations.del")}
          </Button>
        </ButtonGroup>
      </div>
    )
  );
}
