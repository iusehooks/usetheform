import React from "react";

import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export function Collection({
  children,
  name,
  object,
  value,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr
}) {
  const type = object ? "object" : "array";
  const ctx = useObject({
    name,
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
  return <Context.Provider value={ctx}>{children}</Context.Provider>;
}
