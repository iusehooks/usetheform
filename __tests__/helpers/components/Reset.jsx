import React from "react";
import { useForm, STATUS } from "./../../../src";

const Reset = () => {
  const { reset, pristine, formStatus } = useForm();
  return (
    <button
      data-testid="reset"
      disabled={
        pristine ||
        formStatus === STATUS.ON_INIT_ASYNC ||
        formStatus === STATUS.ON_RUN_ASYNC
      }
      type="button"
      onClick={reset}
    >
      Reset
    </button>
  );
};

export default Reset;
