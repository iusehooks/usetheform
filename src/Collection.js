import React from "react";
import { withIndex } from "./hoc/withIndex";
import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export const Collection = withIndex(
  ({
    children,
    name,
    index,
    object,
    value,
    reducers,
    onValidation,
    resetSyncErr,
    validators,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr
  }) => {
    const type = object ? "object" : "array";
    const ctx = useObject({
      name,
      index,
      type,
      value,
      reducers,
      onValidation,
      validators,
      resetSyncErr,
      asyncValidator,
      onAsyncValidation,
      resetAsyncErr
    });

    return <Context.Provider value={ctx}> {children}</Context.Provider>;
  }
);
