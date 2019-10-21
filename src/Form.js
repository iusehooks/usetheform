import React from "react";

import useForm from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

import { useFormStorePivateAPI } from "./hooks/useFormStore";

const noop = () => undefined;

export default function Form({
  children,
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit = noop,
  reducers,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  ...rest
}) {
  const { storeReducers, setFormStore } = useFormStorePivateAPI();

  const { onSubmitForm, ...value } = useForm({
    initialState,
    onChange,
    onInit,
    storeReducers,
    setFormStore,
    onReset,
    onSubmit,
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name
  });

  return (
    <Context.Provider value={value}>
      <form onSubmit={onSubmitForm} {...rest} name={name}>
        {children}
      </form>
    </Context.Provider>
  );
}
