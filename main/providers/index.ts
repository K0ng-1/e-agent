import { decode } from "js-base64";
import { OpenAiProvider } from "./OpenAiProvider";
import configManager from "@main/service/ConfigService";
import { CONFIG_KEYS } from "@common/constants";
import logManager from "@main/service/LogService";
import { Provider } from "@common/types";
import { parseOpenAISetting } from "@common/utils";

console.log(
  "providers loaded ==========================",
  process.env.AGENT_API_KEY,
);
const providers = [
  {
    id: 1,
    name: "bigmodel",
    title: "智谱AI",
    models: ["glm-4.5-flash"],
    openAISetting: {
      baseURL: "https://open.bigmodel.cn/api/paas/v4",
      apiKey: "",
    },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    visible: true,
  },
  {
    id: 2,
    name: "deepseek",
    title: "深度求索 (DeepSeek)",
    models: ["deepseek-chat"],
    openAISetting: {
      baseURL: "https://api.deepseek.com/v1",
      apiKey: "",
    },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    visible: true,
  },
  {
    id: 3,
    name: "siliconflow",
    title: "硅基流动",
    models: ["Qwen/Qwen3-8B", "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"],
    openAISetting: {
      baseURL: "https://api.siliconflow.cn/v1",
      apiKey: "",
    },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    visible: true,
  },
  {
    id: 4,
    name: "qianfan",
    title: "百度千帆",
    models: ["ernie-speed-128k", "ernie-4.0-8k", "ernie-3.5-8k"],
    openAISetting: {
      baseURL: "https://qianfan.baidubce.com/v2",
      apiKey: "",
    },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    visible: true,
  },
];

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
