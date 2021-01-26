import React from "react";
import { useForm, STATUS } from "./../../../src";

const Reset = ({ forceEnable }) => {
  const { reset, pristine, formStatus } = useForm();
  const isDisabled = forceEnable
    ? false
    : pristine ||
      formStatus === STATUS.ON_INIT_ASYNC ||
      formStatus === STATUS.ON_RUN_ASYNC;
  return (
    <>
      <button
        data-testid="reset"
        disabled={isDisabled}
        type="button"
        onClick={reset}
      >
        Reset
      </button>
      {pristine && <label data-testid="pristine">pristine</label>}
    </>
  );
};

export default Reset;
