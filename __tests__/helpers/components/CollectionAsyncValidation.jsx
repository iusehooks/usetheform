import React, { useRef } from "react";
import {
  Input,
  Collection,
  useAsyncValidation,
  useChildren
} from "./../../../src";

const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 1) {
        reject("Add at least two Inputs");
      } else resolve();
    }, 100);
  });

export default function CollectionAsyncValidation() {
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);
  const [inputs, setInputs] = useChildren([]);
  const index = useRef(0);
  const addInput = () => {
    index.current = index.current + 1;
    setInputs(prev => [
      ...prev,
      { index: index.current, value: index.current }
    ]);
  };

  const removeInput = () => {
    setInputs(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div>
      <label>Inputs: (Async Validation) </label>
      <br />
      <button type="button" data-testid="addInput" onClick={addInput}>
        Add an Input
      </button>
      <button type="button" data-testid="removeInput" onClick={removeInput}>
        Remove an Input
      </button>
      <br />
      <Collection array name="asyncValCollection" {...asyncValidation}>
        {inputs.map(input => (
          <Input type="text" key={input.index} value={input.value} />
        ))}
      </Collection>
      {asyncStatus.status === "asyncStart" && (
        <label data-testid="asyncStart">Checking...</label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid="asyncSuccess">{asyncStatus.value}</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid="asyncError">{asyncStatus.value}</label>
      )}
    </div>
  );
}
