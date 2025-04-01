/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection, useAsyncValidation, useChildren } = UseTheForm;

const asyncTestCollectionAsyncValidation = value =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.length <= 1) {
        reject("Add at least two Inputs");
      } else resolve();
    }, 1000);
  });

let indexCollectionAsyncValidation = 0;

window.CollectionAsyncValidation = function ({ uniqueId = "" }) {
  const [asyncStatus, asyncValidation] = useAsyncValidation(
    asyncTestCollectionAsyncValidation
  );
  const [inputs, setInputs] = useChildren([]);
  const addInput = () => {
    ++indexCollectionAsyncValidation;
    setInputs(prev => [
      ...prev,
      {
        index: indexCollectionAsyncValidation,
        value: indexCollectionAsyncValidation
      }
    ]);
  };

  const removeInput = () => {
    setInputs(prev => prev.slice(0, prev.length - 1));
  };

  return (
    <div>
      <label>Inputs: (Async Validation) </label>
      <br />
      <button
        data-testid={`add-input-${uniqueId}`}
        type="button"
        onClick={addInput}
      >
        Add an Input
      </button>
      <button
        data-testid={`remove-input-${uniqueId}`}
        type="button"
        onClick={removeInput}
      >
        Remove an Input
      </button>
      <br />
      <Collection array name="asyncValCollection" {...asyncValidation}>
        {inputs.map(input => (
          <Input
            data-testid={`input-${input.index}-${uniqueId}`}
            type="text"
            key={input.index}
            value={input.value}
          />
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
