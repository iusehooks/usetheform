import React from "react";
import useField from "./hooks/useField";

export default function TextArea({
  onFocus,
  onBlur,
  onChange,
  children,
  path,
  name,
  validators,
  asyncValidator,
  onValidation,
  onAsyncValidation,
  resetSyncErr,
  resetAsyncErr,
  index,
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
    index,
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
