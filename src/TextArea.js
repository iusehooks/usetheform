import React from "react";
import { withIndex } from "./hoc/withIndex";
import { useField } from "./hooks/useField";

export const TextArea = withIndex(function TextArea({
  onFocus,
  onBlur,
  onChange,
  name,
  index,
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
});
