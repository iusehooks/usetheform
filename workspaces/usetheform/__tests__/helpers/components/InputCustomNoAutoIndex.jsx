import React from "react";
import { useField } from "./../../../src";

export const InputCustomNoAutoIndex = ({
  type,
  name,
  value,
  index,
  ...restAttr
}) => {
  const props = useField({ type, name, value, index });
  return <input {...restAttr} {...props}></input>;
};
