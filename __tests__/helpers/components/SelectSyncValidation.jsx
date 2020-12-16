import React, { useState } from "react";
import { Select, useValidation } from "./../../../src";

const required = val => {
  return val && val.length >= 1 ? undefined : "erorr";
};

const options = ["1", "2", "3", "4"];

export default function SelectSyncValidation({
  name = "select",
  touched = false,
  multiple = false,
  value,
  index,
  dataTestid = "select"
}) {
  const [syncStatus, syncValidation] = useValidation([required]);

  const [remove, setRemove] = useState(false);

  return (
    <div data-testid="synciselect_wrapper">
      <label>InputSyncValidation: </label>
      {!remove && (
        <Select
          index={index}
          value={value}
          multiple={multiple}
          touched={touched}
          name={name}
          data-testid={dataTestid}
          {...syncValidation}
        >
          {options.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      )}
      {syncStatus.error && (
        <label data-testid="errorLabel">{syncStatus.error}</label>
      )}
      <button
        type="button"
        data-testid="remove"
        onClick={() => setRemove(true)}
      >
        remove
      </button>
    </div>
  );
}
