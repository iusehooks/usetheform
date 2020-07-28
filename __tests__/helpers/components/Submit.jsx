import React from "react";
import { useForm } from "./../../../src";

export default function Sumbit({ forceEnable }) {
  const { isValid, submitted } = useForm();
  return (
    <>
      <button
        data-testid="submit"
        disabled={forceEnable ? false : !isValid}
        type="submit"
      >
        Submit
      </button>
      <span data-testid="submittedCounter">{submitted}</span>
    </>
  );
}
