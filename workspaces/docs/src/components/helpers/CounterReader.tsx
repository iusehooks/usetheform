import React from "react";
import { useSelector } from "@usetheform";

export const CounterReader = () => {
  const [counter, setCounterValue] = useSelector((state) => state.counter);
  return (
    <div className="flex space-x-4">
      <button type="button" onClick={() => setCounterValue(0)}>
        Reset Counter
      </button>
      <div className="inline-flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md shadow-sm">
        <span>Counter:</span>
        <span className="font-semibold text-blue-600">{counter}</span>
      </div>
    </div>
  );
};
