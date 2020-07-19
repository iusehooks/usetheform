import React from "react";
import { useField } from "./hooks/useField";

export function Input({
  onFocus,
  onBlur,
  onChange,
  children: omitChildren,
  name,
  __indexAuto__: omitIndexAuto,
  index,
  checked,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
  type,
  value,
  touched,
  multiple,
  reducers,
  ...extraProps
}) {
  const props = useField({
    onFocus,
    onBlur,
    onChange,
    type,
    name,
    index,
    checked,
    value,
    validators,
    asyncValidator,
    onValidation,
    onAsyncValidation,
    reducers,
    resetSyncErr,
    resetAsyncErr,
    touched,
    multiple
  });

  return <input {...extraProps} {...props} />;
}

Input.defaultProps = {
  __indexAuto__: true
};
