import React from "react";

import { useObject } from "./hooks/useObject";
import { ContextObject as Context } from "./hooks/useOwnContext";

export function Collection({
  children,
  name,
  indexAuto,
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

  const indexing =
    type === "array" &&
    React.Children.toArray(children)
      .filter(child => hasPropsIndexAuto(child))
      .map((child, index) => index);

  return (
    <Context.Provider value={ctx}>
      {type === "array"
        ? React.Children.map(children, child => {
            if (hasPropsIndexAuto(child)) {
              const index = indexing.shift();
              return React.cloneElement(child, {
                index
              });
            } else {
              return child;
            }
          })
        : children}
    </Context.Provider>
  );
}

function hasPropsIndexAuto(child) {
  return (
    child !== undefined &&
    child !== null &&
    child.props &&
    child.props.indexAuto === true
  );
}

Collection.defaultProps = {
  indexAuto: true
};
