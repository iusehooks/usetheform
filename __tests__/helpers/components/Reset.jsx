import React from "react";
import { useForm } from "./../../../src";

const Reset = () => {
  const { reset, pristine } = useForm();
  return (
    <button
      data-testid="reset"
      disabled={pristine}
      type="button"
      onClick={reset}
    >
      Reset
    </button>
  );
};

export default Reset;
