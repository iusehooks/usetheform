/* eslint-disable react/react-in-jsx-scope */

const { Input, Collection } = UseTheForm;

const initialValueCollectionArrayNestedDefault = [
  "input1",
  "input2",
  [
    "input3",
    "input4",
    ["input5", "input6", ["input7", "input8", ["input9", "input10"]]]
  ]
];

window.CollectionArrayNested = function CollectionArrayNested({
  dataTestid = "",
  name = "collectionArrayNested",
  initialValueCollectionArrayNested = initialValueCollectionArrayNestedDefault
}) {
  return (
    <Collection array name={name} value={initialValueCollectionArrayNested}>
      <Input type="text" data-testid={`${dataTestid}_1`} />
      <Input type="text" data-testid={`${dataTestid}_2`} />
      <Collection array>
        <Input type="text" data-testid={`${dataTestid}_3`} />
        <Input type="text" data-testid={`${dataTestid}_4`} />
        <Collection array>
          <Input type="text" data-testid={`${dataTestid}_5`} />
          <Input type="text" data-testid={`${dataTestid}_6`} />
          <Collection array>
            <Input type="text" data-testid={`${dataTestid}_7`} />
            <Input type="text" data-testid={`${dataTestid}_8`} />
            <Collection array>
              <Input type="text" data-testid={`${dataTestid}_9`} />
              <Input type="text" data-testid={`${dataTestid}_10`} />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
};
