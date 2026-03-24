import { setPrimaryColor } from "@renderer/utils/theme";

export function usePrimaryColor(color: string) {
  if (color) {
    setPrimaryColor(color);
  }
  return { setPrimaryColor };
}
export default usePrimaryColor;
