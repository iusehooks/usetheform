/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection, useAsyncValidation, useChildren } = UseTheForm;

const asyncTest = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 1) {
        reject("Add at least two Inputs");
      } else resolve();
    }, 1000);
  });

let index = 0;

window.CollectionAsyncValidation = function() {
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncTest);
  const [inputs, setInputs] = useChildren([]);
  const addInput = () => {
    ++index;
    setInputs(prev => [...prev, { index, value: index }]);
  };

  const removeInput = () => {
    setInputs(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div>
      <label>Inputs: (Async Validation) </label>
      <br />
      <button type="button" onClick={addInput}>
        Add an Input
      </button>
      <button type="button" onClick={removeInput}>
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
};
