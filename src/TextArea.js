import React from "react";
import { useField } from "./hooks/useField";

export function TextArea({
  onFocus,
  onBlur,
  onChange,
  children: omitChildren,
  name,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
  value,
  touched,
  reducers,
  ...extraProps
}) {
  const props = useField({
    onFocus,
    onBlur,
    onChange,
    type: "text",
    name,
    value,
    validators,
    asyncValidator,
    onValidation,
    onAsyncValidation,
    resetSyncErr,
    resetAsyncErr,
    touched,
    reducers
  });

  return <textarea {...extraProps} {...props} />;
}
