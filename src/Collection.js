import React, { useMemo } from "react";
import { withIndex } from "./hoc/withIndex";
import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export const Collection = withIndex(function Collection({
  children,
  name,
  index,
  object,
  touched,
  value,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr,
  isPersistent
}) {
  const type = object ? "object" : "array";
  const props = useObject({
    name,
    index,
    touched,
    type,
    value,
    reducers,
    onValidation,
    validators,
    resetSyncErr,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr,
    isPersistent
  });

  const ctx = useMemo(() => props, [props.state, props.formStatus]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});
