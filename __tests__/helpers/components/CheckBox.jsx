import React from "react";
import { Input, useValidation } from "./../../../src";

const required = value => (value ? undefined : "Required");

export default function CheckBox({ name = "checkbox", value }) {
  const [status, validation] = useValidation([required]);
  return (
    <div>
      <label>CheckBox: </label>
      <Input
        name={name}
        {...validation}
        type="checkbox"
        data-testid="checkbox"
        value={value}
      />
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
    </div>
  );
}
