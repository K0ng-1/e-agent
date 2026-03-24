import { decode } from "js-base64";
import { OpenAiProvider } from "./OpenAiProvider";
import configManager from "@main/service/ConfigService";
import { CONFIG_KEYS } from "@common/constants";
import logManager from "@main/service/LogService";
import { Provider } from "@common/types";
import { parseOpenAISetting } from "@common/utils";

interface _Provider extends Omit<Provider, "openAISetting"> {
  openAISetting: {
    apiKey: string;
    baseURL: string;
  };
}

const _parseProvider = () => {
  let result: Provider[] = [];
  let canBase64Parsed = false;
  const providerConfig = configManager.get(CONFIG_KEYS.PROVIDER);

  try {
    result = JSON.parse(decode(providerConfig)) as Provider[];
    canBase64Parsed = true;
  } catch (error) {
    logManager.error(`Error parsing provider config: ${error}`);
  }

  if (!canBase64Parsed) {
    try {
      result = JSON.parse(providerConfig) as Provider[];
    } catch (error) {
      logManager.error(`Error parsing provider config: ${error}`);
    }
  }
  if (!result.length) return;

  return result.map((provider: Provider) => ({
    ...provider,
    openAISetting:
      typeof provider.openAISetting === "string"
        ? parseOpenAISetting(provider.openAISetting ?? "")
        : provider.openAISetting,
  })) as _Provider[];
};

const getProviderConfig = () => {
  try {
    return _parseProvider();
  } catch (error) {
    logManager.error(`Error parsing provider config: ${error}`);
    return [];
  }
};

export function createProvider(name: string) {
  const providers = getProviderConfig();

  if (!providers?.length) {
    throw new Error("provider config not found");
  }

  for (const provider of providers) {
    if (provider.name === name) {
      if (!provider.openAISetting.apiKey || !provider.openAISetting.baseURL) {
        throw new Error("apiKey or baseURL not found");
      }

      const { apiKey, baseURL } = provider.openAISetting;
      return new OpenAiProvider(apiKey, baseURL);
    }
  }
}
