import React from "react";
import { useField, withIndex } from "./../../../src";

export const CustomField = withIndex(({ name, value, ...restAttr }) => {
  const props = useField({ type: "custom", name, value });
  const onChange = () => props.onChange({ target: { value: "5" } });
  return (
    <button type="button" onClick={onChange} {...restAttr}>
      Change Value
    </button>
  );
});
