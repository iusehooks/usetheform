import React, { memo } from "react";
import { ContextObject as Context, useOwnContext } from "./hooks/useOwnContext";

const preventRemoval = () => false;
export const PersistStateOnUnmount = memo(function PersistStateOnUnmount({
  children
}) {
  const context = useOwnContext();
  const newContext = { ...context, removeProp: preventRemoval };
  return <Context.Provider value={newContext}>{children}</Context.Provider>;
});
