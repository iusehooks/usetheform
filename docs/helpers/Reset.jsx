import React from "react";
import { useForm } from "../../src";

export const Reset = () => {
  const { reset, pristine } = useForm();
  return (
    <button disabled={pristine} type="button" onClick={reset}>
      Reset
    </button>
  );
};
