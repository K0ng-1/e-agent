import React from "react";
import useCounterStore from "@/store/useCounterStore";
export default function StorePage() {
  const count = useCounterStore((s) => s.count);
  const inc = useCounterStore((s) => s.inc);
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center w-full">
        StorePage
      </h1>
      <p className="text-2xl font-bold text-center w-full">count: {count}</p>
      <button onClick={inc} className="text-2xl font-bold text-center w-full">
        inc
      </button>
    </div>
  );
}
