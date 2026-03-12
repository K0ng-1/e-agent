import useCounterStore from "@renderer/store/useCounterStore";
import { Button } from "@heroui/button";
export default function StorePage() {
  const count = useCounterStore((s) => s.count);
  const inc = useCounterStore((s) => s.inc);
  return (
    <div>
      <p className="text-2xl font-bold text-center w-full">count: {count}</p>
      <Button onPress={inc} className="text-2xl font-bold text-center w-full">
        inc
      </Button>
    </div>
  );
}
