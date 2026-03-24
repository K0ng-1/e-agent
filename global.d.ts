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
  openWindow(name: WINDOW_NAMES): void;
  closeWindow(): void;
  minimizeWindow(): void;
  maximizeWindow(): void;
  onWindowMaximized(callback: (isMaximized: boolean) => void): void;
  isWindowMaximized(): Promise<boolean>;

  setThemeMode(mode: ThemeMode): void;
  getThemeMode(): Promise<ThemeMode>;
  isDarkMode(): Promise<boolean>;
  onSystemThemeChange(callback: (theme: ThemeMode) => void): () => void;

  showContextMenu(menuId: string, dynamicOptions?: string): Promise<any>;
  contextMenuItemClick(menuId: string, cb: (id: string) => void): void;
  removeContextMenuListener(menuId: string): void;

  viewIsReady(): void;

  getConfig(key: CONFIG_KEYS): Promise<IConfig[keyof IConfig]>;
  setConfig(key: CONFIG_KEYS, value: IConfig[keyof IConfig]): void;
  updateConfig(config: IConfig): void;
  onConfigChange(callback: (config: IConfig) => void): () => void;
  removeConfigChangeListener(callback: (config: IConfig) => void): void;

  createDialog(params: CreateDialogProps): Promise<DialogFeedback>;
  _dialogFeedback(val: DialogFeedback, winId: number): void;
  _dialogGetParams(): Promise<CreateDialogProps>;

  startADialogue(params: CreateDialogueProps): void;
  onDialogueBack(
    cb: (data: DialogueBackStream) => void,
    messageId: number,
  ): () => void;

  onShortcutCalled(key: SHORTCUT_KEYS, callback: () => void): () => void;

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
