import { OpenAISetting } from "./types";
import { encode, decode } from "js-base64";

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

export function cloneDeep<T>(obj: T, visited = new WeakMap()): T {
  // if (structuredClone) {
  //   return structuredClone(obj);
  // }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (visited.has(obj)) {
    return visited.get(obj)!;
  }
  const clone = Array.isArray(obj) ? [] : {};
  visited.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (clone as T)[key] = cloneDeep((obj as T)[key], visited);
    }
  }
  return clone as T;
}

export function stringifyOpenAISetting(setting: OpenAISetting) {
  try {
    return encode(JSON.stringify(setting));
  } catch (error) {
    console.error("stringifyOpenAISetting failed:", error);
    return "";
  }
}

export function parseOpenAISetting(setting: string): OpenAISetting {
  try {
    return JSON.parse(decode(setting));
  } catch (error) {
    console.error("parseOpenAISetting failed:", error);
    return {} as OpenAISetting;
  }
}

export function uniqueByKey<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): T[] {
  const seen = new Map<unknown, boolean>();

  return arr.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.set(keyValue, true);
    return true;
  });
}
