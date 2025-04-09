import React from "react";
import { withIndex, useField } from "./../../usetheform/src";

export const CustomInput = withIndex(
  ({ type, name, value, index, ...restAttr }) => {
    const props = useField({ type, name, value, index });
    return <input {...restAttr} {...props}></input>;
  }
);
