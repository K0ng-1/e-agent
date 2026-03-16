import { Input } from "@heroui/react";
import TooltipTheme from "../TooltipTheme";
import { debounce } from "@common/utils";
import { ConversitionContext } from "../Layout";

export default function ItemTitle({
  title,
  onUpdateTitle,
}: {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
}) {
  const [_title, setTitle] = useState(title);
  const [isTitleOverflow, setIsTitleOverflow] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isEditable = false;

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

  useEffect(updateOverflowStatus, [_title, width]);

  return (
    <>
      {isEditable ? (
        <Input
          className="w-full"
          size="sm"
          value={_title}
          onValueChange={setTitle}
          onKeyDown={(e) => e.key === "Enter" && setTitle(_title)}
        />
      ) : (
        <h2
          ref={titleRef}
          className="text-xs conversation-title w-full text-tx-secondary font-semibold loading-5 truncate"
        >
          {isTitleOverflow ? (
            <TooltipTheme content={title}>
              <span>{title}</span>
            </TooltipTheme>
          ) : (
            title
          )}
        </h2>
      )}
    </>
  );
}
