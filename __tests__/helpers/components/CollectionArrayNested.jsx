import React from "react";
import { Collection, Input } from "./../../../src";

export const initialValue = [
  "foo",
  true,
  [
    "foo_lv1",
    true,
    ["foo_lv2", true, ["foo_lv3", true, ["foo_lv4", undefined]]]
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
      <Input type="text" />
      <Input type="checkbox" />
      <Collection array>
        <Input type="text" />
        <Input type="checkbox" />
        <Collection array>
          <Input type="text" />
          <Input type="checkbox" />
          <Collection array>
            <Input type="text" />
            <Input type="checkbox" />
            <Collection array>
              <Input type="text" data-testid="mostinnerText" />
              <Input type="checkbox" data-testid="mostinnerCheckbox" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
}
