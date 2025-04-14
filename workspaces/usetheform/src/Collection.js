import React, { useMemo } from "react";
import { withIndex } from "./hoc/withIndex";
import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export const Collection = withIndex(function Collection({
  children,
  name,
  index,
  object,
  array,
  touched,
  value,
  reducers,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr,
  as,
  ...propsHtml
}) {
  const type = object ? "object" : array ? "array" : "object";

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
    resetAsyncErr
  });

  const ctx = useMemo(() => props, [props.state, props.formStatus]);

  const Wrapper = as || React.Fragment;

  return (
    <Context.Provider value={ctx}>
      <Wrapper {...propsHtml}>{children}</Wrapper>
    </Context.Provider>
  );
});
