/* eslint-disable react/react-in-jsx-scope */
const {
  default: Form,
  Collection,
  useSelector,
  Input,
  useField,
  useValidation
} = UseTheForm;
const { Reset, Submit } = window;

window.FormWithCustomInputAndSelector = () => {
  const CounterSelector = () => {
    const [counter, setCounterValue] = useSelector(
      state => state.inputs.counter
    );
    const [arrayValue, setArrayValue] = useSelector(
      state => state.array[0][0][0][0]
    );
    return (
      <div style={{ backgroundColor: "blue" }}>
        <span data-testid="FormWithCustomInputAndSelector-counter-viewer">
          {counter}
        </span>
        -
        <span data-testid="FormWithCustomInputAndSelector-array-viewer">
          {arrayValue}
        </span>
        <button
          data-testid="FormWithCustomInputAndSelector-counter-reset"
          type="button"
          onClick={() => setCounterValue(0)}
        >
          Reset Counter
        </button>
        <button
          data-testid="FormWithCustomInputAndSelector-nested-reset"
          type="button"
          onClick={() => setArrayValue("test")}
        >
          Reset Nested Array Value
        </button>
      </div>
    );
  };

  const CustomField = ({ name = "customField", initialValue = { a: 1 } }) => {
    const minVal = value =>
      value && value.a && value.a > 5 ? undefined : "Value must be > 5";

    const [status, validation] = useValidation([minVal]);

    const { value, setValue } = useField({
      type: "custom",
      name,
      reducers: next => {
        const newValue = { ...next, a: parseInt(next.a) + 1 };
        return newValue;
      },
      value: initialValue,
      ...validation
    });
    const onChange = () =>
      setValue(prev => {
        return { ...prev, a: parseInt(prev.a) + 1 };
      });
    return (
      <div>
        <pre>
          <code>{JSON.stringify(value)}</code>
        </pre>
        {status.error && (
          <p
            data-testid="FormWithCustomInputAndSelector-customfield-error"
            style={{ color: "red" }}
          >
            {status.error}
          </p>
        )}
        <button
          data-testid="FormWithCustomInputAndSelector-customfield"
          type="button"
          onClick={onChange}
        >
          Change Value
        </button>
      </div>
    );
  };

  return (
    <div>
      <Form
        onSubmit={(state, isValid) => {
          console.log(
            "onSubmit,consoleLogFormWithCustomInputAndSelector",
            state,
            isValid
          );
        }}
        onReset={(state, isValid) => {
          console.log(
            "onReset,consoleLogFormWithCustomInputAndSelector",
            state,
            isValid
          );
        }}
        onInit={(state, isValid) => {
          console.log(
            "onInit,consoleLogFormWithCustomInputAndSelector",
            state,
            isValid
          );
        }}
        onChange={(state, isValid) => {
          console.log(
            "onChange,consoleLogFormWithCustomInputAndSelector",
            JSON.parse(JSON.stringify(state)),
            isValid
          );
        }}
        data-testid="FormWithCustomInputAndSelector-Form"
      >
        <CustomField />
        <Collection array name="array">
          <Collection array>
            <Collection array>
              <Collection array>
                <Input
                  data-testid={"FormWithCustomInputAndSelector-nested-input"}
                  type="text"
                  value="test"
                />
              </Collection>
            </Collection>
          </Collection>
        </Collection>
        <Collection object name="inputs">
          <CounterSelector />
          <Input
            data-testid={"FormWithCustomInputAndSelector-counter-input"}
            type="text"
            name="counter"
            value="0"
            placeholder="Counter"
          />
        </Collection>
        <Reset data_prefix="FormWithCustomInputAndSelector-" />
        <Submit data_prefix="FormWithCustomInputAndSelector-" />
      </Form>
    </div>
  );
};
