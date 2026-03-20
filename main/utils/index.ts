import zh from "@locales/zh.json";
import en from "@locales/en.json";
import logManager from "@main/service/LogService";

type MessageSchema = typeof zh;
const messages: Record<string, MessageSchema> = { zh, en };

export function createTranslator() {
  return (key?: string) => {
    if (!key) return void 0;

    try {
      const keys = key.split(".");
      let result: any = messages["zh"];
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
