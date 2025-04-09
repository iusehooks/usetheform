import React from "react";
import { Collection, Input } from "./../../../src";

export const initialValue = [
  "input1",
  "input2",
  [
    "input3",
    "input4",
    ["input5", "input6", ["input7", "input8", ["input9", "input10"]]]
  ]
];

export const expectedValueArrayNested = [
  "input_1",
  "input_2",
  [
    "input_3",
    "input_4",
    ["input_5", "input_6", ["input_7", "input_8", ["input_9", "input_10"]]]
  ]
];

export default function CollectionArrayNested({ reducers }) {
  return (
    <Collection
      reducers={reducers}
      array
      name="arrayNested"
      value={initialValue}
    >
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
}

export const expectedValueArrayNestedReduced = [
  "input1_1",
  "input2_1",
  [
    "input3_1",
    "input4_1",
    [
      "input5_1",
      "input6_1",
      ["input7_1", "input8_1", ["input9_1", "input10_1"]]
    ]
  ]
];

export function CollectionArrayNestedValue({ reducers }) {
  return (
    <Collection reducers={reducers} array name="arrayNested">
      <Input type="text" data-testid="1" value="input1" />
      <Input type="text" data-testid="2" value="input2" />
      <Collection array>
        <Input type="text" data-testid="3" value="input3" />
        <Input type="text" data-testid="4" value="input4" />
        <Collection array>
          <Input type="text" data-testid="5" value="input5" />
          <Input type="text" data-testid="6" value="input6" />
          <Collection array>
            <Input type="text" data-testid="7" value="input7" />
            <Input type="text" data-testid="8" value="input8" />
            <Collection array>
              <Input type="text" data-testid="9" value="input9" />
              <Input type="text" data-testid="10" value="input10" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
}

export const reducerArrayNested = (value, prevValue) => {
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

  if (
    prevValue[2] !== undefined &&
    newValue?.[2]?.[2] &&
    newValue?.[2]?.[2]?.[0]
  ) {
    newValue[2][2][0] = `${newValue[2][2][0]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    newValue?.[2]?.[2] &&
    newValue?.[2]?.[2]?.[1]
  ) {
    newValue[2][2][1] = `${newValue[2][2][1]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue?.[2]?.[2] !== undefined &&
    newValue?.[2]?.[2]?.[2] &&
    newValue?.[2]?.[2]?.[2]?.[0]
  ) {
    newValue[2][2][2][0] = `${newValue[2][2][2][0]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue?.[2]?.[2] !== undefined &&
    newValue?.[2]?.[2]?.[2]?.[1]
  ) {
    newValue[2][2][2][1] = `${newValue[2][2][2][1]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue[2][2] !== undefined &&
    prevValue?.[2]?.[2]?.[2] !== undefined &&
    newValue?.[2]?.[2][2][2][0]
  ) {
    newValue[2][2][2][2][0] = `${newValue[2][2][2][2][0]}_1`;
  }

  if (
    prevValue[2] !== undefined &&
    prevValue?.[2]?.[2] !== undefined &&
    prevValue?.[2]?.[2][2] !== undefined &&
    newValue?.[2]?.[2]?.[2]?.[2][1]
  ) {
    newValue[2][2][2][2][1] = `${newValue[2][2][2][2][1]}_1`;
  }

  return newValue;
};
