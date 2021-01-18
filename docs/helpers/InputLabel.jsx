import React from "react";
import { Input } from "./../../src";

const styleLabel = {
  display: "block",
  position: "absolute",
  fontSize: "14px",
  background: "white",
  top: "-12px",
  paddingRight: "4px"
};

const inputStyle = {
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: "4px"
};

export const InputLabel = ({ placeholder = "", ...restProps }) => {
  return (
    <label style={{ display: "block", position: "relative", minWidth: "60px" }}>
      <span style={styleLabel}>{placeholder}</span>
      <Input style={inputStyle} {...restProps} />
    </label>
  );
};
