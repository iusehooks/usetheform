import React from "react";
import { useField, withIndex } from "./../../../src";

export const InputCustom = withIndex(
  ({ type, name, value, index, ...restAttr }) => {
    const props = useField({ type, name, value, index });
    return <input {...restAttr} {...props}></input>;
  }
);
