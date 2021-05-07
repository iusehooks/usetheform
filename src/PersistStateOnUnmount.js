import React, { useCallback, memo } from "react";
import { ContextObject as Context, useOwnContext } from "./hooks/useOwnContext";

export const PersistStateOnUnmount = memo(function PersistStateOnUnmount({
  children
}) {
  const context = useOwnContext();
  const removeProp = useCallback(() => false, []);
  context.removeProp = removeProp;
  return <Context.Provider value={context}>{children}</Context.Provider>;
});
