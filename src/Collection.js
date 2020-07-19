import React from "react";
import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export function Collection({
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
}) {
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

  let indexing = -1;
  return (
    <Context.Provider value={ctx}>
      {type === "array"
        ? React.Children.map(children, child => {
            if (hasPropsindexAuto(child)) {
              indexing = indexing + 1;
              return React.cloneElement(child, {
                index: indexing
              });
            } else {
              return child;
            }
          })
        : children}
    </Context.Provider>
  );
}

function hasPropsindexAuto(child) {
  return (
    child !== undefined &&
    child !== null &&
    child.props &&
    child.props.__indexAuto__ === true
  );
}

Collection.defaultProps = {
  __indexAuto__: true
};
