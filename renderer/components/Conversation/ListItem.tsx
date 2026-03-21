import { Conversation } from "@common/types";
import { Checkbox } from "@heroui/react";
import ItemTitle from "./ItemTitle";
import { StarIcon } from "@heroicons/react/24/solid";
import useConversation from "@renderer/hooks/useConversation";
import { memo } from "react";
import { useNavigate } from "react-router";
interface ListItemProps extends Conversation {
  isTitleEditable: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}
export default memo(function ListItem(props: ListItemProps) {
  const navigate = useNavigate();
  const { id, title, selectedModel, pinned, isTitleEditable, onContextMenu } =
    props;
  const {
    selectIds,
    setEditId,
    setSelectIds,
    updateConversation,
    isBatchOperate,
  } = useConversation();
  console.dir("memo isBatchOperate, " + isBatchOperate);

  const handleCheckedChange = (checked: boolean) => {
    setSelectIds(
      checked ? [...selectIds, id] : selectIds.filter((item) => item !== id),
    );
  };

  const updateTitle = async (newTitle: string) => {
    await updateConversation(
      {
        id,
        title: newTitle,
        selectedModel: props.selectedModel,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        providerId: props.providerId,
        pinned: props.pinned,
      },
      true,
    );

    setEditId(null);
  };
  return (
    <li
      className="cursor-pointer p-2 mt-2 rounded-md hover:bg-input flex flex-col items-start gap-2"
      onContextMenu={onContextMenu}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/conversation/${id}`);
      }}
    >
      <div className="conversation-desc text-tx-secondary flex items-center text-sm loading-5">
        {selectedModel}
        {pinned && <StarIcon className="w-4 h-4 text-tx-secondary" />}
      </div>
      <div className="w-full flex items-center truncate">
        {isBatchOperate && (
          <Checkbox
            size="sm"
            isSelected={selectIds.includes(id)}
            onValueChange={handleCheckedChange}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
        <ItemTitle
          title={title}
          isEditable={isTitleEditable}
          onUpdateTitle={updateTitle}
        />
      </div>
    </li>
  );
});
