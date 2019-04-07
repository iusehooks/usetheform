import React from "react";

import useForm from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

const noop = () => undefined;

export default function Form({
  children,
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit = noop,
  reducers,
  ...rest
}) {
  const {
    state,
    changeProp,
    initProp,
    removeProp,
    onSubmitForm,
    stillMounted,
    status,
    reset,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    registerReset,
    unRegisterReset,
    isValid,
    pristine
  } = useForm({ initialState, onChange, onInit, onReset, onSubmit, reducers });

  const value = {
    state,
    formState: state, // pass the global form state down
    formStatus: status, // pass the global form state down
    changeProp,
    initProp,
    removeProp,
    stillMounted,
    addValidators,
    removeValidators,
    addValidatorsAsync,
    removeValidatorsAsync,
    registerReset,
    unRegisterReset,
    reset,
    isValid,
    pristine
  };
  return (
    <Context.Provider value={value}>
      <form onSubmit={onSubmitForm} {...rest}>
        {children}
      </form>
    </Context.Provider>
  );
}
