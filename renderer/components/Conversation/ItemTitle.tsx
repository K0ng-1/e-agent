import { Input, Tooltip } from "@heroui/react";
import { debounce } from "@common/utils";
import { ConversitionContext } from "../Layout";
import { useContext, useEffect, useRef, useState } from "react";

interface ItemTitleProps {
  title: string;
  isEditable: boolean;
  onUpdateTitle: (newTitle: string) => void;
}
export default function ItemTitle(props: ItemTitleProps) {
  const { title, onUpdateTitle, isEditable = false } = props;
  const [isTitleOverflow, setIsTitleOverflow] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [_title, setTitle] = useState(title);

  const { width } = useContext(ConversitionContext);

  function checkOverflow(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }
    return element.scrollWidth > element.clientWidth;
  }
  const updateOverflowStatus = debounce(() => {
    setIsTitleOverflow(checkOverflow(titleRef.current));
  }, 100);

  useEffect(() => {
    window.addEventListener("resize", updateOverflowStatus);
    return () => {
      window.removeEventListener("resize", updateOverflowStatus);
    };
  }, []);

  useEffect(updateOverflowStatus, [title, width]);

  return (
    <>
      {isEditable ? (
        <Input
          className="w-full"
          size="sm"
          value={_title}
          onValueChange={setTitle}
          onKeyDown={(e) => e.key === "Enter" && onUpdateTitle(_title)}
        />
      ) : (
        <h2
          ref={titleRef}
          className="text-xs conversation-title text-tx-secondary font-semibold truncate"
        >
          {isTitleOverflow ? (
            <Tooltip content={title}>
              <span>{title}</span>
            </Tooltip>
          ) : (
            title
          )}
        </h2>
      )}
    </>
  );
}
