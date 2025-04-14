import React, { useMemo, memo } from "react";
import { useForm } from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

export const FormContext = memo(function FormContext({
  children,
  initialState,
  onChange,
  onInit,
  onReset,
  onSubmit,
  onValidation,
  resetSyncErr,
  validators,
  asyncValidator,
  onAsyncValidation,
  resetAsyncErr,
  touched,
  reducers,
  _getInitialStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  action
}) {
  const props = useForm({
    initialState,
    onChange,
    onInit,
    onReset,
    onSubmit,
    onValidation,
    resetSyncErr,
    validators,
    asyncValidator,
    onAsyncValidation,
    resetAsyncErr,
    touched,
    reducers,
    _getInitialStateForm_,
    _onMultipleForm_,
    name,
    action
  });

  const ctx = useMemo(
    () => props,
    [
      props.state,
      props.isValid,
      props.status,
      props.pristine,
      props.isSubmitting,
      props.submitAttempts,
      props.submitted
    ]
  );

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
});
