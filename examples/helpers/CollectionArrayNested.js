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

window.CollectionArrayNested = function CollectionArrayNested() {
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
