import React, { useState } from "react";
import Submit from "./Submit";
import { Form, Input, useValidation } from "./../../../src";

const required = value =>
  value && value.trim() !== "" ? undefined : "Required";

export const FormWithValidationAfterMounted = () => {
  const [input, setInput] = useState(() => null);

  const [status, inputValidation] = useValidation([required]);

  const onClick = () => {
    setInput(<Input key="1" type="text" name="text" {...inputValidation} />);
  };

  return (
    <>
      <Form>
        {input}
        <Submit />
      </Form>
      <button onClick={onClick} type="button" data-testid="addBtn">
        addBtn
      </button>
      {status.error && <label data-testid="errorLabel">{status.error}</label>}
    </>
  );
};
