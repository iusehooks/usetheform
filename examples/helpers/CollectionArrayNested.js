/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection } = UseTheForm;

const initialValue = [
  "input1",
  "input2",
  [
    "input3",
    "input4",
    ["input5", "input6", ["input7", "input8", ["input9", "input10"]]]
  ]
];

const expectedValueArrayNested = [
  "input_1",
  "input_2",
  [
    "input_3",
    "input_4",
    ["input_5", "input_6", ["input_7", "input_8", ["input_9", "input_10"]]]
  ]
];

window.CollectionArrayNested = function CollectionArrayNested({ reducers }) {
  return (
    <Collection array name="arrayNested1" value={initialValue}>
      <Input type="text" data-testid="1" />
      <Input type="text" data-testid="2" />
      <Collection array>
        <Input type="text" data-testid="3" />
        <Input type="text" data-testid="4" />
        <Collection array>
          <Input type="text" data-testid="5" />
          <Input type="text" data-testid="6" />
          <Collection array>
            <Input type="text" data-testid="7" />
            <Input type="text" data-testid="8" />
            <Collection array>
              <Input type="text" data-testid="9" />
              <Input type="text" data-testid="10" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
};

function reducerArrayNested(value, prevValue) {
  const newValue = [...value];

  if (!prevValue[0] && newValue[0]) {
    newValue[0] = `${newValue[0]}_1`;
  }
  if (prevValue[1] === undefined && newValue[1])
    newValue[1] = `${newValue[1]}_1`;
  if (prevValue[2] === undefined && newValue[2] && newValue[2][0]) {
    newValue[2][0] = `${newValue[2][0]}_1`;
  }
  if (prevValue[2] === undefined && newValue[2] && newValue[2][1]) {
    newValue[2][1] = `${newValue[2][1]}_1`;
  }

  if (prevValue[2] !== undefined && newValue[2][2] && newValue[2][2][0]) {
    newValue[2][2][0] = `${newValue[2][2][0]}_1`;
  }

  if (prevValue[2] !== undefined && newValue[2][2] && newValue[2][2][1]) {
    newValue[2][2][1] = `${newValue[2][2][1]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue[2][2] !== undefined &&
    newValue[2][2][2] &&
    newValue[2][2][2][0]
  ) {
    newValue[2][2][2][0] = `${newValue[2][2][2][0]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue[2][2] !== undefined &&
    newValue[2][2][2][1]
  ) {
    newValue[2][2][2][1] = `${newValue[2][2][2][1]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue[2][2] !== undefined &&
    prevValue[2][2][2] !== undefined &&
    newValue[2][2][2][2][0]
  ) {
    newValue[2][2][2][2][0] = `${newValue[2][2][2][2][0]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue[2][2] !== undefined &&
    prevValue[2][2][2] !== undefined &&
    newValue[2][2][2][2][1]
  ) {
    newValue[2][2][2][2][1] = `${newValue[2][2][2][2][1]}_1`;
  }

  return newValue;
}
