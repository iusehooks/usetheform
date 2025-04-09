import React from "react";
import {
  FormContext,
  useValidation,
  useAsyncValidation,
  useForm
} from "./../../../src";

export const FormContextWithValidation = ({
  validators,
  asyncValidatorFunc,
  children,
  ...restProp
}) => {
  const [status, formValidationProp] = useValidation(validators);
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncValidatorFunc);

  return (
    <>
      <FormContext {...restProp} {...formValidationProp} {...asyncValidation}>
        <Form>{children}</Form>
      </FormContext>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
      {asyncStatus.status === "asyncStart" && (
        <label data-testid="asyncStart">Checking...</label>
      )}
      {asyncStatus.status === "asyncSuccess" && (
        <label data-testid="asyncSuccess">{asyncStatus.value}</label>
      )}
      {asyncStatus.status === "asyncError" && (
        <label data-testid="asyncError">{asyncStatus.value}</label>
      )}
    </>
  );
};

function Form({ children }) {
  const { onSubmitForm } = useForm();
  return <form onSubmit={onSubmitForm}>{children}</form>;
}
