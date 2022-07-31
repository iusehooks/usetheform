import React, { useMemo, memo } from "react";

import { useForm } from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

function Form({
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
  reducers,
  touched,
  _getInitilaStateForm_, // Private API
  _onMultipleForm_, // Private API
  name,
  action,
  formStore,
  innerRef,
  ...rest
}) {
  const { onSubmitForm, ...props } = useForm({
    initialState,
    touched,
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
    reducers,
    _getInitilaStateForm_,
    _onMultipleForm_,
    name,
    action,
    formStore
  });

  const ctx = useMemo(() => props, [
    props.state,
    props.isValid,
    props.status,
    props.pristine,
    props.isSubmitting,
    props.submitAttempts,
    props.submitted
  ]);

  return (
    <Context.Provider value={ctx}>
      <form
        action={action}
        onSubmit={onSubmitForm}
        {...rest}
        name={name}
        ref={innerRef}
      >
        {children}
      </form>
    </Context.Provider>
  );
}

export default memo(Form);
