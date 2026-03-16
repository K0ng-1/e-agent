import {
  WINDOW_NAMES,
  MAIN_WIN_SIZE,
  MENU_IDS,
  IPC_EVENTS,
  CONVERSATION_ITEM_MENU_IDS,
  CONVERSATION_LIST_MENU_IDS,
  MESSAGE_ITEM_MENU_IDS,
} from "@common/constants";
import logManager from "@main/service/LogService";
import menuManager from "@main/service/MenuService";
import windowManager from "@main/service/WindowService";
import { BrowserWindow } from "electron";

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

export function setupMainWindow() {
  windowManager.onWindowCreate(WINDOW_NAMES.MAIN, registerMenus);
  return windowManager.create(WINDOW_NAMES.MAIN, MAIN_WIN_SIZE);
}
