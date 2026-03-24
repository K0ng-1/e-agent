import { useEffect, useState } from "react";
import { DialogFeedback } from "@common/constants";

export function useDialog() {
  const [params, setParams] = useState<CreateDialogProps>({
    title: "",
    content: "",
    confirmText: "",
    cancelText: "",
  });

  // const { themeMode } = useThemeMode();

  useEffect(() => {
    window.api._dialogGetParams().then((res) => setParams(res));
  }, [setParams]);

  const createDialog = (opts: CreateDialogProps) => {
    const overlay = document.createElement("div");
    overlay.classList.add("dialog-overlay");
    const isModal = opts.isModal !== false;
    return new Promise<DialogFeedback>((resolve) => {
      window.api.createDialog(opts).then((res) => {
        resolve(res);
        if (!isModal) return;
        document.body.removeChild(overlay);
        overlay.classList.remove("show");
        overlay.remove();
      });
      if (!isModal) return;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add("show"), 10);
    });
  };

  const confirmDialog = () => {
    window.api._dialogFeedback(DialogFeedback.CONFIRM, Number(params.winId));
  };
  const cancelDialog = () => {
    window.api._dialogFeedback(DialogFeedback.CANCEL, Number(params.winId));
  };

  return { params, createDialog, confirmDialog, cancelDialog };
}

export default useDialog;
