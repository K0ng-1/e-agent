/// <reference types="@common/constants" />

interface CreateDialogProps {
  winId?: string;
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  isModal?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

type DialogueMessageRole = "user" | "assistant";
interface DialogueMessageProps {
  role: DialogueMessageRole;
  content: string;
}

interface CreateDialogueProps {
  messages: DialogueMessageProps[];
  providerName: string;
  selectedModel: string;
  messageId: number;
  conversationId: number;
}

interface UniversalChunk {
  isEnd: boolean;
  result: string;
}

interface DialogueBackStream {
  messageId: number;
  data: UniversalChunk & { isError?: boolean };
}
interface WindowApi {
  closeWindow(): void;
  minimizeWindow(): void;
  maximizeWindow(): void;
  onWindowMaximized(callback: (isMaximized: boolean) => void): void;
  isWindowMaximized(): Promise<boolean>;

  setThemeMode(mode: ThemeMode): void;
  getThemeMode(): Promise<ThemeMode>;
  onSystemThemeChange(callback: (theme: ThemeMode) => void): () => void;

  showContextMenu(menuId: string, dynamicOptions?: string): Promise<any>;
  contextMenuItemClick(menuId: string, cb: (id: string) => void): void;
  removeContextMenuListener(menuId: string): void;

  viewIsReady(): void;

  createDialog(params: CreateDialogProps): Promise<DialogFeedback>;
  _dialogFeedback(val: DialogFeedback, winId: number): void;
  _dialogGetParams(): Promise<CreateDialogProps>;

  startADialogue(params: CreateDialogueProps): void;
  onDialogueBack(
    cb: (data: DialogueBackStream) => void,
    messageId: number,
  ): () => void;

  logger: {
    debug(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    error(message: string, ...meta: any[]): void;
  };
}

declare interface Window {
  api: WindowApi;
}
