import React from "react";
import { useField, withIndex, useValidation } from "./../../../src";

export const InputCustom = withIndex(
  ({ type, name, value, index, validators = [], touched, ...restAttr }) => {
    const [status, propsValidators] = useValidation(validators);
    const props = useField({
      type,
      name,
      value,
      index,
      touched,
      ...propsValidators
    });
    return (
      <div>
        <input {...restAttr} {...props}></input>;
        {status.error && <label data-testid="errorLabel">{status.error}</label>}
      </div>
    );
  }
);

export const InputUseField = withIndex(({ type, name, value }) => {
  const props = useField({ type, name, value });
  return (
    <pre>
      <code>{JSON.stringify(props.value)}</code>
    </pre>
  );
});
