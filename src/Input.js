import React from "react";
import { withIndex } from "./hoc/withIndex";
import { useField } from "./hooks/useField";

export const Input = withIndex(function Input({
  onFocus,
  onBlur,
  onChange,
  name,
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
});
