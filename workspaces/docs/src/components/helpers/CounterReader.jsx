import React from "react";
import { useSelector } from "@usetheform";

export const CounterReader = () => {
  const [counter, setCounterValue] = useSelector(state => state.counter);
  return (
    <div>
      <span style={{ marginRight: "16px" }}>Counter: {counter}</span>
      <button type="button" onClick={() => setCounterValue(0)}>
        Reset Counter
      </button>
    </div>
  );
};
