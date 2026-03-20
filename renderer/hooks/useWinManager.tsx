import { useEffect, useState } from "react";

export function useWinManager() {
  const [isMaximized, setIsMaximized] = useState(false);

  function closeWindow() {
    window.api.closeWindow();
  }
  function minimizeWindow() {
    window.api.minimizeWindow();
  }
  function maximizeWindow() {
    window.api.maximizeWindow();
  }

  useEffect(() => {
    (async () => {
      setIsMaximized(await window.api.isWindowMaximized());
      window.api.onWindowMaximized((_isMaximized: boolean) => {
        setIsMaximized(_isMaximized);
      });
    })();
  }, []);

  return {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    isMaximized,
  };
}
