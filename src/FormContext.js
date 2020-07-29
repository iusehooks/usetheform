import React, { useMemo, memo } from "react";
import { useForm } from "./hooks/useForm";
import { ContextForm as Context } from "./hooks/useOwnContext";

export const FormContext = memo(
  ({
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
    action
  }) => {
    const props = useForm({
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

    const ctx = useMemo(() => props, [
      props.state,
      props.isValid,
      props.status,
      props.pristine,
      props.submitted
    ]);

    return <Context.Provider value={ctx}>{children}</Context.Provider>;
  }
);
