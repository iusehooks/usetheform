import React from "react";

import { useForm } from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

export default function Form({
  children,
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit,
  reducers,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  action,
  ...rest
}) {
  const { onSubmitForm, ...ctx } = useForm({
    initialState,
    onChange,
    onInit,
    onReset,
    onSubmit,
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name,
    action
  });

  return (
    <Context.Provider value={ctx}>
      <form action={action} onSubmit={onSubmitForm} {...rest} name={name}>
        {children}
      </form>
    </Context.Provider>
  );
}
