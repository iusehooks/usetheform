import React from "react";

import { useForm } from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

export function FormContext({
  children,
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit,
  reducers,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name
}) {
  const ctx = useForm({
    initialState,
    onChange,
    onInit,
    onReset,
    onSubmit,
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name
  });

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
}
