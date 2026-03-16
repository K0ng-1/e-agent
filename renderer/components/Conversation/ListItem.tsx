import { Conversation } from "@common/types";
import { Checkbox } from "@heroui/react";
import ItemTitle from "./ItemTitle";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ListItem(props: Conversation) {
  const { title, selectedModel, pinned } = props;
  const isBatchOperate = false;
  const isTitleEditable = false;
  const [checked, setChecked] = useState(false);
  const _CHECKBOX_STYLE_FIX = {
    width: "20px",
    height: "20px",
  };
  const updateTitle = (newTitle: string) => {};
  return (
    <li className="cursor-pointer p-2 mt-2 rounded-md hover:bg-input flex flex-col items-start gap-2">
      <div className="conversation-desc text-tx-secondary flex items-center text-sm loading-5">
        {selectedModel}
        {pinned && <StarIcon className="w-4 h-4 text-tx-secondary" />}
      </div>
      {isBatchOperate ? (
        <div className="w-full flex items-center">
          <Checkbox
            style={_CHECKBOX_STYLE_FIX}
            checked={checked}
            onValueChange={setChecked}
          />
          <div className="flex-auto">
            <ItemTitle
              title={title}
              is-editable={isTitleEditable}
              onUpdateTitle={updateTitle}
            />
          </div>
        </div>
      ) : (
        <ItemTitle
          title={title}
          is-editable={isTitleEditable}
          onUpdateTitle={updateTitle}
        />
      )}
    </li>
  );
}
