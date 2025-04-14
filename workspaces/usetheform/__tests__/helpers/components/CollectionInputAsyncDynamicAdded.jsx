import React from "react";
import { Collection, useChildren } from "./../../../src";
import InputAsync from "./InputAsync";

let index = 0;
export default function CollectionInputAsyncDynamicAdded() {
  const [inputs, setInputs] = useChildren([]);
  const addInput = () => {
    ++index;
    setInputs(prev => [...prev, { index, value: index }]);
  };

  const removeInput = () => setInputs(prev => prev.slice(0, prev.length - 1));

  return (
    <div>
      <label>Inputs: (Async Validation)</label>
      <br />
      <button type="button" data-testid="addInput" onClick={addInput}>
        Add a Member
      </button>
      <button type="button" data-testid="removeInput" onClick={removeInput}>
        Remove a Member
      </button>
      <br />
      <Collection array name="asyncCollection">
        {inputs.map(member => (
          <InputAsync key={member.index} value={`${member.value}`} />
        ))}
      </Collection>
    </div>
  );
}
