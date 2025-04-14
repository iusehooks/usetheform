const {
  Input,
  createFormStore,
  Collection,
  useValidation,
  useSelector,
  useForm,
  FormContext
} = UseTheForm;

const { useState, useMemo } = React;

window.CreateFormStoreWithFormContext = (() => {
  const required = (value) =>
    value && value.trim() !== "" ? undefined : "Required";

  const [formStore, useFormSelector] = createFormStore({
    inputNested: { inputNested_lv1: [["hi"]] },
    counter: 10,
    array: { nested: [1] }
  });

  const FormWithContext = ({ children }) => {
    const { onSubmitForm } = useForm();
    return (
      <form
        data-testid="CreateFormStoreWithFormContext-Form"
        onSubmit={onSubmitForm}
      >
        {children}
      </form>
    );
  };

  const Counter = () => {
    const [counter, setCounterValue] = useFormSelector(
      (state) => state.counter
    );
    return (
      <div>
        <span data-testid="CreateFormStoreWithFormContext-Counter-Value">
          {counter}
        </span>
        <button
          data-testid="CreateFormStoreWithFormContext-Increase"
          type="button"
          onClick={() => setCounterValue((prev) => ++prev)}
        >
          Increase Counter
        </button>
        <button
          data-testid="CreateFormStoreWithFormContext-Decrease"
          type="button"
          onClick={() => setCounterValue((prev) => --prev)}
        >
          Decrease Counter
        </button>
        <button
          data-testid="CreateFormStoreWithFormContext-Counter-Set"
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
        <span data-testid="CreateFormStoreWithFormContext-FieldTextNested">
          {text}
        </span>
        <button
          data-testid="CreateFormStoreWithFormContext-FieldTextNested-Set"
          type="button"
          onClick={() => setText("hello")}
        >
          Set Text Hello
        </button>
      </div>
    );
  };

  const CounterReaderNested = () => {
    const [counter, setCounterValue] = useSelector(
      (state) => state.array.nested[0]
    );
    return (
      <div>
        <span data-testid="CreateFormStoreWithFormContext-CounterReader-nested">
          {counter}
        </span>
        <button
          data-testid="CreateFormStoreWithFormContext-CounterReader-increment"
          type="button"
          onClick={() => setCounterValue((prev) => ++prev)}
        >
          Increment Counter
        </button>
        <button
          data-testid="CreateFormStoreWithFormContext-CounterReader-decrement"
          type="button"
          onClick={() => setCounterValue((prev) => --prev)}
        >
          Decrement Counter
        </button>
      </div>
    );
  };
  return function CreateFormStoreWithFormContext() {
    const [statusInputEmail, validationInputEmail] = useValidation([required]);

    const handleSubmit = (state, isValid) => {
      console.log(
        "onSubmit,consoleLogCreateFormStoreWithFormContext",
        state,
        isValid
      );
    };

    const handleChange = (state, isValid) => {
      console.log(
        "onChange,consoleLogCreateFormStoreWithFormContext",
        state,
        isValid
      );
    };

    const handleReset = (state, isValid) => {
      console.log(
        "onReset,consoleLogCreateFormStoreWithFormContext",
        state,
        isValid
      );
    };

    const handleInit = (state, isValid) => {
      console.log(
        "onInit,consoleLogCreateFormStoreWithFormContext",
        state,
        isValid
      );
    };

    return (
      <div>
        <FormContext
          data-testid="CreateFormStoreWithFormContext-Form"
          onSubmit={handleSubmit}
          onChange={handleChange}
          onReset={handleReset}
          onInit={handleInit}
          formStore={formStore}
          initialState={{ name: "Antonio" }}
          reducers={(value) => ({ ...value, name: "Antonio Test" })}
        >
          <FormWithContext>
            <Input
              data-testid="CreateFormStoreWithFormContext-counter"
              type="number"
              name="counter"
              placeholder="Counter"
            />
            <Input
              data-testid="CreateFormStoreWithFormContext-name"
              type="text"
              name="name"
              placeholder="Name"
            />
            <Collection object name="array">
              <Collection array name="nested">
                <Input
                  data-testid="CreateFormStoreWithFormContext-nested"
                  type="number"
                />
              </Collection>
            </Collection>
            <Collection object name="inputNested">
              <Collection array name="inputNested_lv1">
                <Collection array>
                  <Input
                    data-testid="CreateFormStoreWithFormContext-inputNested"
                    type="text"
                  />
                </Collection>
              </Collection>
            </Collection>
            <Input
              data-testid="CreateFormStoreWithFormContext-lastname"
              type="text"
              value="foo"
              name="lastname"
            />
            <Input
              data-testid="CreateFormStoreWithFormContext-email"
              touched
              type="text"
              name="email"
              placeholder="Email"
              {...validationInputEmail}
            />
            <Submit data_prefix="CreateFormStoreWithFormContext-" />
            <Reset data_prefix="CreateFormStoreWithFormContext-" />
            <CounterReaderNested />
          </FormWithContext>
        </FormContext>
        <Counter />
        <FieldTextNested />
        {statusInputEmail.error && (
          <label data-testid="CreateFormStoreWithFormContext-error">
            {statusInputEmail.error}
          </label>
        )}
      </div>
    );
  };
})();
