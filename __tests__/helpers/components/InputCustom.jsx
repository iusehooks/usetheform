import React from "react";
import { useField, withIndex } from "./../../../src";

export const InputCustom = withIndex(
  ({ type, name, value, index, ...restAttr }) => {
    const props = useField({ type, name, value, index });
    return <input {...restAttr} {...props}></input>;
  }
);

export const InputUseField = withIndex(({ type, name, value }) => {
  const props = useField({ type, name, value });
  return (
    <pre>
      <code>{JSON.stringify(props.value)}</code>
    </pre>
  );
});
