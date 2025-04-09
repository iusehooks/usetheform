import React from "react";
import { Input, useValidation } from "./../../../src";

const required = value => (value ? undefined : "Required");

export default function Radio({ name = "radio", value }) {
  const [status, validation] = useValidation([required]);
  return (
    <div>
      <label>Radio: </label>
      <Input
        name={name}
        {...validation}
        type="radio"
        data-testid="radio"
        value={value}
      />
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
    </div>
  );
}
