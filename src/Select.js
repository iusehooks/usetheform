import React from "react";
import { withIndex } from "./hoc/withIndex";
import { useField } from "./hooks/useField";

export const Select = withIndex(
  ({
    onFocus,
    onBlur,
    onChange,
    children,
    name,
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
  }) => {
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
);
