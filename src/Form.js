import React from "react";

import useForm from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

const noop = () => undefined;

export default function Form({
  children,
  initialState,
  onChange,
  onInit,
  actionDispatcher,
  onReset,
  onSubmit = noop,
  actionReducers,
  reducers,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  ...rest
}) {
  const { onSubmitForm, ...value } = useForm({
    initialState,
    onChange,
    onInit,
    actionDispatcher,
    onReset,
    onSubmit,
    actionReducers,
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name
  });

  return (
    <Context.Provider value={value}>
      <form onSubmit={onSubmitForm} {...rest}>
        {children}
      </form>
    </Context.Provider>
  );
}
