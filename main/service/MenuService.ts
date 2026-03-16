import { ipcMain, Menu, type MenuItemConstructorOptions } from "electron";
import logManager from "./LogService";
import { IPC_EVENTS } from "@common/constants";
import { cloneDeep } from "@common/utils";
import { createTranslator } from "@main/utils/index";
let t = createTranslator();
class MenuService {
  private static _instance: MenuService;

  private _menuTemplates: Map<string, MenuItemConstructorOptions[]> = new Map();
  private _currentMenu?: Menu = void 0;

  private constructor() {
    this._setupIpcListener();
    this._setupLanguageChangeListener();
    logManager.info("MenuService initialized successfully.");
  }

  private _setupIpcListener() {
    ipcMain.handle(
      IPC_EVENTS.SHOW_CONTEXT_MENU,
      (_, menuId, dynamicOptions?: string) => {
        return new Promise((resolve) => {
          this.showMenu(menuId, () => resolve(true), dynamicOptions);
        });
      },
    );
  }
  private _setupLanguageChangeListener() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MenuService();
    }
    return this._instance;
  }

  public register(menuId: string, template: MenuItemConstructorOptions[]) {
    this._menuTemplates.set(menuId, template);
    return menuId;
  }

  public showMenu(
    menuId: string,
    onClose?: () => void,
    dynamicOptions?: string,
  ) {
    if (this._currentMenu) return;
    const template = cloneDeep(this._menuTemplates.get(menuId));
    if (!template) {
      logManager.error(`Menu ${menuId} not found.`);
      onClose?.();
      return;
    }

    let _dynamicOptions: Array<
      Partial<MenuItemConstructorOptions> & { id: string }
    > = [];

    try {
      _dynamicOptions = Array.isArray(dynamicOptions)
        ? dynamicOptions
        : JSON.parse(dynamicOptions ?? "[]");
    } catch (error) {
      logManager.error(
        `Failed to parse dynamicOptions for menu ${menuId}: ${error}`,
      );
      onClose?.();
      return;
    }

    const translationItem = (
      item: MenuItemConstructorOptions,
    ): MenuItemConstructorOptions => {
      if (item.submenu) {
        return {
          ...item,
          label: t(item.label) ?? void 0,
          submenu: (item.submenu as MenuItemConstructorOptions[]).map(
            translationItem,
          ),
        };
      }
      return {
        ...item,
        label: t(item.label) ?? void 0,
      };
    };

    const localizedTemplate = template.map((item) => {
      if (!Array.isArray(_dynamicOptions) || !_dynamicOptions.length) {
        return translationItem(item);
      }

      const dynamicItem = _dynamicOptions.find((o) => o.id === item.id);

      if (dynamicItem) {
        return translationItem({ ...item, ...dynamicItem });
      }

      if (item.submenu) {
        return translationItem({
          ...item,
          submenu: (item.submenu as MenuItemConstructorOptions[]).map(
            (_item) => {
              const dynamicItem = _dynamicOptions.find(
                (o) => o.id === _item.id,
              );
              return { ..._item, ...dynamicItem };
            },
          ),
        });
      }
      return translationItem(item);
    });

    const menu = Menu.buildFromTemplate(localizedTemplate);

    this._currentMenu = menu;

    menu.popup({
      callback: () => {
        this._currentMenu = void 0;
        onClose?.();
      },
    });
  }

  public destroyMenu(menuId: string) {
    this._menuTemplates.delete(menuId);
  }

  public destroyed() {
    this._menuTemplates.clear();
    this._currentMenu = void 0;
  }
}

export const menuManager = MenuService.getInstance();
export default menuManager;
