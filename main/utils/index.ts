import zh from "@locales/zh.json";
import en from "@locales/en.json";
import logManager from "@main/service/LogService";
import configManager from "@main/service/ConfigService";
import { CONFIG_KEYS } from "@common/constants";
import path from "node:path";
import { app } from "electron";

type MessageSchema = typeof zh;
const messages: Record<string, MessageSchema> = { zh, en };

export function createTranslator() {
  return (key?: string) => {
    if (!key) return void 0;

    try {
      const keys = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = messages[configManager.get(CONFIG_KEYS.LANGUAGE)];
      for (const _key of keys) {
        result = result[_key];
      }
      return result as string;
    } catch (error) {
      logManager.error(`failed to translate key: ${key} ${error}`);
      return key;
    }
  };
}

let logo: string | null = null;
export function createLogo() {
  if (logo !== null) return logo;
  if (app.isPackaged) {
    logo = path.join(
      __dirname,
      `../renderer/${MAIN_WINDOW_VITE_NAME}/logo.ico`,
    );
  } else {
    logo = path.join(__dirname, "../../public/logo.ico");
  }
  return logo;
}
