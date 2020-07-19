import React from "react";
import { useField } from "./hooks/useField";

export function Select({
  onFocus,
  onBlur,
  onChange,
  children,
  name,
  __indexAuto__: omitIndexAuto,
  index,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
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

Select.defaultProps = {
  __indexAuto__: true
};
