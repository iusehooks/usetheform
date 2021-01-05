import React from "react";
import { Input, Collection } from "./../../../src";

const preventAge = (state, prevState) => {
  let newState = { ...state };
  if (newState.end < prevState.start) newState.end = prevState.start;

  if (newState.start > prevState.end) newState.start = prevState.end;

  return newState;
};
export default function AgeRange({ name = "ageRange" }) {
  return (
    <div>
      <label>Allowed Age : </label>
      <Collection object reducers={preventAge} name={name}>
        <Input
          name="start"
          data-testid="start"
          type="range"
          min="0"
          max="100"
          value="18"
        />
        <Input
          name="end"
          data-testid="end"
          type="range"
          min="0"
          max="100"
          value="65"
        />
      </Collection>
    </div>
  );
}
