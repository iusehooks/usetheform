/* eslint-disable react/react-in-jsx-scope */
const { default: Form, Collection, Input } = UseTheForm;
const { Reset, Submit } = window;

window.BigFormCollectionArrayDeepNested = () => {
  const buildNestedCollections = (depth, current = 0) => {
    if (current >= depth) return null;

    return (
      <Collection array>
        <Input
          type="text"
          value={`${current}`}
          data-testid={`BigFormCollectionArrayDeepNested-input-${current}`}
        />
        {buildNestedCollections(depth, current + 1)}
      </Collection>
    );
  };

  const NestedForm = ({ depth }) => {
    return (
      <Collection array>
        <Input
          type="text"
          value={"0"}
          data-testid="BigFormCollectionArrayDeepNested-input-0"
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
            "onSubmit,consoleLogBigFormCollectionArrayDeepNested",
            state,
            isValid
          );
        }}
        onReset={(state, isValid) => {
          console.log(
            "onReset,consoleLogBigFormCollectionArrayDeepNested",
            state,
            isValid
          );
        }}
        onInit={(state, isValid) => {
          console.log(
            "onInit,consoleLogBigFormCollectionArrayDeepNested",
            state,
            isValid
          );
        }}
        onChange={(state, isValid) => {
          console.log(
            "onChange,consoleLogBigFormCollectionArrayDeepNested",
            JSON.parse(JSON.stringify(state)),
            isValid
          );
        }}
        data-testid="BigFormCollectionArrayDeepNested-Form"
      >
        <Collection
          object
          name="object"
          value={{ object_1: { object_2: { object_input: "object_input" } } }}
        >
          <Collection object name="object_1">
            <Collection object name="object_2">
              <Input
                type="text"
                name="object_input"
                data-testid="BigFormCollectionArrayDeepNested-input-object_input"
              />
            </Collection>
          </Collection>
        </Collection>
        <Collection
          array
          name="inputs"
          reducers={next => BigFormCollectionArrayDeepNested_mapNested(next)}
        >
          <NestedForm depth={10} />
        </Collection>
        <Reset data_prefix="BigFormCollectionArrayDeepNested-" />
        <Submit data_prefix="BigFormCollectionArrayDeepNested-" />
      </Form>
    </div>
  );
};

function BigFormCollectionArrayDeepNested_mapNested(item) {
  if (Array.isArray(item)) {
    return item.map(it => BigFormCollectionArrayDeepNested_mapNested(it));
  } else {
    const value = parseInt(item);
    if (value == 8) {
      return "800";
    }
    return `${value}`;
  }
}
