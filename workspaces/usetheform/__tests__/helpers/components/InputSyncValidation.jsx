import React from "react";
import { Input, useValidation } from "./../../../src";

const required = value =>
  value && value.trim() !== "" ? undefined : "Required";

export default function InputSyncValidation({
  name = "input",
  touched = false,
  value,
  index,
  dataTestid = "input"
}) {
  const [syncStatus, syncValidation] = useValidation([required]);

  return (
    <div data-testid="syncinput_wrapper">
      <label>InputSyncValidation: </label>
      <Input
        touched={touched}
        index={index}
        name={name}
        {...syncValidation}
        type="text"
        value={value}
        data-testid={dataTestid}
      />
      {syncStatus.error && (
        <label data-testid="errorLabel">{syncStatus.error}</label>
      )}
    </div>
  );
}
