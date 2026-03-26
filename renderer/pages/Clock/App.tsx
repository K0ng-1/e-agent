import React, { useEffect, useRef } from "react";
import { useWinManager } from "@renderer/hooks";

export default function App() {
  useWinManager();
  const clockRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<{ x: number; y: number } | null>(null);

  function handleMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    offset.current = {
      x: e.screenX - window.screenX,
      y: e.screenY - window.screenY,
    };
  }
  function handleMouseEnter() {
    console.log("enter");
    window.api.setIgnoreMouseEvent(false);
  }
  function handleMouseLeave() {
    console.log("leave");
    window.api.setIgnoreMouseEvent(true);
    // setTimeout(() => {
    //   window.api.setIgnoreMouseEvent(false);
    // }, 2000);
  }
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging.current && offset.current) {
        const x = e.screenX - offset.current.x;
        const y = e.screenY - offset.current.y;
        window.api.setWindowPosition(x, y);
      }
    }
    function handleMouseUp() {
      isDragging.current = false;
      offset.current = null;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-[350px] h-[350px] flex-center">
      <div
        ref={clockRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="clock w-50 h-50 rounded-full bg-amber-400 shadow"
      >
        <div className="w-full h-full"></div>
      </div>
    </div>
  );
}
