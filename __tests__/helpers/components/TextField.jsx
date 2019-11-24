import React from "react";
import { Input } from "./../../../src";

export default function TextField({ label, type, name, ...rest }) {
  return (
    <div>
      <label>{label}</label>
      <Input data-testid={name} name={name} {...rest} type={type || "text"} />
    </div>
  );
}
