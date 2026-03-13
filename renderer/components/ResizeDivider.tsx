import { MouseEventHandler } from "react";

interface ResizeDividerProps {
  direction: "vertical" | "horizontal";
  valIsNegative?: boolean; // 是否反向拖动
  size: number;
  maxSize: number;
  minSize: number;
  onResize: (size: number) => void;
}

export default function ResizeDivider(props: ResizeDividerProps) {
  const {
    direction,
    valIsNegative = false,
    size,
    maxSize,
    minSize,
    onResize,
  } = props;

  let isDragging = false;
  let startSize = 0;
  const startPoint = useRef({ x: 0, y: 0 });
  const isVertical = direction === "vertical";

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    isDragging = true;
    startPoint.current.x = e.clientX;
    startPoint.current.y = e.clientY;

    startSize = size;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const diffX = valIsNegative
      ? startPoint.current.x - e.clientX
      : e.clientX - startPoint.current.x;
    const diffY = valIsNegative
      ? startPoint.current.y - e.clientY
      : e.clientY - startPoint.current.y;

    const diff = isVertical ? diffX : diffY;

    const newSize = Math.max(minSize, Math.min(maxSize, startSize + diff));
    onResize(newSize);
  };

  const handleMouseUp = () => {
    isDragging = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={clsx(
        isVertical
          ? "w-5 h-full cursor-col-resize"
          : "w-full h-5 cursor-row-resize",
        "resize-divider bg-transparent z-999",
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={handleMouseDown}
    ></div>
  );
}
