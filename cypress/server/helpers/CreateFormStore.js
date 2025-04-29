const { Form, Input, createFormStore, Collection, useValidation } = UseTheForm;
const { useState } = React;

window.CreateFormStore = (() => {
  const [formStore, useFormSelector] = createFormStore({
    inputNested: { inputNested_lv1: [["hi"]] },
    counter: 10,
    array: { nested: [1] }
  });

  const Counter = () => {
    const [counter, setCounterValue] = useFormSelector(
      (state) => state.counter
    );
    return (
      <div>
        <span data-testid="CreateFormStore-Counter-Value">{counter}</span>
        <button
          data-testid="CreateFormStore-Increase"
          type="button"
          onClick={() => setCounterValue((prev) => ++prev)}
        >
          Increase Counter
        </button>
        <button
          data-testid="CreateFormStore-Decrease"
          type="button"
          onClick={() => setCounterValue((prev) => --prev)}
        >
          Decrease Counter
        </button>
        <button
          data-testid="CreateFormStore-Counter-Set"
          type="button"
          onClick={() => setCounterValue(2)}
        >
          Reset Counter
        </button>
      </div>
    );
  };

  const FieldTextNested = () => {
    const [text, setText] = useFormSelector(
      (state) => state.inputNested.inputNested_lv1[0][0]
    );
    return (
      <div>
        <span data-testid="CreateFormStore-FieldTextNested">{text}</span>
        <button
          data-testid="CreateFormStore-FieldTextNested-Set"
          type="button"
          onClick={() => setText("hello")}
        >
          Set Text Hello
        </button>
      </div>
    );
  };


  const CollectionNested = () => {
    const [text, setText] = useFormSelector(
      (state) => state.collection
    );
    return (
      <div>
        <span data-testid="CreateFormStore-CollectionNested-Value">{JSON.stringify(text)}</span>
        <button
          data-testid="CreateFormStore-CollectionNested-Set"
          type="button"
          onClick={() => setText({ nested: { "collection-nested": "hello" } })}
        >
          Set Collection-Nested Text
        </button>
      </div>
    );
  };
  const required = (value) =>
    value && value.trim() !== "" ? undefined : "Required";

  return function CreateFormStore() {
    const [statusInputEmail, validationInputEmail] = useValidation([required]);

    // Handle form submission, changes, and resets
    const handleSubmit = (state, isValid) => {
      console.log("onSubmit,consoleLogCreateFormStore", state, isValid);
    };

    const handleChange = (state, isValid) => {
      console.log("onChange,consoleLogCreateFormStore", state, isValid);
    };

    const handleReset = (state, isValid) => {
      console.log("onReset,consoleLogCreateFormStore", state, isValid);
    };

    const handleInit = (state, isValid) => {
      console.log("onInit,consoleLogCreateFormStore", state, isValid);
    };

    return (
      <div>
        <Form
          data-testid="CreateFormStore-Form"
          onSubmit={handleSubmit}
          onChange={handleChange}
          onReset={handleReset}
          onInit={handleInit}
          formStore={formStore}
          initialState={{ name: "Antonio" }}
          reducers={(value) => ({ ...value, name: "Antonio Test" })}
        >
          <Input
            data-testid="CreateFormStore-counter"
            type="number"
            name="counter"
            placeholder="Counter"
          />
          <Input
            data-testid="CreateFormStore-name"
            type="text"
            name="name"
            placeholder="Name"
          />
          <Collection object name="collection">
            <Collection object name="nested">
              <Input data-testid="CreateFormStore-collection-nested" name="collection-nested" type="text" />
            </Collection>
          </Collection>
          <Collection object name="array">
            <Collection array name="nested">
              <Input data-testid="CreateFormStore-nested" type="number" />
            </Collection>
          </Collection>
          <Collection object name="inputNested">
            <Collection array name="inputNested_lv1">
              <Collection array>
                <Input data-testid="CreateFormStore-inputNested" type="text" />
              </Collection>
            </Collection>
          </Collection>
          <Input
            data-testid="CreateFormStore-lastname"
            type="text"
            value="foo"
            name="lastname"
          />
          <Input
            data-testid="CreateFormStore-email"
            touched
            type="text"
            name="email"
            placeholder="Email"
            {...validationInputEmail}
          />
          <Submit data_prefix="CreateFormStore-" />
          <Reset data_prefix="CreateFormStore-" />
        </Form>
        <Counter />
        <CollectionNested />
        <FieldTextNested />
        {statusInputEmail.error && (
          <label data-testid="CreateFormStore-error">
            {statusInputEmail.error}
          </label>
        )}
      </div>
    );
  };
})();
