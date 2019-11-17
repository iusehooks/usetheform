import React from "react";

import { ContextForm as Context } from "./hooks/useOwnContext";

export function FormContext({ children, value }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
