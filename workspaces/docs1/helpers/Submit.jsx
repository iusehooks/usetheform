import React from "react";
import { useForm } from "./../../usetheform/src";

export const Submit = () => {
  const { isValid } = useForm();
  return (
    <button disabled={!isValid} type="submit">
      Submit
    </button>
  );
};
