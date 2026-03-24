import { useEffect, useState } from "react";

export function useFontSize(size: number) {
  const [fontSize, setFontSize] = useState(size);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return { fontSize, setFontSize };
}

export default useFontSize;
