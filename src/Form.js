import React from "react";

import useForm from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

import { useFormStore } from "./hooks/useFormStore";

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
  const { storeReducers, setStoreDispatcher, setStoreState } = useFormStore();

  const { onSubmitForm, ...value } = useForm({
    initialState,
    onChange,
    onInit,
    setStoreDispatcher,
    storeReducers,
    setStoreState,
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
