import React from "react";
import { useForm } from "./../../../src";

export default function Sumbit() {
  const { isValid, submitted } = useForm();
  return (
    <>
      <button data-testid="submit" disabled={!isValid} type="submit">
        Submit
      </button>
      <span data-testid="submittedCounter">{submitted}</span>
    </>
  );
}
