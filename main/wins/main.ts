import {
  WINDOW_NAMES,
  MAIN_WIN_SIZE,
  MENU_IDS,
  IPC_EVENTS,
  CONVERSATION_ITEM_MENU_IDS,
  CONVERSATION_LIST_MENU_IDS,
  MESSAGE_ITEM_MENU_IDS,
  CONFIG_KEYS,
} from "@common/constants";
import { createProvider } from "@main/providers";
import configManager from "@main/service/ConfigService";
import logManager from "@main/service/LogService";
import menuManager from "@main/service/MenuService";
import trayManager from "@main/service/TrayService";
import windowManager from "@main/service/WindowService";
import { BrowserWindow, ipcMain } from "electron";

const handleTray = (minimizeToTray: boolean) => {
  trayManager[minimizeToTray ? "create" : "destroy"]();
};

const registerMenus = (window: BrowserWindow) => {
  const conversationItemMenuItemClick = (id: string) => {
    logManager.logUserOperation(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.CONVERSATION_ITEM}-${id}`,
    );
    window.webContents.send(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.CONVERSATION_ITEM}`,
      id,
    );
  };

  // 注册对话项上下文菜单
  menuManager.register(MENU_IDS.CONVERSATION_ITEM, [
    {
      id: CONVERSATION_ITEM_MENU_IDS.PIN,
      label: "menu.conversation.pinConversation",
      click: () =>
        conversationItemMenuItemClick(CONVERSATION_ITEM_MENU_IDS.PIN),
    },
    {
      id: CONVERSATION_ITEM_MENU_IDS.RENAME,
      label: "menu.conversation.renameConversation",
      click: () =>
        conversationItemMenuItemClick(CONVERSATION_ITEM_MENU_IDS.RENAME),
    },
    {
      id: CONVERSATION_ITEM_MENU_IDS.DEL,
      label: "menu.conversation.delConversation",
      click: () =>
        conversationItemMenuItemClick(CONVERSATION_ITEM_MENU_IDS.DEL),
    },
  ]);

  const conversationListMenuItemClick = (id: string) => {
    logManager.logUserOperation(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.CONVERSATION_LIST}-${id}`,
    );
    window.webContents.send(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.CONVERSATION_LIST}`,
      id,
    );
  };

  // 注册对话列表上下文菜单
  menuManager.register(MENU_IDS.CONVERSATION_LIST, [
    {
      id: CONVERSATION_LIST_MENU_IDS.NEW_CONVERSATION,
      label: "menu.conversation.newConversation",
      click: () =>
        conversationListMenuItemClick(
          CONVERSATION_LIST_MENU_IDS.NEW_CONVERSATION,
        ),
    },
    { type: "separator" },
    {
      id: CONVERSATION_LIST_MENU_IDS.SORT_BY,
      label: "menu.conversation.sortBy",
      submenu: [
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_BY_CREATE_TIME,
          label: "menu.conversation.sortByCreateTime",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_BY_CREATE_TIME,
            ),
        },
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_BY_UPDATE_TIME,
          label: "menu.conversation.sortByUpdateTime",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_BY_UPDATE_TIME,
            ),
        },
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_BY_NAME,
          label: "menu.conversation.sortByName",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_BY_NAME,
            ),
        },
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_BY_MODEL,
          label: "menu.conversation.sortByModel",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_BY_MODEL,
            ),
        },
        { type: "separator" },
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_ASCENDING,
          label: "menu.conversation.sortAscending",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_ASCENDING,
            ),
        },
        {
          id: CONVERSATION_LIST_MENU_IDS.SORT_DESCENDING,
          label: "menu.conversation.sortDescending",
          type: "radio",
          checked: false,
          click: () =>
            conversationListMenuItemClick(
              CONVERSATION_LIST_MENU_IDS.SORT_DESCENDING,
            ),
        },
      ],
    },
    {
      id: CONVERSATION_LIST_MENU_IDS.BATCH_OPERATIONS,
      label: "menu.conversation.batchOperations",
      click: () =>
        conversationListMenuItemClick(
          CONVERSATION_LIST_MENU_IDS.BATCH_OPERATIONS,
        ),
    },
  ]);

  const messageItemMenuItemClick = (id: string) => {
    logManager.logUserOperation(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.MESSAGE_ITEM}-${id}`,
    );
    window.webContents.send(
      `${IPC_EVENTS.SHOW_CONTEXT_MENU}:${MENU_IDS.MESSAGE_ITEM}`,
      id,
    );
  };

  // 注册消息项上下文菜单
  menuManager.register(MENU_IDS.MESSAGE_ITEM, [
    {
      id: MESSAGE_ITEM_MENU_IDS.COPY,
      label: "menu.message.copyMessage",
      click: () => messageItemMenuItemClick(MESSAGE_ITEM_MENU_IDS.COPY),
    },
    {
      id: MESSAGE_ITEM_MENU_IDS.SELECT,
      label: "menu.message.selectMessage",
      click: () => messageItemMenuItemClick(MESSAGE_ITEM_MENU_IDS.SELECT),
    },
    { type: "separator" },
    {
      id: MESSAGE_ITEM_MENU_IDS.DELETE,
      label: "menu.message.deleteMessage",
      click: () => messageItemMenuItemClick(MESSAGE_ITEM_MENU_IDS.DELETE),
    },
  ]);
};

export function setupMainWindow(): BrowserWindow | void {
  windowManager.onWindowCreate(WINDOW_NAMES.MAIN, (window) => {
    let minimizeToTray = configManager.get(CONFIG_KEYS.MINIMIZE_TO_TRAY);
    configManager.onConfigChange((config) => {
      if (minimizeToTray === config[CONFIG_KEYS.MINIMIZE_TO_TRAY]) return;
      minimizeToTray = config[CONFIG_KEYS.MINIMIZE_TO_TRAY];
      handleTray(minimizeToTray);
    });

    handleTray(minimizeToTray);

    registerMenus(window);
  });
  const window = windowManager.create(WINDOW_NAMES.MAIN, MAIN_WIN_SIZE);

  ipcMain.on(
    IPC_EVENTS.START_A_DIALOGUE,
    async (_event, props: CreateDialogueProps) => {
      const { providerName, messages, messageId, selectedModel } = props;
      const mainWindow = windowManager.get(WINDOW_NAMES.MAIN);

      if (!mainWindow) {
        throw new Error("mainWindow not found");
      }

      try {
        const provider = createProvider(providerName);
        const chunks = await provider?.chat(messages, selectedModel);

        if (!chunks) {
          throw new Error("chunks or stream not found");
        }

        for await (const chunk of chunks) {
          const chunkContent = {
            messageId,
            data: chunk,
          };
          mainWindow.webContents.send(
            IPC_EVENTS.START_A_DIALOGUE + "back" + messageId,
            chunkContent,
          );
        }
      } catch (error) {
        const errorContent = {
          messageId,
          data: {
            isEnd: true,
            isError: true,
            result: error instanceof Error ? error.message : String(error),
          },
        };

        mainWindow.webContents.send(
          `${IPC_EVENTS.START_A_DIALOGUE}back${messageId}`,
          errorContent,
        );
      }
    },
  );

  return window;
}
