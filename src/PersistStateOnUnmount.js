import React, { useCallback } from "react";
import { ContextObject as Context, useOwnContext } from "./hooks/useOwnContext";

export const PersistStateOnUnmount = function PersistStateOnUnmount({
  children
}) {
  const context = useOwnContext();
  const removeProp = useCallback(() => {
    return false;
  }, []);
  context.removeProp = removeProp;
  return <Context.Provider value={context}>{children}</Context.Provider>;
};
