import React from "react";
import useField from "./hooks/useField";

export default function Select({
  onFocus,
  onBlur,
  onChange,
  children,
  name,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
  index,
  type: omitType,
  multiple,
  value,
  touched,
  reducers,
  ...extraProps
}) {
  const props = useField({
    onFocus,
    onBlur,
    onChange,
    type: "select",
    name,
    index,
    value,
    validators,
    asyncValidator,
    onValidation,
    onAsyncValidation,
    resetSyncErr,
    resetAsyncErr,
    touched,
    multiple,
    reducers
  });

  return (
    <select {...extraProps} {...props}>
      {children}
    </select>
  );
}
