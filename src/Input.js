import React from "react";
import useField from "./hooks/useField";

export default function Input({
  onFocus,
  onBlur,
  onChange,
  children,
  path,
  name,
  checked,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
  index,
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
