import React from "react";

import useObject from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export default function Collection({
  children,
  name,
  object,
  value: initialValue,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr
}) {
  const type = object ? "object" : "array";
  const value = useObject({
    name,
    type,
    value: initialValue,
    reducers,
    onValidation,
    validators,
    resetSyncErr,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr
  });
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
