import React from "react";
import { Input, withIndex } from "./../../src";

const CustomInput = ({ index, label, value, type }) => (
  <label>
    {label}: <Input type={type} index={index} value={value} />
  </label>
);

export default withIndex(CustomInput);
