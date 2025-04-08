/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input, useValidation } = UseTheForm;
const { Reset, Submit } = window;

window.BigFormCollectionObjectDeepNested = () => {
  const buildNestedCollections = (depth, current = 0) => {
    const isCurrent = value =>
      value && value.trim() !== "" && value + "" === current + ""
        ? undefined
        : "Required";
    const [, validation] = useValidation([isCurrent]);
    if (current >= depth) return null;

    return (
      <Collection object name={`object_${current}`}>
        <Input
          name={`object_${current}_input`}
          type="text"
          value={`${current}`}
          data-testid={`BigFormCollectionObjectDeepNested-input-${current}`}
          {...validation}
        />
        {buildNestedCollections(depth, current + 1)}
      </Collection>
    );
  };

  const NestedForm = ({ depth }) => {
    const isCurrent = value =>
      value && value.trim() !== "" && value + "" === "0"
        ? undefined
        : "Required";

    const [, validation] = useValidation([isCurrent]);
    return (
      <Collection object name="object_0">
        <Input
          name="object_0_input"
          type="text"
          value={"0"}
          data-testid="BigFormCollectionObjectDeepNested-input-0"
          {...validation}
        />
        {buildNestedCollections(depth, 1)}
      </Collection>
    );
  };

  return (
    <div>
      <Form
        onSubmit={(state, isValid) => {
          console.log(
            "onSubmit,consoleLogBigFormCollectionObjectDeepNested",
            state,
            isValid
          );
        }}
        onReset={(state, isValid) => {
          console.log(
            "onReset,consoleLogBigFormCollectionObjectDeepNested",
            state,
            isValid
          );
        }}
        onInit={(state, isValid) => {
          console.log(
            "onInit,consoleLogBigFormCollectionObjectDeepNested",
            state,
            isValid
          );
        }}
        onChange={(state, isValid) => {
          console.log(
            "onChange,consoleLogBigFormCollectionObjectDeepNested",
            JSON.parse(JSON.stringify(state)),
            isValid
          );
        }}
        data-testid="BigFormCollectionObjectDeepNested-Form"
      >
        <Collection object name="inputs">
          <NestedForm depth={10} />
        </Collection>
        <Reset data_prefix="BigFormCollectionObjectDeepNested-" />
        <Submit data_prefix="BigFormCollectionObjectDeepNested-" />
      </Form>
    </div>
  );
};
