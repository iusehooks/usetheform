import React from "react";
import { Collection, Input } from "../../../src";

export const initialValue = {
  1: "1",
  2: "2",
  lv2: {
    3: "3",
    4: "4",
    lv3: {
      5: "5",
      6: "6",
      lv4: { 7: "7", 8: "8", lv5: { 9: "9", 10: "10" } }
    }
  }
};

export default function CollectionObjectNested({ reducers }) {
  return (
    <Collection reducers={reducers} object name="lv1" value={initialValue}>
      <Input type="text" name="1" data-testid="1" />
      <Input type="text" name="2" data-testid="2" />
      <Collection object name="lv2">
        <Input type="text" name="3" data-testid="3" />
        <Input type="text" name="4" data-testid="4" />
        <Collection object name="lv3">
          <Input type="text" name="5" data-testid="5" />
          <Input type="text" name="6" data-testid="6" />
          <Collection object name="lv4">
            <Input type="text" name="7" data-testid="7" />
            <Input type="text" name="8" data-testid="8" />
            <Collection object name="lv5">
              <Input type="text" name="9" data-testid="9" />
              <Input type="text" name="10" data-testid="10" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
}

export function CollectionObjectNestedValue({ reducers }) {
  return (
    <Collection reducers={reducers} object name="lv1">
      <Input type="text" name="1" data-testid="1" value="1" />
      <Input type="text" name="2" data-testid="2" value="2" />
      <Collection object name="lv2">
        <Input type="text" name="3" data-testid="3" value="3" />
        <Input type="text" name="4" data-testid="4" value="4" />
        <Collection object name="lv3">
          <Input type="text" name="5" data-testid="5" value="5" />
          <Input type="text" name="6" data-testid="6" value="6" />
          <Collection object name="lv4">
            <Input type="text" name="7" data-testid="7" value="7" />
            <Input type="text" name="8" data-testid="8" value="8" />
            <Collection object name="lv5">
              <Input type="text" name="9" data-testid="9" value="9" />
              <Input type="text" name="10" data-testid="10" value="10" />
            </Collection>
          </Collection>
        </Collection>
      </Collection>
    </Collection>
  );
}

export const expectedValueObjNested = {
  1: "1_1",
  2: "2_1",
  lv2: {
    3: "3_1",
    4: "4_1",
    lv3: {
      5: "5_1",
      6: "6_1",
      lv4: {
        7: "7_1",
        8: "8_1",
        lv5: { 9: "9_1", 10: "10_1" }
      }
    }
  }
};

export const reducerObjectNested = (value, prevValue) => {
  const newValue = { ...value };

  if (!prevValue[1] && newValue[1]) {
    newValue[1] = `${newValue[1]}_1`;
  }
  if (prevValue[2] === undefined && newValue[2])
    newValue[2] = `${newValue[2]}_1`;
  if (prevValue["lv2"] === undefined && newValue["lv2"] && newValue["lv2"][3]) {
    newValue["lv2"][3] = `${newValue["lv2"][3]}_1`;
  }
  if (prevValue["lv2"] === undefined && newValue["lv2"] && newValue["lv2"][4]) {
    newValue["lv2"][4] = `${newValue["lv2"][4]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"][5]
  ) {
    newValue["lv2"]["lv3"][5] = `${newValue["lv2"]["lv3"][5]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"][6]
  ) {
    newValue["lv2"]["lv3"][6] = `${newValue["lv2"]["lv3"][6]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"]["lv4"] &&
    newValue["lv2"]["lv3"]["lv4"][7]
  ) {
    newValue["lv2"]["lv3"]["lv4"][7] = `${newValue["lv2"]["lv3"]["lv4"][7]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"]["lv4"] &&
    newValue["lv2"]["lv3"]["lv4"][8]
  ) {
    newValue["lv2"]["lv3"]["lv4"][8] = `${newValue["lv2"]["lv3"]["lv4"][8]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"]["lv4"] &&
    newValue["lv2"]["lv3"]["lv4"]["lv5"] &&
    newValue["lv2"]["lv3"]["lv4"]["lv5"][9]
  ) {
    newValue["lv2"]["lv3"]["lv4"][
      "lv5"
    ][9] = `${newValue["lv2"]["lv3"]["lv4"]["lv5"][9]}_1`;
  }

  if (
    prevValue["lv2"] === undefined &&
    newValue["lv2"] &&
    newValue["lv2"]["lv3"] &&
    newValue["lv2"]["lv3"]["lv4"] &&
    newValue["lv2"]["lv3"]["lv4"]["lv5"] &&
    newValue["lv2"]["lv3"]["lv4"]["lv5"][10]
  ) {
    newValue["lv2"]["lv3"]["lv4"][
      "lv5"
    ][10] = `${newValue["lv2"]["lv3"]["lv4"]["lv5"][10]}_1`;
  }

  return newValue;
};
