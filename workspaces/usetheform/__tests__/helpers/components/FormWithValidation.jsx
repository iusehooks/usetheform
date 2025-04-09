import React from "react";
import { Form, useValidation, useAsyncValidation } from "./../../../src";

export const FormWithValidation = ({
  validators,
  asyncValidatorFunc,
  children,
  ...restProp
}) => {
  const [status, formValidationProp] = useValidation(validators);
  const [asyncStatus, asyncValidation] = useAsyncValidation(asyncValidatorFunc);

  return (
    <>
      <Form {...restProp} {...formValidationProp} {...asyncValidation}>
        {children}
      </Form>
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
